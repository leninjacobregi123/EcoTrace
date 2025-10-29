"""
Knowledge Graph API routes
"""

from fastapi import APIRouter, HTTPException, Query
from ..models import GraphData, GraphNode, GraphEdge
from ..database import get_neo4j

router = APIRouter()


@router.get("/company/{company_id}", response_model=GraphData)
async def get_company_graph(
    company_id: str,
    depth: int = Query(default=1, ge=1, le=3)
):
    """Get knowledge graph for a specific company"""
    driver = get_neo4j()
    if not driver:
        raise HTTPException(status_code=503, detail="Neo4j unavailable")

    try:
        with driver.session() as session:
            # Get company and related nodes
            query = """
            MATCH (c:Company {company_id: $company_id})
            OPTIONAL MATCH (c)-[r1:MAKES_CLAIM]->(claim:Claim)
            OPTIONAL MATCH (c)<-[r2:MENTIONS]-(news:NewsArticle)
            OPTIONAL MATCH (c)<-[r3:MENTIONS]-(pub:Publication)
            RETURN c, claim, news, pub, r1, r2, r3
            LIMIT 100
            """

            result = session.run(query, company_id=company_id)

            nodes = {}
            edges = []

            for record in result:
                # Add company node
                if record['c']:
                    company = record['c']
                    node_id = company['company_id']
                    if node_id not in nodes:
                        nodes[node_id] = GraphNode(
                            id=node_id,
                            label=company.get('name', 'Unknown'),
                            type='company',
                            properties=dict(company)
                        )

                # Add claim nodes
                if record['claim']:
                    claim = record['claim']
                    node_id = claim['claim_id']
                    if node_id not in nodes:
                        nodes[node_id] = GraphNode(
                            id=node_id,
                            label=claim.get('claim_text', '')[:50] + '...',
                            type='claim',
                            properties=dict(claim)
                        )
                    edges.append(GraphEdge(
                        source=company['company_id'],
                        target=node_id,
                        type='MAKES_CLAIM'
                    ))

                # Add news nodes
                if record['news']:
                    news = record['news']
                    node_id = news['article_id']
                    if node_id not in nodes:
                        nodes[node_id] = GraphNode(
                            id=node_id,
                            label=news.get('title', ''),
                            type='news',
                            properties=dict(news)
                        )
                    edges.append(GraphEdge(
                        source=node_id,
                        target=company['company_id'],
                        type='MENTIONS'
                    ))

                # Add publication nodes
                if record['pub']:
                    pub = record['pub']
                    node_id = pub['publication_id']
                    if node_id not in nodes:
                        nodes[node_id] = GraphNode(
                            id=node_id,
                            label=pub.get('title', ''),
                            type='publication',
                            properties=dict(pub)
                        )
                    edges.append(GraphEdge(
                        source=node_id,
                        target=company['company_id'],
                        type='MENTIONS'
                    ))

            return GraphData(
                nodes=list(nodes.values()),
                edges=edges
            )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/relationships")
async def get_relationship_stats():
    """Get statistics about knowledge graph relationships"""
    driver = get_neo4j()
    if not driver:
        raise HTTPException(status_code=503, detail="Neo4j unavailable")

    try:
        with driver.session() as session:
            # Count nodes
            node_counts = session.run("""
                MATCH (n)
                RETURN labels(n)[0] as label, count(n) as count
            """)

            nodes_stats = {}
            for record in node_counts:
                nodes_stats[record['label']] = record['count']

            # Count relationships
            rel_counts = session.run("""
                MATCH ()-[r]->()
                RETURN type(r) as type, count(r) as count
            """)

            rel_stats = {}
            for record in rel_counts:
                rel_stats[record['type']] = record['count']

            return {
                "nodes": nodes_stats,
                "relationships": rel_stats
            }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
