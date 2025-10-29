"""
Pydantic models for API requests and responses
"""

from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime


class HealthCheck(BaseModel):
    status: str
    timestamp: datetime
    services: Dict[str, bool]


class Company(BaseModel):
    company_id: str
    name: str
    ticker: Optional[str] = None
    industry: Optional[str] = None
    website: Optional[str] = None
    headquarters: Optional[str] = None
    crawled_at: Optional[str] = None


class SustainabilityClaim(BaseModel):
    claim_id: str
    company_id: str
    company_name: str
    claim_text: str
    claim_type: Optional[str] = None
    claim_category: Optional[str] = None
    numerical_value: Optional[str] = None
    unit: Optional[str] = None
    target_year: Optional[str] = None
    baseline_year: Optional[str] = None
    confidence_score: Optional[float] = None
    source_type: Optional[str] = None
    source_url: Optional[str] = None
    published_date: Optional[str] = None
    extracted_at: Optional[str] = None


class CredibilityScore(BaseModel):
    company_id: str
    company_name: str
    overall_score: float
    total_claims: int
    verified_claims: int
    contradicted_claims: int
    pending_claims: int
    score_breakdown: Dict[str, float]
    last_updated: datetime


class SearchQuery(BaseModel):
    query: str
    filters: Optional[Dict[str, Any]] = None
    limit: int = Field(default=10, ge=1, le=100)
    offset: int = Field(default=0, ge=0)


class SearchResult(BaseModel):
    total: int
    results: List[Dict[str, Any]]
    took_ms: int


class NewsArticle(BaseModel):
    article_id: str
    title: str
    summary: Optional[str] = None
    company_mentions: List[str]
    sustainability_topics: List[str]
    sentiment: str
    source: str
    published_date: Optional[str] = None
    url: str
    credibility_rating: Optional[float] = None


class GraphNode(BaseModel):
    id: str
    label: str
    type: str
    properties: Dict[str, Any]


class GraphEdge(BaseModel):
    source: str
    target: str
    type: str
    properties: Optional[Dict[str, Any]] = None


class GraphData(BaseModel):
    nodes: List[GraphNode]
    edges: List[GraphEdge]


class AnalyticsOverview(BaseModel):
    total_companies: int
    total_claims: int
    total_news_articles: int
    total_publications: int
    average_credibility_score: float
    top_claim_types: Dict[str, int]
    sentiment_distribution: Dict[str, int]
    recent_activity: List[Dict[str, Any]]
