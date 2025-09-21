# Entity Relationship Diagram
## Crowdsourced Civic Issue Reporting System

### Database ER Diagram

```mermaid
erDiagram
    users {
        uuid id PK
        varchar email UK
        varchar phone
        varchar password_hash
        varchar full_name
        enum user_type
        text profile_picture_url
        varchar preferred_language
        geometry location
        integer gamification_points
        varchar badge_level
        boolean is_verified
        timestamp created_at
        timestamp updated_at
        timestamp last_login
    }
    
    complaints {
        uuid id PK
        uuid user_id FK
        varchar title
        text description
        varchar category
        varchar sub_category
        enum severity
        enum status
        integer priority_score
        geometry location
        text address
        varchar landmark
        uuid department_id FK
        uuid assigned_engineer_id FK
        text_array image_urls
        text audio_url
        jsonb ai_classification
        integer upvotes
        integer downvotes
        text resolution_notes
        text_array resolution_images
        decimal estimated_cost
        decimal actual_cost
        timestamp created_at
        timestamp updated_at
        timestamp acknowledged_at
        timestamp resolved_at
    }
    
    departments {
        uuid id PK
        varchar name
        text description
        varchar contact_email
        varchar contact_phone
        uuid head_user_id FK
        boolean is_active
        timestamp created_at
    }
    
    user_votes {
        uuid id PK
        uuid user_id FK
        uuid complaint_id FK
        enum vote_type
        timestamp created_at
    }
    
    notifications {
        uuid id PK
        uuid user_id FK
        uuid complaint_id FK
        varchar title
        text message
        enum type
        jsonb channels
        boolean is_read
        timestamp sent_at
        timestamp created_at
    }
    
    badges {
        uuid id PK
        varchar name
        text description
        text icon_url
        jsonb criteria
        integer points_reward
        boolean is_active
    }
    
    user_badges {
        uuid id PK
        uuid user_id FK
        uuid badge_id FK
        timestamp earned_at
    }
    
    referrals {
        uuid id PK
        uuid referrer_id FK
        uuid referred_id FK
        enum status
        integer points_awarded
        timestamp created_at
        timestamp completed_at
    }
    
    complaint_analytics {
        uuid id PK
        uuid complaint_id FK
        varchar metric_name
        decimal metric_value
        timestamp recorded_at
    }

    %% Relationships
    users ||--o{ complaints : "creates"
    users ||--o{ user_votes : "votes"
    users ||--o{ notifications : "receives"
    users ||--o{ user_badges : "earns"
    users ||--o{ referrals : "refers_as_referrer"
    users ||--o{ referrals : "refers_as_referred"
    users ||--o{ departments : "heads"
    users ||--o{ complaints : "assigned_as_engineer"
    
    complaints ||--o{ user_votes : "receives_votes"
    complaints ||--o{ notifications : "triggers"
    complaints ||--o{ complaint_analytics : "tracked_by"
    
    departments ||--o{ complaints : "manages"
    
    badges ||--o{ user_badges : "awarded_as"
```

### Relationship Details

#### One-to-Many Relationships:
1. **users → complaints**: A user can create multiple complaints
2. **users → user_votes**: A user can vote on multiple complaints
3. **users → notifications**: A user can receive multiple notifications
4. **users → user_badges**: A user can earn multiple badges
5. **departments → complaints**: A department can handle multiple complaints
6. **complaints → user_votes**: A complaint can receive multiple votes
7. **complaints → notifications**: A complaint can trigger multiple notifications
8. **complaints → complaint_analytics**: A complaint can have multiple analytics records
9. **badges → user_badges**: A badge can be earned by multiple users

#### Special Relationships:
1. **users → departments**: A user can head a department (head_user_id)
2. **users → complaints**: A user can be assigned as field engineer (assigned_engineer_id)
3. **users → referrals**: Self-referencing relationship for referrer and referred users

#### Many-to-Many Relationships (through junction tables):
1. **users ↔ badges**: Through user_badges table
2. **users ↔ complaints**: Through user_votes table (voting relationship)

### Key Constraints:
- Each user can vote only once per complaint (unique constraint on user_id, complaint_id in user_votes)
- Each user can earn each badge only once (unique constraint on user_id, badge_id in user_badges)
- Email addresses must be unique across all users
- Geospatial data uses PostGIS GEOMETRY type for location tracking