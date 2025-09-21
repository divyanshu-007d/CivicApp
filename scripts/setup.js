#!/usr/bin/env node

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

const log = (message, color = colors.reset) => {
  console.log(`${color}${message}${colors.reset}`);
};

const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const repos = packageJson.config.repos;

async function setupRepos() {
  log('🚀 SIH 2025 Civic App Setup Starting...', colors.cyan + colors.bright);
  log('', colors.reset);

  for (const [name, config] of Object.entries(repos)) {
    log(`📦 Setting up ${name}...`, colors.yellow);
    
    // Check if folder already exists
    if (fs.existsSync(config.folder)) {
      log(`  ✅ ${config.folder} already exists, pulling latest changes...`, colors.green);
      try {
        process.chdir(config.folder);
        execSync('git pull origin master', { stdio: 'inherit' });
        process.chdir('..');
      } catch (error) {
        log(`  ⚠️  Failed to pull ${name}, skipping...`, colors.yellow);
        process.chdir('..');
      }
    } else {
      log(`  🔄 Cloning ${name} from ${config.url}...`, colors.blue);
      try {
        execSync(`git clone ${config.url} ${config.folder}`, { stdio: 'inherit' });
        log(`  ✅ Successfully cloned ${name}`, colors.green);
      } catch (error) {
        log(`  ❌ Failed to clone ${name}`, colors.red);
        continue;
      }
    }

    // Install dependencies
    log(`  📋 Installing dependencies for ${name}...`, colors.blue);
    try {
      process.chdir(config.folder);
      
      // Check if package.json exists
      if (fs.existsSync('package.json')) {
        log(`    Installing npm packages...`, colors.blue);
        execSync('npm install', { stdio: 'inherit' });
        log(`  ✅ Dependencies installed for ${name}`, colors.green);
      } else {
        log(`    No package.json found, skipping npm install`, colors.yellow);
      }
      
      process.chdir('..');
    } catch (error) {
      log(`  ❌ Failed to install dependencies for ${name}`, colors.red);
      process.chdir('..');
    }
    
    log('', colors.reset);
  }

  log('🎉 Setup Complete!', colors.green + colors.bright);
  log('', colors.reset);
  log('Next steps:', colors.cyan);
  log('  • Run "npm start" to start all applications', colors.reset);
  log('  • Run "npm run status" to check repo status', colors.reset);
  log('  • Work in individual folders as usual', colors.reset);
  log('', colors.reset);
}

// Handle process cleanup
process.on('SIGINT', () => {
  log('\n⚠️  Setup interrupted by user', colors.yellow);
  process.exit(0);
});

process.on('SIGTERM', () => {
  log('\n⚠️  Setup terminated', colors.yellow);
  process.exit(0);
});

// Run setup
setupRepos().catch(error => {
  log(`❌ Setup failed: ${error.message}`, colors.red);
  process.exit(1);
});