"""
News & Media Monitoring Spider
Crawls news sources for articles about corporate sustainability claims,
greenwashing accusations, and environmental controversies
"""

import scrapy
import re
import hashlib
from datetime import datetime, timedelta
from urllib.parse import urljoin, quote
from ecotrace_crawler.items import NewsArticleItem


class NewsSpider(scrapy.Spider):
    name = "news_spider"

    # Target companies
    target_companies = [
        'Apple', 'Microsoft', 'Google', 'Amazon', 'Tesla',
        'ExxonMobil', 'Shell', 'BP', 'Chevron',
        'Walmart', 'Target', 'Ford', 'GM'
    ]

    # News keywords
    sustainability_keywords = [
        'greenwashing', 'net zero', 'carbon neutral', 'climate pledge',
        'emissions', 'sustainability report', 'ESG', 'renewable energy',
        'environmental claim', 'climate target', 'carbon offset'
    ]

    # News sources (using RSS feeds and public APIs where available)
    news_sources = [
        {
            'name': 'Google News RSS',
            'type': 'rss',
            'base_url': 'https://news.google.com/rss/search?q='
        },
    ]

    custom_settings = {
        'CONCURRENT_REQUESTS_PER_DOMAIN': 3,
        'DOWNLOAD_DELAY': 2,
    }

    def start_requests(self):
        """Generate initial requests for news sources"""

        # Search for each company + sustainability keywords
        for company in self.target_companies:
            for keyword in self.sustainability_keywords[:5]:  # Limit to avoid too many requests
                query = f'{company} {keyword}'

                # Google News RSS
                rss_url = f'https://news.google.com/rss/search?q={quote(query)}&hl=en-US&gl=US&ceid=US:en'
                yield scrapy.Request(
                    url=rss_url,
                    callback=self.parse_google_news_rss,
                    meta={'company': company, 'keyword': keyword, 'query': query},
                    errback=self.handle_error
                )

    def parse_google_news_rss(self, response):
        """Parse Google News RSS feed"""
        company = response.meta['company']
        keyword = response.meta['keyword']

        # Parse RSS items
        items = response.xpath('//item')

        for item in items:
            title = item.xpath('.//title/text()').get()
            link = item.xpath('.//link/text()').get()
            pub_date = item.xpath('.//pubDate/text()').get()
            description = item.xpath('.//description/text()').get()
            source = item.xpath('.//source/text()').get()

            if title and link:
                # Follow link to get full article
                yield scrapy.Request(
                    url=link,
                    callback=self.parse_news_article,
                    meta={
                        'company': company,
                        'keyword': keyword,
                        'title': title,
                        'pub_date': pub_date,
                        'description': description,
                        'source': source or 'Unknown'
                    },
                    errback=self.handle_article_error
                )

    def parse_news_article(self, response):
        """Parse individual news article"""
        company = response.meta['company']
        keyword = response.meta['keyword']
        title = response.meta.get('title', '')
        pub_date = response.meta.get('pub_date', '')
        description = response.meta.get('description', '')
        source = response.meta.get('source', 'Unknown')

        # Extract article content
        # Try multiple common selectors for article content
        content_selectors = [
            'article p::text',
            'div.article-body p::text',
            'div.story-body p::text',
            'div.content p::text',
            'div[class*="article"] p::text',
            'main p::text',
            'p::text'
        ]

        content = ''
        for selector in content_selectors:
            paragraphs = response.css(selector).getall()
            if len(paragraphs) > 3:  # Found substantial content
                content = ' '.join(paragraphs)
                break

        if not content:
            content = description  # Fall back to description

        # Extract author if available
        author_selectors = [
            'span.author::text',
            'div.author a::text',
            'a[rel="author"]::text',
            'span.byline::text'
        ]

        author = None
        for selector in author_selectors:
            author = response.css(selector).get()
            if author:
                break

        # Detect all companies mentioned in the article
        company_mentions = []
        for comp in self.target_companies:
            if comp.lower() in content.lower() or comp.lower() in title.lower():
                company_mentions.append(comp)

        # Extract sustainability topics
        topics = []
        for kw in self.sustainability_keywords:
            if kw in content.lower() or kw in title.lower():
                topics.append(kw)

        # Determine sentiment (simple keyword-based)
        sentiment = self.analyze_sentiment(title, content)

        # Calculate credibility rating based on source
        credibility = self.calculate_credibility(source)

        # Create summary (first 500 characters)
        summary = content[:500] + '...' if len(content) > 500 else content

        # Only save if relevant
        if len(company_mentions) > 0 and len(topics) > 0:
            item = NewsArticleItem()
            item['article_id'] = self.generate_id(response.url)
            item['title'] = title
            item['content'] = content
            item['summary'] = summary
            item['company_mentions'] = company_mentions
            item['sustainability_topics'] = topics
            item['sentiment'] = sentiment
            item['source'] = source
            item['author'] = author
            item['published_date'] = pub_date
            item['url'] = response.url
            item['credibility_rating'] = credibility
            item['crawled_at'] = datetime.utcnow().isoformat()

            yield item

    def analyze_sentiment(self, title, content):
        """Simple sentiment analysis based on keywords"""
        text = (title + ' ' + content).lower()

        # Positive keywords
        positive_keywords = [
            'achieve', 'success', 'leader', 'innovative', 'commit',
            'progress', 'milestone', 'award', 'recognized', 'certified'
        ]

        # Negative keywords
        negative_keywords = [
            'greenwash', 'fail', 'mislead', 'accuse', 'lawsuit',
            'violation', 'false', 'deceptive', 'controversy', 'scandal',
            'criticize', 'penalty', 'fraud'
        ]

        positive_count = sum(1 for kw in positive_keywords if kw in text)
        negative_count = sum(1 for kw in negative_keywords if kw in text)

        if negative_count > positive_count:
            return 'negative'
        elif positive_count > negative_count:
            return 'positive'
        else:
            return 'neutral'

    def calculate_credibility(self, source):
        """Calculate source credibility rating"""
        # Tier 1: High credibility sources
        tier1 = [
            'reuters', 'associated press', 'bloomberg', 'financial times',
            'wall street journal', 'the guardian', 'bbc', 'npr'
        ]

        # Tier 2: Medium credibility
        tier2 = [
            'cnn', 'cnbc', 'forbes', 'business insider', 'washington post',
            'new york times', 'time', 'the economist'
        ]

        source_lower = source.lower()

        for outlet in tier1:
            if outlet in source_lower:
                return 0.9

        for outlet in tier2:
            if outlet in source_lower:
                return 0.7

        return 0.5  # Unknown or lower-tier sources

    def generate_id(self, text):
        """Generate unique ID from text"""
        return hashlib.md5(text.encode()).hexdigest()

    def handle_error(self, failure):
        """Handle request errors"""
        self.logger.error(f'Request failed: {failure.value}')

    def handle_article_error(self, failure):
        """Handle article parsing errors (many news sites block scrapers)"""
        self.logger.warning(f'Article request failed (possibly blocked): {failure.value}')
