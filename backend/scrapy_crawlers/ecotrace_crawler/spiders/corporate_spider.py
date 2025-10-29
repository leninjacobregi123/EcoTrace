"""
Corporate Sustainability Reports Spider
Crawls company websites for sustainability reports, ESG disclosures, and environmental commitments
"""

import scrapy
import re
import hashlib
from datetime import datetime
from urllib.parse import urljoin, urlparse
from ecotrace_crawler.items import CompanyItem, SustainabilityClaimItem


class CorporateSpider(scrapy.Spider):
    name = "corporate_spider"

    # Major companies to start with (expandable list)
    start_companies = [
        # Tech giants
        {"name": "Apple", "domain": "apple.com", "esg_path": "/environment/"},
        {"name": "Microsoft", "domain": "microsoft.com", "esg_path": "/sustainability/"},
        {"name": "Google", "domain": "sustainability.google", "esg_path": "/"},
        {"name": "Amazon", "domain": "sustainability.aboutamazon.com", "esg_path": "/"},

        # Energy companies
        {"name": "BP", "domain": "bp.com", "esg_path": "/sustainability/"},
        {"name": "Shell", "domain": "shell.com", "esg_path": "/sustainability/"},
        {"name": "ExxonMobil", "domain": "corporate.exxonmobil.com", "esg_path": "/sustainability/"},

        # Automotive
        {"name": "Tesla", "domain": "tesla.com", "esg_path": "/impact/"},
        {"name": "Ford", "domain": "corporate.ford.com", "esg_path": "/sustainability/"},
        {"name": "GM", "domain": "gmsustainability.com", "esg_path": "/"},

        # Retail
        {"name": "Walmart", "domain": "corporate.walmart.com", "esg_path": "/esgreport/"},
        {"name": "Target", "domain": "corporate.target.com", "esg_path": "/sustainability-governance/"},
    ]

    custom_settings = {
        'CONCURRENT_REQUESTS_PER_DOMAIN': 4,
        'DOWNLOAD_DELAY': 3,
    }

    # Sustainability-related keywords for filtering relevant pages
    sustainability_keywords = [
        'sustainability', 'esg', 'environmental', 'climate', 'carbon',
        'emissions', 'renewable', 'green', 'net zero', 'carbon neutral',
        'greenhouse gas', 'ghg', 'scope 1', 'scope 2', 'scope 3',
        'sustainable', 'responsibility', 'impact report'
    ]

    def __init__(self, start_urls=None, company_name=None, *args, **kwargs):
        """Initialize spider with optional custom URL and company name"""
        super(CorporateSpider, self).__init__(*args, **kwargs)
        self.custom_start_urls = start_urls
        self.custom_company_name = company_name

    def start_requests(self):
        """Generate initial requests for each company"""
        # If custom URL provided (from API), use it
        if self.custom_start_urls:
            urls = self.custom_start_urls.split(',') if ',' in self.custom_start_urls else [self.custom_start_urls]
            company_name = self.custom_company_name or 'Unknown Company'

            for url in urls:
                # Extract domain from URL
                parsed_url = urlparse(url if url.startswith('http') else f'https://{url}')
                domain = parsed_url.netloc

                company = {
                    'name': company_name,
                    'domain': domain,
                    'esg_path': parsed_url.path or '/'
                }

                full_url = url if url.startswith('http') else f'https://{url}'

                yield scrapy.Request(
                    url=full_url,
                    callback=self.parse_company_page,
                    meta={
                        'company': company,
                        'playwright': True,
                        'playwright_include_page': True,
                        'playwright_page_methods': [
                            {'method': 'wait_for_timeout', 'args': [2000]},  # Wait 2s for JS to load
                        ]
                    },
                    errback=self.handle_error,
                    dont_filter=True
                )
        else:
            # Use default companies list
            for company in self.start_companies:
                url = f"https://{company['domain']}{company['esg_path']}"
                yield scrapy.Request(
                    url=url,
                    callback=self.parse_company_page,
                    meta={
                        'company': company,
                        'playwright': True,
                        'playwright_include_page': True,
                        'playwright_page_methods': [
                            {'method': 'wait_for_timeout', 'args': [2000]},
                        ]
                    },
                    errback=self.handle_error
                )

    def parse_company_page(self, response):
        """Parse main sustainability/ESG page"""
        company = response.meta['company']

        # Extract company information
        company_item = CompanyItem()
        company_item['company_id'] = self.generate_id(company['name'])
        company_item['name'] = company['name']
        company_item['website'] = company['domain']
        company_item['source_url'] = response.url
        company_item['crawled_at'] = datetime.utcnow().isoformat()

        yield company_item

        # Extract sustainability claims from the page
        yield from self.extract_claims(response, company)

        # Find and follow links to PDF reports
        pdf_links = response.css('a[href$=".pdf"]::attr(href)').getall()
        for pdf_link in pdf_links:
            pdf_url = urljoin(response.url, pdf_link)
            if self.is_sustainability_related(pdf_link):
                yield scrapy.Request(
                    url=pdf_url,
                    callback=self.parse_pdf_report,
                    meta={'company': company, 'file_type': 'pdf'}
                )

        # Follow sustainability-related links
        all_links = response.css('a::attr(href)').getall()
        for link in all_links:
            if self.is_sustainability_related(link):
                full_url = urljoin(response.url, link)
                # Only follow links within same domain
                if urlparse(full_url).netloc == urlparse(response.url).netloc:
                    yield scrapy.Request(
                        url=full_url,
                        callback=self.parse_sustainability_page,
                        meta={
                            'company': company,
                            'playwright': True,
                            'playwright_page_methods': [
                                {'method': 'wait_for_timeout', 'args': [1500]},
                            ]
                        }
                    )

    def parse_sustainability_page(self, response):
        """Parse sub-pages with sustainability information"""
        company = response.meta['company']

        # Extract claims from this page
        yield from self.extract_claims(response, company)

        # Look for downloadable reports
        pdf_links = response.css('a[href$=".pdf"]::attr(href)').getall()
        for pdf_link in pdf_links:
            if self.is_sustainability_related(pdf_link):
                pdf_url = urljoin(response.url, pdf_link)
                yield scrapy.Request(
                    url=pdf_url,
                    callback=self.parse_pdf_report,
                    meta={'company': company, 'file_type': 'pdf'}
                )

    def parse_pdf_report(self, response):
        """Handle PDF sustainability reports (text extraction happens in pipeline)"""
        company = response.meta['company']

        # Create item to be processed by PDF pipeline
        claim_item = SustainabilityClaimItem()
        claim_item['company_id'] = self.generate_id(company['name'])
        claim_item['company_name'] = company['name']
        claim_item['source_type'] = 'corporate_report'
        claim_item['source_url'] = response.url
        claim_item['source_document'] = response.url.split('/')[-1]
        claim_item['extracted_at'] = datetime.utcnow().isoformat()

        # Store PDF content for pipeline processing
        claim_item['raw_context'] = response.body

        yield claim_item

    def extract_claims(self, response, company):
        """Extract sustainability claims from HTML content"""

        # Extract all text content using multiple selectors
        text_elements = response.css('p, h1, h2, h3, h4, h5, h6, li, td, div.text, span.text, article').getall()

        # Enhanced patterns with more flexible matching
        claim_patterns = [
            # Net zero targets (more flexible)
            r'(net[- ]zero|carbon[- ]neutral|climate[- ]neutral)[\s\w]*(?:by|in|until|before|target)[:\s]*(\d{4})',
            # Emission reduction targets
            r'reduce[\s\w]*emissions?[\s\w]*(?:by[\s]*)?(\d+)[\s]*%[\s\w]*(?:by|in|until|before)[:\s]*(\d{4})',
            r'(\d+)[\s]*%[\s\w]*reduction[\s\w]*emissions?[\s\w]*(?:by|in|until|before)[:\s]*(\d{4})',
            r'emissions?[\s\w]*reduction[\s\w]*(\d+)[\s]*%[\s\w]*(?:by|in)[:\s]*(\d{4})',
            # Renewable energy commitments
            r'(\d+)[\s]*%[\s\w]*renewable[\s\w]*energy[\s\w]*(?:by|in|until)[:\s]*(\d{4})',
            r'renewable[\s\w]*energy[\s\w]*(\d+)[\s]*%[\s\w]*(?:by|in|until)[:\s]*(\d{4})',
            r'100[\s]*%[\s\w]*renewable[\s\w]*(?:by|in|until)[:\s]*(\d{4})',
            # Carbon negative/positive
            r'carbon[\s-]*(?:negative|positive)[\s\w]*(?:by|in)[:\s]*(\d{4})',
            # Specific emission values
            r'(?:scope[\s]*[123][\s]*)?emissions?[\s\w]*(\d+(?:,\d+)*(?:\.\d+)?)[\s]*(?:million|billion)?[\s]*(?:tons?|tonnes?|mt|metric\s*tons?)[\s]*(?:of[\s]*)?(?:co2|carbon|ghg)',
            # Waste reduction
            r'zero[\s-]waste[\s\w]*(?:by|in|until)[:\s]*(\d{4})',
            r'(\d+)[\s]*%[\s\w]*(?:waste|landfill)[\s\w]*(?:reduction|diversion)',
            r'eliminate[\s\w]*(?:plastic|waste)[\s\w]*(?:by|in)[:\s]*(\d{4})',
            # Water usage
            r'(\d+)[\s]*%[\s\w]*water[\s\w]*reduction',
            # Circular economy
            r'circular[\s\w]*economy[\s\w]*(?:by|in)[:\s]*(\d{4})',
            # Clean energy
            r'(\d+)[\s]*%[\s\w]*clean[\s\w]*energy',
        ]

        claim_count = 0
        seen_texts = set()  # Avoid duplicates

        for element in text_elements:
            # Remove HTML tags and clean text
            text = re.sub(r'<[^>]+>', '', element)
            text = re.sub(r'\s+', ' ', text).strip()

            # Skip very short or very long texts
            if len(text) < 20 or len(text) > 1000:
                continue

            # Check if text contains sustainability keywords
            text_lower = text.lower()
            if any(keyword in text_lower for keyword in self.sustainability_keywords):

                # Try to match claim patterns
                for pattern in claim_patterns:
                    matches = re.finditer(pattern, text, re.IGNORECASE | re.DOTALL)
                    for match in matches:
                        matched_text = match.group(0).strip()

                        # Skip if we've seen this exact claim
                        if matched_text in seen_texts or len(matched_text) < 10:
                            continue

                        seen_texts.add(matched_text)

                        claim_item = SustainabilityClaimItem()
                        claim_item['claim_id'] = self.generate_id(matched_text + response.url + str(claim_count))
                        claim_item['company_id'] = self.generate_id(company['name'])
                        claim_item['company_name'] = company['name']
                        claim_item['claim_text'] = matched_text
                        claim_item['raw_context'] = text[:500]  # Store context
                        claim_item['source_type'] = 'corporate_website'
                        claim_item['source_url'] = response.url
                        claim_item['extracted_at'] = datetime.utcnow().isoformat()
                        claim_item['confidence_score'] = 0.8  # Higher confidence for HTML extraction

                        # Extract numerical values and years
                        numbers = re.findall(r'\d+', matched_text)
                        if numbers:
                            # Check for years
                            years = [n for n in numbers if len(n) == 4 and 2020 <= int(n) <= 2100]
                            if years:
                                claim_item['target_year'] = years[0]

                            # Get percentage or value
                            percentages = re.findall(r'(\d+)\s*%', matched_text)
                            if percentages:
                                claim_item['numerical_value'] = percentages[0]
                                claim_item['unit'] = 'percent'

                        # Classify claim type
                        if any(word in text_lower for word in ['net zero', 'carbon neutral', 'climate neutral']):
                            claim_item['claim_type'] = 'net_zero'
                        elif any(word in text_lower for word in ['renewable', 'clean energy']):
                            claim_item['claim_type'] = 'renewable_energy'
                        elif 'waste' in text_lower:
                            claim_item['claim_type'] = 'waste_reduction'
                        elif 'water' in text_lower:
                            claim_item['claim_type'] = 'water'
                        elif any(word in text_lower for word in ['emission', 'carbon', 'ghg']):
                            claim_item['claim_type'] = 'emission_reduction'
                        else:
                            claim_item['claim_type'] = 'sustainability'

                        claim_count += 1
                        yield claim_item

    def is_sustainability_related(self, url):
        """Check if URL is likely related to sustainability"""
        url_lower = url.lower()
        return any(keyword in url_lower for keyword in self.sustainability_keywords)

    def generate_id(self, text):
        """Generate unique ID from text"""
        return hashlib.md5(text.encode()).hexdigest()

    def handle_error(self, failure):
        """Handle request errors"""
        self.logger.error(f'Request failed: {failure.value}')
