# EcoTrace: AI-Powered Corporate Sustainability Claims Verification

![EcoTrace Logo](./docs/logo.png)

## 🌍 Overview

EcoTrace is an innovative, domain-specific web crawler and indexer that monitors corporate sustainability claims across the web and builds a comprehensive knowledge graph to detect greenwashing by cross-referencing claims with actual environmental data, regulatory filings, and scientific reports.

## ✨ Key Features

- **Multi-Source Intelligence**: Crawls corporate reports, regulatory databases, scientific publications, and news sources
- **AI-Powered Verification**: Uses NLP and LLMs to extract and verify sustainability claims
- **Knowledge Graph**: Builds relationship networks between companies, claims, and evidence
- **Real-Time Monitoring**: Tracks claim evolution and detects contradictions
- **Credibility Scoring**: Generates authenticity scores for each sustainability claim
- **Professional Dashboard**: Beautiful, responsive UI with interactive visualizations

## 🏗️ Architecture

```
EcoTrace
├── Backend
│   ├── Scrapy Crawlers (Multi-domain spiders)
│   ├── Data Processing (NLP & extraction)
│   ├── FastAPI (REST API)
│   └── Databases (Elasticsearch, Neo4j)
└── Frontend
    └── React + Vite (Modern UI)
```

## 🚀 Technology Stack

### Backend
- **Scrapy**: Domain-specific web crawling
- **FastAPI**: High-performance REST API
- **Elasticsearch**: Full-text search and indexing
- **Neo4j**: Knowledge graph storage
- **Spacy & Transformers**: NLP and claim extraction
- **Sentence-Transformers**: Semantic similarity matching

### Frontend
- **React 18**: Modern UI framework
- **Vite**: Lightning-fast build tool
- **Tailwind CSS**: Utility-first styling
- **Recharts & D3.js**: Data visualizations
- **React Force Graph**: Interactive knowledge graphs
- **Framer Motion**: Smooth animations

## 📦 Installation

### Prerequisites
- Python 3.10+
- Node.js 18+
- Docker & Docker Compose (for databases)
- Git

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python -m spacy download en_core_web_sm
playwright install
```

### Frontend Setup

```bash
cd frontend
npm install
```

### Database Setup

```bash
# Start Elasticsearch and Neo4j using Docker
docker-compose up -d
```

## Usage

### Start Backend

```bash
cd backend
# Start API server
uvicorn api.main:app --reload --port 8000

# Run crawlers
cd scrapy_crawlers
scrapy crawl corporate_spider
scrapy crawl regulatory_spider
scrapy crawl scientific_spider
scrapy crawl news_spider
```

### Start Frontend

```bash
cd frontend
npm run dev
```

Access the application at `http://localhost:5173`

## 🕷️ Crawlers

### 1. Corporate Spider
Crawls company sustainability reports, ESG disclosures, and press releases.

### 2. Regulatory Spider
Extracts data from EPA, SEC filings, and environmental databases.

### 3. Scientific Spider
Monitors academic publications and climate research.

### 4. News Spider
Tracks sustainability-related news and media coverage.

## 📊 API Endpoints

- `GET /api/companies` - List all tracked companies
- `GET /api/companies/{id}/claims` - Get company claims
- `GET /api/companies/{id}/score` - Get credibility score
- `GET /api/search` - Search claims and evidence
- `GET /api/graph/relationships` - Get knowledge graph data
- `POST /api/verify/claim` - Verify a specific claim

## 🎨 UI Features

- **Dashboard**: Overview of all monitored companies
- **Company Profile**: Detailed claim analysis per company
- **Knowledge Graph Viewer**: Interactive relationship visualization
- **Search Engine**: Full-text search across all indexed data
- **Comparison Tool**: Compare multiple companies
- **Alert System**: Real-time contradiction notifications

## 🔒 Security

- JWT-based authentication
- Rate limiting
- Input validation
- CORS protection
- Secure database connections

## 📈 Roadmap

- [ ] Add more data sources (international databases)
- [ ] Implement ML-based greenwashing detection
- [ ] Add sentiment analysis for news coverage
- [ ] Build public API for researchers
- [ ] Mobile app development
- [ ] Multi-language support

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guidelines](./CONTRIBUTING.md).

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- Thanks to all open-source projects that made this possible
- Environmental activists and researchers fighting greenwashing
- The Scrapy, React, and FastAPI communities

## 📞 Contact

- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

---

**Made with ❤️ for a sustainable future**
