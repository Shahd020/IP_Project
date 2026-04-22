@echo off
cd /d "%~dp0server"
node dev-memory-server.mjs >> dev-server-live.log 2>&1
pause
