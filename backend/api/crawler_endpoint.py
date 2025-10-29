"""
API endpoint to trigger live crawling from UI
"""
from fastapi import APIRouter, BackgroundTasks, HTTPException
from pydantic import BaseModel
import subprocess
import os
import uuid
import json
from datetime import datetime

router = APIRouter()

# Store crawl status in memory (in production, use Redis)
crawl_status = {}

class CrawlRequest(BaseModel):
    company_name: str
    company_url: str

class CrawlStatusResponse(BaseModel):
    task_id: str
    status: str  # 'pending', 'running', 'completed', 'failed'
    progress: dict
    results: dict = None

def run_crawler(task_id: str, company_name: str, company_url: str):
    """
    Run crawler in background
    """
    try:
        # Update status to running
        crawl_status[task_id] = {
            'status': 'running',
            'company_name': company_name,
            'company_url': company_url,
            'started_at': datetime.now().isoformat(),
            'progress': {
                'pages_crawled': 0,
                'claims_found': 0,
                'current_step': 'Initializing crawler...'
            }
        }

        # Run Scrapy crawler
        scrapy_dir = os.path.join(
            os.path.dirname(os.path.dirname(__file__)),
            'scrapy_crawlers',
            'ecotrace_crawler'
        )

        output_file = f'/tmp/crawl_{task_id}.json'

        # Update progress
        crawl_status[task_id]['progress']['current_step'] = 'Crawling website...'

        # Run crawler with timeout
        result = subprocess.run(
            [
                'scrapy', 'crawl', 'corporate_spider',
                '-a', f'start_urls={company_url}',
                '-a', f'company_name={company_name}',
                '-o', output_file,
                '-s', 'CLOSESPIDER_ITEMCOUNT=20',  # Increased for production
                '-s', 'CLOSESPIDER_TIMEOUT=90',     # 90 seconds crawl time
                '-s', 'DEPTH_LIMIT=3',              # Allow deeper crawling
                '-s', 'CONCURRENT_REQUESTS=8',       # Faster crawling
                '-s', 'DOWNLOAD_DELAY=1',            # Reduced delay
            ],
            cwd=scrapy_dir,
            capture_output=True,
            text=True,
            timeout=120  # 2 minutes max total
        )

        # Update progress
        crawl_status[task_id]['progress']['current_step'] = 'Processing data...'

        # Read results
        if os.path.exists(output_file):
            with open(output_file, 'r') as f:
                try:
                    results = json.load(f)
                    if not isinstance(results, list):
                        results = [results]
                except json.JSONDecodeError:
                    results = []

            # Update status to completed
            crawl_status[task_id] = {
                'status': 'completed',
                'company_name': company_name,
                'company_url': company_url,
                'started_at': crawl_status[task_id]['started_at'],
                'completed_at': datetime.now().isoformat(),
                'progress': {
                    'pages_crawled': len(results),
                    'claims_found': sum(1 for r in results if 'claim_text' in r),
                    'current_step': 'Completed successfully!'
                },
                'results': {
                    'items_count': len(results),
                    'company_name': company_name,
                    'claims': [r.get('claim_text', '') for r in results if 'claim_text' in r][:5],
                    'success': True
                }
            }

            # Clean up
            os.remove(output_file)
        else:
            raise Exception("No results file generated")

    except subprocess.TimeoutExpired:
        crawl_status[task_id] = {
            'status': 'failed',
            'company_name': company_name,
            'company_url': company_url,
            'error': 'Crawler timed out after 2 minutes. The website may be too large or slow to respond.',
            'progress': {
                'current_step': 'Timeout - try a more specific sustainability page URL'
            },
            'suggestions': [
                'Try using a direct link to the sustainability/ESG page',
                'Some examples: company.com/sustainability, company.com/environment',
                'Avoid main homepages which may have too much content'
            ]
        }
    except Exception as e:
        error_msg = str(e)
        suggestions = []

        # Provide helpful suggestions based on error type
        if 'No results file generated' in error_msg:
            suggestions = [
                'The website may have blocked our crawler (robots.txt or bot protection)',
                'Try accessing their official sustainability report page',
                'Some companies publish ESG reports as PDFs - those work better',
                'Check if the URL is accessible in a regular browser first'
            ]

        crawl_status[task_id] = {
            'status': 'failed',
            'company_name': company_name,
            'company_url': company_url,
            'error': error_msg,
            'progress': {
                'current_step': f'Crawl failed: {error_msg}'
            },
            'suggestions': suggestions if suggestions else ['Please try a different URL or company']
        }

@router.post("/api/crawl/start")
async def start_crawl(request: CrawlRequest, background_tasks: BackgroundTasks):
    """
    Start a new crawl task
    """
    # Validate input
    if not request.company_name or not request.company_url:
        raise HTTPException(status_code=400, detail="Company name and URL required")

    # Validate URL format
    if not request.company_url.startswith(('http://', 'https://')):
        request.company_url = 'https://' + request.company_url

    # Generate task ID
    task_id = str(uuid.uuid4())

    # Initialize status
    crawl_status[task_id] = {
        'status': 'pending',
        'company_name': request.company_name,
        'company_url': request.company_url,
        'created_at': datetime.now().isoformat(),
        'progress': {
            'current_step': 'Queued for crawling...'
        }
    }

    # Start crawler in background
    background_tasks.add_task(run_crawler, task_id, request.company_name, request.company_url)

    return {
        'task_id': task_id,
        'status': 'pending',
        'message': f'Started crawling {request.company_name}'
    }

@router.get("/api/crawl/status/{task_id}")
async def get_crawl_status(task_id: str):
    """
    Get status of a crawl task
    """
    if task_id not in crawl_status:
        raise HTTPException(status_code=404, detail="Task not found")

    return crawl_status[task_id]

@router.get("/api/crawl/active")
async def get_active_crawls():
    """
    Get all active crawls
    """
    active = {
        tid: status for tid, status in crawl_status.items()
        if status['status'] in ['pending', 'running']
    }
    return {'active_crawls': active, 'count': len(active)}
