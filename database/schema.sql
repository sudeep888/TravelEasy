-- database/schema.sql

-- Airlines table
CREATE TABLE airlines (
    id SERIAL PRIMARY KEY,
    iata_code VARCHAR(2) UNIQUE NOT NULL,
    icao_code VARCHAR(3) UNIQUE,
    name VARCHAR(100) NOT NULL,
    country VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    website_url VARCHAR(255),
    baggage_policy_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Baggage rules with versioning
CREATE TABLE baggage_rules (
    id SERIAL PRIMARY KEY,
    airline_id INTEGER REFERENCES airlines(id) ON DELETE CASCADE,
    cabin_class VARCHAR(50) NOT NULL, -- ECONOMY, PREMIUM_ECONOMY, BUSINESS, FIRST
    route_type VARCHAR(20) NOT NULL, -- DOMESTIC, INTERNATIONAL
    passenger_type VARCHAR(20) DEFAULT 'ADULT', -- ADULT, CHILD, INFANT
    cabin_baggage_count INTEGER DEFAULT 1,
    cabin_baggage_weight DECIMAL(5,2), -- in kg
    cabin_baggage_dimensions VARCHAR(50), -- "55x40x20"
    checked_baggage_count INTEGER DEFAULT 1,
    checked_baggage_weight DECIMAL(5,2), -- in kg
    checked_baggage_size VARCHAR(50),
    excess_fee_per_kg DECIMAL(10,2),
    excess_fee_flat DECIMAL(10,2),
    currency VARCHAR(3) DEFAULT 'INR',
    effective_from DATE NOT NULL,
    effective_to DATE,
    is_active BOOLEAN DEFAULT true,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster lookups
CREATE INDEX idx_baggage_rules_lookup ON baggage_rules 
(airline_id, cabin_class, route_type, passenger_type, effective_from, is_active);

-- Passenger rights rules
CREATE TABLE passenger_rights (
    id SERIAL PRIMARY KEY,
    country_code VARCHAR(2) NOT NULL, -- 'IN', 'US', 'EU', etc.
    issue_type VARCHAR(50) NOT NULL, -- DELAY, CANCELLATION, DENIED_BOARDING, BAGGAGE_LOSS, BAGGAGE_DELAY
    delay_hours_from INTEGER,
    delay_hours_to INTEGER,
    compensation_amount DECIMAL(10,2),
    compensation_currency VARCHAR(3) DEFAULT 'INR',
    refund_percentage INTEGER,
    provisions TEXT, -- JSON field for specific provisions
    legal_reference VARCHAR(255),
    airline_specific_rules JSONB, -- For airline-specific variations
    effective_from DATE NOT NULL,
    effective_to DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User complaints/sessions
CREATE TABLE complaint_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_token VARCHAR(100) UNIQUE,
    flight_number VARCHAR(10),
    airline_id INTEGER REFERENCES airlines(id),
    pnr VARCHAR(10),
    passenger_name VARCHAR(255),
    passenger_email VARCHAR(255),
    issue_type VARCHAR(50),
    flight_date DATE,
    route_from VARCHAR(3),
    route_to VARCHAR(3),
    description TEXT,
    compensation_asked DECIMAL(10,2),
    status VARCHAR(20) DEFAULT 'DRAFT',
    pdf_generated BOOLEAN DEFAULT false,
    pdf_path VARCHAR(255),
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Audit log for rule changes
CREATE TABLE rule_audit_log (
    id SERIAL PRIMARY KEY,
    table_name VARCHAR(50) NOT NULL,
    record_id INTEGER NOT NULL,
    action VARCHAR(10) NOT NULL, -- INSERT, UPDATE, DELETE
    old_values JSONB,
    new_values JSONB,
    changed_by VARCHAR(100),
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create function for updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for all tables
CREATE TRIGGER update_airlines_updated_at BEFORE UPDATE ON airlines
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_baggage_rules_updated_at BEFORE UPDATE ON baggage_rules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_passenger_rights_updated_at BEFORE UPDATE ON passenger_rights
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_complaint_sessions_updated_at BEFORE UPDATE ON complaint_sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();