"""
Companies API routes
"""

from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from ..models import Company, CredibilityScore
from ..database import get_elasticsearch, get_neo4j, get_mongodb
from datetime import datetime

router = APIRouter()


@router.get("/", response_model=List[Company])
async def get_companies(
    limit: int = Query(default=50, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    industry: Optional[str] = None
):
    """Get list of all tracked companies"""
    es = get_elasticsearch()
    if not es:
        raise HTTPException(status_code=503, detail="Elasticsearch unavailable")

    try:
        # Build query
        query = {"match_all": {}}
        if industry:
            query = {"match": {"industry": industry}}

        response = es.search(
            index="ecotrace_companies",
            query=query,
            from_=offset,
            size=limit
        )

        companies = []
        for hit in response['hits']['hits']:
            companies.append(Company(**hit['_source']))

        return companies

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{company_id}", response_model=Company)
async def get_company(company_id: str):
    """Get company details by ID"""
    es = get_elasticsearch()
    if not es:
        raise HTTPException(status_code=503, detail="Elasticsearch unavailable")

    try:
        response = es.get(index="ecotrace_companies", id=company_id)
        return Company(**response['_source'])
    except Exception as e:
        raise HTTPException(status_code=404, detail="Company not found")


@router.get("/{company_id}/claims")
async def get_company_claims(
    company_id: str,
    limit: int = Query(default=20, ge=1, le=100)
):
    """Get all claims made by a specific company"""
    es = get_elasticsearch()
    if not es:
        raise HTTPException(status_code=503, detail="Elasticsearch unavailable")

    try:
        response = es.search(
            index="ecotrace_claims",
            query={"match": {"company_id": company_id}},
            size=limit,
            sort=[{"extracted_at": {"order": "desc"}}]
        )

        claims = [hit['_source'] for hit in response['hits']['hits']]
        return {
            "company_id": company_id,
            "total_claims": response['hits']['total']['value'],
            "claims": claims
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{company_id}/score", response_model=CredibilityScore)
async def get_company_credibility_score(company_id: str):
    """Calculate and return company credibility score"""
    es = get_elasticsearch()
    if not es:
        raise HTTPException(status_code=503, detail="Elasticsearch unavailable")

    try:
        # Get company info
        company_response = es.get(index="ecotrace_companies", id=company_id)
        company = company_response['_source']

        # Get all claims
        claims_response = es.search(
            index="ecotrace_claims",
            query={"match": {"company_id": company_id}},
            size=1000
        )

        total_claims = claims_response['hits']['total']['value']
        claims = [hit['_source'] for hit in claims_response['hits']['hits']]

        # Calculate score (simplified version)
        verified = sum(1 for c in claims if c.get('confidence_score', 0) > 0.8)
        contradicted = sum(1 for c in claims if c.get('confidence_score', 0) < 0.3)
        pending = total_claims - verified - contradicted

        # Overall score calculation
        if total_claims > 0:
            overall_score = (verified / total_claims) * 100
        else:
            overall_score = 0.0

        # Score breakdown by claim type
        score_breakdown = {}
        claim_types = {}
        for claim in claims:
            ct = claim.get('claim_type', 'unknown')
            if ct not in claim_types:
                claim_types[ct] = {'total': 0, 'verified': 0}
            claim_types[ct]['total'] += 1
            if claim.get('confidence_score', 0) > 0.8:
                claim_types[ct]['verified'] += 1

        for ct, data in claim_types.items():
            score_breakdown[ct] = (data['verified'] / data['total']) * 100 if data['total'] > 0 else 0

        return CredibilityScore(
            company_id=company_id,
            company_name=company.get('name', 'Unknown'),
            overall_score=overall_score,
            total_claims=total_claims,
            verified_claims=verified,
            contradicted_claims=contradicted,
            pending_claims=pending,
            score_breakdown=score_breakdown,
            last_updated=datetime.utcnow()
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{company_id}/news")
async def get_company_news(
    company_id: str,
    limit: int = Query(default=20, ge=1, le=100)
):
    """Get news articles mentioning the company"""
    es = get_elasticsearch()
    mongo = get_mongodb()

    if not es:
        raise HTTPException(status_code=503, detail="Elasticsearch unavailable")

    try:
        # Get company name first
        company_response = es.get(index="ecotrace_companies", id=company_id)
        company_name = company_response['_source'].get('name')

        # Search news articles
        response = es.search(
            index="ecotrace_news",
            query={"match": {"company_mentions": company_name}},
            size=limit,
            sort=[{"published_date": {"order": "desc"}}]
        )

        articles = [hit['_source'] for hit in response['hits']['hits']]
        return {
            "company_id": company_id,
            "company_name": company_name,
            "total_articles": response['hits']['total']['value'],
            "articles": articles
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
