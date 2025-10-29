# EcoTrace System Architecture & Design

## Table of Contents

- [Overview](#overview)
- [Architecture Principles](#architecture-principles)
- [System Components](#system-components)
- [Data Flow](#data-flow)
- [Database Schema](#database-schema)
- [API Design](#api-design)
- [Scalability Considerations](#scalability-considerations)
- [Security Architecture](#security-architecture)
- [Deployment Architecture](#deployment-architecture)

---

## Overview

EcoTrace is designed as a modern, scalable platform for tracking and verifying corporate sustainability claims. The architecture follows microservices principles while maintaining simplicity for initial deployment.

### Design Goals

1. **Scalability**: Handle millions of claims and hundreds of companies
2. **Performance**: Real-time search and analysis
3. **Reliability**: 99.9% uptime with fault tolerance
4. **Maintainability**: Clean code, modular design
5. **Extensibility**: Easy to add new data sources and features

---

## Architecture Principles

### 1. Separation of Concerns
- **Presentation Layer**: React frontend
- **Application Layer**: FastAPI backend
- **Data Layer**: Triple database system
- **Processing Layer**: Scrapy + NLP pipelines

### 2. Microservices-Ready
While currently monolithic, the architecture supports easy extraction into microservices:
- Crawler Service
- Search Service
- Analytics Service
- Graph Service

### 3. Event-Driven Processing
- Background task execution
- Asynchronous crawling
- Real-time status updates

### 4. Database Per Concern
- **Elasticsearch**: Optimized for search and analytics
- **Neo4j**: Optimized for relationship queries
- **MongoDB**: Optimized for document storage

---

## System Components

### 1. Frontend Application

**Technology**: React 18 + Vite + Tailwind CSS

**Components**:
```
frontend/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── LiveCrawler.jsx
│   │   ├── CompanyCard.jsx
│   │   ├── ClaimCard.jsx
│   │   └── KnowledgeGraph.jsx
│   ├── pages/            # Page-level components
│   │   ├── Dashboard.jsx
│   │   ├── Search.jsx
│   │   ├── Companies.jsx
│   │   ├── Claims.jsx
│   │   └── Analytics.jsx
│   ├── services/         # API clients
│   │   └── api.js
│   └── App.jsx           # Main application
```

**Responsibilities**:
- User interface and interactions
- API communication
- State management
- Data visualization
- Real-time updates

### 2. Backend API

**Technology**: FastAPI + Python 3.11+

**Modules**:
```
backend/api/
├── main.py                  # Application entry point
├── crawler_endpoint.py      # Live crawler API
├── routes/
│   ├── search.py           # Search endpoints
│   ├── companies.py        # Company endpoints
│   ├── claims.py           # Claims endpoints
│   ├── graph.py            # Knowledge graph endpoints
│   └── analytics.py        # Analytics endpoints
└── middleware/
    ├── auth.py             # Authentication
    ├── rate_limit.py       # Rate limiting
    └── cors.py             # CORS handling
```

**Responsibilities**:
- API endpoint handling
- Request validation
- Business logic
- Database interactions
- Background task management

### 3. Web Crawler

**Technology**: Scrapy 2.12 + Playwright 1.55

**Spiders**:
```
scrapy_crawlers/ecotrace_crawler/
├── spiders/
│   ├── corporate_spider.py      # Company websites
│   ├── news_spider.py           # News articles
│   ├── regulatory_spider.py     # Regulatory filings
│   └── scientific_spider.py     # Research papers
├── pipelines.py                 # Data processing
├── items.py                     # Data models
└── settings.py                  # Configuration
```

**Features**:
- JavaScript rendering (Playwright)
- robots.txt bypass (configurable)
- Concurrent requests
- Auto-throttling
- Request retry logic
- PDF extraction

### 4. Data Processing Pipeline

**Stages**:

1. **Validation Pipeline**
   - Data cleaning
   - Format normalization
   - Duplicate detection

2. **NLP Pipeline** (Optional)
   - Named entity recognition
   - Claim classification
   - Confidence scoring
   - Sentiment analysis

3. **Database Pipeline**
   - Elasticsearch indexing
   - Neo4j relationship creation
   - MongoDB document storage

### 5. Database Layer

#### Elasticsearch
```
Indices:
├── ecotrace_companies
├── ecotrace_claims
├── ecotrace_news
└── ecotrace_publications

Mapping Example:
{
  "company_name": "text",
  "claim_text": "text",
  "claim_type": "keyword",
  "target_year": "integer",
  "confidence_score": "float",
  "source_url": "keyword",
  "extracted_at": "date"
}
```

#### Neo4j
```
Nodes:
├── Company
├── Claim
├── Publication
└── NewsArticle

Relationships:
├── MAKES_CLAIM
├── VERIFIED_BY
├── CONTRADICTS
└── MENTIONS
```

#### MongoDB
```
Collections:
├── companies
├── claims
├── regulatory
├── publications
└── news
```

---

## Data Flow

### 1. Live Crawl Flow

```
User Input → API Request → Background Task
                              ↓
                         Scrapy Spider
                              ↓
                    Extract HTML/JavaScript
                              ↓
                      Regex + NLP Extraction
                              ↓
                       Validation Pipeline
                              ↓
                    Triple Database Storage
                              ↓
                        API Response
                              ↓
                       Frontend Display
```

### 2. Search Flow

```
User Query → API Request → Elasticsearch Query
                               ↓
                        Results Retrieved
                               ↓
                        Formatted Response
                               ↓
                        Frontend Display
```

### 3. Graph Query Flow

```
User Request → API Request → Neo4j Cypher Query
                                 ↓
                           Graph Traversal
                                 ↓
                           Relationship Data
                                 ↓
                          Frontend Visualization
```

---

## Database Schema

### Elasticsearch Schema

```json
{
  "companies": {
    "properties": {
      "company_id": { "type": "keyword" },
      "name": { "type": "text" },
      "industry": { "type": "keyword" },
      "website": { "type": "keyword" },
      "source_url": { "type": "keyword" },
      "crawled_at": { "type": "date" }
    }
  },
  "claims": {
    "properties": {
      "claim_id": { "type": "keyword" },
      "company_id": { "type": "keyword" },
      "company_name": { "type": "text" },
      "claim_text": { "type": "text" },
      "claim_type": { "type": "keyword" },
      "numerical_value": { "type": "float" },
      "unit": { "type": "keyword" },
      "target_year": { "type": "integer" },
      "confidence_score": { "type": "float" },
      "source_type": { "type": "keyword" },
      "source_url": { "type": "keyword" },
      "extracted_at": { "type": "date" }
    }
  }
}
```

### Neo4j Schema

```cypher
// Company Node
CREATE (c:Company {
  company_id: String,
  name: String,
  industry: String,
  website: String
})

// Claim Node
CREATE (cl:Claim {
  claim_id: String,
  claim_text: String,
  claim_type: String,
  target_year: Integer,
  confidence_score: Float
})

// Relationship
CREATE (c)-[:MAKES_CLAIM {
  extracted_at: DateTime,
  source_url: String
}]->(cl)
```

---

## API Design

### RESTful Principles

- Resource-based URLs
- HTTP methods (GET, POST, PUT, DELETE)
- JSON request/response
- Standard HTTP status codes
- Pagination for list endpoints
- Filtering and sorting support

### API Versioning

```
/api/v1/companies
/api/v1/claims
/api/v1/search
```

### Response Format

```json
{
  "status": "success",
  "data": { ... },
  "meta": {
    "total": 100,
    "page": 1,
    "per_page": 10
  }
}
```

### Error Format

```json
{
  "status": "error",
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid company URL",
    "details": { ... }
  }
}
```

---

## Scalability Considerations

### Horizontal Scaling

1. **API Servers**: Stateless design allows easy horizontal scaling
2. **Crawler Workers**: Independent spider instances
3. **Database Sharding**: Elasticsearch and MongoDB support sharding
4. **Load Balancing**: Nginx or Traefik for request distribution

### Performance Optimization

1. **Caching**:
   - Redis for API responses
   - Browser caching for frontend assets
   - Elasticsearch query cache

2. **Database Indexing**:
   - Elasticsearch full-text indices
   - Neo4j relationship indices
   - MongoDB compound indices

3. **Async Processing**:
   - Background tasks for crawling
   - Queue-based job processing
   - Webhook callbacks for long operations

### Resource Management

- Connection pooling for databases
- Request rate limiting
- Auto-throttling for crawlers
- Memory-efficient data streaming

---

## Security Architecture

### Authentication & Authorization

- JWT-based authentication (ready for implementation)
- Role-based access control (RBAC)
- API key authentication for external access

### Data Security

- HTTPS for all API communication
- Database encryption at rest
- Secrets management (environment variables)
- Input validation and sanitization

### Network Security

- CORS configuration
- Rate limiting
- DDoS protection (via reverse proxy)
- Firewall rules for database access

---

## Deployment Architecture

### Development Environment

```
Docker Compose:
├── Frontend (Node.js dev server)
├── Backend (FastAPI with hot reload)
├── Elasticsearch
├── Neo4j
└── MongoDB
```

### Production Environment

```
Kubernetes/Docker Swarm:
├── Load Balancer (Nginx/Traefik)
├── Frontend (3 replicas)
├── Backend (5 replicas)
├── Crawler Workers (10 replicas)
├── Elasticsearch Cluster (3 nodes)
├── Neo4j Cluster (3 nodes)
├── MongoDB Replica Set (3 nodes)
├── Redis Cache
└── Monitoring (Prometheus + Grafana)
```

### CI/CD Pipeline

```
GitHub → Actions
    ↓
  Build & Test
    ↓
  Docker Images
    ↓
  Registry (Docker Hub/ECR)
    ↓
  Deploy to Staging
    ↓
  Automated Tests
    ↓
  Deploy to Production
```

---

## Monitoring & Observability

### Metrics

- API response times
- Crawler throughput
- Database query performance
- Error rates
- Resource utilization

### Logging

- Structured JSON logging
- Centralized log aggregation (ELK stack)
- Log levels: DEBUG, INFO, WARNING, ERROR, CRITICAL

### Alerting

- Service health checks
- Database connectivity
- Crawler failures
- High error rates
- Resource exhaustion

---

## Future Enhancements

1. **Machine Learning Integration**
   - Automated claim verification
   - Anomaly detection
   - Predictive analytics

2. **Blockchain Integration**
   - Immutable claim records
   - Verification certificates

3. **Advanced NLP**
   - GPT integration for analysis
   - Multi-language support
   - Sentiment analysis

4. **Mobile Applications**
   - React Native apps
   - Push notifications
   - Offline support

---

## Conclusion

EcoTrace's architecture is designed to be robust, scalable, and maintainable. The modular design allows for easy updates and feature additions while maintaining system stability and performance.

For questions or suggestions, please open an issue or discussion on GitHub.
