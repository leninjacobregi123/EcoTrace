"""
Scientific Publications Spider
Crawls academic databases for research papers related to corporate environmental
performance, climate change, and sustainability studies
"""

import scrapy
import re
import hashlib
import json
from datetime import datetime
from urllib.parse import urljoin, urlencode, quote
from ecotrace_crawler.items import ScientificPublicationItem


class ScientificSpider(scrapy.Spider):
    name = "scientific_spider"

    # Target academic sources
    sources = [
        'arxiv',  # ArXiv preprints
        'pubmed',  # PubMed Central
        'doaj',    # Directory of Open Access Journals
    ]

    # Research topics related to corporate sustainability
    search_queries = [
        'corporate carbon emissions',
        'greenwashing detection',
        'corporate environmental performance',
        'ESG disclosure accuracy',
        'climate change corporate response',
        'renewable energy adoption companies',
        'sustainability reporting verification',
        'corporate climate commitments',
    ]

    # Target companies for specific searches
    target_companies = [
        'Apple', 'Microsoft', 'Google', 'Amazon', 'Tesla',
        'ExxonMobil', 'Shell', 'BP', 'Chevron',
        'Walmart', 'Ford', 'GM'
    ]

    custom_settings = {
        'CONCURRENT_REQUESTS_PER_DOMAIN': 2,
        'DOWNLOAD_DELAY': 3,
    }

    def start_requests(self):
        """Generate initial requests for academic sources"""

        # ArXiv searches
        for query in self.search_queries:
            arxiv_url = f'http://export.arxiv.org/api/query?search_query=all:{quote(query)}&start=0&max_results=50&sortBy=submittedDate&sortOrder=descending'
            yield scrapy.Request(
                url=arxiv_url,
                callback=self.parse_arxiv,
                meta={'query': query},
                errback=self.handle_error
            )

        # Company-specific searches
        for company in self.target_companies:
            query = f'{company} climate sustainability emissions'
            arxiv_url = f'http://export.arxiv.org/api/query?search_query=all:{quote(query)}&start=0&max_results=20&sortBy=submittedDate&sortOrder=descending'
            yield scrapy.Request(
                url=arxiv_url,
                callback=self.parse_arxiv,
                meta={'query': query, 'company': company}
            )

        # PubMed Central searches
        for query in self.search_queries[:3]:  # Limit PMC searches
            pmc_url = f'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pmc&term={quote(query)}&retmode=json&retmax=30&sort=date'
            yield scrapy.Request(
                url=pmc_url,
                callback=self.parse_pubmed_search,
                meta={'query': query}
            )

    def parse_arxiv(self, response):
        """Parse ArXiv API response"""
        query = response.meta.get('query', '')
        company = response.meta.get('company', None)

        # Parse XML response
        entries = response.xpath('//xmlns:entry', namespaces={'xmlns': 'http://www.w3.org/2005/Atom'})

        for entry in entries:
            # Extract publication data
            title = entry.xpath('.//xmlns:title/text()', namespaces={'xmlns': 'http://www.w3.org/2005/Atom'}).get()
            abstract = entry.xpath('.//xmlns:summary/text()', namespaces={'xmlns': 'http://www.w3.org/2005/Atom'}).get()
            published = entry.xpath('.//xmlns:published/text()', namespaces={'xmlns': 'http://www.w3.org/2005/Atom'}).get()
            link = entry.xpath('.//xmlns:id/text()', namespaces={'xmlns': 'http://www.w3.org/2005/Atom'}).get()

            # Extract authors
            authors = entry.xpath('.//xmlns:author/xmlns:name/text()', namespaces={'xmlns': 'http://www.w3.org/2005/Atom'}).getall()

            if title and abstract:
                # Check relevance to companies
                related_companies = []
                if company:
                    related_companies.append(company)
                else:
                    for comp in self.target_companies:
                        if comp.lower() in abstract.lower() or comp.lower() in title.lower():
                            related_companies.append(comp)

                # Calculate relevance score
                relevance_score = self.calculate_relevance(title, abstract, query)

                if relevance_score > 0.3:  # Only save relevant publications
                    item = ScientificPublicationItem()
                    item['publication_id'] = self.generate_id(link)
                    item['title'] = title.strip()
                    item['abstract'] = abstract.strip()
                    item['authors'] = authors
                    item['related_companies'] = related_companies
                    item['publication_date'] = published
                    item['journal'] = 'arXiv'
                    item['url'] = link
                    item['relevance_score'] = relevance_score
                    item['crawled_at'] = datetime.utcnow().isoformat()

                    # Extract DOI if available
                    doi = entry.xpath('.//xmlns:doi/text()', namespaces={'xmlns': 'http://www.w3.org/2005/Atom'}).get()
                    if doi:
                        item['doi'] = doi

                    yield item

    def parse_pubmed_search(self, response):
        """Parse PubMed search results"""
        query = response.meta['query']

        try:
            data = json.loads(response.text)
            id_list = data.get('esearchresult', {}).get('idlist', [])

            if id_list:
                # Fetch details for each paper
                ids = ','.join(id_list)
                detail_url = f'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pmc&id={ids}&retmode=json'
                yield scrapy.Request(
                    url=detail_url,
                    callback=self.parse_pubmed_details,
                    meta={'query': query}
                )

        except json.JSONDecodeError:
            self.logger.error(f"Failed to parse PubMed search response")

    def parse_pubmed_details(self, response):
        """Parse PubMed article details"""
        query = response.meta['query']

        try:
            data = json.loads(response.text)
            result = data.get('result', {})

            for key, article in result.items():
                if key == 'uids':
                    continue

                title = article.get('title', '')
                pmcid = article.get('pmcid', '')

                if title and pmcid:
                    # Request full article
                    article_url = f'https://www.ncbi.nlm.nih.gov/pmc/articles/{pmcid}/'
                    yield scrapy.Request(
                        url=article_url,
                        callback=self.parse_pubmed_article,
                        meta={'query': query, 'pmcid': pmcid, 'title': title}
                    )

        except json.JSONDecodeError:
            self.logger.error(f"Failed to parse PubMed details response")

    def parse_pubmed_article(self, response):
        """Parse individual PubMed article"""
        query = response.meta['query']
        pmcid = response.meta['pmcid']
        title = response.meta['title']

        # Extract abstract
        abstract = ' '.join(response.css('div.abstract p::text').getall())

        # Extract authors
        authors = response.css('div.authors a.author-name::text').getall()

        # Extract publication date
        pub_date = response.css('span.cit::text').get()

        # Extract DOI
        doi = response.css('a.id-link::text').get()

        # Check for company mentions
        related_companies = []
        content = title + ' ' + abstract
        for company in self.target_companies:
            if company.lower() in content.lower():
                related_companies.append(company)

        # Calculate relevance
        relevance_score = self.calculate_relevance(title, abstract, query)

        if relevance_score > 0.3:
            item = ScientificPublicationItem()
            item['publication_id'] = self.generate_id(pmcid)
            item['title'] = title
            item['abstract'] = abstract
            item['authors'] = authors
            item['related_companies'] = related_companies
            item['publication_date'] = pub_date
            item['journal'] = 'PubMed Central'
            item['url'] = response.url
            item['relevance_score'] = relevance_score
            item['crawled_at'] = datetime.utcnow().isoformat()

            if doi:
                item['doi'] = doi

            yield item

    def calculate_relevance(self, title, abstract, query):
        """Calculate relevance score based on keyword matching"""
        text = (title + ' ' + abstract).lower()
        query_terms = query.lower().split()

        # Count matching terms
        matches = sum(1 for term in query_terms if term in text)

        # Keywords that increase relevance
        high_value_keywords = [
            'greenwash', 'emission', 'carbon', 'climate', 'sustainability',
            'corporate', 'esg', 'environmental', 'verification', 'disclosure'
        ]

        bonus_matches = sum(1 for keyword in high_value_keywords if keyword in text)

        # Calculate score (0 to 1)
        base_score = matches / len(query_terms) if query_terms else 0
        bonus = bonus_matches * 0.1

        return min(base_score + bonus, 1.0)

    def generate_id(self, text):
        """Generate unique ID from text"""
        return hashlib.md5(str(text).encode()).hexdigest()

    def handle_error(self, failure):
        """Handle request errors"""
        self.logger.error(f'Request failed: {failure.value}')
