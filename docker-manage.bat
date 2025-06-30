@echo off
REM AI Expense Tracker Docker Management Script for Windows

echo 🐳 AI Expense Tracker Docker Management
echo ======================================

if "%1"=="build" (
    echo 🔨 Building Docker images...
    docker-compose build --no-cache
    goto :end
)

if "%1"=="start" (
    echo 🚀 Starting all services...
    docker-compose up -d
    echo ✅ Services started!
    echo 📱 Next.js App: http://localhost:3000
    echo 🤖 Python ML API: http://localhost:8000
    echo 🗄️  MongoDB: localhost:27017
    echo 🌐 Nginx Proxy: http://localhost:80
    goto :end
)

if "%1"=="stop" (
    echo ⏹️  Stopping all services...
    docker-compose down
    echo ✅ Services stopped!
    goto :end
)

if "%1"=="restart" (
    echo 🔄 Restarting all services...
    docker-compose down
    docker-compose up -d
    echo ✅ Services restarted!
    goto :end
)

if "%1"=="logs" (
    if not "%2"=="" (
        echo 📋 Showing logs for %2...
        docker-compose logs -f %2
    ) else (
        echo 📋 Showing all logs...
        docker-compose logs -f
    )
    goto :end
)

if "%1"=="status" (
    echo 📊 Service status...
    docker-compose ps
    goto :end
)

if "%1"=="clean" (
    echo 🧹 Cleaning up...
    docker-compose down -v
    docker system prune -f
    echo ✅ Cleanup complete!
    goto :end
)

echo Usage: %0 {build^|start^|stop^|restart^|logs^|status^|clean}
echo.
echo Commands:
echo   build     - Build all Docker images
echo   start     - Start all services
echo   stop      - Stop all services
echo   restart   - Restart all services
echo   logs      - Show logs (optionally specify service)
echo   status    - Show service status
echo   clean     - Clean up containers and volumes

:end
