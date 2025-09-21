#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');

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

function checkRepoStatus() {
  log('📊 SIH 2025 Civic App - Repository Status', colors.cyan + colors.bright);
  log('', colors.reset);

  Object.entries(repos).forEach(([name, config]) => {
    log(`${name}:`, colors.yellow + colors.bright);
    
    if (!fs.existsSync(config.folder)) {
      log(`  ❌ Not cloned (run "npm run setup")`, colors.red);
      log('', colors.reset);
      return;
    }

    try {
      process.chdir(config.folder);
      
      // Check git status
      const gitStatus = execSync('git status --porcelain', { encoding: 'utf8' });
      const branch = execSync('git branch --show-current', { encoding: 'utf8' }).trim();
      
      log(`  📁 Folder: ${config.folder}`, colors.blue);
      log(`  🌿 Branch: ${branch}`, colors.green);
      
      if (gitStatus.trim()) {
        log(`  📝 Changes: Yes (uncommitted changes)`, colors.yellow);
        const changes = gitStatus.trim().split('\n');
        changes.slice(0, 3).forEach(change => {
          log(`    ${change}`, colors.yellow);
        });
        if (changes.length > 3) {
          log(`    ... and ${changes.length - 3} more`, colors.yellow);
        }
      } else {
        log(`  📝 Changes: None (clean)`, colors.green);
      }

      // Check if package.json exists and show some info
      if (fs.existsSync('package.json')) {
        const appPackageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
        log(`  📦 Version: ${appPackageJson.version || 'unknown'}`, colors.cyan);
        log(`  🚀 Start: ${config.startCommand}`, colors.magenta);
      }
      
      process.chdir('..');
    } catch (error) {
      log(`  ❌ Error checking status: ${error.message}`, colors.red);
      process.chdir('..');
    }
    
    log('', colors.reset);
  });

  log('Commands:', colors.cyan);
  log('  npm run setup    - Clone/update all repos', colors.reset);
  log('  npm start        - Start all applications', colors.reset);
  log('  npm run clean    - Clean all node_modules', colors.reset);
  log('', colors.reset);
}

checkRepoStatus();