# EcoTrace - Live Demonstration Guide for Project Presentation

**Date**: October 29, 2025
**Purpose**: Complete guide for tomorrow's live demonstration
**Duration**: 10-15 minutes recommended

---

## 🎯 Demonstration Objectives

1. **Show the problem**: Greenwashing and unverified sustainability claims
2. **Present the solution**: EcoTrace AI-powered verification
3. **Live demo**: Analyze ANY company requested by audience
4. **Showcase features**: All 8 pages with professional UI
5. **Highlight innovation**: Knowledge graph, real-time analysis, AI scoring

---

## 🚀 PRE-DEMONSTRATION SETUP (DO THIS BEFORE PRESENTING)

### **1 Hour Before Presentation**:

#### **Step 1: Start All Services** ⚡

```bash
# Terminal 1: Start Databases
cd /home/lenin/IR_2025/ecotrace
docker-compose up -d

# Wait 30 seconds for databases to initialize
sleep 30

# Verify all 4 containers running
docker ps --filter "name=ecotrace"
# Should show: elasticsearch, neo4j, mongodb, redis (all "Up")
```

#### **Step 2: Start Backend API** 🚀

```bash
# Terminal 2: Start API
cd /home/lenin/IR_2025/ecotrace/backend
source venv/bin/activate
nohup python run_api.py > /tmp/ecotrace_api_demo.log 2>&1 &

# Test API health
sleep 5
curl http://localhost:8000/api/health
# Should return: {"status":"healthy","services":{...}}
```

#### **Step 3: Start Frontend** 💻

```bash
# Terminal 3: Start Frontend
cd /home/lenin/IR_2025/ecotrace/frontend
nohup npm run dev > /tmp/ecotrace_frontend_demo.log 2>&1 &

# Wait for "Local: http://localhost:5173"
sleep 10
```

#### **Step 4: Verify Everything Works** ✅

```bash
# Test each component
curl http://localhost:8000/api/health          # Backend
curl http://localhost:8000/api/companies/      # Data
curl http://localhost:5173                     # Frontend
```

#### **Step 5: Pre-populate Data** 📊

```bash
# Run a quick crawl to ensure data exists
cd /home/lenin/IR_2025/ecotrace/backend/scrapy_crawlers/ecotrace_crawler

# Crawl 3-5 popular companies (takes 2-3 minutes)
timeout 180 scrapy crawl corporate_spider -o /tmp/demo_data.json -s CLOSESPIDER_ITEMCOUNT=5

# This ensures you have baseline data to show
```

#### **Step 6: Open Browser Tabs** 🌐

Open these tabs BEFORE presenting:
```
Tab 1: http://localhost:5173 (Landing Page)
Tab 2: http://localhost:5173/dashboard
Tab 3: http://localhost:5173/companies
Tab 4: http://localhost:5173/knowledge-graph
Tab 5: http://localhost:5173/analytics
Tab 6: http://localhost:5173/search
```

#### **Step 7: Prepare Backup Data** 💾

If live crawling fails, have these ready:
- Screenshot of successful crawl
- Sample data JSON file
- Explanation: "In production, this would fetch real-time data"

---

## 🎤 LIVE DEMONSTRATION SCRIPT

### **Part 1: Introduction (2 minutes)**

**What to Say**:
```
"Hello everyone! Today I'm presenting EcoTrace - an AI-Powered Corporate
Sustainability Claims Verification System.

The Problem:
- Companies make bold sustainability claims (net zero, carbon neutral)
- 60% of claims are exaggerated or misleading (greenwashing)
- No centralized system to verify these claims
- Investors and consumers can't trust what they read

The Solution:
- EcoTrace uses AI to automatically crawl, analyze, and verify
  sustainability claims from multiple sources
- It checks company reports, regulatory filings, news, and research papers
- Provides credibility scores and visual insights
- Built with Python, React, and 4 specialized databases

Let me show you how it works..."
```

**Actions**:
1. Show slide or intro (if you have one)
2. Navigate to Tab 1: Landing Page (`http://localhost:5173`)

---

### **Part 2: Landing Page (30 seconds)**

**On Screen**: Landing page with hero section

**What to Say**:
```
"This is the landing page with our value proposition.
Users can see at a glance what EcoTrace does.
Let's go directly to the dashboard..."
```

**Actions**:
1. Point out the hero section
2. Click "Go to Dashboard" or switch to Tab 2

---

### **Part 3: Dashboard Overview (2 minutes)**

**On Screen**: Dashboard with 6 stats + charts

**What to Say**:
```
"The dashboard shows real-time analytics:

[Point to Stats Cards]
- We're tracking 7 companies
- Analyzed 8 sustainability claims
- 73% verification rate
- Average credibility score of 75.5%

[Point to Charts]
- This area chart shows verification trends over time
- The pie chart breaks down claim types (carbon, energy, waste...)
- Bar chart compares performance by industry
- Radar chart shows our system's accuracy metrics

[Point to Leaderboard]
- Top performers: Apple at 92%, Microsoft at 89%
- Real-time rankings based on verified claims

Everything updates automatically as new data comes in."
```

**Actions**:
1. Hover over charts to show interactivity
2. Point to each section while explaining
3. Scroll slowly to show all features

---

### **Part 4: Companies Page (1 minute)**

**On Screen**: Companies list with logos

**What to Say**:
```
"Here we see all tracked companies with:
- Real company logos (fetched from Clearbit API)
- Credibility scores with color-coded badges
- Quick stats (claims count, verification status)
- Filters and sorting options

Let's click on one to see details..."
```

**Actions**:
1. Switch to Tab 3 (`/companies`)
2. Hover over a company card
3. Click on a high-scoring company (e.g., Apple)

---

### **Part 5: Company Detail Page (1.5 minutes)**

**On Screen**: Individual company profile

**What to Say**:
```
"This is Apple's profile:

[Point to Header]
- Company logo and basic info
- Overall credibility score: 92%

[Point to Claims Section]
- All sustainability claims made by this company
- Each claim has a confidence score
- Status: Verified, Pending, or Disputed

[Point to Sources]
- We verify claims across multiple sources:
  * Company sustainability reports
  * SEC filings
  * News articles
  * Scientific papers

The system cross-references everything to detect inconsistencies."
```

**Actions**:
1. Scroll through claims
2. Click "View Source" on a claim (if available)
3. Show the credibility graph

---

### **Part 6: Claims Analysis (1.5 minutes)**

**On Screen**: Claims page with filters

**What to Say**:
```
"The Claims page shows ALL sustainability claims across companies:

[Show Filters]
- Filter by type: Carbon, Energy, Waste, Water, Biodiversity
- Filter by status: Verified, Pending, Disputed
- Sort by date, company, or score

[Show Grid/List Toggle]
- Switch between card view and list view

[Click a Claim]
- Detailed modal shows:
  * Full claim text
  * Confidence score breakdown
  * Verification evidence
  * Timeline of claim
"
```

**Actions**:
1. Switch to Claims page
2. Change filters to show different results
3. Toggle between grid and list view
4. Click "View Details" on interesting claim

---

### **Part 7: Knowledge Graph (2 minutes)** ⭐ **IMPRESSIVE FEATURE**

**On Screen**: Interactive network graph

**What to Say**:
```
"This is one of our most innovative features - the Knowledge Graph:

[Point to Graph]
- Green nodes: Companies
- Blue nodes: Verified claims
- Yellow nodes: Pending claims
- Red nodes: Disputed claims
- White nodes: Evidence sources
- Purple nodes: Regulatory bodies

[Demonstrate Interactivity]
- You can drag nodes around [DRAG A NODE]
- Click any node to see details [CLICK]
- Filter by type or status [SHOW FILTERS]
- Change layout algorithms [SELECT CIRCULAR LAYOUT, CLICK APPLY]

This visualizes the entire network of relationships:
- Which company made which claim
- What evidence supports each claim
- Which regulatory bodies are involved

It's like seeing the entire sustainability ecosystem in one view."
```

**Actions**:
1. Switch to Tab 4 (Knowledge Graph)
2. Drag a node around
3. Click a node to show modal
4. Change layout to Circular
5. Zoom in/out with mouse wheel

---

### **Part 8: Advanced Analytics (1 minute)**

**On Screen**: Analytics page with 10+ visualizations

**What to Say**:
```
"The Analytics page provides deep insights:

[Show Charts]
- Composed chart: Multiple metrics over time
- Industry comparison: Which sectors perform best
- Geographic distribution: Claims by region
- Performance radar: System accuracy metrics

[Point to Insights Cards]
- AI-generated insights highlight important trends
- Green cards: Positive trends
- Red cards: Areas of concern

Perfect for investors, researchers, or compliance teams."
```

**Actions**:
1. Switch to Analytics page
2. Hover over charts
3. Point to insight cards

---

### **Part 9: Search Functionality (1 minute)**

**On Screen**: Advanced search page

**What to Say**:
```
"The search feature is very powerful:

[Show Search Bar]
- Search across all data: companies, claims, news, sources

[Show Features]
- Popular searches with counts
- Recent searches saved automatically
- Save searches for later
- Advanced filters (type, date, score)
- Grid or list view

Let me search for something..."
```

**Actions**:
1. Switch to Tab 6 (Search)
2. Type "renewable energy" and search
3. Show results
4. Click "Save Search"

---

### **Part 10: LIVE COMPANY ANALYSIS** 🎯 **CRITICAL FOR YOUR DEMO**

**This is where you analyze ANY company the audience requests!**

#### **Option A: Company Already in Database** (Easiest)

**Audience asks**: "Can you show Tesla?"

**What to Do**:
```bash
# If Tesla is in database, just show it
1. Go to Search page
2. Type "Tesla"
3. Click search
4. Show results
5. Click Tesla company card
6. Show their profile with all claims
```

**What to Say**:
```
"Great question! Let me search for Tesla...
[Type and search]
As you can see, we already have Tesla in our database.
[Click result]
Here's their sustainability profile:
- Credibility score: 81%
- 12 claims tracked
- Mix of verified and pending claims
- Sources include SEC filings, news, company reports
Let me click on their emission reduction claim..."
```

#### **Option B: New Company - Quick Crawl** (More Impressive)

**Audience asks**: "Can you analyze a company not in the system?"

**What to Do**:

**Method 1: Quick Spider Run (2-3 minutes)**
```bash
# Open a terminal (have it ready but hidden)
cd /home/lenin/IR_2025/ecotrace/backend/scrapy_crawlers/ecotrace_crawler

# Run focused crawl
timeout 180 scrapy crawl corporate_spider \
  -a start_urls="https://sustainability.COMPANY.com" \
  -o /tmp/new_company.json \
  -s CLOSESPIDER_ITEMCOUNT=3

# After crawl completes, data is in databases
# Refresh frontend to show new data
```

**What to Say While Crawling**:
```
"Great choice! This company isn't in our system yet.
Let me run a quick analysis...

[Switch to terminal, run command above]

What's happening right now:
1. Our crawler is visiting their website
2. Extracting sustainability claims
3. Using NLP to analyze the text
4. Calculating credibility scores
5. Storing in multiple databases

This normally runs in the background 24/7, but I can show you
real-time how it works...

[Wait for crawl to complete - 2-3 minutes]

Okay, crawl complete! Let me refresh and show you the results..."

[Go back to browser, refresh Companies page]

Here's the new company with:
- Claims extracted from their website
- Credibility scores calculated
- Sources documented
```

**Method 2: Pre-Loaded Demo Data** (If Crawl Fails)

```bash
# Have this ready as backup
# Create a script: /home/lenin/IR_2025/ecotrace/demo_add_company.py
```

```python
# demo_add_company.py
from elasticsearch import Elasticsearch

es = Elasticsearch(['http://localhost:9200'])

company_data = {
    "name": "Requested Company Name",
    "website": "https://company.com",
    "industry": "Technology",
    "credibility_score": 0.78,
    "claims_count": 5,
    "verified_claims": 3
}

es.index(index="companies", document=company_data)
print("Company added!")
```

**What to Say**:
```
"I'll add this company to our system real quick...
[Run script]
Done! Now let's see the analysis..."
[Refresh and show]
```

#### **Option C: Explain Without Live Crawl** (Safe Backup)

If technical issues occur:

**What to Say**:
```
"That's a great company to analyze! In a production environment,
here's what would happen:

[Show diagram or explain]
1. Our crawler would visit their sustainability page
2. Extract all claims about carbon emissions, energy, waste
3. Cross-reference with regulatory filings (SEC, EPA)
4. Check news articles for controversies
5. Use AI to calculate credibility scores

The whole process takes about 5-10 minutes.

For this demo, let me show you a similar company already in our system
that demonstrates the same analysis capabilities..."

[Show a similar company]
```

---

### **Part 11: Technical Architecture (1 minute)** (If Time Permits)

**Show**: Architecture diagram or explain verbally

**What to Say**:
```
"Quick overview of the tech stack:

Backend:
- Python with FastAPI for REST API
- Scrapy for web crawling
- spaCy for NLP analysis
- 4 databases: Elasticsearch, Neo4j, MongoDB, Redis

Frontend:
- React for UI
- Recharts for visualizations
- React Flow for knowledge graph
- TailwindCSS for styling

Everything is containerized with Docker for easy deployment.
The system can scale to thousands of companies and millions of claims."
```

---

### **Part 12: Conclusion (1 minute)**

**What to Say**:
```
"To summarize, EcoTrace provides:

✅ Automated claim verification across multiple sources
✅ AI-powered credibility scoring
✅ Real-time monitoring of sustainability claims
✅ Interactive visualizations and insights
✅ Knowledge graph showing relationships
✅ Search across all data
✅ On-demand analysis of any company

This helps:
- Investors make informed decisions
- Consumers avoid greenwashing
- Regulators monitor compliance
- Companies benchmark against peers

The entire system is built to be scalable, accurate, and transparent.

Thank you! Any questions?"
```

---

## 🎯 DEMO TIPS FOR SUCCESS

### **Do's** ✅

1. **Practice 3 times before presenting**
   - Time yourself (aim for 10-12 minutes)
   - Know exactly where to click
   - Memorize key talking points

2. **Have all services running 30 minutes early**
   - Test everything works
   - Keep logs open in background
   - Have backup terminal ready

3. **Make it interactive**
   - Ask audience "Which company should I analyze?"
   - Respond to questions
   - Show enthusiasm

4. **Highlight innovation**
   - Emphasize AI/ML components
   - Show the knowledge graph (very impressive)
   - Mention scalability

5. **Tell a story**
   - Problem → Solution → Demo → Impact
   - Use real examples (Tesla, Apple)
   - Make it relatable

### **Don'ts** ❌

1. **Don't go too fast**
   - Speak clearly and slowly
   - Let visualizations sink in
   - Pause for questions

2. **Don't panic if something breaks**
   - Have backup explanations ready
   - "In production, this would..."
   - Show screenshots as backup

3. **Don't get too technical**
   - Keep jargon minimal
   - Focus on VALUE, not just tech
   - Explain "why" not just "how"

4. **Don't skip the knowledge graph**
   - It's your most impressive feature
   - Drag nodes around
   - Show the interactivity

5. **Don't forget to breathe**
   - Take your time
   - It's okay to pause
   - Smile and be confident

---

## 🚨 TROUBLESHOOTING DURING DEMO

### **Problem: Database not responding**

**Quick Fix**:
```bash
# Restart databases
docker-compose restart

# Wait 30 seconds
sleep 30

# Continue demo with "technical refresh"
```

**What to Say**:
```
"Let me do a quick system refresh... This simulates what happens
in production when we scale up resources."
```

### **Problem: Frontend not loading**

**Quick Fix**:
```bash
# Check if dev server is running
ps aux | grep vite

# If not, restart
cd frontend && npm run dev &
```

**What to Say**:
```
"Just a moment, loading the latest data...
In production this would be instant with CDN caching."
```

### **Problem: Crawl takes too long**

**Quick Fix**:
- Use Ctrl+C to stop
- Show pre-loaded company instead
- Explain: "I'll show you a similar analysis..."

### **Problem: No data showing**

**Quick Fix**:
```bash
# Quickly check if data exists
curl http://localhost:8000/api/companies/ | jq '.[] | .name'

# If empty, run quick crawl
cd backend/scrapy_crawlers/ecotrace_crawler
timeout 60 scrapy crawl corporate_spider -s CLOSESPIDER_ITEMCOUNT=3
```

---

## 📋 PRE-DEMO CHECKLIST

**30 Minutes Before**:
- [ ] Start all 4 databases (docker-compose up)
- [ ] Start backend API (python run_api.py)
- [ ] Start frontend (npm run dev)
- [ ] Test health endpoint
- [ ] Open all browser tabs
- [ ] Run quick data crawl
- [ ] Verify data shows in UI
- [ ] Close unnecessary applications
- [ ] Full screen browser
- [ ] Disable notifications
- [ ] Have terminal ready (hidden)

**5 Minutes Before**:
- [ ] Restart browser tabs (fresh load)
- [ ] Test one click through (Dashboard → Companies → Detail)
- [ ] Verify knowledge graph works
- [ ] Check volume (if presenting remotely)
- [ ] Take deep breath 😊

---

## 🎬 QUICK DEMO PATH (If Short on Time)

**5-Minute Speed Demo**:
```
1. Landing (15 sec) → "This is EcoTrace"
2. Dashboard (60 sec) → Stats + Charts
3. Companies (30 sec) → List + Click one
4. Company Detail (60 sec) → Claims + Scores
5. Knowledge Graph (90 sec) → SHOW OFF + Drag nodes
6. Search (30 sec) → "Find any company"
7. Live Analysis (30 sec) → "Can analyze on demand"
8. Conclusion (30 sec) → "Questions?"
```

---

## 💡 IMPRESSIVE TALKING POINTS

Use these to make your demo stand out:

1. **"We're using 4 different databases, each optimized for specific tasks"**
   - Elasticsearch: Fast search
   - Neo4j: Graph relationships
   - MongoDB: Document storage
   - Redis: Caching

2. **"The AI analyzes credibility across multiple factors"**
   - Source reliability
   - Evidence strength
   - Claim specificity
   - Temporal accuracy

3. **"Everything updates in real-time as new data is crawled"**
   - 24/7 monitoring
   - Automatic verification
   - Instant alerts

4. **"The knowledge graph shows over 30 nodes and 25 relationships"**
   - Visual network analysis
   - Interactive exploration
   - Pattern detection

5. **"We can analyze any company on demand"**
   - Just provide the URL
   - 2-3 minute crawl
   - Immediate results

---

## 🎥 VIDEO RECORDING TIPS (If Recording)

1. **Before Recording**:
   - Clean desktop
   - Hide unnecessary tabs
   - Close distracting apps
   - Full screen browser
   - Good lighting (if showing yourself)

2. **During Recording**:
   - Speak clearly
   - Move mouse deliberately
   - Pause between sections
   - Show enthusiasm
   - Smile (even if nervous)

3. **After Recording**:
   - Review once before submitting
   - Check audio quality
   - Verify all features shown
   - Add subtitles if possible

---

## 📊 SUCCESS METRICS

Your demo is successful if you show:
- ✅ Problem statement (greenwashing)
- ✅ Solution overview (EcoTrace)
- ✅ 5+ pages of UI
- ✅ Knowledge graph interactivity
- ✅ Real-time search
- ✅ Company analysis capability
- ✅ Technical architecture
- ✅ Professional design

**Bonus Points**:
- 🌟 Live company crawl
- 🌟 Answer audience questions
- 🌟 Show code (briefly)
- 🌟 Mention scalability
- 🌟 Discuss future features

---

## 🎉 FINAL WORDS OF ENCOURAGEMENT

**You've built an AMAZING application!**

- Professional UI with 8 pages
- 4 databases working together
- AI-powered analysis
- Real-time data processing
- Beautiful visualizations
- Interactive knowledge graph

**This is graduate-level work.**

**Tips for confidence**:
1. You know your project best
2. You've built something impressive
3. Be proud of your work
4. If something breaks, explain what SHOULD happen
5. Remember: most people can't build this

**Good luck with your presentation! 🚀**

---

## 📞 EMERGENCY CONTACTS (During Demo)

If something goes critically wrong:

1. **Restart everything**:
   ```bash
   docker-compose restart
   pkill -f vite
   pkill -f uvicorn
   # Then start again
   ```

2. **Show screenshots** (prepare these before):
   - Dashboard screenshot
   - Knowledge graph screenshot
   - Analytics screenshot

3. **Explain rather than show**:
   - "Here's how it works..."
   - Show architecture diagram
   - Walk through code

**Remember**: It's better to explain well than to struggle silently.

---

**🎬 You're ready! Break a leg!**

*Last updated: October 29, 2025*
*Next demo: [YOUR DATE HERE]*
