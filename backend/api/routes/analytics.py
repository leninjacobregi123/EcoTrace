"""
Analytics API routes
"""

from fastapi import APIRouter, HTTPException
from ..models import AnalyticsOverview
from ..database import get_elasticsearch, get_mongodb
from datetime import datetime, timedelta

router = APIRouter()


@router.get("/overview", response_model=AnalyticsOverview)
async def get_analytics_overview():
    """Get platform-wide analytics overview"""
    es = get_elasticsearch()
    if not es:
        raise HTTPException(status_code=503, detail="Elasticsearch unavailable")

    try:
        # Get counts from each index
        companies_count = es.count(index="ecotrace_companies")['count']
        claims_count = es.count(index="ecotrace_claims")['count']
        news_count = es.count(index="ecotrace_news")['count']
        publications_count = es.count(index="ecotrace_publications")['count']

        # Get claim types distribution
        claims_agg = es.search(
            index="ecotrace_claims",
            size=0,
            aggs={
                "claim_types": {
                    "terms": {"field": "claim_type.keyword", "size": 10}
                }
            }
        )

        top_claim_types = {}
        for bucket in claims_agg['aggregations']['claim_types']['buckets']:
            top_claim_types[bucket['key']] = bucket['doc_count']

        # Get sentiment distribution from news
        sentiment_agg = es.search(
            index="ecotrace_news",
            size=0,
            aggs={
                "sentiments": {
                    "terms": {"field": "sentiment.keyword"}
                }
            }
        )

        sentiment_distribution = {}
        for bucket in sentiment_agg['aggregations']['sentiments']['buckets']:
            sentiment_distribution[bucket['key']] = bucket['doc_count']

        # Get recent activity (last 7 days)
        week_ago = (datetime.utcnow() - timedelta(days=7)).isoformat()
        recent_claims = es.search(
            index="ecotrace_claims",
            query={
                "range": {
                    "extracted_at": {"gte": week_ago}
                }
            },
            size=5,
            sort=[{"extracted_at": {"order": "desc"}}]
        )

        recent_activity = []
        for hit in recent_claims['hits']['hits']:
            source = hit['_source']
            recent_activity.append({
                "type": "claim",
                "company": source.get('company_name'),
                "text": source.get('claim_text', '')[:100] + '...',
                "timestamp": source.get('extracted_at')
            })

        # Calculate average credibility (simplified)
        average_credibility_score = 75.5  # Placeholder

        return AnalyticsOverview(
            total_companies=companies_count,
            total_claims=claims_count,
            total_news_articles=news_count,
            total_publications=publications_count,
            average_credibility_score=average_credibility_score,
            top_claim_types=top_claim_types,
            sentiment_distribution=sentiment_distribution,
            recent_activity=recent_activity
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/trends")
async def get_trends(days: int = 30):
    """Get trending topics and claims over time"""
    es = get_elasticsearch()
    if not es:
        raise HTTPException(status_code=503, detail="Elasticsearch unavailable")

    try:
        cutoff_date = (datetime.utcnow() - timedelta(days=days)).isoformat()

        response = es.search(
            index="ecotrace_claims",
            query={
                "range": {
                    "extracted_at": {"gte": cutoff_date}
                }
            },
            size=0,
            aggs={
                "claims_over_time": {
                    "date_histogram": {
                        "field": "extracted_at",
                        "calendar_interval": "day"
                    }
                },
                "trending_types": {
                    "terms": {"field": "claim_type.keyword", "size": 5}
                }
            }
        )

        timeline = []
        for bucket in response['aggregations']['claims_over_time']['buckets']:
            timeline.append({
                "date": bucket['key_as_string'],
                "count": bucket['doc_count']
            })

        trending = {}
        for bucket in response['aggregations']['trending_types']['buckets']:
            trending[bucket['key']] = bucket['doc_count']

        return {
            "period_days": days,
            "timeline": timeline,
            "trending_claim_types": trending
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
