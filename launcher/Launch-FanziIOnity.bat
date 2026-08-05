@echo off
REM Double-click entry point for the FANZi IO-nity resilient launcher.
REM Runs Launch-FanziIOnity.ps1, which self-elevates and handles updates/auto-restart.
setlocal
set SCRIPT_DIR=%~dp0
powershell -NoProfile -ExecutionPolicy Bypass -File "%SCRIPT_DIR%Launch-FanziIOnity.ps1" %*
endlocal
