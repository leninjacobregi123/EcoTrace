"""
Search API routes
"""

from fastapi import APIRouter, HTTPException, Query
from ..models import SearchQuery, SearchResult
from ..database import get_elasticsearch
import time

router = APIRouter()


@router.get("/", response_model=SearchResult)
async def search(
    q: str = Query(..., min_length=1),
    index: str = Query(default="all", regex="^(all|companies|claims|news|publications|regulatory)$"),
    limit: int = Query(default=10, ge=1, le=100),
    offset: int = Query(default=0, ge=0)
):
    """Full-text search across all indices"""
    es = get_elasticsearch()
    if not es:
        raise HTTPException(status_code=503, detail="Elasticsearch unavailable")

    try:
        start_time = time.time()

        # Determine which indices to search
        if index == "all":
            indices = "ecotrace_*"
        else:
            indices = f"ecotrace_{index}"

        # Build search query
        search_query = {
            "multi_match": {
                "query": q,
                "fields": [
                    "name^3",
                    "company_name^3",
                    "title^2",
                    "claim_text^2",
                    "content",
                    "abstract",
                    "description"
                ],
                "fuzziness": "AUTO"
            }
        }

        response = es.search(
            index=indices,
            query=search_query,
            from_=offset,
            size=limit,
            highlight={
                "fields": {
                    "claim_text": {},
                    "content": {"fragment_size": 150},
                    "abstract": {"fragment_size": 150}
                }
            }
        )

        results = []
        for hit in response['hits']['hits']:
            result = hit['_source']
            result['_index'] = hit['_index']
            result['_score'] = hit['_score']
            if 'highlight' in hit:
                result['_highlight'] = hit['highlight']
            results.append(result)

        took_ms = int((time.time() - start_time) * 1000)

        return SearchResult(
            total=response['hits']['total']['value'],
            results=results,
            took_ms=took_ms
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/advanced", response_model=SearchResult)
async def advanced_search(search_query: SearchQuery):
    """Advanced search with filters"""
    es = get_elasticsearch()
    if not es:
        raise HTTPException(status_code=503, detail="Elasticsearch unavailable")

    try:
        start_time = time.time()

        # Build query with filters
        must = [{"multi_match": {"query": search_query.query, "fields": ["*"]}}]

        if search_query.filters:
            for key, value in search_query.filters.items():
                must.append({"match": {key: value}})

        query = {"bool": {"must": must}}

        response = es.search(
            index="ecotrace_*",
            query=query,
            from_=search_query.offset,
            size=search_query.limit
        )

        results = [hit['_source'] for hit in response['hits']['hits']]
        took_ms = int((time.time() - start_time) * 1000)

        return SearchResult(
            total=response['hits']['total']['value'],
            results=results,
            took_ms=took_ms
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
