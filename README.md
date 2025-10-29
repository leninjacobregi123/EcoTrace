# EcoTrace

**AI-Powered Corporate Sustainability Claims Verification Platform**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Python 3.11+](https://img.shields.io/badge/python-3.11+-blue.svg)](https://www.python.org/downloads/)
[![React 18](https://img.shields.io/badge/react-18.0+-61DAFB.svg)](https://reactjs.org/)
[![Docker](https://img.shields.io/badge/docker-ready-2496ED.svg)](https://www.docker.com/)

> A comprehensive platform for tracking, analyzing, and verifying corporate sustainability claims using advanced web crawling, natural language processing, and knowledge graph technology.

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Development](#development)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

##  Overview

**EcoTrace** is an enterprise-grade platform designed to combat greenwashing by automatically collecting, analyzing, and verifying corporate sustainability claims. The system crawls company websites, sustainability reports, news articles, and regulatory filings to build a comprehensive knowledge graph of environmental commitments and their verification status.

### Problem Statement

- **70%** of corporate sustainability claims lack proper verification
- Manual verification is time-consuming and expensive
- Greenwashing damages consumer trust and environmental progress
- No centralized platform for tracking corporate environmental commitments

### Solution

EcoTrace provides:
- **Automated claim extraction** from multiple sources using AI-powered web crawling
- **Real-time verification** against regulatory data and scientific publications
- **Knowledge graph** visualization of claim relationships and evidence
- **Live analysis** capability for on-demand company sustainability assessment
- **Comprehensive analytics** dashboard for trend analysis and insights

---

##  Key Features

###  Live Sustainability Analysis
- **Real-time web crawling** with JavaScript rendering (Playwright integration)
- Extract sustainability claims from corporate websites in seconds
- Support for modern React/Next.js based corporate sites
- Automatic claim classification (net-zero, renewable energy, waste reduction, etc.)

###  Multi-Source Data Collection
- **Corporate websites** - sustainability pages and ESG reports
- **Regulatory filings** - EPA, SEC disclosures
- **News articles** - media coverage and fact-checking
- **Scientific publications** - peer-reviewed research validation
- **PDF reports** - automated extraction from sustainability reports

###  AI-Powered Analysis
- **NLP-based claim extraction** with 14+ detection patterns
- **Automatic claim categorization** and type classification
- **Confidence scoring** for extracted claims
- **Entity extraction** - companies, dates, numerical values, units
- **Sentiment analysis** for news coverage

###  Knowledge Graph
- **Neo4j-powered** relationship mapping
- Visual representation of company-claim-evidence connections
- Interactive graph exploration
- Relationship-based insights and validation

###  Triple Database Architecture
- **Elasticsearch** - Full-text search and real-time analytics
- **Neo4j** - Knowledge graph and relationship queries
- **MongoDB** - Raw data storage and backup

###  Analytics Dashboard
- Trend analysis and visualization
- Company credibility scoring
- Claim verification statistics
- Industry benchmarking
- Temporal analysis of commitments

---

##  Architecture

### System Architecture 

"https://github.com/user-attachments/assets/3efe1d89-a3d7-430f-ae09-02838530b024" />


### Data Flow

```
1. DATA COLLECTION
   Corporate Website → Scrapy+Playwright → HTML/PDF Content

2. EXTRACTION
   Content → Regex Patterns + NLP → Structured Claims

3. VALIDATION
   Claims → Confidence Scoring → Classification

4. STORAGE
   Structured Data → Triple Database → Indexed & Queryable

5. PRESENTATION
   API → React Frontend → User Dashboard
```

---

##  Tech Stack

### Backend
- **Framework**: FastAPI (Python 3.11+)
- **Web Scraping**: Scrapy 2.12 + Playwright 1.55
- **NLP**: spaCy, Sentence-Transformers
- **Task Queue**: FastAPI BackgroundTasks
- **API**: REST + JSON

### Frontend
- **Framework**: React 18.2
- **Build Tool**: Vite 5.0
- **Styling**: Tailwind CSS 3.4
- **UI Components**: Custom + shadcn/ui patterns
- **Charts**: Recharts, D3.js
- **Icons**: Lucide React
- **Animations**: Framer Motion

### Databases
- **Search**: Elasticsearch 8.x
- **Graph**: Neo4j 5.x
- **Document**: MongoDB 7.x

### DevOps
- **Containerization**: Docker + Docker Compose
- **Deployment**: Production-ready configuration
- **Monitoring**: Health checks + Logging

---

##  Quick Start

### Prerequisites

- Docker & Docker Compose
- 8GB RAM minimum (16GB recommended)
- 20GB free disk space

### One-Command Deploy

```bash
# Clone repository
git clone https://github.com/yourusername/ecotrace.git
cd ecotrace

# Start all services
docker-compose up -d

# Access the application
# Frontend: http://localhost:3000
# API: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

That's it! The application will be running with all services configured.

---

##  Installation

### Method 1: Docker (Recommended)

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/ecotrace.git
cd ecotrace
```

2. **Configure environment**
```bash
# Copy environment templates
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Edit .env files with your configuration
nano backend/.env
```

3. **Start services**
```bash
# Build and start all containers
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Method 2: Manual Installation

<details>
<summary>Click to expand manual installation steps</summary>

#### Backend Setup

```bash
cd backend

# Create virtual environment
python3.11 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Install Playwright browsers
playwright install chromium

# Configure environment
cp .env.example .env
nano .env

# Start API server
uvicorn api.main:app --host 0.0.0.0 --port 8000 --reload
```

#### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
nano .env

# Start development server
npm run dev

# Build for production
npm run build
```

</details>

---

##  Usage

### Live Company Analysis

```bash
# Via API
curl -X POST http://localhost:8000/api/crawl/start \
  -H "Content-Type: application/json" \
  -d '{
    "company_name": "Microsoft",
    "company_url": "https://www.microsoft.com/en-us/sustainability"
  }'

# Returns: {"task_id": "uuid", "status": "pending"}

# Check status
curl http://localhost:8000/api/crawl/status/{task_id}
```

### Search Claims

```bash
curl "http://localhost:8000/api/search?q=net+zero+2030"
```

### Query Knowledge Graph

```bash
curl "http://localhost:8000/api/graph?company=Tesla"
```

For detailed API documentation, visit: `http://localhost:8000/docs`

---

##  API Documentation

### Core Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Health check for all services |
| `/api/crawl/start` | POST | Start live company analysis |
| `/api/crawl/status/{task_id}` | GET | Get crawl status and results |
| `/api/search` | GET | Full-text search across all data |
| `/api/companies` | GET | List all tracked companies |
| `/api/claims` | GET | Query sustainability claims |
| `/api/graph` | GET | Get knowledge graph data |
| `/api/analytics` | GET | Get analytics and statistics |

**Interactive API Docs**: http://localhost:8000/docs (Swagger UI)

---

##  Project Structure

```
ecotrace/
├── backend/                      # Python backend
│   ├── api/                      # FastAPI application
│   │   ├── main.py              # Application entry point
│   │   ├── crawler_endpoint.py  # Live crawler endpoints
│   │   └── routes/              # API route modules
│   ├── scrapy_crawlers/         # Web scraping
│   │   └── ecotrace_crawler/
│   │       ├── spiders/         # Scrapy spiders
│   │       ├── pipelines.py     # Data processing pipelines
│   │       ├── items.py         # Data models
│   │       └── settings.py      # Crawler configuration
│   ├── data_processing/         # NLP and analysis
│   ├── models/                  # Database models
│   ├── config/                  # Configuration files
│   └── requirements.txt         # Python dependencies
│
├── frontend/                    # React frontend
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── pages/              # Page components
│   │   ├── services/           # API clients
│   │   └── App.jsx             # Main app component
│   ├── public/                 # Static assets
│   └── package.json            # NPM dependencies
│
├── docs/                        # Documentation
│   ├── architecture/           # System design docs
│   ├── setup/                  # Installation guides
│   ├── features/               # Feature documentation
│   ├── api/                    # API documentation
│   └── deployment/             # Deployment guides
│
├── docker-compose.yml          # Docker services config
├── .gitignore                  # Git ignore rules
├── README.md                   # This file
├── LICENSE                     # MIT License
└── CONTRIBUTING.md             # Contribution guidelines
```

---

##  Development

### Running Tests

```bash
# Backend tests
cd backend
pytest tests/ -v

# Frontend tests
cd frontend
npm test
```

### Code Quality

```bash
# Python linting
flake8 backend/
black backend/

# JavaScript linting
npm run lint
```

### Development Workflow

1. Create a feature branch: `git checkout -b feature/amazing-feature`
2. Make your changes
3. Run tests: `pytest && npm test`
4. Commit: `git commit -m 'Add amazing feature'`
5. Push: `git push origin feature/amazing-feature`
6. Open a Pull Request

---

##  Deployment

See [Deployment Guide](docs/deployment/PRODUCTION_DEPLOYMENT_GUIDE.md) for detailed production deployment instructions.

### Quick Deploy Checklist

- [ ] Configure environment variables
- [ ] Set up SSL certificates
- [ ] Configure reverse proxy
- [ ] Set up monitoring
- [ ] Configure backups
- [ ] Security audit

---

##  Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

---

##  License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

##  Acknowledgments

- Built with modern open-source technologies
- Inspired by the need for corporate environmental accountability
- Community-driven sustainability verification

---

##  Contact & Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/ecotrace/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/ecotrace/discussions)

---

##  Roadmap

### v1.0 (Current)
- [x] Core web crawling engine
- [x] Live company analysis
- [x] Triple database architecture
- [x] Analytics dashboard
- [x] Docker deployment

### v1.1 (Next)
- [ ] AI-powered verification scoring
- [ ] Email alerts
- [ ] Advanced NLP with GPT integration
- [ ] API rate limiting

### v2.0 (Future)
- [ ] Multi-language support
- [ ] ML prediction models
- [ ] Blockchain verification
- [ ] Mobile apps

---

<p align="center">
  Made with ❤️ for a sustainable future
</p>

<p align="center">
  <sub>EcoTrace - Transparency in Corporate Sustainability Claims</sub>
</p>
