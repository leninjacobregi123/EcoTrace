"""
Regulatory Data Spider
Crawls environmental regulatory databases (EPA, SEC, etc.) for emissions data,
violations, permits, and environmental filings
"""

import scrapy
import re
import hashlib
import json
from datetime import datetime
from urllib.parse import urljoin, urlencode
from ecotrace_crawler.items import RegulatoryDataItem


class RegulatorySpider(scrapy.Spider):
    name = "regulatory_spider"

    # Target regulatory sources
    data_sources = [
        {
            'name': 'EPA_FLIGHT',
            'url': 'https://ghgdata.epa.gov/ghgp/main.do',
            'description': 'EPA Facility Level GHG Emissions Data'
        },
        {
            'name': 'EPA_ECHO',
            'url': 'https://echo.epa.gov/',
            'description': 'EPA Enforcement and Compliance History'
        },
        {
            'name': 'SEC_EDGAR',
            'url': 'https://www.sec.gov/cgi-bin/browse-edgar',
            'description': 'SEC EDGAR Database for environmental disclosures'
        },
    ]

    # Companies to monitor (ticker symbols for SEC, names for EPA)
    target_companies = [
        {'name': 'Apple Inc', 'ticker': 'AAPL', 'cik': '0000320193'},
        {'name': 'Microsoft Corporation', 'ticker': 'MSFT', 'cik': '0000789019'},
        {'name': 'Amazon.com Inc', 'ticker': 'AMZN', 'cik': '0001018724'},
        {'name': 'Tesla Inc', 'ticker': 'TSLA', 'cik': '0001318605'},
        {'name': 'ExxonMobil Corporation', 'ticker': 'XOM', 'cik': '0000034088'},
        {'name': 'Chevron Corporation', 'ticker': 'CVX', 'cik': '0000093410'},
        {'name': 'BP p.l.c.', 'ticker': 'BP', 'cik': '0000313807'},
    ]

    custom_settings = {
        'CONCURRENT_REQUESTS_PER_DOMAIN': 2,
        'DOWNLOAD_DELAY': 5,  # Be respectful to government servers
        'ROBOTSTXT_OBEY': True,
    }

    def start_requests(self):
        """Generate initial requests for regulatory data"""

        # EPA GHG Data requests
        for company in self.target_companies:
            # Search for facilities by company name
            yield scrapy.FormRequest(
                url='https://ghgdata.epa.gov/ghgp/service/facilitySearch',
                formdata={
                    'facility_name': company['name'],
                    'year': '2023',  # Most recent year
                },
                callback=self.parse_epa_ghg_search,
                meta={'company': company, 'year': 2023},
                errback=self.handle_error
            )

        # SEC EDGAR requests for sustainability reports
        for company in self.target_companies:
            # Search for environmental-related filings (8-K, 10-K, DEF 14A)
            edgar_url = f"https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK={company['cik']}&type=&dateb=&owner=exclude&count=100&search_text=sustainability"
            yield scrapy.Request(
                url=edgar_url,
                callback=self.parse_sec_filings,
                meta={'company': company},
                errback=self.handle_error
            )

    def parse_epa_ghg_search(self, response):
        """Parse EPA GHG facility search results"""
        company = response.meta['company']
        year = response.meta['year']

        try:
            data = json.loads(response.text)

            if not data:
                self.logger.warning(f"No EPA data found for {company['name']}")
                return

            # Process each facility
            for facility in data:
                # Request detailed facility data
                facility_id = facility.get('facilityId')
                if facility_id:
                    detail_url = f'https://ghgdata.epa.gov/ghgp/service/facilityDetail/{facility_id}'
                    yield scrapy.Request(
                        url=detail_url,
                        callback=self.parse_facility_detail,
                        meta={'company': company, 'facility': facility, 'year': year}
                    )

        except json.JSONDecodeError:
            self.logger.error(f"Failed to parse EPA GHG response for {company['name']}")

    def parse_facility_detail(self, response):
        """Parse detailed facility emissions data"""
        company = response.meta['company']
        facility = response.meta['facility']
        year = response.meta['year']

        try:
            data = json.loads(response.text)

            # Extract emissions data
            for gas_type in ['co2', 'ch4', 'n2o', 'totalEmissions']:
                if gas_type in data:
                    item = RegulatoryDataItem()
                    item['record_id'] = self.generate_id(
                        f"{company['name']}_{facility.get('facilityName', '')}_{year}_{gas_type}"
                    )
                    item['company_id'] = self.generate_id(company['name'])
                    item['company_name'] = company['name']
                    item['agency'] = 'EPA'
                    item['record_type'] = 'ghg_emissions'
                    item['metric'] = gas_type
                    item['value'] = data[gas_type]
                    item['unit'] = 'metric_tons_co2e'
                    item['reporting_year'] = str(year)
                    item['facility_name'] = facility.get('facilityName', '')
                    item['facility_location'] = f"{facility.get('city', '')}, {facility.get('state', '')}"
                    item['source_url'] = response.url
                    item['crawled_at'] = datetime.utcnow().isoformat()

                    yield item

        except json.JSONDecodeError:
            self.logger.error(f"Failed to parse facility detail: {response.url}")

    def parse_sec_filings(self, response):
        """Parse SEC EDGAR filing search results"""
        company = response.meta['company']

        # Extract filing links
        filing_rows = response.css('table.tableFile2 tr')

        for row in filing_rows[1:]:  # Skip header
            # Get filing type and date
            filing_type = row.css('td:nth-child(1)::text').get()
            filing_date = row.css('td:nth-child(4)::text').get()

            # Get documents link
            documents_link = row.css('td:nth-child(2) a::attr(href)').get()

            if documents_link and filing_type in ['10-K', '20-F', 'DEF 14A', '8-K']:
                full_url = urljoin(response.url, documents_link)
                yield scrapy.Request(
                    url=full_url,
                    callback=self.parse_sec_filing_documents,
                    meta={
                        'company': company,
                        'filing_type': filing_type,
                        'filing_date': filing_date
                    }
                )

    def parse_sec_filing_documents(self, response):
        """Parse individual SEC filing documents page"""
        company = response.meta['company']
        filing_type = response.meta['filing_type']
        filing_date = response.meta['filing_date']

        # Find HTML or PDF documents
        doc_links = response.css('table.tableFile tr td a::attr(href)').getall()

        for link in doc_links:
            if link.endswith('.htm') or link.endswith('.html'):
                doc_url = urljoin(response.url, link)
                yield scrapy.Request(
                    url=doc_url,
                    callback=self.parse_sec_document,
                    meta={
                        'company': company,
                        'filing_type': filing_type,
                        'filing_date': filing_date,
                        'source_url': doc_url
                    }
                )

    def parse_sec_document(self, response):
        """Extract environmental data from SEC filing"""
        company = response.meta['company']
        filing_type = response.meta['filing_type']
        filing_date = response.meta['filing_date']

        # Extract text content
        text_content = ' '.join(response.css('*::text').getall())

        # Keywords indicating environmental disclosures
        env_keywords = [
            'climate risk', 'carbon emissions', 'greenhouse gas',
            'environmental liability', 'sustainability', 'renewable energy',
            'emissions reduction', 'environmental compliance', 'pollution'
        ]

        # Search for environmental mentions
        for keyword in env_keywords:
            if keyword in text_content.lower():
                # Extract context around keyword (500 chars before and after)
                pattern = rf'.{{0,500}}{keyword}.{{0,500}}'
                matches = re.finditer(pattern, text_content, re.IGNORECASE)

                for match in matches:
                    context = match.group(0)

                    # Try to extract numerical data
                    numbers = re.findall(r'\$?([\d,]+(?:\.\d+)?)\s*(?:million|billion|thousand|tons?|tonnes?|MW|GW)?', context)

                    item = RegulatoryDataItem()
                    item['record_id'] = self.generate_id(f"{company['cik']}_{filing_date}_{keyword}")
                    item['company_id'] = self.generate_id(company['name'])
                    item['company_name'] = company['name']
                    item['agency'] = 'SEC'
                    item['record_type'] = 'environmental_disclosure'
                    item['metric'] = keyword
                    item['source_url'] = response.meta['source_url']
                    item['document_id'] = filing_type
                    item['filed_date'] = filing_date
                    item['crawled_at'] = datetime.utcnow().isoformat()

                    if numbers:
                        item['value'] = numbers[0]

                    yield item

    def generate_id(self, text):
        """Generate unique ID from text"""
        return hashlib.md5(text.encode()).hexdigest()

    def handle_error(self, failure):
        """Handle request errors"""
        self.logger.error(f'Request failed: {failure.value}')
