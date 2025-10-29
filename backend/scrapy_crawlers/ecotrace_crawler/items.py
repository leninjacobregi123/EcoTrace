"""
Data models for EcoTrace crawler
Defines the structure of scraped items
"""

import scrapy
from datetime import datetime
from scrapy.item import Item, Field


class CompanyItem(scrapy.Item):
    """Company information item"""
    company_id = Field()
    name = Field()
    ticker = Field()
    industry = Field()
    website = Field()
    headquarters = Field()
    description = Field()
    crawled_at = Field()
    source_url = Field()


class SustainabilityClaimItem(scrapy.Item):
    """Sustainability claim extracted from various sources"""
    claim_id = Field()
    company_id = Field()
    company_name = Field()
    claim_text = Field()
    claim_type = Field()  # emissions, renewable_energy, waste, water, etc.
    claim_category = Field()  # target, achievement, initiative, policy
    numerical_value = Field()  # extracted number if applicable
    unit = Field()  # metric (tons CO2, %, MW, etc.)
    target_year = Field()  # if future target
    baseline_year = Field()  # comparison year
    confidence_score = Field()  # NLP confidence
    source_type = Field()  # corporate_report, news, regulatory, scientific
    source_url = Field()
    source_document = Field()
    published_date = Field()
    extracted_at = Field()
    raw_context = Field()  # surrounding text for verification


class RegulatoryDataItem(scrapy.Item):
    """Environmental regulatory data (EPA, SEC, etc.)"""
    record_id = Field()
    company_id = Field()
    company_name = Field()
    agency = Field()  # EPA, SEC, etc.
    record_type = Field()  # emission_report, violation, permit, etc.
    metric = Field()
    value = Field()
    unit = Field()
    reporting_year = Field()
    facility_name = Field()
    facility_location = Field()
    source_url = Field()
    document_id = Field()
    filed_date = Field()
    crawled_at = Field()


class ScientificPublicationItem(scrapy.Item):
    """Scientific research related to companies/industries"""
    publication_id = Field()
    title = Field()
    authors = Field()
    abstract = Field()
    keywords = Field()
    related_companies = Field()  # companies mentioned
    related_industries = Field()
    publication_date = Field()
    journal = Field()
    doi = Field()
    url = Field()
    key_findings = Field()  # extracted findings
    relevance_score = Field()
    crawled_at = Field()


class NewsArticleItem(scrapy.Item):
    """News articles about sustainability claims"""
    article_id = Field()
    title = Field()
    content = Field()
    summary = Field()
    company_mentions = Field()  # list of companies mentioned
    sustainability_topics = Field()  # extracted topics
    sentiment = Field()  # positive, negative, neutral
    source = Field()  # news outlet
    author = Field()
    published_date = Field()
    url = Field()
    credibility_rating = Field()
    crawled_at = Field()


class VerificationEvidenceItem(scrapy.Item):
    """Evidence supporting or contradicting claims"""
    evidence_id = Field()
    claim_id = Field()
    evidence_type = Field()  # supporting, contradicting, neutral
    source_type = Field()
    source_url = Field()
    evidence_text = Field()
    data_points = Field()
    confidence_score = Field()
    extracted_at = Field()


class RelationshipItem(scrapy.Item):
    """Relationships for knowledge graph"""
    source_id = Field()
    source_type = Field()  # company, claim, evidence, etc.
    target_id = Field()
    target_type = Field()
    relationship_type = Field()  # makes_claim, verified_by, contradicts, etc.
    strength = Field()  # relationship strength score
    metadata = Field()  # additional context
    created_at = Field()
