#!/bin/bash

# EcoTrace Stop Script
# This script stops all running services

echo "🛑 Stopping EcoTrace Platform..."

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

# Stop backend
echo "Stopping backend..."
pkill -f "uvicorn main:app"

# Stop frontend
echo "Stopping frontend..."
pkill -f "vite"

# Stop databases
echo "Stopping databases..."
docker-compose down

echo -e "${GREEN}✓ All services stopped${NC}"
