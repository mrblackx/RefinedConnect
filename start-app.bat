@echo off
echo Starting RefinedConnect Chat Application...
echo.

REM Check if Node.js is installed
node --version > nul 2>&1
if %errorlevel% neq 0 (
    echo Node.js is not installed!
    echo Please download and install Node.js from https://nodejs.org/
    echo Choose the LTS (Long Term Support) version
    echo.
    echo After installing Node.js, please run this script again.
    pause
    start https://nodejs.org/
    exit /b 1
)

REM Check if npm is installed
npm --version > nul 2>&1
if %errorlevel% neq 0 (
    echo npm is not installed!
    echo Please install npm and try again.
    pause
    exit /b 1
)

echo Node.js and npm are installed. Proceeding with setup...
echo.

REM Check if node_modules exists
if not exist "node_modules\" (
    echo Installing dependencies...
    echo This may take a few minutes...
    call npm install
    if %errorlevel% neq 0 (
        echo Error installing dependencies!
        pause
        exit /b 1
    )
) else (
    echo Dependencies already installed.
)

REM Check if .env.local exists
if not exist ".env.local" (
    echo Creating environment file...
    copy .env.example .env.local
    if %errorlevel% neq 0 (
        echo Error creating environment file!
        pause
        exit /b 1
    )
)

echo.
echo Starting the development server...
echo The application will open in your default browser...
echo.
echo To stop the server, close this window or press Ctrl+C
echo.

REM Start the development server and open in browser
start http://localhost:3000
timeout /t 5 /nobreak > nul
npm run dev 