#!/usr/bin/env node

const { spawn } = require('child_process');
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

// Get the app name from command line argument
const appName = process.argv[2];

if (!appName) {
  log('❌ Please specify an app name!', colors.red);
  log('Usage: node start-single.js <app-name>', colors.yellow);
  log('Available apps: admin-dashboard, citizen-app, field-engineer-app', colors.cyan);
  process.exit(1);
}

const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const repos = packageJson.config.repos;

const config = repos[appName];

if (!config) {
  log(`❌ App "${appName}" not found in configuration!`, colors.red);
  log('Available apps:', colors.yellow);
  Object.keys(repos).forEach(name => {
    log(`  • ${name}`, colors.cyan);
  });
  process.exit(1);
}

function startSingleApp() {
  // Check if folder exists
  if (!fs.existsSync(config.folder)) {
    log(`❌ ${appName} folder not found!`, colors.red);
    log(`Run "npm run setup" first to clone the repository.`, colors.yellow);
    process.exit(1);
  }

  // Check if package.json exists
  if (!fs.existsSync(path.join(config.folder, 'package.json'))) {
    log(`❌ ${appName} has no package.json!`, colors.red);
    log(`The folder might be corrupted. Try running "npm run setup" again.`, colors.yellow);
    process.exit(1);
  }

  // App-specific colors and info
  const appInfo = {
    'admin-dashboard': {
      color: colors.blue,
      emoji: '🌐',
      name: 'Admin Dashboard',
      description: 'Government administration panel',
      readyPatterns: ['Ready in', 'Local:'],
      successMessage: `🌐 Access it at: http://localhost:${config.port}`
    },
    'citizen-app': {
      color: colors.green,
      emoji: '📱',
      name: 'Citizen App',
      description: 'Citizen issue reporting app',
      readyPatterns: ['Waiting on', 'Metro waiting', 'Press s │'],
      successMessage: '📱 Scan QR code above with Expo Go app\n🌐 Or open web version at http://localhost:8081'
    },
    'field-engineer-app': {
      color: colors.magenta,
      emoji: '🔧',
      name: 'Field Engineer App',
      description: 'Government worker mobile app',
      readyPatterns: ['Waiting on', 'Metro waiting', 'Press s │'],
      successMessage: '📱 Scan QR code above with Expo Go app\n🌐 Or open web version at http://localhost:8081'
    }
  };

  const info = appInfo[appName] || {
    color: colors.cyan,
    emoji: '🚀',
    name: appName,
    description: 'Application',
    readyPatterns: ['Ready', 'started'],
    successMessage: `🌐 Check output above for access URL`
  };

  // Starting message
  log(`${info.emoji} Starting ${info.name}...`, info.color + colors.bright);
  log(`📝 ${info.description}`, colors.reset);
  log(`📁 Folder: ${config.folder}`, colors.blue);
  log(`🚀 Command: ${config.startCommand}`, colors.cyan);
  log(`🌐 Port: ${config.port}`, colors.magenta);
  log('', colors.reset);

  // Parse and execute the start command
  const [command, ...args] = config.startCommand.split(' ');
  
  let isReady = false;
  let readyMessageShown = false;
  
  const child = spawn(command, args, {
    cwd: config.folder,
    stdio: 'pipe',
    shell: true
  });

  // Buffer to collect output for pattern matching
  let outputBuffer = '';

  // Capture output to detect when app is ready
  child.stdout.on('data', (data) => {
    const output = data.toString();
    outputBuffer += output;
    
    // Forward output to console
    process.stdout.write(output);
    
    // Check if app is ready based on patterns
    if (!isReady) {
      const isAppReady = info.readyPatterns.some(pattern => 
        outputBuffer.toLowerCase().includes(pattern.toLowerCase())
      );
      
      if (isAppReady) {
        isReady = true;
        // Small delay to let more output come through
        setTimeout(() => {
          if (!readyMessageShown) {
            readyMessageShown = true;
            showReadyMessage();
          }
        }, 2000);
      }
    }
  });

  child.stderr.on('data', (data) => {
    process.stderr.write(data);
  });

  function showReadyMessage() {
    log(`\n${info.emoji} ${info.name} is ready!`, info.color + colors.bright);
    log(info.successMessage, colors.green);
    log(`\nPress Ctrl+C to stop`, colors.yellow);
    log('', colors.reset);
  }

  // Handle process events
  child.on('close', (code) => {
    if (code === 0) {
      log(`✅ ${info.name} closed successfully`, info.color);
    } else {
      log(`❌ ${info.name} exited with code ${code}`, colors.red);
    }
  });

  child.on('error', (error) => {
    log(`❌ Failed to start ${info.name}: ${error.message}`, colors.red);
    process.exit(1);
  });

  // Handle graceful shutdown
  process.on('SIGINT', () => {
    log(`\n⚠️  Stopping ${info.name}...`, colors.yellow);
    child.kill('SIGTERM');
    
    setTimeout(() => {
      if (!child.killed) {
        log(`⚠️  Force stopping ${info.name}...`, colors.red);
        child.kill('SIGKILL');
      }
    }, 5000);
  });

  process.on('SIGTERM', () => {
    child.kill('SIGTERM');
  });

  // Fallback timeout message (in case detection fails)
  setTimeout(() => {
    if (!readyMessageShown) {
      readyMessageShown = true;
      log(`\n${info.emoji} ${info.name} is starting up...`, info.color);
      log(`Check the output above for QR code and access URLs`, colors.cyan);
      log(`Press Ctrl+C to stop`, colors.yellow);
      log('', colors.reset);
    }
  }, 20000); // 20 second timeout
}

// Start the app
startSingleApp();