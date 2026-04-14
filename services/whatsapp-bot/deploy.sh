#!/bin/bash

# Deploy script for WhatsApp API

set -e

echo "🚀 WhatsApp API Deployment Script"
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo "📋 Checking prerequisites..."

if ! command_exists docker; then
    echo -e "${RED}❌ Docker is not installed${NC}"
    exit 1
fi

if ! command_exists docker-compose; then
    echo -e "${RED}❌ Docker Compose is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ All prerequisites met${NC}"

# Pull latest changes
echo -e "\n📥 Pulling latest changes..."
git pull origin main || echo -e "${YELLOW}⚠️  Could not pull from git${NC}"

# Build containers
echo -e "\n🔨 Building containers..."
docker-compose -f docker-compose.yml build

# Stop existing containers
echo -e "\n🛑 Stopping existing containers..."
docker-compose -f docker-compose.yml down

# Start containers
echo -e "\n🚀 Starting containers..."
docker-compose -f docker-compose.yml up -d

# Wait for services to start
echo -e "\n⏳ Waiting for services to start..."
sleep 10

# Check health
echo -e "\n🏥 Checking service health..."
if curl -f http://localhost:3000/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ WhatsApp bot is healthy${NC}"
else
    echo -e "${YELLOW}⚠️  WhatsApp bot health check failed${NC}"
fi

# Show logs
echo -e "\n📄 Recent logs:"
docker-compose -f docker-compose.yml logs --tail=20

echo -e "\n${GREEN}🎉 Deployment complete!${NC}"
echo -e "\nUseful commands:"
echo "  View logs:     docker-compose logs -f"
echo "  Stop service:  docker-compose down"
echo "  Restart:       docker-compose restart"
echo "  Status:        docker-compose ps"

# Check if QR code is needed
echo -e "\n📱 Checking WhatsApp connection..."
echo "If you see a QR code in the logs above, scan it with WhatsApp"
echo "To view the QR code again: docker-compose logs whatsapp-bot | grep -A 20 'QR'"