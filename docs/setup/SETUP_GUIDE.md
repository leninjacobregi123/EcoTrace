# EcoTrace Setup Guide

Complete step-by-step guide to set up and run the EcoTrace platform.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Database Setup](#database-setup)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [Running the Application](#running-the-application)
- [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Software
- **Python 3.10+** - Backend and crawlers
- **Node.js 18+** - Frontend application
- **Docker & Docker Compose** - For databases
- **Git** - Version control

### System Requirements
- **RAM**: Minimum 8GB, recommended 16GB
- **Storage**: Minimum 20GB free space
- **OS**: Linux, macOS, or Windows with WSL2

## Database Setup

### 1. Start Database Services

```bash
cd ecotrace
docker-compose up -d
```

This will start:
- **Elasticsearch** on port 9200
- **Neo4j** on ports 7474 (HTTP) and 7687 (Bolt)
- **MongoDB** on port 27017
- **Redis** on port 6379

### 2. Verify Database Connections

**Elasticsearch:**
```bash
curl http://localhost:9200
# Should return JSON with cluster info
```

**Neo4j:**
```bash
# Access Neo4j Browser at http://localhost:7474
# Default credentials: neo4j / changeme
```

**MongoDB:**
```bash
docker exec -it ecotrace_mongodb mongosh
# Should open MongoDB shell
```

### 3. Change Default Passwords

**Neo4j:**
```bash
docker exec -it ecotrace_neo4j cypher-shell -u neo4j -p changeme
ALTER CURRENT USER SET PASSWORD FROM 'changeme' TO 'your_secure_password';
```

Update the password in `.env` file.

## Backend Setup

### 1. Create Virtual Environment

```bash
cd backend
python3 -m venv venv

# On Linux/macOS:
source venv/bin/activate

# On Windows:
venv\Scripts\activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Install NLP Models

```bash
# Download spaCy English model
python -m spacy download en_core_web_sm

# Install Playwright browsers (for JavaScript-heavy sites)
playwright install
```

### 4. Configure Environment Variables

```bash
cp ../.env.example ../.env
```

Edit `.env` with your settings:
```env
# Application
APP_ENV=development
DEBUG=True

# API
API_SECRET_KEY=your-secret-key-here

# Elasticsearch
ELASTICSEARCH_HOST=localhost
ELASTICSEARCH_PORT=9200

# Neo4j
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=your_secure_password

# MongoDB
MONGODB_URI=mongodb://localhost:27017

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
```

### 5. Test Backend Installation

```bash
# Test Scrapy installation
cd scrapy_crawlers
scrapy list
# Should show: corporate_spider, regulatory_spider, scientific_spider, news_spider

# Test API
cd ../api
python main.py
# Should start on http://localhost:8000
```

## Frontend Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Configure Environment

Create `.env.local`:
```env
VITE_API_URL=http://localhost:8000
```

### 3. Test Frontend

```bash
npm run dev
# Should start on http://localhost:5173
```

## Running the Application

### Development Mode

**Terminal 1 - Databases:**
```bash
docker-compose up
```

**Terminal 2 - Backend API:**
```bash
cd backend
source venv/bin/activate
cd api
uvicorn main:app --reload --port 8000
```

**Terminal 3 - Frontend:**
```bash
cd frontend
npm run dev
```

**Terminal 4 - Run Crawlers (Optional):**
```bash
cd backend
source venv/bin/activate
cd scrapy_crawlers

# Run individual spiders
scrapy crawl corporate_spider
scrapy crawl regulatory_spider
scrapy crawl scientific_spider
scrapy crawl news_spider

# Or run all spiders
./run_all_spiders.sh
```

### Access the Application

- **Frontend:** http://localhost:5173
- **API Documentation:** http://localhost:8000/api/docs
- **Neo4j Browser:** http://localhost:7474
- **Elasticsearch:** http://localhost:9200

## Production Deployment

### 1. Build Frontend

```bash
cd frontend
npm run build
# Creates optimized build in dist/
```

### 2. Configure Production Environment

Update `.env`:
```env
APP_ENV=production
DEBUG=False
API_HOST=0.0.0.0
API_PORT=8000
CORS_ORIGINS=https://yourdomain.com
```

### 3. Run with Production Server

```bash
cd backend/api
gunicorn main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

### 4. Serve Frontend

Use Nginx, Apache, or a CDN to serve the `dist/` folder.

### 5. Set Up SSL

Use Let's Encrypt or your preferred SSL provider.

### 6. Configure Firewall

- Open ports: 80 (HTTP), 443 (HTTPS)
- Close database ports to external access
- Use internal networking for database connections

## Scheduled Crawling

### Using Cron (Linux/macOS)

```bash
crontab -e
```

Add:
```cron
# Run corporate spider daily at 2 AM
0 2 * * * cd /path/to/ecotrace/backend/scrapy_crawlers && /path/to/venv/bin/scrapy crawl corporate_spider

# Run news spider every 6 hours
0 */6 * * * cd /path/to/ecotrace/backend/scrapy_crawlers && /path/to/venv/bin/scrapy crawl news_spider
```

### Using systemd (Linux)

Create `/etc/systemd/system/ecotrace-crawler.service`:
```ini
[Unit]
Description=EcoTrace Crawler Service
After=network.target

[Service]
Type=oneshot
User=your_user
WorkingDirectory=/path/to/ecotrace/backend/scrapy_crawlers
ExecStart=/path/to/venv/bin/scrapy crawl corporate_spider

[Install]
WantedBy=multi-user.target
```

Create timer `/etc/systemd/system/ecotrace-crawler.timer`:
```ini
[Unit]
Description=Run EcoTrace Crawler Daily

[Timer]
OnCalendar=daily
Persistent=true

[Install]
WantedBy=timers.target
```

Enable:
```bash
sudo systemctl enable ecotrace-crawler.timer
sudo systemctl start ecotrace-crawler.timer
```

## Troubleshooting

### Database Connection Issues

**Problem:** Can't connect to Elasticsearch
```bash
# Check if container is running
docker ps | grep elasticsearch

# Check logs
docker logs ecotrace_elasticsearch

# Restart container
docker restart ecotrace_elasticsearch
```

**Problem:** Neo4j authentication failed
- Reset password using `cypher-shell`
- Update `.env` with correct password

### Crawler Issues

**Problem:** Spiders not found
```bash
# Ensure you're in the correct directory
cd backend/scrapy_crawlers

# Check settings
scrapy list
```

**Problem:** Import errors
```bash
# Reinstall dependencies
pip install -r ../../requirements.txt
```

### Frontend Issues

**Problem:** API requests failing
- Check CORS settings in backend
- Verify API is running on correct port
- Check `.env.local` has correct API URL

**Problem:** Build fails
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Performance Issues

**Problem:** Slow queries
- Add indices to Elasticsearch
- Optimize Neo4j queries
- Enable caching in Redis

**Problem:** High memory usage
- Reduce `CONCURRENT_REQUESTS` in Scrapy settings
- Limit result size in API queries
- Configure Elasticsearch heap size

## Monitoring

### View Logs

**Backend:**
```bash
tail -f logs/ecotrace.log
```

**Scrapy:**
```bash
tail -f backend/scrapy_crawlers/scrapy.log
```

**Docker:**
```bash
docker-compose logs -f
```

### Health Checks

```bash
# API health
curl http://localhost:8000/api/health

# Elasticsearch
curl http://localhost:9200/_cluster/health

# Neo4j
docker exec ecotrace_neo4j cypher-shell -u neo4j -p password "RETURN 1"
```

## Next Steps

1. **Customize Spiders** - Add more companies or data sources
2. **Enhance NLP** - Integrate advanced models for better extraction
3. **Add Authentication** - Implement user login and permissions
4. **Deploy to Cloud** - Use AWS, GCP, or Azure
5. **Set Up Monitoring** - Integrate with Prometheus, Grafana, or Sentry

## Support

For issues and questions:
- Check the [main README](README.md)
- Review [API documentation](http://localhost:8000/api/docs)
- Submit issues on GitHub

---

**Made with ❤️ for a sustainable future**
