# SIH 2025 - Civic Issue Reporting and Resolution System

## 🏆 Smart India Hackathon 2025 - Problem Statement 25031
**Government of Jharkhand**

A comprehensive AI-powered civic issue reporting platform designed to bridge the gap between citizens and government departments through intelligent automation and gamified engagement.

## 🌟 Project Overview

This monorepo contains three interconnected applications that form a complete civic governance ecosystem:

### 📱 Applications

1. **[Citizen Mobile App](./citizen-app/)** - React Native
   - One-tap issue reporting with AI classification
   - Real-time tracking and notifications
   - Gamified engagement with points and badges
   - Multi-platform bot integration (WhatsApp, Telegram, Discord)

2. **[Field Engineer App](./field-engineer-app/)** - React Native
   - Smart task management for government workers
   - AI-powered verification system
   - Route optimization and offline capabilities
   - Before/after photo validation

3. **[Admin Dashboard](./admin-dashboard/)** - Next.js
   - Centralized management and analytics
   - Department-wise task allocation
   - Real-time monitoring and reporting
   - Performance metrics and insights

## 🚀 Key Features

### 🤖 AI-Powered Intelligence
- **Google Gemini Multimodal AI** for automatic issue classification
- Computer vision for image analysis and verification
- Natural language processing for complaint categorization
- Intelligent priority assignment based on severity and location

### 🎮 Gamification System
- **Cultural Rankings**: Mukhiya → Mahapaur → Pradhan Mantri
- Point-based reward system
- Community leaderboards
- Badge achievements for civic participation

### 🌐 Universal Accessibility
- Multi-platform support (Android, iOS, Web)
- WhatsApp, Telegram, and Discord bot integration
- Offline-first architecture
- Multi-language support (Hindi, English, Regional)

### 📊 Advanced Analytics
- Real-time dashboard with KPIs
- Predictive analytics for resource planning
- Geographic heat maps for issue density
- Performance tracking and reporting

## 🛠 Technology Stack

### Frontend
- **Mobile**: React Native, Expo
- **Web**: Next.js, React, Material-UI
- **State Management**: Redux Toolkit
- **UI Components**: Custom design system

### Backend & AI
- **Server**: Node.js, Express.js
- **Database**: PostgreSQL with PostGIS
- **AI/ML**: Google Gemini API
- **Caching**: Redis
- **File Storage**: AWS S3 / Google Cloud Storage

### Infrastructure
- **Cloud**: AWS / Google Cloud Platform
- **Containers**: Docker, Kubernetes
- **CI/CD**: GitHub Actions
- **Monitoring**: CloudWatch, Prometheus

## 📈 Impact & Benefits

### 🏛 Government Benefits
- 30-40% reduction in operational costs
- Faster issue resolution (days instead of months)
- Data-driven decision making
- Improved citizen satisfaction

### 👥 Citizen Benefits
- Easy, one-tap issue reporting
- Transparent tracking system
- Gamified civic engagement
- Multi-channel accessibility

### 🌍 Environmental Impact
- Optimized resource allocation
- Reduced carbon footprint through smart routing
- Faster environmental issue resolution
- Data-driven green city development

## 📋 Implementation Timeline

### Phase 1: Foundation (Weeks 1-2)
- [x] Database schema design
- [x] Core API development
- [x] AI integration setup

### Phase 2: Applications (Weeks 3-4)
- [x] Mobile app development
- [x] Admin dashboard creation
- [x] Basic functionality implementation

### Phase 3: Advanced Features (Weeks 5-6)
- [x] AI integration and testing
- [x] Gamification system
- [x] Multi-platform bot development

### Phase 4: Deployment (Weeks 7-8)
- [ ] End-to-end testing
- [ ] Performance optimization
- [ ] Production deployment
- [ ] Government integration

## 🎯 Target Metrics

### Year 1 (Jharkhand Pilot)
- 10,000+ active users
- 50% reduction in resolution time
- 40% improvement in citizen satisfaction
- 25% reduction in operational costs

### Year 2-3 (Statewide Expansion)
- 100,000+ active users
- Integration with Smart Cities Mission
- Multi-state deployment
- ₹2000+ crore market opportunity

## 🔄 Getting Started

### Prerequisites
- Node.js (v18+)
- Git
- Google Gemini API access

### Quick Start
```bash
# Clone the main repository
git clone https://github.com/divyanshu-007d/CivicApp.git
cd CivicApp

# Install main dependencies
npm install

# Setup all applications (clones repos and installs dependencies)
npm run setup

# Start all applications
npm start
```

### Available Commands
```bash
npm run setup    # One-time setup for new team members (clone all repos and install dependencies)
npm start        # Start all applications concurrently (for demos and testing)  
npm run admin    # Start only the Admin Dashboard (Next.js web app)
npm run citizen  # Start only the Citizen App (React Native mobile app)
npm run engineer # Start only the Field Engineer App (React Native mobile app)
npm run status   # Check what's happening (see git status and info for all repos)
npm run clean    # Clean all node_modules folders (fresh start if needed)
```

### Individual App Commands
After running `npm run setup`, you can also work on apps individually:
```bash
# Quick start individual apps (recommended for daily development)
npm run admin    # 🌐 Admin Dashboard → http://localhost:3000
npm run citizen  # 📱 Citizen App → http://localhost:19006  
npm run engineer # 🔧 Field Engineer App → http://localhost:19007

# OR work directly in app folders
cd citizen-app && npm start          # Citizen mobile app
cd admin-dashboard && npm run dev    # Admin web dashboard  
cd field-engineer-app && npm start   # Field engineer mobile app
```

### 🎯 Typical Workflow
```bash
# First time setup (for new team members)
npm install && npm run setup

# Daily development - Start individual apps
npm run admin     # Work on admin dashboard
npm run citizen   # Work on citizen mobile app  
npm run engineer  # Work on field engineer app

# Demo/Testing (start everything together)
npm start
# Opens all applications:
# 🌐 Admin Dashboard: http://localhost:3000
# 📱 Citizen App: http://localhost:19006  
# 🔧 Field Engineer App: http://localhost:19007

# Check status anytime
npm run status
```

## 📂 Project Structure

```
civic-app/
├── citizen-app/              # Citizen mobile app
├── field-engineer-app/       # Field engineer mobile app  
├── admin-dashboard/          # Admin web dashboard
├── backend/                  # Shared backend services
├── scripts/                  # Setup and management scripts
├── reports/                  # Project documentation
├── presentation/             # SIH presentation materials
└── research/                 # Research and analysis
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📜 License

This project is developed for Smart India Hackathon 2025 and is intended for open-source contribution to Indian civic governance.

## 🏆 SIH 2025 Team

**Problem Statement**: 25031 - Crowdsourced Civic Issue Reporting  
**Organization**: Government of Jharkhand  
**Category**: Software  



**Digital India 🇮🇳 | Smart Cities Mission | AI for Good**

*Empowering Citizens, Enabling Government, Building Better Communities*