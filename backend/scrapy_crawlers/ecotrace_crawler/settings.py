# Scrapy settings for ecotrace_crawler project
import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

BOT_NAME = "ecotrace_crawler"

SPIDER_MODULES = ["ecotrace_crawler.spiders"]
NEWSPIDER_MODULE = "ecotrace_crawler.spiders"

# Crawl responsibly by identifying yourself
USER_AGENT = "Mozilla/5.0 (compatible; EcoTrace-Bot/1.0; +https://ecotrace.ai/bot)"

# Obey robots.txt rules (can be overridden per-request)
# Disabled for Live Analysis to access corporate sustainability pages
ROBOTSTXT_OBEY = False
ROBOTSTXT_USER_AGENT = "EcoTrace-Bot"

# Configure maximum concurrent requests
CONCURRENT_REQUESTS = 16
CONCURRENT_REQUESTS_PER_DOMAIN = 8
CONCURRENT_REQUESTS_PER_IP = 8

# Configure delay for requests
DOWNLOAD_DELAY = 2
RANDOMIZE_DOWNLOAD_DELAY = True

# Cookies
COOKIES_ENABLED = True

# Disable Telnet Console
TELNETCONSOLE_ENABLED = False

# Request headers
DEFAULT_REQUEST_HEADERS = {
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
    "Accept-Encoding": "gzip, deflate, br",
    "DNT": "1",
    "Connection": "keep-alive",
    "Upgrade-Insecure-Requests": "1",
}

# Enable or disable spider middlewares
SPIDER_MIDDLEWARES = {
    "ecotrace_crawler.middlewares.EcotraceCrawlerSpiderMiddleware": 543,
}

# Enable or disable downloader middlewares
DOWNLOADER_MIDDLEWARES = {
    "ecotrace_crawler.middlewares.EcotraceCrawlerDownloaderMiddleware": 543,
    # "scrapy.downloadermiddlewares.useragent.UserAgentMiddleware": None,
    # "scrapy_user_agents.middlewares.RandomUserAgentMiddleware": 400,
    "scrapy.downloadermiddlewares.retry.RetryMiddleware": 550,
    "scrapy.downloadermiddlewares.httpproxy.HttpProxyMiddleware": 750,
}

# Playwright integration for JavaScript rendering
DOWNLOAD_HANDLERS = {
    "http": "scrapy_playwright.handler.ScrapyPlaywrightDownloadHandler",
    "https": "scrapy_playwright.handler.ScrapyPlaywrightDownloadHandler",
}

# Playwright settings
PLAYWRIGHT_BROWSER_TYPE = "chromium"
PLAYWRIGHT_LAUNCH_OPTIONS = {
    "headless": True,
    "args": [
        "--disable-blink-features=AutomationControlled",
        "--disable-dev-shm-usage",
        "--no-sandbox",
    ]
}
PLAYWRIGHT_DEFAULT_NAVIGATION_TIMEOUT = 30000  # 30 seconds

# Configure item pipelines
ITEM_PIPELINES = {
    "ecotrace_crawler.pipelines.DataValidationPipeline": 100,
    # "ecotrace_crawler.pipelines.NLPExtractionPipeline": 200,  # Disabled - requires spacy
    "ecotrace_crawler.pipelines.ElasticsearchPipeline": 300,
    "ecotrace_crawler.pipelines.Neo4jPipeline": 400,
    "ecotrace_crawler.pipelines.MongoDBPipeline": 500,
}

# Enable and configure the AutoThrottle extension
AUTOTHROTTLE_ENABLED = True
AUTOTHROTTLE_START_DELAY = 2
AUTOTHROTTLE_MAX_DELAY = 10
AUTOTHROTTLE_TARGET_CONCURRENCY = 1.5
AUTOTHROTTLE_DEBUG = False

# Enable HTTP caching for development
HTTPCACHE_ENABLED = True
HTTPCACHE_EXPIRATION_SECS = 86400  # 24 hours
HTTPCACHE_DIR = "httpcache"
HTTPCACHE_IGNORE_HTTP_CODES = [500, 502, 503, 504, 408, 429]
HTTPCACHE_STORAGE = "scrapy.extensions.httpcache.FilesystemCacheStorage"

# Set settings whose default value is deprecated to a future-proof value
TWISTED_REACTOR = "twisted.internet.asyncioreactor.AsyncioSelectorReactor"
FEED_EXPORT_ENCODING = "utf-8"
