#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Công cụ tự động tải toàn bộ mã nguồn dự án GOOGMATH (Bài 11: ƯC, ƯCLN & Bài 12: BC, BCNN) lên GitHub
và kích hoạt tên miền GitHub Pages: https://<username>.github.io/googmath/
"""

import os
import sys
import time
import json
import base64
import webbrowser
import urllib.request
import urllib.parse
import urllib.error

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

WORKSPACE_DIR = os.path.dirname(os.path.abspath(__file__))
REPO_NAME = "googmath"
REPO_DESC = "GOOGMATH - Cổng Trò Chơi Học Tập Toán 6 (Bài 11: Ước chung, ƯCLN & Bài 12: Bội chung, BCNN) - GV: Lý Hoàng Em"
TOKEN_CACHE_FILE = os.path.join(WORKSPACE_DIR, ".gh_token_cache")
FALLBACK_TOKEN_CACHE = r"D:\web_ca_nhan\.gh_token_cache"

GITHUB_CLIENT_ID = "178c6fc778ccc68e1d6a"


def github_api(method, path, token, payload=None):
    url = f"https://api.github.com{path}"
    headers = {
        "Accept": "application/vnd.github+json",
        "Authorization": f"Bearer {token}",
        "User-Agent": "googmath-uploader",
        "X-GitHub-Api-Version": "2022-11-28",
    }
    data = None
    if payload is not None:
        data = json.dumps(payload).encode("utf-8")
        headers["Content-Type"] = "application/json"

    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=45) as resp:
            body = resp.read().decode("utf-8")
            return resp.status, (json.loads(body) if body else {})
    except urllib.error.HTTPError as e:
        err_body = e.read().decode("utf-8", errors="replace")
        try:
            err_json = json.loads(err_body)
        except Exception:
            err_json = {"message": err_body}
        return e.code, err_json


def get_token_via_device_flow():
    req_data = urllib.parse.urlencode({
        "client_id": GITHUB_CLIENT_ID,
        "scope": "repo workflow"
    }).encode("utf-8")
    req = urllib.request.Request(
        "https://github.com/login/device/code",
        data=req_data,
        headers={"Accept": "application/json", "User-Agent": "googmath-uploader"},
        method="POST"
    )
    with urllib.request.urlopen(req, timeout=20) as resp:
        info = json.loads(resp.read().decode("utf-8"))

    device_code = info["device_code"]
    user_code = info["user_code"]
    verification_uri = info["verification_uri"]
    interval = int(info.get("interval", 5))

    print("=" * 70)
    print("🔐 XÁC THỰC TÀI KHOẢN GITHUB ĐỂ TẢI LÊN TÊN MIỀN 'googmath':")
    print("=" * 70)
    print(f"👉 Bước 1: Trình duyệt sẽ mở địa chỉ: {verification_uri}")
    print(f"👉 Bước 2: Nhập mã xác thực gồm 8 ký tự sau:  {user_code}")
    print("👉 Bước 3: Bấm nút 'Authorize' (Cho phép) trên trang GitHub.")
    print("=" * 70)
    sys.stdout.flush()

    try:
        webbrowser.open(verification_uri)
    except Exception:
        pass

    while True:
        time.sleep(interval)
        poll_data = urllib.parse.urlencode({
            "client_id": GITHUB_CLIENT_ID,
            "device_code": device_code,
            "grant_type": "urn:ietf:params:oauth:grant-type:device_code"
        }).encode("utf-8")
        poll_req = urllib.request.Request(
            "https://github.com/login/oauth/access_token",
            data=poll_data,
            headers={"Accept": "application/json", "User-Agent": "googmath-uploader"},
            method="POST"
        )
        with urllib.request.urlopen(poll_req, timeout=20) as resp:
            res = json.loads(resp.read().decode("utf-8"))

        if "access_token" in res:
            print("\n✅ Đã xác thực GitHub thành công!")
            return res["access_token"]
        err = res.get("error")
        if err == "authorization_pending":
            continue
        elif err == "slow_down":
            interval += 5
        else:
            raise RuntimeError(f"Lỗi xác thực GitHub: {res}")


def collect_web_files():
    ignore_dirs = {".git", "node_modules", "__pycache__"}
    files_list = []
    for root, dirs, files in os.walk(WORKSPACE_DIR):
        dirs[:] = [d for d in dirs if d not in ignore_dirs]
        for fname in files:
            if fname == ".gh_token_cache":
                continue
            full_path = os.path.join(root, fname)
            rel_path = os.path.relpath(full_path, WORKSPACE_DIR).replace("\\", "/")
            files_list.append((rel_path, full_path))
    return files_list


def push_files_to_branch(owner, token, branch_name, base_commit_sha, files_to_upload, commit_msg):
    tree_items = []
    for idx, (rel_path, full_path) in enumerate(files_to_upload, 1):
        with open(full_path, "rb") as f:
            raw_bytes = f.read()
        b64_content = base64.b64encode(raw_bytes).decode("ascii")
        st, blob_res = github_api(
            "POST",
            f"/repos/{owner}/{REPO_NAME}/git/blobs",
            token,
            {"content": b64_content, "encoding": "base64"},
        )
        if st not in (200, 201):
            raise RuntimeError(f"Lỗi tải file {rel_path}: {blob_res}")

        tree_items.append({
            "path": rel_path,
            "mode": "100644",
            "type": "blob",
            "sha": blob_res["sha"],
        })
        print(f"   [{idx}/{len(files_to_upload)}] ({branch_name}) Đã tải: {rel_path}")

    # Thêm .nojekyll để GitHub Pages phục vụ nhanh các file tĩnh
    st, blob_res = github_api(
        "POST",
        f"/repos/{owner}/{REPO_NAME}/git/blobs",
        token,
        {"content": "", "encoding": "utf-8"},
    )
    if st in (200, 201):
        tree_items.append({
            "path": ".nojekyll",
            "mode": "100644",
            "type": "blob",
            "sha": blob_res["sha"],
        })

    st, tree_res = github_api(
        "POST",
        f"/repos/{owner}/{REPO_NAME}/git/trees",
        token,
        {"tree": tree_items},
    )
    if st not in (200, 201):
        raise RuntimeError(f"Lỗi tạo Git Tree: {tree_res}")

    st, commit_res = github_api(
        "POST",
        f"/repos/{owner}/{REPO_NAME}/git/commits",
        token,
        {
            "message": commit_msg,
            "tree": tree_res["sha"],
            "parents": [base_commit_sha],
        },
    )
    if st not in (200, 201):
        raise RuntimeError(f"Lỗi tạo Commit: {commit_res}")

    st_ref, _ = github_api("GET", f"/repos/{owner}/{REPO_NAME}/git/ref/heads/{branch_name}", token)
    if st_ref == 200:
        github_api(
            "PATCH",
            f"/repos/{owner}/{REPO_NAME}/git/refs/heads/{branch_name}",
            token,
            {"sha": commit_res["sha"], "force": True},
        )
    else:
        github_api(
            "POST",
            f"/repos/{owner}/{REPO_NAME}/git/refs",
            token,
            {"ref": f"refs/heads/{branch_name}", "sha": commit_res["sha"]},
        )


def upload_repository(token):
    status, user_info = github_api("GET", "/user", token)
    if status != 200:
        raise RuntimeError(f"Không thể lấy thông tin tài khoản GitHub: {user_info}")

    owner = user_info["login"]
    print(f"👤 Tài khoản GitHub: {owner}")

    status, repo_info = github_api("GET", f"/repos/{owner}/{REPO_NAME}", token)
    if status == 404:
        print(f"📦 Đang khởi tạo kho chứa mới: {owner}/{REPO_NAME} ...")
        status, repo_info = github_api(
            "POST",
            "/user/repos",
            token,
            {
                "name": REPO_NAME,
                "description": REPO_DESC,
                "private": False,
                "auto_init": True,
            },
        )
        if status not in (200, 201):
            raise RuntimeError(f"Không thể tạo repository: {repo_info}")
        time.sleep(2)
    else:
        print(f"📦 Đã tìm thấy kho chứa: {owner}/{REPO_NAME}")

    default_branch = repo_info.get("default_branch", "main")
    status, ref_info = github_api("GET", f"/repos/{owner}/{REPO_NAME}/git/ref/heads/{default_branch}", token)
    if status != 200:
        github_api(
            "PUT",
            f"/repos/{owner}/{REPO_NAME}/contents/README.md",
            token,
            {
                "message": "Initial commit",
                "content": base64.b64encode(b"# GOOGMATH - Toan 6").decode("ascii"),
            },
        )
        time.sleep(1)
        status, ref_info = github_api("GET", f"/repos/{owner}/{REPO_NAME}/git/ref/heads/{default_branch}", token)

    base_commit_sha = ref_info["object"]["sha"]
    web_files = collect_web_files()

    print(f"🚀 [1/2] Đang tải {len(web_files)} tệp mã nguồn lên nhánh '{default_branch}'...")
    push_files_to_branch(
        owner,
        token,
        default_branch,
        base_commit_sha,
        web_files,
        "Deploy GOOGMATH Web App (Bài 11: ƯC, ƯCLN & Bài 12: BC, BCNN + Nhân vật Pi, Vuông, Tròn)",
    )

    print(f"🌐 [2/2] Đang xuất bản Web App lên nhánh 'gh-pages'...")
    push_files_to_branch(
        owner,
        token,
        "gh-pages",
        base_commit_sha,
        web_files,
        "Publish GOOGMATH Web App to GitHub Pages",
    )

    st_pages, _ = github_api("GET", f"/repos/{owner}/{REPO_NAME}/pages", token)
    if st_pages == 200:
        github_api(
            "PUT",
            f"/repos/{owner}/{REPO_NAME}/pages",
            token,
            {"source": {"branch": "gh-pages", "path": "/"}},
        )
    else:
        github_api(
            "POST",
            f"/repos/{owner}/{REPO_NAME}/pages",
            token,
            {"source": {"branch": "gh-pages", "path": "/"}},
        )

    repo_url = f"https://github.com/{owner}/{REPO_NAME}"
    pages_url = f"https://{owner}.github.io/{REPO_NAME}/"
    bai12_url = f"https://{owner}.github.io/{REPO_NAME}/bai12.html"

    print("\n" + "★" * 70)
    print("🎉 ĐÃ TẢI LÊN GITHUB & ĐĂNG KÝ TÊN MIỀN 'googmath' THÀNH CÔNG!")
    print(f"🔗 Kho mã nguồn GitHub : {repo_url}")
    print(f"🌐 Link Web (Bài 11 & Cổng chính): {pages_url}")
    print(f"🚀 Link trực tiếp Bài 12         : {bai12_url}")
    print("★" * 70)


def main():
    token = os.environ.get("GITHUB_TOKEN", "").strip()
    if len(sys.argv) > 1 and sys.argv[1].strip():
        token = sys.argv[1].strip()

    for cache_path in (TOKEN_CACHE_FILE, FALLBACK_TOKEN_CACHE):
        if not token and os.path.exists(cache_path):
            try:
                with open(cache_path, "r", encoding="utf-8") as f:
                    cached = f.read().strip()
                st, _ = github_api("GET", "/user", cached)
                if st == 200:
                    token = cached
                    break
            except Exception:
                pass

    if not token:
        token = get_token_via_device_flow()

    try:
        with open(TOKEN_CACHE_FILE, "w", encoding="utf-8") as f:
            f.write(token)
    except Exception:
        pass

    upload_repository(token)


if __name__ == "__main__":
    main()
