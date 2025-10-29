#!/bin/bash

# EcoTrace Quick Start Script
# This script starts all necessary services for development

echo "🌍 Starting EcoTrace Platform..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠ Docker is not running. Please start Docker first.${NC}"
    exit 1
fi

# Start databases
echo -e "${BLUE}📦 Starting databases...${NC}"
docker-compose up -d

# Wait for databases to be ready
echo -e "${BLUE}⏳ Waiting for databases to initialize...${NC}"
sleep 10

# Check Elasticsearch
until curl -s http://localhost:9200 > /dev/null; do
    echo "Waiting for Elasticsearch..."
    sleep 2
done
echo -e "${GREEN}✓ Elasticsearch ready${NC}"

# Check Neo4j
until curl -s http://localhost:7474 > /dev/null; do
    echo "Waiting for Neo4j..."
    sleep 2
done
echo -e "${GREEN}✓ Neo4j ready${NC}"

echo ""
echo -e "${BLUE}🚀 Starting backend API...${NC}"
cd backend/api
source ../venv/bin/activate 2>/dev/null || echo "Virtual environment not found. Please run: cd backend && python -m venv venv && source venv/bin/activate && pip install -r requirements.txt"
uvicorn main:app --reload --port 8000 &
BACKEND_PID=$!
echo -e "${GREEN}✓ Backend API started (PID: $BACKEND_PID)${NC}"

cd ../..

echo ""
echo -e "${BLUE}🎨 Starting frontend...${NC}"
cd frontend
npm run dev &
FRONTEND_PID=$!
echo -e "${GREEN}✓ Frontend started (PID: $FRONTEND_PID)${NC}"

cd ..

echo ""
echo -e "${GREEN}✨ EcoTrace is now running!${NC}"
echo ""
echo "📍 Access points:"
echo "  Frontend:      http://localhost:5173"
echo "  API:           http://localhost:8000"
echo "  API Docs:      http://localhost:8000/api/docs"
echo "  Neo4j Browser: http://localhost:7474"
echo "  Elasticsearch: http://localhost:9200"
echo ""
echo "To stop all services, run: ./stop.sh"
echo "Or press Ctrl+C and run: docker-compose down"
echo ""

# Keep script running
wait
