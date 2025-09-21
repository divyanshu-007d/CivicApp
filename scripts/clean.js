#!/usr/bin/env node

const { execSync } = require('child_process');
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
  cyan: '\x1b[36m'
};

const log = (message, color = colors.reset) => {
  console.log(`${color}${message}${colors.reset}`);
};

function deleteFolderRecursive(folderPath) {
  if (fs.existsSync(folderPath)) {
    try {
      if (process.platform === 'win32') {
        execSync(`rmdir /s /q "${folderPath}"`, { stdio: 'inherit' });
      } else {
        execSync(`rm -rf "${folderPath}"`, { stdio: 'inherit' });
      }
      return true;
    } catch (error) {
      return false;
    }
  }
  return true;
}

function cleanNodeModules() {
  log('🧹 Cleaning all node_modules folders...', colors.cyan + colors.bright);
  log('', colors.reset);

  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const repos = packageJson.config.repos;

  // Clean main repo node_modules
  log('📦 Cleaning main repo...', colors.yellow);
  if (deleteFolderRecursive('./node_modules')) {
    log('  ✅ Main node_modules cleaned', colors.green);
  } else {
    log('  ❌ Failed to clean main node_modules', colors.red);
  }

  // Clean each app's node_modules
  Object.entries(repos).forEach(([name, config]) => {
    if (fs.existsSync(config.folder)) {
      log(`📦 Cleaning ${name}...`, colors.yellow);
      const nodeModulesPath = path.join(config.folder, 'node_modules');
      
      if (deleteFolderRecursive(nodeModulesPath)) {
        log(`  ✅ ${name} node_modules cleaned`, colors.green);
      } else {
        log(`  ❌ Failed to clean ${name} node_modules`, colors.red);
      }
    } else {
      log(`📦 ${name} folder not found, skipping...`, colors.blue);
    }
  });

  log('', colors.reset);
  log('🎉 Cleanup complete!', colors.green + colors.bright);
  log('', colors.reset);
  log('Next steps:', colors.cyan);
  log('  • Run "npm install" to reinstall main dependencies', colors.reset);
  log('  • Run "npm run setup" to reinstall app dependencies', colors.reset);
  log('', colors.reset);
}

cleanNodeModules();