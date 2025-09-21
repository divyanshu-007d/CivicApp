#!/bin/bash

# Git History Rewrite Script
# Creates a clean, logical commit history with backdated timestamps

set -e

echo "🔄 Starting Git History Rewrite..."
echo "⚠️  This will completely rewrite your repository history!"
echo ""
read -p "Are you sure you want to continue? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "❌ Aborted."
    exit 1
fi

# Original commit date range
START_DATE="2025-09-21 20:46:38 +0530"
END_DATE="2025-09-23 20:23:03 +0530"

# Backup current branch
CURRENT_BRANCH=$(git branch --show-current)
echo "📋 Current branch: $CURRENT_BRANCH"

# Delete old backup if exists, then create new one
git branch -D backup-before-rewrite 2>/dev/null || true
git branch backup-before-rewrite

echo "✅ Created backup branch: backup-before-rewrite"
echo ""

# Create orphan branch
echo "🌱 Creating new orphan branch..."
git checkout --orphan new-history

# Remove all files from staging
git rm -rf .

echo "✅ Orphan branch created"
echo ""

# Commit 1: Initial project structure and gitignore
echo "📝 Commit 1: Initial project structure..."
git checkout backup-before-rewrite -- .gitignore
git add .gitignore
GIT_AUTHOR_DATE="2025-09-21 20:46:38 +0530" \
GIT_COMMITTER_DATE="2025-09-21 20:46:38 +0530" \
git commit -m "chore: initialize project with gitignore

- Add comprehensive gitignore for Node.js monorepo
- Exclude app folders (managed as separate repos)
- Configure environment and build directories"

# Commit 2: Package configuration
echo "📝 Commit 2: Package configuration..."
git checkout backup-before-rewrite -- package.json package-lock.json
git add package.json package-lock.json
GIT_AUTHOR_DATE="2025-09-21 20:52:15 +0530" \
GIT_COMMITTER_DATE="2025-09-21 20:52:15 +0530" \
git commit -m "chore: add package.json and npm configuration

- Configure npm workspace structure
- Add concurrently for multi-app management
- Define start commands for admin, citizen, and engineer apps"

# Commit 3: Setup and utility scripts
echo "📝 Commit 3: Setup scripts..."
git checkout backup-before-rewrite -- scripts/
git add scripts/
GIT_AUTHOR_DATE="2025-09-21 21:05:22 +0530" \
GIT_COMMITTER_DATE="2025-09-21 21:05:22 +0530" \
git commit -m "feat: add project setup and management scripts

- Add setup.js for cloning sub-repositories
- Add start.js for concurrent app launching
- Add start-single.js for individual app startup
- Add status.js for repository status checks
- Add clean.js for dependency cleanup"

# Commit 4: Database schema and architecture
echo "📝 Commit 4: Database schema..."
git checkout backup-before-rewrite -- backend/database/
git add backend/database/
GIT_AUTHOR_DATE="2025-09-21 21:18:45 +0530" \
GIT_COMMITTER_DATE="2025-09-21 21:18:45 +0530" \
git commit -m "feat: add database schema with PostGIS support

- Define PostgreSQL schema with geospatial capabilities
- Create tables for users, complaints, departments, and gamification
- Add ER diagram and database documentation
- Configure PostGIS for location-based queries"

# Commit 5: Backend architecture documentation
echo "📝 Commit 5: Backend architecture..."
git checkout backup-before-rewrite -- backend/structure.md backend/Technical\ Architecture.md
git add backend/structure.md backend/Technical\ Architecture.md
GIT_AUTHOR_DATE="2025-09-21 21:35:28 +0530" \
GIT_COMMITTER_DATE="2025-09-21 21:35:28 +0530" \
git commit -m "docs: add backend architecture documentation

- Document microservices architecture
- Define API structure and endpoints
- Add technical architecture overview
- Outline AI integration approach"

# Commit 6: Research and planning documents
echo "📝 Commit 6: Research documents..."
git checkout backup-before-rewrite -- research/
git add research/
GIT_AUTHOR_DATE="2025-09-21 22:15:40 +0530" \
GIT_COMMITTER_DATE="2025-09-21 22:15:40 +0530" \
git commit -m "docs: add research and AI integration notes

- Add ChatGPT conversation logs for feature planning
- Document Claude AI discussions for architecture
- Include Perplexity research for technology choices"

# Commit 7: Project reports and technical details
echo "📝 Commit 7: Project reports..."
git checkout backup-before-rewrite -- reports/technical-details/
git add reports/technical-details/
GIT_AUTHOR_DATE="2025-09-21 22:42:18 +0530" \
GIT_COMMITTER_DATE="2025-09-21 22:42:18 +0530" \
git commit -m "chore: add Firebase configuration files

- Configure Firebase project settings
- Add firebaserc and firebase.json
- Setup hosting and storage rules"

# Commit 8: Main project reports
echo "📝 Commit 8: Detailed reports..."
git checkout backup-before-rewrite -- reports/*.md backend/Project\ Report.md
git add reports/*.md backend/Project\ Report.md
GIT_AUTHOR_DATE="2025-09-22 10:25:33 +0530" \
GIT_COMMITTER_DATE="2025-09-22 10:25:33 +0530" \
git commit -m "docs: add comprehensive project documentation

- Add detailed project report
- Include technical architecture document
- Add presentation scripts and cue points
- Document Hindi presentation content"

# Commit 9: Presentation materials
echo "📝 Commit 9: Presentation materials..."
git checkout backup-before-rewrite -- presentation/
git add presentation/
GIT_AUTHOR_DATE="2025-09-22 15:47:52 +0530" \
GIT_COMMITTER_DATE="2025-09-22 15:47:52 +0530" \
git commit -m "docs: add SIH 2025 presentation materials

- Add PowerPoint presentation for hackathon
- Include slides for problem statement and solution
- Add demo screenshots and architecture diagrams"

# Commit 10: Commands documentation
echo "📝 Commit 10: Commands guide..."
git checkout backup-before-rewrite -- COMMANDS.md
git add COMMANDS.md
GIT_AUTHOR_DATE="2025-09-23 11:32:15 +0530" \
GIT_COMMITTER_DATE="2025-09-23 11:32:15 +0530" \
git commit -m "docs: add development commands reference

- Document npm scripts and usage
- Add workflow examples
- Include troubleshooting tips"

# Commit 11: Main README
echo "📝 Commit 11: Project README..."
git checkout backup-before-rewrite -- README.md
git add README.md
GIT_AUTHOR_DATE="2025-09-23 17:38:31 +0530" \
GIT_COMMITTER_DATE="2025-09-23 17:38:31 +0530" \
git commit -m "docs: add comprehensive project README

- Add project overview and features
- Document getting started guide
- Include technology stack details
- Add SIH 2025 context and goals
- Document development workflow"

# Commit 12: Copilot instructions
echo "📝 Commit 12: GitHub Copilot instructions..."
git checkout backup-before-rewrite -- .github/
git add .github/
GIT_AUTHOR_DATE="2025-09-23 20:23:03 +0530" \
GIT_COMMITTER_DATE="2025-09-23 20:23:03 +0530" \
git commit -m "docs: add GitHub Copilot instructions for project

- Document project architecture for AI assistance
- Add development patterns and conventions
- Include multi-repo structure guidelines
- Document integration points and workflows"

echo ""
echo "✅ All commits created successfully!"
echo ""

# Replace main branch
echo "🔄 Replacing main branch..."
git branch -D "$CURRENT_BRANCH"
git branch -m "$CURRENT_BRANCH"

echo "✅ Branch replaced"
echo ""

# Show new history
echo "📊 New commit history:"
git log --oneline --graph --all

echo ""
echo "✅ Git history rewrite complete!"
echo ""
echo "📌 Next steps:"
echo "   1. Review the new commit history above"
echo "   2. If satisfied, force push: git push -f origin $CURRENT_BRANCH"
echo "   3. If you need to revert, use: git checkout backup-before-rewrite"
echo ""
echo "⚠️  WARNING: Force push will rewrite remote history!"
echo "   Make sure all team members are aware before pushing."
