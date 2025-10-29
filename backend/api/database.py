"""
Database connection utilities
"""

import os
from elasticsearch import Elasticsearch
from neo4j import GraphDatabase
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()


def get_elasticsearch():
    """Get Elasticsearch client"""
    try:
        es_host = os.getenv('ELASTICSEARCH_HOST', 'localhost')
        es_port = int(os.getenv('ELASTICSEARCH_PORT', 9200))
        return Elasticsearch([f'http://{es_host}:{es_port}'])
    except Exception as e:
        print(f"Failed to connect to Elasticsearch: {e}")
        return None


def get_neo4j():
    """Get Neo4j driver"""
    try:
        uri = os.getenv('NEO4J_URI', 'bolt://localhost:7687')
        user = os.getenv('NEO4J_USER', 'neo4j')
        password = os.getenv('NEO4J_PASSWORD', 'changeme')
        return GraphDatabase.driver(uri, auth=(user, password))
    except Exception as e:
        print(f"Failed to connect to Neo4j: {e}")
        return None


def get_mongodb():
    """Get MongoDB client"""
    try:
        mongo_uri = os.getenv('MONGODB_URI', 'mongodb://localhost:27017')
        return MongoClient(mongo_uri)
    except Exception as e:
        print(f"Failed to connect to MongoDB: {e}")
        return None
