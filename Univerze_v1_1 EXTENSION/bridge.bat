@echo off
title Univerze Bridge
color 0B

set PORT=12345
set BRIDGE_DIR=%~dp0

echo ====================================
echo         UNIVERZE BRIDGE SERVER
echo ====================================
echo.
echo  Bridge:  http://localhost:%PORT%
echo  Status:  Starting...
echo.

where python >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python not found in PATH.
    echo Install Python 3 from https://python.org
    pause
    exit /b 1
)

echo [INFO] Starting embedded bridge...
echo.

echo from http.server import BaseHTTPRequestHandler

echo Ready.
echo.
echo The bridge is listening on port %PORT%.
echo Keep this window open while using Univerze.
echo Press Ctrl+C to stop.
echo.

cd /d "%BRIDGE_DIR%"
python -c "import http.server, socketserver, json, sys, os, cgi; exec(open(os.path.join(os.path.dirname('%~f0'), 'bridge_embedded.py')).read())"

if errorlevel 1 (
    echo.
    echo [ERROR] Bridge failed to start.
    echo Check that port %PORT% is not in use.
)

pause