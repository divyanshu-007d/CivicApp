-- Database Schema for Civic Issue Reporting System MVP
-- PostgreSQL with PostGIS extension

-- Enable PostGIS extension for geospatial data
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create custom ENUM types
CREATE TYPE user_type_enum AS ENUM ('citizen', 'field_engineer', 'admin', 'super_admin');
CREATE TYPE complaint_severity_enum AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE complaint_status_enum AS ENUM ('submitted', 'acknowledged', 'in_progress', 'resolved', 'rejected');
CREATE TYPE vote_type_enum AS ENUM ('upvote', 'downvote');
CREATE TYPE notification_type_enum AS ENUM ('complaint_update', 'system', 'achievement', 'reminder');
CREATE TYPE referral_status_enum AS ENUM ('pending', 'completed');

-- Users table - Core entity for all user types
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    user_type user_type_enum NOT NULL DEFAULT 'citizen',
    profile_picture_url TEXT,
    preferred_language VARCHAR(10) DEFAULT 'en',
    location GEOMETRY(POINT, 4326), -- PostGIS geometry for GPS coordinates
    gamification_points INTEGER DEFAULT 0,
    badge_level VARCHAR(50) DEFAULT 'citizen',
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE
);

-- Departments table - Government departments handling complaints
CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    head_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Complaints table - Core entity for civic issues
CREATE TABLE complaints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    sub_category VARCHAR(100),
    severity complaint_severity_enum DEFAULT 'medium',
    status complaint_status_enum DEFAULT 'submitted',
    priority_score INTEGER DEFAULT 0,
    location GEOMETRY(POINT, 4326) NOT NULL, -- Required for geospatial queries
    address TEXT,
    landmark VARCHAR(255),
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    assigned_engineer_id UUID REFERENCES users(id) ON DELETE SET NULL,
    image_urls TEXT[], -- Array of image URLs from cloud storage
    audio_url TEXT,
    ai_classification JSONB, -- AI analysis results in JSON format
    upvotes INTEGER DEFAULT 0,
    downvotes INTEGER DEFAULT 0,
    resolution_notes TEXT,
    resolution_images TEXT[],
    estimated_cost DECIMAL(10,2),
    actual_cost DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    acknowledged_at TIMESTAMP WITH TIME ZONE,
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- User Votes table - Junction table for user voting on complaints
CREATE TABLE user_votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    complaint_id UUID NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
    vote_type vote_type_enum NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, complaint_id) -- Ensure one vote per user per complaint
);

-- Notifications table - Multi-channel notification system
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    complaint_id UUID REFERENCES complaints(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type notification_type_enum NOT NULL,
    channels JSONB, -- JSON array of channels: ["email", "sms", "push"]
    is_read BOOLEAN DEFAULT FALSE,
    sent_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Badges table - Gamification badges
CREATE TABLE badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    icon_url TEXT,
    criteria JSONB, -- JSON criteria for earning the badge
    points_reward INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Badges table - Junction table for user-earned badges
CREATE TABLE user_badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    badge_id UUID NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, badge_id) -- Ensure each badge is earned only once per user
);

-- Referrals table - User referral system
CREATE TABLE referrals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    referrer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    referred_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status referral_status_enum DEFAULT 'pending',
    points_awarded INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Complaint Analytics table - Tracking and metrics
CREATE TABLE complaint_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    complaint_id UUID NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
    metric_name VARCHAR(100) NOT NULL,
    metric_value DECIMAL(10,2),
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE OPTIMIZATION
-- ============================================================================

-- Geospatial indexes for location-based queries
CREATE INDEX idx_complaints_location ON complaints USING GIST(location);
CREATE INDEX idx_users_location ON users USING GIST(location);

-- Performance indexes for frequent queries
CREATE INDEX idx_complaints_status ON complaints(status);
CREATE INDEX idx_complaints_category ON complaints(category);
CREATE INDEX idx_complaints_created_at ON complaints(created_at DESC);
CREATE INDEX idx_complaints_user_id ON complaints(user_id);
CREATE INDEX idx_complaints_department_id ON complaints(department_id);
CREATE INDEX idx_complaints_assigned_engineer ON complaints(assigned_engineer_id);

-- User-related indexes
CREATE INDEX idx_users_user_type ON users(user_type);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at DESC);

-- Voting and notification indexes
CREATE INDEX idx_user_votes_complaint ON user_votes(complaint_id);
CREATE INDEX idx_user_votes_user ON user_votes(user_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = FALSE;

-- Gamification indexes
CREATE INDEX idx_user_badges_user ON user_badges(user_id);
CREATE INDEX idx_user_badges_badge ON user_badges(badge_id);

-- Full-text search index for complaints
CREATE INDEX idx_complaints_search ON complaints USING GIN(to_tsvector('english', title || ' ' || COALESCE(description, '')));

-- ============================================================================
-- TRIGGERS FOR AUTOMATIC UPDATES
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for complaints table
CREATE TRIGGER update_complaints_updated_at 
    BEFORE UPDATE ON complaints 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger for users table
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- SAMPLE DATA FOR MVP TESTING
-- ============================================================================

-- Insert sample departments
INSERT INTO departments (name, description, contact_email, contact_phone) VALUES
('Roads & Infrastructure', 'Handles road repairs, potholes, and infrastructure issues', 'roads@gov.in', '+91-9876543210'),
('Water & Sanitation', 'Manages water supply and sewage issues', 'water@gov.in', '+91-9876543211'),
('Electricity', 'Electrical infrastructure and power supply issues', 'power@gov.in', '+91-9876543212'),
('Waste Management', 'Garbage collection and waste disposal', 'waste@gov.in', '+91-9876543213'),
('Traffic Police', 'Traffic violations and road safety', 'traffic@gov.in', '+91-9876543214');

-- Insert sample badges for gamification
INSERT INTO badges (name, description, icon_url, criteria, points_reward) VALUES
('First Reporter', 'First complaint submitted', '/badges/first-reporter.png', '{"complaints_count": 1}', 10),
('Community Helper', 'Submitted 5 complaints', '/badges/community-helper.png', '{"complaints_count": 5}', 50),
('Civic Champion', 'Submitted 20 complaints', '/badges/civic-champion.png', '{"complaints_count": 20}', 200),
('Vote Master', 'Voted on 10 complaints', '/badges/vote-master.png', '{"votes_count": 10}', 25),
('Problem Solver', 'Had 3 complaints resolved', '/badges/problem-solver.png', '{"resolved_complaints": 3}', 75);

-- Note: Sample users and complaints should be added through the application
-- to ensure proper password hashing and validation