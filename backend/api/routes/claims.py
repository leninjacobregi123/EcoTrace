"""
Claims API routes
"""

from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from ..models import SustainabilityClaim
from ..database import get_elasticsearch

router = APIRouter()


@router.get("/", response_model=List[SustainabilityClaim])
async def get_claims(
    limit: int = Query(default=50, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    claim_type: Optional[str] = None,
    company_name: Optional[str] = None
):
    """Get list of sustainability claims"""
    es = get_elasticsearch()
    if not es:
        raise HTTPException(status_code=503, detail="Elasticsearch unavailable")

    try:
        # Build query
        must = []
        if claim_type:
            must.append({"match": {"claim_type": claim_type}})
        if company_name:
            must.append({"match": {"company_name": company_name}})

        query = {"bool": {"must": must}} if must else {"match_all": {}}

        response = es.search(
            index="ecotrace_claims",
            query=query,
            from_=offset,
            size=limit,
            sort=[{"extracted_at": {"order": "desc"}}]
        )

        claims = []
        for hit in response['hits']['hits']:
            claims.append(SustainabilityClaim(**hit['_source']))

        return claims

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{claim_id}", response_model=SustainabilityClaim)
async def get_claim(claim_id: str):
    """Get specific claim by ID"""
    es = get_elasticsearch()
    if not es:
        raise HTTPException(status_code=503, detail="Elasticsearch unavailable")

    try:
        response = es.get(index="ecotrace_claims", id=claim_id)
        return SustainabilityClaim(**response['_source'])
    except Exception as e:
        raise HTTPException(status_code=404, detail="Claim not found")


@router.get("/types/summary")
async def get_claim_types_summary():
    """Get summary of claims by type"""
    es = get_elasticsearch()
    if not es:
        raise HTTPException(status_code=503, detail="Elasticsearch unavailable")

    try:
        response = es.search(
            index="ecotrace_claims",
            size=0,
            aggs={
                "claim_types": {
                    "terms": {"field": "claim_type.keyword", "size": 20}
                },
                "claim_categories": {
                    "terms": {"field": "claim_category.keyword", "size": 10}
                }
            }
        )

        claim_types = {}
        for bucket in response['aggregations']['claim_types']['buckets']:
            claim_types[bucket['key']] = bucket['doc_count']

        claim_categories = {}
        for bucket in response['aggregations']['claim_categories']['buckets']:
            claim_categories[bucket['key']] = bucket['doc_count']

        return {
            "total_claims": response['hits']['total']['value'],
            "by_type": claim_types,
            "by_category": claim_categories
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
