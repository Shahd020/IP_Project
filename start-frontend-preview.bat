@echo off
cd /d "%~dp0"
echo Starting frontend...
npm run preview -- --host 127.0.0.1
pause
