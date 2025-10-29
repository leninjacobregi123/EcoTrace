# Live Company Analysis - Demo Guide

## Overview
The Live Analysis feature has been successfully integrated into your EcoTrace application. This allows users to analyze any company's sustainability claims in real-time through the UI, with all data populating into the databases automatically.

## What Has Been Implemented

### 1. Backend API Endpoint (`/backend/api/crawler_endpoint.py`)
- **POST `/api/crawl/start`** - Initiates a new crawling task
- **GET `/api/crawl/status/{task_id}`** - Polls for real-time status updates
- **GET `/api/crawl/active`** - Lists all active crawls

### 2. Frontend Component (`/frontend/src/components/LiveCrawler.jsx`)
- Beautiful gradient UI with animations
- Real-time progress tracking
- Status updates every 2 seconds
- Automatic redirect to search results upon completion
- Example companies for quick testing

### 3. Integration
- Added route `/live-analysis` in App.jsx
- Added "Live Analysis" navigation link in sidebar (with Sparkles icon)
- Full integration with existing backend crawler infrastructure

## How It Works

### User Flow:
1. User navigates to **Live Analysis** page from sidebar
2. Enters company name and URL
3. Clicks "Start Analysis"
4. System:
   - Creates unique task ID
   - Runs Scrapy crawler in background
   - Updates progress in real-time
   - Saves data to Elasticsearch, Neo4j, and MongoDB
   - Auto-redirects to search results when complete

### Technical Flow:
```
UI Input → POST /api/crawl/start → Background Task Created
           ↓
        Task ID Returned
           ↓
    Status Polling (every 2s) → GET /api/crawl/status/{task_id}
           ↓
    Scrapy Crawler Executes → Extracts Claims
           ↓
    Data Saved to Databases (ES + Neo4j + MongoDB)
           ↓
    Status: Completed → Auto-redirect to Search Results
```

## Demo Instructions for Tomorrow

### Setup (Before Demo):
1. **Ensure all services are running:**
   ```bash
   # Check databases
   docker ps

   # All containers should be running:
   # - ecotrace-elasticsearch
   # - ecotrace-neo4j
   # - ecotrace-mongodb
   # - ecotrace-redis
   ```

2. **Start Backend (if not already running):**
   ```bash
   cd /home/lenin/IR_2025/ecotrace/backend
   source venv/bin/activate
   nohup python -m uvicorn api.main:app --reload --host 0.0.0.0 --port 8000 > /tmp/ecotrace_backend.log 2>&1 &
   ```

3. **Start Frontend (if not already running):**
   ```bash
   cd /home/lenin/IR_2025/ecotrace/frontend
   npm run dev
   ```

4. **Verify everything is healthy:**
   ```bash
   curl http://localhost:8000/api/health
   ```

### Live Demo Steps:

#### Step 1: Navigate to Live Analysis (30 seconds)
- Open browser to `http://localhost:5173/`
- Click on "Live Analysis" in the sidebar
- Explain: "This is our real-time company analysis feature"

#### Step 2: Enter Company Details (30 seconds)
- **Company Name:** Use a pre-crawled company OR a simple site
- **URL:** Enter the sustainability/impact page URL
- Explain: "Users can analyze any company by simply entering their details"

#### Step 3: Start Analysis (2-3 minutes)
- Click "Start Analysis"
- Show the progress indicators:
  - Status changing from "PENDING" → "RUNNING" → "COMPLETED"
  - Pages crawled counter
  - Claims found counter
  - Current step description
- Explain: "The system is crawling the website in real-time, extracting sustainability claims, and running our AI analysis"

#### Step 4: View Results (1-2 minutes)
- Wait for completion (automatic redirect to Search)
- Show the company in search results with:
  - Credibility score
  - Extracted claims
  - Source links
  - Timestamps

#### Step 5: Show Database Population (1 minute)
- Open another tab and show:
  - Companies page - new company appears
  - Claims page - new claims listed
  - Knowledge Graph - new nodes and relationships
  - Analytics - updated statistics

### Recommended Demo Companies:

**Option 1: Use Pre-Crawled Companies** (Safest for Demo)
- Tesla, Patagonia, IKEA (if already in database)
- Show existing data and explain the crawling process
- Then optionally trigger a new crawl

**Option 2: Crawl Simple/Smaller Sites** (If doing live crawl)
- Use smaller company websites
- Avoid complex sites that may timeout
- Test beforehand to ensure 2-3 minute completion time

**Option 3: Combination Approach** (Recommended)
- Start with showing pre-existing data
- Explain the Live Analysis feature
- Demonstrate the UI and flow (even if crawler takes time)
- Show that task is running in background

## Talking Points for Demo

### Introduction:
*"EcoTrace is an AI-powered platform for verifying corporate sustainability claims. One of our key features is the ability to analyze any company in real-time through our Live Analysis system."*

### During Crawling:
*"As you can see, our system is actively crawling the company's website, extracting their sustainability claims, and running them through our NLP analysis pipeline. All of this data is being saved to our multi-database architecture - Elasticsearch for search, Neo4j for relationships, and MongoDB for structured data."*

### After Completion:
*"And here are the results - our AI has assigned a credibility score based on multiple factors: specificity of claims, presence of evidence, third-party verification, and consistency across sources. Users can click into any claim to see detailed analysis."*

### Database Integration:
*"This data is now fully integrated into our platform - it appears in search results, the knowledge graph shows relationships between companies and claims, and our analytics dashboard has been updated with the latest statistics."*

## Troubleshooting

### If Crawler Takes Too Long:
- Explain it's a complex website
- Show the progress indicators working
- Navigate to other features while it runs
- Come back to show results

### If Crawler Fails:
- Explain that some websites have anti-scraping measures
- Show the error handling in UI
- Demonstrate with a different company
- Or show pre-crawled examples

### If Backend Is Not Responding:
```bash
# Restart backend
cd /home/lenin/IR_2025/ecotrace/backend
lsof -ti :8000 | xargs -r kill -9
source venv/bin/activate
python -m uvicorn api.main:app --reload --host 0.0.0.0 --port 8000
```

## Key Features to Highlight

✅ **Real-Time Processing** - Live crawling and analysis
✅ **Multi-Database Architecture** - Elasticsearch + Neo4j + MongoDB
✅ **AI-Powered Analysis** - NLP for credibility scoring
✅ **Beautiful UI** - Professional gradients and animations
✅ **Progress Tracking** - Real-time status updates
✅ **Automatic Integration** - Data flows into all platform features
✅ **User-Friendly** - Simple form, no technical knowledge needed

## URLs for Quick Access

- Frontend: http://localhost:5173
- Live Analysis: http://localhost:5173/live-analysis
- Backend API Docs: http://localhost:8000/api/docs
- Health Check: http://localhost:8000/api/health

## Success Metrics

By the end of the demo, you will have shown:
1. ✅ Real-time data crawling from company websites
2. ✅ AI analysis and credibility scoring
3. ✅ Database population (3 databases)
4. ✅ Full platform integration (Search, Graph, Analytics)
5. ✅ Professional, production-ready UI
6. ✅ End-to-end workflow from input to results

## Final Tips

1. **Practice once before the demo** - Test the complete flow
2. **Have backup companies ready** - In case one doesn't work
3. **Know your talking points** - Practice explaining the technical architecture
4. **Be prepared for questions** - About scalability, accuracy, data sources
5. **Show enthusiasm** - This is an impressive full-stack application!

---

**Remember:** The goal is to demonstrate that your platform can take a company name/URL, analyze it in real-time, and integrate the results into a comprehensive sustainability verification system. Even if the crawling takes time, the process itself demonstrates the real-world capability of your platform.

Good luck with your demo! 🚀
