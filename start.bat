@echo off
echo ========================================================
echo   Starting IMovies Full-Stack Movie Booking System
echo ========================================================
echo.
echo Starting Backend API Server (Port 5000)...
start "IMovies Backend" cmd /k "cd backend && npm run dev"

timeout /t 2 /nobreak >nul

echo Starting Frontend UI Server (Port 3000)...
start "IMovies Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo All services launched!
echo Open your browser at: http://localhost:3000
echo ========================================================

