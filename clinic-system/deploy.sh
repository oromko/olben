#!/bin/bash

# Family Medium Clinic System - Deployment Script
# This script automates the deployment process

set -e

echo "🏥 Family Medium Clinic System - Deployment"
echo "==========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Docker is installed
check_docker() {
    if ! command -v docker &> /dev/null; then
        echo -e "${RED}❌ Docker is not installed. Please install Docker first.${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ Docker is installed${NC}"
}

# Check if Docker Compose is installed
check_docker_compose() {
    if ! command -v docker-compose &> /dev/null; then
        echo -e "${RED}❌ Docker Compose is not installed. Please install Docker Compose first.${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ Docker Compose is installed${NC}"
}

# Create .env file if it doesn't exist
create_env_file() {
    if [ ! -f .env ]; then
        echo -e "${YELLOW}⚠️  .env file not found. Creating from .env.example...${NC}"
        cp .env.example .env
        echo -e "${GREEN}✅ .env file created${NC}"
    else
        echo -e "${GREEN}✅ .env file already exists${NC}"
    fi
}

# Build Docker images
build_images() {
    echo -e "${YELLOW}🔨 Building Docker images...${NC}"
    docker-compose build
    echo -e "${GREEN}✅ Docker images built${NC}"
}

# Start services
start_services() {
    echo -e "${YELLOW}🚀 Starting services...${NC}"
    docker-compose up -d
    echo -e "${GREEN}✅ Services started${NC}"
}

# Show status
show_status() {
    echo ""
    echo -e "${GREEN}===========================================${NC}"
    echo -e "${GREEN}🎉 Deployment Complete!${NC}"
    echo -e "${GREEN}===========================================${NC}"
    echo ""
    echo "Frontend: http://localhost:3000"
    echo "Backend:  http://localhost:5000"
    echo "MySQL:    localhost:3306"
    echo ""
    echo "To view logs: docker-compose logs -f"
    echo "To stop:      docker-compose down"
    echo ""
}

# Main deployment function
deploy() {
    check_docker
    check_docker_compose
    create_env_file
    
    echo ""
    read -p "Do you want to build images? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        build_images
    fi
    
    start_services
    show_status
}

# Run deployment
deploy
