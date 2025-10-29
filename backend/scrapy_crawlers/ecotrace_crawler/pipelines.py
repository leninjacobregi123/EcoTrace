"""
EcoTrace Data Processing Pipelines
Handles validation, NLP extraction, and storage to multiple databases
"""

import os
import re
import json
from datetime import datetime
from itemadapter import ItemAdapter
from elasticsearch import Elasticsearch
from neo4j import GraphDatabase
from pymongo import MongoClient
import logging

logger = logging.getLogger(__name__)

# Optional NLP imports - only load if available
try:
    import spacy
    SPACY_AVAILABLE = True
except ImportError:
    SPACY_AVAILABLE = False
    logger.warning("spacy not available - NLP features will be limited")


class DataValidationPipeline:
    """Validates and cleans scraped data"""

    def process_item(self, item, spider):
        adapter = ItemAdapter(item)

        # Define numeric fields with default values
        numeric_fields = {
            'confidence_score': 0.5,
            'credibility_score': 0.5,
            'relevance_score': 0.5
        }

        # Remove None values and set defaults for numeric fields
        for field in adapter.field_names():
            value = adapter.get(field)

            # Handle numeric fields
            if field in numeric_fields:
                if value is None or value == '' or value == 'None':
                    adapter[field] = numeric_fields[field]
                else:
                    try:
                        adapter[field] = float(value)
                    except (ValueError, TypeError):
                        adapter[field] = numeric_fields[field]
            # Handle text fields
            elif value is None:
                adapter[field] = ''

        # Clean text fields
        text_fields = ['claim_text', 'content', 'abstract', 'raw_context']
        for field in text_fields:
            if field in adapter.field_names() and adapter.get(field):
                # Remove extra whitespace
                cleaned = re.sub(r'\s+', ' ', str(adapter[field]))
                adapter[field] = cleaned.strip()

        return item


class NLPExtractionPipeline:
    """Extracts entities, numbers, and semantic information using NLP"""

    def __init__(self):
        self.nlp = None

    def open_spider(self, spider):
        """Load spaCy model"""
        try:
            self.nlp = spacy.load('en_core_web_sm')
            logger.info("SpaCy model loaded successfully")
        except Exception as e:
            logger.error(f"Failed to load spaCy model: {e}")
            self.nlp = None

    def process_item(self, item, spider):
        if not self.nlp:
            return item

        adapter = ItemAdapter(item)

        # Process claim text
        if 'claim_text' in adapter.field_names() and adapter.get('claim_text'):
            claim_text = adapter['claim_text']
            doc = self.nlp(claim_text)

            # Extract numbers and units
            numbers = []
            for token in doc:
                if token.like_num:
                    numbers.append(token.text)

            # Extract years (4-digit numbers starting with 20)
            years = [num for num in numbers if len(num) == 4 and num.startswith('20')]
            if years and 'target_year' not in adapter.keys():
                adapter['target_year'] = years[0]

            # Extract percentage values
            percentages = re.findall(r'(\d+(?:\.\d+)?)%', claim_text)
            if percentages and 'numerical_value' not in adapter.keys():
                adapter['numerical_value'] = percentages[0]
                adapter['unit'] = 'percent'

            # Classify claim type based on keywords
            claim_lower = claim_text.lower()
            if any(word in claim_lower for word in ['emission', 'carbon', 'co2', 'ghg']):
                adapter['claim_type'] = 'emissions'
            elif any(word in claim_lower for word in ['renewable', 'solar', 'wind', 'clean energy']):
                adapter['claim_type'] = 'renewable_energy'
            elif any(word in claim_lower for word in ['waste', 'recycl', 'circular']):
                adapter['claim_type'] = 'waste'
            elif any(word in claim_lower for word in ['water', 'h2o']):
                adapter['claim_type'] = 'water'

            # Classify claim category
            if any(word in claim_lower for word in ['target', 'goal', 'aim', 'by 20']):
                adapter['claim_category'] = 'target'
            elif any(word in claim_lower for word in ['achiev', 'reach', 'accomplish']):
                adapter['claim_category'] = 'achievement'
            elif any(word in claim_lower for word in ['initiat', 'program', 'project']):
                adapter['claim_category'] = 'initiative'

        # Process article content for sentiment
        if 'content' in adapter.field_names() and adapter.get('content'):
            content = adapter['content']
            # Sentiment is already processed in spider, but we could enhance it here
            pass

        return item


class ElasticsearchPipeline:
    """Stores items in Elasticsearch for full-text search"""

    def __init__(self):
        self.es = None
        self.index_prefix = 'ecotrace'

    def open_spider(self, spider):
        """Connect to Elasticsearch"""
        try:
            es_host = os.getenv('ELASTICSEARCH_HOST', 'localhost')
            es_port = int(os.getenv('ELASTICSEARCH_PORT', 9200))

            self.es = Elasticsearch([f'http://{es_host}:{es_port}'])

            # Create indices if they don't exist
            indices = [
                'companies', 'claims', 'regulatory',
                'publications', 'news'
            ]

            for index_name in indices:
                full_index = f'{self.index_prefix}_{index_name}'
                if not self.es.indices.exists(index=full_index):
                    self.es.indices.create(index=full_index)
                    logger.info(f"Created Elasticsearch index: {full_index}")

            logger.info("Connected to Elasticsearch")
        except Exception as e:
            logger.error(f"Failed to connect to Elasticsearch: {e}")
            self.es = None

    def close_spider(self, spider):
        """Close Elasticsearch connection"""
        if self.es:
            self.es.close()

    def process_item(self, item, spider):
        if not self.es:
            return item

        adapter = ItemAdapter(item)
        item_dict = dict(adapter)

        try:
            # Determine index based on item type
            item_class = item.__class__.__name__

            if 'CompanyItem' in item_class:
                index = f'{self.index_prefix}_companies'
                doc_id = item_dict.get('company_id')
            elif 'SustainabilityClaimItem' in item_class:
                index = f'{self.index_prefix}_claims'
                doc_id = item_dict.get('claim_id')
            elif 'RegulatoryDataItem' in item_class:
                index = f'{self.index_prefix}_regulatory'
                doc_id = item_dict.get('record_id')
            elif 'ScientificPublicationItem' in item_class:
                index = f'{self.index_prefix}_publications'
                doc_id = item_dict.get('publication_id')
            elif 'NewsArticleItem' in item_class:
                index = f'{self.index_prefix}_news'
                doc_id = item_dict.get('article_id')
            else:
                logger.warning(f"Unknown item type: {item_class}")
                return item

            # Index document
            self.es.index(index=index, id=doc_id, document=item_dict)
            logger.debug(f"Indexed {item_class} to {index}")

        except Exception as e:
            logger.error(f"Error indexing to Elasticsearch: {e}")

        return item


class Neo4jPipeline:
    """Stores items in Neo4j knowledge graph"""

    def __init__(self):
        self.driver = None

    def open_spider(self, spider):
        """Connect to Neo4j"""
        try:
            uri = os.getenv('NEO4J_URI', 'bolt://localhost:7687')
            user = os.getenv('NEO4J_USER', 'neo4j')
            password = os.getenv('NEO4J_PASSWORD', 'changeme')

            self.driver = GraphDatabase.driver(uri, auth=(user, password))
            logger.info("Connected to Neo4j")

            # Create constraints
            with self.driver.session() as session:
                session.run("CREATE CONSTRAINT IF NOT EXISTS FOR (c:Company) REQUIRE c.company_id IS UNIQUE")
                session.run("CREATE CONSTRAINT IF NOT EXISTS FOR (cl:Claim) REQUIRE cl.claim_id IS UNIQUE")
                session.run("CREATE CONSTRAINT IF NOT EXISTS FOR (p:Publication) REQUIRE p.publication_id IS UNIQUE")

        except Exception as e:
            logger.error(f"Failed to connect to Neo4j: {e}")
            self.driver = None

    def close_spider(self, spider):
        """Close Neo4j connection"""
        if self.driver:
            self.driver.close()

    def process_item(self, item, spider):
        if not self.driver:
            return item

        adapter = ItemAdapter(item)
        item_class = item.__class__.__name__

        try:
            with self.driver.session() as session:
                if 'CompanyItem' in item_class:
                    self.create_company_node(session, adapter)
                elif 'SustainabilityClaimItem' in item_class:
                    self.create_claim_node(session, adapter)
                elif 'ScientificPublicationItem' in item_class:
                    self.create_publication_node(session, adapter)
                elif 'NewsArticleItem' in item_class:
                    self.create_news_node(session, adapter)

        except Exception as e:
            logger.error(f"Error writing to Neo4j: {e}")

        return item

    def create_company_node(self, session, adapter):
        """Create or update company node"""
        query = """
        MERGE (c:Company {company_id: $company_id})
        SET c.name = $name,
            c.website = $website,
            c.industry = $industry,
            c.updated_at = $crawled_at
        """
        session.run(query, dict(adapter))

    def create_claim_node(self, session, adapter):
        """Create claim node and relationship to company"""
        query = """
        MERGE (c:Company {company_id: $company_id})
        CREATE (cl:Claim {
            claim_id: $claim_id,
            claim_text: $claim_text,
            claim_type: $claim_type,
            source_type: $source_type,
            source_url: $source_url,
            extracted_at: $extracted_at
        })
        CREATE (c)-[:MAKES_CLAIM]->(cl)
        """
        session.run(query, dict(adapter))

    def create_publication_node(self, session, adapter):
        """Create publication node and link to mentioned companies"""
        companies = adapter.get('related_companies', [])

        query = """
        MERGE (p:Publication {publication_id: $publication_id})
        SET p.title = $title,
            p.journal = $journal,
            p.url = $url,
            p.published_date = $publication_date
        """
        session.run(query, dict(adapter))

        # Link to companies
        for company_name in companies:
            link_query = """
            MATCH (p:Publication {publication_id: $publication_id})
            MERGE (c:Company {name: $company_name})
            CREATE (p)-[:MENTIONS]->(c)
            """
            session.run(link_query, {'publication_id': adapter.get('publication_id'), 'company_name': company_name})

    def create_news_node(self, session, adapter):
        """Create news node and link to mentioned companies"""
        companies = adapter.get('company_mentions', [])

        query = """
        CREATE (n:NewsArticle {
            article_id: $article_id,
            title: $title,
            source: $source,
            url: $url,
            published_date: $published_date,
            sentiment: $sentiment
        })
        """
        session.run(query, dict(adapter))

        # Link to companies
        for company_name in companies:
            link_query = """
            MATCH (n:NewsArticle {article_id: $article_id})
            MERGE (c:Company {name: $company_name})
            CREATE (n)-[:MENTIONS]->(c)
            """
            session.run(link_query, {'article_id': adapter.get('article_id'), 'company_name': company_name})


class MongoDBPipeline:
    """Stores raw data in MongoDB for backup and analysis"""

    def __init__(self):
        self.client = None
        self.db = None

    def open_spider(self, spider):
        """Connect to MongoDB"""
        try:
            mongo_uri = os.getenv('MONGODB_URI', 'mongodb://localhost:27017')
            self.client = MongoClient(mongo_uri)
            self.db = self.client[os.getenv('MONGODB_DB', 'ecotrace')]
            logger.info("Connected to MongoDB")
        except Exception as e:
            logger.error(f"Failed to connect to MongoDB: {e}")
            self.client = None

    def close_spider(self, spider):
        """Close MongoDB connection"""
        if self.client:
            self.client.close()

    def process_item(self, item, spider):
        if self.db is None:
            return item

        adapter = ItemAdapter(item)
        item_dict = dict(adapter)
        item_class = item.__class__.__name__

        try:
            # Determine collection based on item type
            if 'CompanyItem' in item_class:
                collection = self.db['companies']
            elif 'SustainabilityClaimItem' in item_class:
                collection = self.db['claims']
            elif 'RegulatoryDataItem' in item_class:
                collection = self.db['regulatory']
            elif 'ScientificPublicationItem' in item_class:
                collection = self.db['publications']
            elif 'NewsArticleItem' in item_class:
                collection = self.db['news']
            else:
                logger.warning(f"Unknown item type: {item_class}")
                return item

            # Insert or update
            id_field = next((f for f in ['company_id', 'claim_id', 'record_id',
                                          'publication_id', 'article_id']
                            if f in item_dict), None)

            if id_field:
                collection.update_one(
                    {id_field: item_dict[id_field]},
                    {'$set': item_dict},
                    upsert=True
                )
            else:
                collection.insert_one(item_dict)

        except Exception as e:
            logger.error(f"Error writing to MongoDB: {e}")

        return item
