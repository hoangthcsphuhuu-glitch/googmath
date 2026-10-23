@echo off
chcp 65001 > nul
cd /d "%~dp0"
echo =========================================================
echo   DANG TAI DU AN GOOGMATH (BAI 11 VA BAI 12) LEN GITHUB
echo =========================================================
python upload_to_github.py
echo.
pause
