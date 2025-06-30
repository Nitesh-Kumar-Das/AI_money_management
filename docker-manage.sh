#!/bin/bash

# AI Expense Tracker Docker Management Script

echo "🐳 AI Expense Tracker Docker Management"
echo "======================================"

case "$1" in
    "build")
        echo "🔨 Building Docker images..."
        docker-compose build --no-cache
        ;;
    "start")
        echo "🚀 Starting all services..."
        docker-compose up -d
        echo "✅ Services started!"
        echo "📱 Next.js App: http://localhost:3000"
        echo "🤖 Python ML API: http://localhost:8000"
        echo "🗄️  MongoDB: localhost:27017"
        echo "🌐 Nginx Proxy: http://localhost:80"
        ;;
    "stop")
        echo "⏹️  Stopping all services..."
        docker-compose down
        echo "✅ Services stopped!"
        ;;
    "restart")
        echo "🔄 Restarting all services..."
        docker-compose down
        docker-compose up -d
        echo "✅ Services restarted!"
        ;;
    "logs")
        if [ -n "$2" ]; then
            echo "📋 Showing logs for $2..."
            docker-compose logs -f "$2"
        else
            echo "📋 Showing all logs..."
            docker-compose logs -f
        fi
        ;;
    "status")
        echo "📊 Service status..."
        docker-compose ps
        ;;
    "clean")
        echo "🧹 Cleaning up..."
        docker-compose down -v
        docker system prune -f
        echo "✅ Cleanup complete!"
        ;;
    "shell")
        if [ -n "$2" ]; then
            echo "🖥️  Opening shell in $2..."
            docker-compose exec "$2" /bin/bash
        else
            echo "❌ Please specify service name (nextjs-app, python-ml, mongodb)"
        fi
        ;;
    *)
        echo "Usage: $0 {build|start|stop|restart|logs|status|clean|shell}"
        echo ""
        echo "Commands:"
        echo "  build     - Build all Docker images"
        echo "  start     - Start all services"
        echo "  stop      - Stop all services"
        echo "  restart   - Restart all services"
        echo "  logs      - Show logs (optionally specify service)"
        echo "  status    - Show service status"
        echo "  clean     - Clean up containers and volumes"
        echo "  shell     - Open shell in container (specify service)"
        exit 1
        ;;
esac
