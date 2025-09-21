# Backend Folder Structure
## Civic Issue Reporting System - Express.js + Supabase

### 📁 **Project Structure Overview**

```
backend/
├── 📁 src/
│   ├── 📁 config/
│   │   ├── database.js          # Supabase client configuration
│   │   ├── environment.js       # Environment variables validation
│   │   ├── cors.js             # CORS configuration
│   │   └── constants.js        # App constants and enums
│   │
│   ├── 📁 controllers/
│   │   ├── authController.js    # Authentication endpoints
│   │   ├── complaintsController.js # Complaint CRUD operations
│   │   ├── usersController.js   # User management
│   │   ├── departmentsController.js # Department management
│   │   ├── notificationsController.js # Notification handling
│   │   ├── analyticsController.js # Analytics and reports
│   │   ├── uploadController.js  # File upload handling
│   │   └── gamificationController.js # Badges and points
│   │
│   ├── 📁 middleware/
│   │   ├── auth.js             # JWT authentication middleware
│   │   ├── validation.js       # Request validation middleware
│   │   ├── errorHandler.js     # Global error handling
│   │   ├── rateLimiter.js      # Rate limiting middleware
│   │   ├── cors.js             # CORS middleware
│   │   ├── logger.js           # Request logging middleware
│   │   └── security.js         # Security headers middleware
│   │
│   ├── 📁 routes/
│   │   ├── index.js            # Main routes aggregator
│   │   ├── auth.js             # Authentication routes
│   │   ├── complaints.js       # Complaint routes
│   │   ├── users.js            # User routes
│   │   ├── departments.js      # Department routes
│   │   ├── notifications.js    # Notification routes
│   │   ├── analytics.js        # Analytics routes
│   │   ├── upload.js           # File upload routes
│   │   └── gamification.js     # Gamification routes
│   │
│   ├── 📁 services/
│   │   ├── 📁 auth/
│   │   │   ├── authService.js   # Authentication business logic
│   │   │   ├── jwtService.js    # JWT token management
│   │   │   └── passwordService.js # Password hashing/validation
│   │   ├── 📁 complaints/
│   │   │   ├── complaintsService.js # Complaint business logic
│   │   │   ├── geospatialService.js # Location-based queries
│   │   │   └── aiClassificationService.js # AI integration
│   │   ├── 📁 notifications/
│   │   │   ├── notificationService.js # Notification logic
│   │   │   ├── emailService.js  # Email notifications
│   │   │   ├── smsService.js    # SMS notifications
│   │   │   └── pushService.js   # Push notifications
│   │   ├── 📁 upload/
│   │   │   ├── uploadService.js # File upload logic
│   │   │   ├── imageProcessor.js # Image processing
│   │   │   └── storageService.js # Supabase storage integration
│   │   ├── 📁 analytics/
│   │   │   ├── analyticsService.js # Analytics calculations
│   │   │   └── reportService.js # Report generation
│   │   └── 📁 external/
│   │       ├── aiService.js     # Google Gemini AI integration
│   │       ├── mapsService.js   # Maps API integration
│   │       └── whatsappService.js # WhatsApp bot integration
│   │
│   ├── 📁 models/
│   │   ├── User.js             # User data model and queries
│   │   ├── Complaint.js        # Complaint data model and queries
│   │   ├── Department.js       # Department data model and queries
│   │   ├── Notification.js     # Notification data model and queries
│   │   ├── Badge.js            # Badge data model and queries
│   │   ├── Vote.js             # User vote data model and queries
│   │   └── Analytics.js        # Analytics data model and queries
│   │
│   ├── 📁 utils/
│   │   ├── logger.js           # Winston logger configuration
│   │   ├── responseHelper.js   # Standardized API responses
│   │   ├── validation.js       # Validation schemas (Joi)
│   │   ├── errorCodes.js       # Error code constants
│   │   ├── helpers.js          # General utility functions
│   │   ├── constants.js        # Application constants
│   │   └── supabaseHelpers.js  # Supabase utility functions
│   │
│   ├── 📁 jobs/
│   │   ├── scheduleJobs.js     # Cron job scheduler
│   │   ├── notificationJobs.js # Notification processing jobs
│   │   ├── analyticsJobs.js    # Analytics calculation jobs
│   │   └── cleanupJobs.js      # Data cleanup jobs
│   │
│   └── app.js                  # Express app configuration
│
├── 📁 tests/
│   ├── 📁 unit/
│   │   ├── 📁 controllers/
│   │   ├── 📁 services/
│   │   ├── 📁 models/
│   │   └── 📁 utils/
│   ├── 📁 integration/
│   │   ├── 📁 auth/
│   │   ├── 📁 complaints/
│   │   └── 📁 users/
│   ├── 📁 fixtures/
│   │   ├── users.js
│   │   ├── complaints.js
│   │   └── departments.js
│   └── setup.js                # Test environment setup
│
├── 📁 docs/
│   ├── api.md                  # API documentation
│   ├── database.md             # Database schema documentation
│   ├── deployment.md           # Deployment guide
│   └── examples/               # API usage examples
│       ├── auth-examples.js
│       ├── complaint-examples.js
│       └── upload-examples.js
│
├── 📁 scripts/
│   ├── setup-database.js       # Database setup script
│   ├── seed-data.js           # Sample data seeding
│   ├── backup-database.js     # Database backup script
│   └── generate-docs.js       # API documentation generator
│
├── 📁 logs/                    # Application logs directory
├── 📁 uploads/                 # Temporary uploads directory
├── .env.example               # Environment variables template
├── .env                       # Environment variables (git ignored)
├── .gitignore                 # Git ignore file
├── package.json               # NPM dependencies and scripts
├── package-lock.json          # NPM lock file
├── server.js                  # Application entry point
├── README.md                  # Project documentation
├── CHANGELOG.md               # Version history
└── docker-compose.yml         # Docker setup for development
```

### 📋 **Folder Structure Explanation**

#### **📁 src/** - Main source code directory
- **config/**: Configuration files for database, environment, and app settings
- **controllers/**: HTTP request handlers that orchestrate business logic
- **middleware/**: Express middleware for authentication, validation, error handling
- **routes/**: API route definitions and routing logic
- **services/**: Business logic layer separated by domain
- **models/**: Data access layer with Supabase query abstractions
- **utils/**: Utility functions, helpers, and common functionality
- **jobs/**: Background job processing and scheduled tasks

#### **📁 tests/** - Testing infrastructure
- **unit/**: Unit tests for individual functions and modules
- **integration/**: API endpoint integration tests
- **fixtures/**: Test data and mock objects

#### **📁 docs/** - Documentation
- API documentation, database schemas, and deployment guides

#### **📁 scripts/** - Utility scripts
- Database setup, data seeding, and maintenance scripts

### 🔧 **Key Architecture Decisions**

#### **1. Separation of Concerns**
- **Controllers**: Handle HTTP requests/responses
- **Services**: Contain business logic
- **Models**: Handle data access and queries
- **Middleware**: Handle cross-cutting concerns

#### **2. Supabase Integration Strategy**
- Centralized Supabase client in `config/database.js`
- Model layer abstracts Supabase queries
- Real-time subscriptions handled in services
- Row Level Security (RLS) policies for data protection

#### **3. Security Implementation**
- JWT authentication middleware
- Role-based access control (RBAC)
- Input validation and sanitization
- Rate limiting and security headers
- Environment variable validation

#### **4. Error Handling Strategy**
- Global error handling middleware
- Standardized error response format
- Custom error classes for different scenarios
- Comprehensive logging system

#### **5. API Design Principles**
- RESTful endpoint design
- Consistent response format
- Proper HTTP status codes
- API versioning support
- Request/response validation

### 📦 **Core Dependencies**

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "@supabase/supabase-js": "^2.38.0",
    "cors": "^2.8.5",
    "helmet": "^7.0.0",
    "express-rate-limit": "^6.10.0",
    "joi": "^17.9.2",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "winston": "^3.10.0",
    "multer": "^1.4.5",
    "node-cron": "^3.0.2",
    "uuid": "^9.0.0"
  },
  "devDependencies": {
    "jest": "^29.6.2",
    "supertest": "^6.3.3",
    "nodemon": "^3.0.1"
  }
}
```

### 🚀 **Development Workflow**

1. **Environment Setup**: Configure `.env` with Supabase credentials
2. **Database Setup**: Run setup script to create tables and RLS policies
3. **Seed Data**: Populate database with initial departments and badges
4. **Start Development**: Use nodemon for hot reloading
5. **Testing**: Run unit and integration tests
6. **Documentation**: Auto-generate API docs

### 🔐 **Environment Variables**

```bash
# Server Configuration
NODE_ENV=development
PORT=3000
API_VERSION=v1

# Supabase Configuration
SUPABASE_URL=https://ffkzscbaytuqsjupsvav.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_KEY=your_service_key_here

# JWT Configuration
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# External API Keys
GOOGLE_GEMINI_API_KEY=your_gemini_api_key
GOOGLE_MAPS_API_KEY=your_maps_api_key

# Notification Services
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASS=your_app_password
SMS_API_KEY=your_sms_api_key
WHATSAPP_TOKEN=your_whatsapp_token
```

### 📝 **Next Steps After Approval**

1. Create the folder structure
2. Set up package.json with dependencies
3. Configure Supabase client and environment
4. Implement core authentication system
5. Build complaint management APIs
6. Add middleware and error handling
7. Create comprehensive testing suite
8. Generate API documentation

**Please review this structure and let me know if it looks good to proceed with the implementation!**