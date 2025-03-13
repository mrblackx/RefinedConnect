#!/bin/bash

echo "Starting RefinedConnect Chat Application..."
echo

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed!"
    echo "Please download and install Node.js from https://nodejs.org/"
    echo "Choose the LTS (Long Term Support) version"
    echo
    echo "After installing Node.js, please run this script again."
    read -p "Press Enter to open the Node.js website..."
    open https://nodejs.org/ 2>/dev/null || xdg-open https://nodejs.org/ 2>/dev/null
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "npm is not installed!"
    echo "Please install npm and try again."
    read -p "Press Enter to continue..."
    exit 1
fi

echo "Node.js and npm are installed. Proceeding with setup..."
echo

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    echo "This may take a few minutes..."
    npm install
    if [ $? -ne 0 ]; then
        echo "Error installing dependencies!"
        read -p "Press Enter to continue..."
        exit 1
    fi
else
    echo "Dependencies already installed."
fi

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "Creating environment file..."
    cp .env.example .env.local
    if [ $? -ne 0 ]; then
        echo "Error creating environment file!"
        read -p "Press Enter to continue..."
        exit 1
    fi
fi

echo
echo "Starting the development server..."
echo "The application will open in your default browser..."
echo
echo "To stop the server, press Ctrl+C"
echo

# Make the script executable
chmod +x start-app.sh

# Start the development server and open in browser
(sleep 5 && open http://localhost:3000 2>/dev/null || xdg-open http://localhost:3000 2>/dev/null) &
npm run dev 