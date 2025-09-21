# Database Design Documentation
## Crowdsourced Civic Issue Reporting System MVP

### Overview
This document outlines the database design for the MVP version of the Crowdsourced Civic Issue Reporting and Resolution System. The database is designed using PostgreSQL with PostGIS extension for geospatial capabilities.

### Database Architecture

#### Core Design Principles
1. **Scalability**: UUID primary keys for horizontal scaling
2. **Performance**: Strategic indexing for geospatial and text searches
3. **Data Integrity**: Foreign key constraints with appropriate cascade rules
4. **Flexibility**: JSONB fields for AI classification and dynamic criteria
5. **Audit Trail**: Timestamp tracking for all major entities

#### Technology Stack
- **Database**: PostgreSQL 15+
- **Extensions**: PostGIS for geospatial data
- **Character Set**: UTF-8 for multi-language support
- **Timezone**: All timestamps with timezone support

### Entity Descriptions

#### 1. Users Table
**Purpose**: Central entity for all system users (citizens, field engineers, admins)

**Key Features**:
- Multi-role support through `user_type` enum
- Geospatial location tracking for proximity-based features
- Gamification system with points and badge levels
- Profile verification system
- Multi-language support

**Relationships**:
- One-to-many with complaints (as creator)
- One-to-many with complaints (as assigned engineer)
- One-to-many with user_votes
- One-to-many with notifications
- Many-to-many with badges (through user_badges)
- Self-referencing through referrals

#### 2. Complaints Table
**Purpose**: Core entity representing civic issues reported by citizens

**Key Features**:
- Comprehensive categorization system
- Severity and status tracking
- Geospatial location (required for mapping)
- AI classification results in JSONB format
- Media attachments (images, audio)
- Voting system for community validation
- Cost tracking for resolution

**Status Flow**:
```
submitted → acknowledged → in_progress → resolved/rejected
```

**Relationships**:
- Many-to-one with users (creator)
- Many-to-one with users (assigned engineer)
- Many-to-one with departments
- One-to-many with user_votes
- One-to-many with notifications
- One-to-many with complaint_analytics

#### 3. Departments Table
**Purpose**: Government departments responsible for handling different types of complaints

**Key Features**:
- Department hierarchy with head assignments
- Contact information for citizen communication
- Active/inactive status for management

#### 4. User_Votes Table
**Purpose**: Junction table for complaint voting system

**Key Features**:
- Prevents duplicate voting (unique constraint)
- Supports upvote/downvote system
- Enables community-driven prioritization

#### 5. Notifications Table
**Purpose**: Multi-channel notification system

**Key Features**:
- Multiple notification types
- Channel specification (email, SMS, push)
- Read/unread tracking
- Complaint-specific and general notifications

#### 6. Badges & User_Badges Tables
**Purpose**: Gamification system to encourage user engagement

**Key Features**:
- Dynamic criteria system using JSONB
- Points reward system
- Achievement tracking
- Prevents duplicate badge awards

#### 7. Referrals Table
**Purpose**: User referral system for organic growth

**Key Features**:
- Tracks referrer-referred relationships
- Status management for completion tracking
- Points award system

#### 8. Complaint_Analytics Table
**Purpose**: Metrics and analytics tracking

**Key Features**:
- Flexible metric storage
- Time-series data for trends
- Performance monitoring

### Indexing Strategy

#### Performance Indexes
```sql
-- Geospatial indexes (GIST)
idx_complaints_location
idx_users_location

-- Standard B-tree indexes
idx_complaints_status
idx_complaints_category
idx_complaints_created_at
idx_users_user_type
idx_notifications_unread

-- Full-text search (GIN)
idx_complaints_search
```

#### Query Optimization
1. **Geospatial Queries**: GIST indexes for efficient location-based searches
2. **Text Search**: GIN indexes for full-text search across complaints
3. **Status Filtering**: B-tree indexes for fast status-based queries
4. **User Lookups**: Optimized for email and user type queries

### Data Types and Constraints

#### Geospatial Data
- **Type**: GEOMETRY(POINT, 4326)
- **SRID**: 4326 (WGS84 coordinate system)
- **Usage**: GPS coordinates for users and complaints

#### JSONB Fields
1. **ai_classification**: AI analysis results
   ```json
   {
     "category": "Road Infrastructure",
     "severity": "high",
     "confidence": 0.95,
     "suggested_department": "Roads & Infrastructure"
   }
   ```

2. **channels**: Notification channels
   ```json
   ["email", "sms", "push"]
   ```

3. **criteria**: Badge earning criteria
   ```json
   {
     "complaints_count": 5,
     "minimum_upvotes": 10
   }
   ```

### Security Considerations

#### Data Protection
1. **Password Security**: Hashed using bcrypt (not stored in plain text)
2. **PII Protection**: Email and phone number encryption capability
3. **Audit Trail**: All critical operations logged with timestamps
4. **Access Control**: Role-based permissions through user_type

#### Compliance
1. **Data Retention**: Automatic cleanup policies for old data
2. **GDPR/Data Protection**: User data deletion capabilities
3. **Government Standards**: Audit-ready logging system

### Scalability Features

#### Horizontal Scaling
1. **UUID Primary Keys**: No sequential dependency
2. **Partitioning Ready**: Date-based partitioning for large tables
3. **Read Replicas**: Optimized for read-heavy workloads
4. **Sharding Capability**: Location-based sharding possible

#### Performance Optimization
1. **Connection Pooling**: Database connection management
2. **Query Optimization**: Explain plan analysis for critical queries
3. **Caching Strategy**: Redis integration for frequently accessed data
4. **Archival Strategy**: Old complaint data archival system

### Migration Strategy

#### Development to Production
1. **Schema Versioning**: Flyway/Liquibase for version control
2. **Data Migration**: Safe migration scripts with rollback
3. **Testing**: Comprehensive testing in staging environment
4. **Deployment**: Zero-downtime deployment strategies

#### Sample Migration Script
```sql
-- Migration: V1.0.0__Initial_Schema.sql
-- This file contains the complete initial schema
-- Future migrations will be incremental (V1.0.1, V1.0.2, etc.)
```

### Monitoring and Maintenance

#### Performance Monitoring
1. **Query Performance**: pg_stat_statements for slow query analysis
2. **Index Usage**: pg_stat_user_indexes for index effectiveness
3. **Connection Monitoring**: Connection pool health checks
4. **Storage Monitoring**: Disk space and growth tracking

#### Backup Strategy
1. **Daily Backups**: Automated daily pg_dump backups
2. **Point-in-Time Recovery**: WAL archiving for PITR
3. **Geographic Distribution**: Backup replication to multiple regions
4. **Testing**: Regular backup restoration testing

### API Integration Points

#### Primary Query Patterns
1. **Nearby Complaints**: Geospatial queries within radius
2. **User Dashboard**: User-specific complaint listing
3. **Department Workload**: Department-specific complaint querying
4. **Analytics Queries**: Aggregated data for dashboards

#### Sample Queries
```sql
-- Find complaints within 1km radius
SELECT * FROM complaints 
WHERE ST_DWithin(location, ST_GeomFromText('POINT(77.2090 28.6139)', 4326), 1000);

-- User's complaint history with vote counts
SELECT c.*, c.upvotes + c.downvotes as total_votes
FROM complaints c 
WHERE c.user_id = $1 
ORDER BY c.created_at DESC;

-- Department workload analysis
SELECT d.name, COUNT(c.id) as pending_complaints
FROM departments d
LEFT JOIN complaints c ON d.id = c.department_id AND c.status IN ('submitted', 'acknowledged')
GROUP BY d.id, d.name;
```

### Future Enhancements

#### Planned Features
1. **Comment System**: Complaint discussion threads
2. **File Versioning**: Media file version tracking
3. **Workflow Engine**: Complex approval workflows
4. **Integration APIs**: Third-party service integrations
5. **Machine Learning**: Predictive analytics for complaint resolution

#### Schema Extensions
1. **Comments Table**: User discussions on complaints
2. **Workflow_States**: Custom workflow management
3. **Integration_Logs**: External API interaction tracking
4. **ML_Models**: Machine learning model metadata