# EcoTrace Usage Guide

Learn how to use EcoTrace to monitor and verify corporate sustainability claims.

## Table of Contents
- [Dashboard Overview](#dashboard-overview)
- [Monitoring Companies](#monitoring-companies)
- [Analyzing Claims](#analyzing-claims)
- [Search Functionality](#search-functionality)
- [Knowledge Graph](#knowledge-graph)
- [API Usage](#api-usage)
- [Advanced Features](#advanced-features)

## Dashboard Overview

The dashboard provides a real-time overview of the platform's activity:

### Key Metrics
- **Companies Tracked**: Total number of monitored companies
- **Total Claims**: Sustainability claims extracted from all sources
- **News Articles**: Media coverage analyzing company claims
- **Publications**: Academic research related to corporate sustainability

### Visualizations
- **Claim Types Chart**: Distribution of claim categories (emissions, renewable energy, waste, etc.)
- **Sentiment Analysis**: Public sentiment from news coverage
- **Recent Activity**: Latest claims and updates
- **Average Credibility Score**: Platform-wide verification rate

## Monitoring Companies

### Viewing Company List

Navigate to **Companies** to see all tracked organizations:
- Click any company card to view detailed analysis
- Filter by industry
- Sort by credibility score

### Company Detail Page

Each company has a comprehensive profile:

#### Credibility Score
- **Overall Score**: Percentage of verified claims (0-100%)
- **Total Claims**: All sustainability commitments made
- **Verified Claims**: Claims supported by evidence
- **Contradicted Claims**: Claims contradicted by data or news

#### Score Breakdown
Visual chart showing verification rate by claim type:
- Emissions reduction
- Renewable energy
- Waste management
- Water conservation

#### Claims Timeline
- Chronological list of all claims
- Color-coded confidence scores:
  - 🟢 Green (>70%): High confidence/verified
  - 🟡 Yellow (40-70%): Medium confidence/pending
  - 🔴 Red (<40%): Low confidence/contradicted

### Adding New Companies

To track additional companies, modify:
```python
# backend/scrapy_crawlers/ecotrace_crawler/spiders/corporate_spider.py

start_companies = [
    {
        "name": "Company Name",
        "domain": "company.com",
        "esg_path": "/sustainability/"
    },
    # Add more companies here
]
```

## Analyzing Claims

### Claims Page

Browse all extracted sustainability claims:
- Filter by claim type
- Filter by company
- Sort by date or confidence score

### Understanding Claims

Each claim includes:
- **Claim Text**: The exact statement made
- **Company**: Source of the claim
- **Type**: Category (emissions, energy, waste, water)
- **Category**: Classification (target, achievement, initiative)
- **Target Year**: When the goal should be achieved
- **Numerical Value**: Quantified commitment (e.g., 50% reduction)
- **Confidence Score**: Verification confidence (0-1)
- **Source**: Where the claim was found

### Verification Process

Claims are verified by:
1. **NLP Extraction**: Automated claim identification
2. **Cross-Referencing**: Comparison with regulatory data
3. **News Analysis**: Media reports and investigations
4. **Scientific Research**: Academic studies on company performance
5. **Scoring Algorithm**: Confidence calculation based on evidence

## Search Functionality

### Basic Search

Use the search bar to find:
- Companies by name
- Specific claims or keywords
- News articles
- Scientific publications

### Advanced Search

Filter results by:
- **Index**: Search specific data type (companies, claims, news)
- **Date Range**: Recent or historical data
- **Claim Type**: Specific sustainability category

Example queries:
- `"net zero by 2030"` - Find all net-zero commitments
- `Apple emissions` - Find Apple's emission-related claims
- `greenwashing` - Find controversies

## Knowledge Graph

The knowledge graph visualizes relationships between:
- **Companies** ↔️ **Claims**
- **Companies** ↔️ **News Articles**
- **Companies** ↔️ **Research Publications**
- **Claims** ↔️ **Evidence**

### Interpreting the Graph

**Node Types:**
- 🏢 **Company Nodes**: Tracked organizations
- 📄 **Claim Nodes**: Sustainability commitments
- 📰 **News Nodes**: Media articles
- 📚 **Publication Nodes**: Research papers

**Edge Types:**
- **MAKES_CLAIM**: Company → Claim
- **MENTIONS**: News/Publication → Company
- **VERIFIES**: Evidence → Claim
- **CONTRADICTS**: Evidence → Claim

## API Usage

### Authentication

(When implemented)
```bash
# Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "user", "password": "pass"}'

# Use token in requests
curl http://localhost:8000/api/companies \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Common Endpoints

**Get Companies:**
```bash
curl http://localhost:8000/api/companies?limit=10
```

**Get Company Details:**
```bash
curl http://localhost:8000/api/companies/{company_id}
```

**Get Company Claims:**
```bash
curl http://localhost:8000/api/companies/{company_id}/claims
```

**Get Credibility Score:**
```bash
curl http://localhost:8000/api/companies/{company_id}/score
```

**Search:**
```bash
curl "http://localhost:8000/api/search?q=carbon+neutral&limit=20"
```

**Get Analytics:**
```bash
curl http://localhost:8000/api/analytics/overview
curl http://localhost:8000/api/analytics/trends?days=30
```

### Response Format

All responses are JSON:
```json
{
  "company_id": "abc123",
  "name": "Example Corp",
  "industry": "Technology",
  "credibility_score": 75.5
}
```

Error responses include:
```json
{
  "detail": "Error message here"
}
```

## Advanced Features

### Custom Spiders

Create custom spiders for specific data sources:

```python
# backend/scrapy_crawlers/ecotrace_crawler/spiders/custom_spider.py

import scrapy
from ecotrace_crawler.items import SustainabilityClaimItem

class CustomSpider(scrapy.Spider):
    name = "custom_spider"
    start_urls = ["https://example.com/sustainability"]

    def parse(self, response):
        # Your parsing logic
        item = SustainabilityClaimItem()
        item['company_name'] = 'Example Corp'
        item['claim_text'] = response.css('...').get()
        yield item
```

### NLP Customization

Enhance claim extraction in pipelines:

```python
# backend/scrapy_crawlers/ecotrace_crawler/pipelines.py

def process_item(self, item, spider):
    # Add custom NLP processing
    # Use transformers, BERT, etc.
    return item
```

### Data Export

**Export to CSV:**
```bash
cd backend/scrapy_crawlers
scrapy crawl corporate_spider -o claims.csv
```

**Export to JSON:**
```bash
scrapy crawl corporate_spider -o claims.json
```

**Export from MongoDB:**
```bash
mongoexport --db=ecotrace --collection=claims --out=claims.json
```

**Export from Elasticsearch:**
```bash
curl -X GET "localhost:9200/ecotrace_claims/_search?size=1000" > claims.json
```

### Scheduling Crawlers

**Linux/macOS (cron):**
```bash
# Edit crontab
crontab -e

# Run daily at 2 AM
0 2 * * * cd /path/to/ecotrace/backend/scrapy_crawlers && scrapy crawl corporate_spider
```

**Windows (Task Scheduler):**
1. Open Task Scheduler
2. Create Basic Task
3. Set trigger (e.g., daily)
4. Action: Start a program
5. Program: `C:\path\to\venv\Scripts\scrapy.exe`
6. Arguments: `crawl corporate_spider`
7. Start in: `C:\path\to\ecotrace\backend\scrapy_crawlers`

### Data Analysis

**Using Python:**
```python
from elasticsearch import Elasticsearch

es = Elasticsearch(['http://localhost:9200'])

# Get all claims for a company
response = es.search(
    index="ecotrace_claims",
    query={"match": {"company_name": "Tesla"}}
)

claims = [hit['_source'] for hit in response['hits']['hits']]
```

**Using Neo4j (Cypher):**
```cypher
// Find companies with most claims
MATCH (c:Company)-[:MAKES_CLAIM]->(claim:Claim)
RETURN c.name, count(claim) as claim_count
ORDER BY claim_count DESC
LIMIT 10

// Find contradicted claims
MATCH (c:Company)-[:MAKES_CLAIM]->(claim:Claim)
WHERE claim.confidence_score < 0.3
RETURN c.name, claim.claim_text, claim.confidence_score
```

## Best Practices

### 1. Regular Updates
Run crawlers regularly to keep data fresh:
- Corporate spider: Daily
- Regulatory spider: Weekly
- News spider: Every 6 hours
- Scientific spider: Weekly

### 2. Data Quality
- Review low-confidence claims manually
- Update NLP models periodically
- Validate against multiple sources

### 3. Performance Optimization
- Use Redis caching for frequently accessed data
- Limit concurrent requests to avoid overwhelming servers
- Archive old data to separate indices

### 4. Ethical Crawling
- Respect robots.txt
- Use appropriate delays between requests
- Identify your bot with proper user agent
- Don't overwhelm target servers

## Troubleshooting Common Issues

### No Data Showing

1. Check if crawlers have been run
2. Verify database connections
3. Check Elasticsearch indices:
   ```bash
   curl http://localhost:9200/_cat/indices?v
   ```

### Incorrect Claims

1. Review extraction patterns in spiders
2. Enhance NLP pipeline
3. Add manual verification step

### Slow Performance

1. Add database indices
2. Implement caching
3. Optimize queries
4. Scale horizontally

## Getting Help

- **Documentation**: Check README.md and SETUP_GUIDE.md
- **API Docs**: http://localhost:8000/api/docs
- **Logs**: Check `logs/ecotrace.log`
- **GitHub Issues**: Submit bug reports and feature requests

---

**Made with ❤️ for a sustainable future**
