-- NIYAMVEDA (नियमवेद) Database Initialization
-- Smart India Hackathon Problem Statement SIH26107

-- 1. Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Source Registry table
CREATE TABLE IF NOT EXISTS source_registry (
    source_id VARCHAR(64) PRIMARY KEY,
    authority VARCHAR(255) NOT NULL,
    document_name VARCHAR(255) NOT NULL,
    document_type VARCHAR(100) NOT NULL,
    official_url TEXT,
    applicable_domain VARCHAR(255),
    version VARCHAR(50),
    effective_date VARCHAR(50),
    verification_status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Evidence Chunks table with explicit 768-dim pgvector
CREATE TABLE IF NOT EXISTS evidence_chunks (
    id VARCHAR(64) PRIMARY KEY,
    source_id VARCHAR(64) REFERENCES source_registry(source_id),
    title VARCHAR(255) NOT NULL,
    authority VARCHAR(255) NOT NULL,
    document_type VARCHAR(100) NOT NULL,
    clause_number VARCHAR(100) NOT NULL,
    chunk_text TEXT NOT NULL,
    publication_date VARCHAR(50),
    effective_date VARCHAR(50),
    version VARCHAR(50),
    verification_status VARCHAR(50) NOT NULL,
    source_url TEXT,
    embedding vector(768),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Products table
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(64) PRIMARY KEY,
    project_name VARCHAR(255) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    category VARCHAR(255) NOT NULL,
    intended_use TEXT,
    material_composition TEXT,
    technical_characteristics TEXT,
    operating_voltage VARCHAR(100),
    power_consumption VARCHAR(100),
    water_storage_capacity VARCHAR(100),
    has_uv_module BOOLEAN DEFAULT FALSE,
    manufacturing_origin VARCHAR(100) DEFAULT 'India',
    target_market VARCHAR(100) DEFAULT 'Domestic',
    status VARCHAR(50) DEFAULT 'DRAFT',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Analysis Results table
CREATE TABLE IF NOT EXISTS analysis_results (
    id VARCHAR(64) PRIMARY KEY,
    product_id VARCHAR(64) REFERENCES products(id),
    evidence_confidence VARCHAR(50) NOT NULL,
    safe_abstention_activated BOOLEAN DEFAULT FALSE,
    abstention_reason TEXT,
    summary TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
