@echo off
echo Starting RR Light House Website...
echo =================================
echo.

:: Ensure we are in the script's directory (Fixes "path not found" if run from C:)
cd /d "%~dp0"

:: Check if venv exists
if not exist "venv" (
    echo Virtual environment not found! Setting it up...
    python -m venv venv
    call venv\Scripts\activate
    pip install -r requirements.txt
) else (
    call venv\Scripts\activate
)

:: Ensure uploads directory exists
if not exist "static\uploads" mkdir "static\uploads"

:: Set Admin Credentials (CHANGE THESE HERE)
set ADMIN_USERNAME=admin
set ADMIN_PASSWORD=admin123

:: Run the app
echo.
echo Launching Server...
echo Open your browser to: http://127.0.0.1:5000/
echo.
python app.py

:: If app crashes, pause to show error
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    echo THE SERVER CRASHED WITH AN ERROR.
    echo Please share the error message above with the developer.
    echo !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    pause
)
