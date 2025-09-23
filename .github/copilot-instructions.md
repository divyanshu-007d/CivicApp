# Copilot Instructions for SIH 2025 Civic App

## Project Overview
This is a **Smart India Hackathon 2025** monorepo containing a comprehensive civic issue reporting system with three interconnected applications: **Admin Dashboard** (Next.js), **Citizen App** (React Native), and **Field Engineer App** (React Native). The system uses AI-powered classification, gamification, and geospatial features.

## Architecture & Structure

### Multi-Repo Monorepo Pattern
- **Main repo** manages three separate git repositories as subfolders
- Each app is independently deployable but shares common patterns
- Use `npm run setup` for first-time cloning of all sub-repos
- Apps configured in `package.json` config section with ports and start commands

### Key Directories
- `citizen-app/` - React Native mobile app for citizens (port 19006)
- `field-engineer-app/` - React Native mobile app for government workers (port 19007) 
- `admin-dashboard/` - Next.js web dashboard for administrators (port 3000)
- `backend/database/schema.sql` - PostgreSQL schema with PostGIS for geospatial data
- `scripts/` - Custom Node.js scripts for development workflow

## Development Workflow

### Daily Development Commands
```bash
npm run admin     # Start only admin dashboard (recommended for web dev)
npm run citizen   # Start only citizen mobile app
npm run engineer  # Start only field engineer app
npm start         # Start ALL apps (for demos/integration testing)
```

### Database Schema Patterns
- Uses **PostgreSQL with PostGIS** extension for geospatial queries
- Custom ENUM types: `complaint_status_enum`, `user_type_enum`, `complaint_severity_enum`
- Location stored as `GEOMETRY(POINT, 4326)` for GPS coordinates
- JSON fields for AI classification results and notification channels
- UUID primary keys throughout

## Mobile App Patterns (React Native)

### Common Structure
```
src/
├── components/common/    # Shared components
├── contexts/           # React contexts (AuthContext pattern)
├── design-system/      # Custom UI component library
├── navigation/         # React Navigation setup
└── screens/           # Screen components
```

### Key Conventions
- Apps use **Expo** framework with managed workflow
- **ThemeProvider** wraps entire app for consistent styling
- **AuthProvider** pattern for authentication state
- Navigation structure: `RootNavigator` receives `isAuthenticated` prop

## Admin Dashboard Patterns (Next.js)

### App Router Structure
- Uses Next.js 13+ App Router with `/app` directory
- **shadcn/ui** components in `/components/ui/`
- **DashboardLayout** component provides sidebar navigation
- Navigation config array in `DashboardLayout.jsx` for menu items

### UI Component System
- Custom utilities in `lib/utils.js` using `cn()` helper
- Badge system for user status/types
- Geist fonts configured in root layout

## AI & Data Integration

### Core Technologies
- **Google Gemini API** for multimodal AI classification
- **PostGIS** for geospatial analysis and location-based queries
- **Redis** for caching (referenced in architecture docs)
- **AWS S3/Google Cloud Storage** for image/file storage

### Gamification System
- Cultural ranking system: "Mukhiya → Mahapaur → Pradhan Mantri"
- Point-based rewards stored in `gamification_points` field
- Badge levels tracked in user profiles

## Critical Integration Points

### Multi-Platform Bot Support
- WhatsApp, Telegram, Discord bot integration mentioned in docs
- Notification system supports multiple channels via JSON array

### Government Workflow
- Department-based assignment system in database
- Field engineer assignment and task management
- Before/after photo validation for issue resolution

## When Making Changes

### Mobile Apps
- Always test authentication flow changes in `AuthContext`
- Consider offline capabilities when modifying data flow
- Update navigation config when adding new screens

### Admin Dashboard  
- Add new routes to both `/app/` directory and navigation array
- Use existing shadcn/ui components for consistency
- Follow the established page component pattern

### Database Changes
- Always consider PostGIS spatial queries when modifying location data
- Update ENUM types carefully as they affect all related tables
- Maintain UUID consistency across foreign key relationships

### Cross-App Features
- Changes affecting complaint status require updates to all three apps
- Notification system changes impact both mobile apps
- AI classification changes affect the entire complaint workflow

## Local Development Setup
1. `npm install && npm run setup` (first time only)
2. Use individual app commands (`npm run admin`, `npm run citizen`, `npm run engineer`)
3. `npm run status` to check git status across all repos
4. `npm run clean` for fresh dependency installation