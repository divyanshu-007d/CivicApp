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
      description: 'Government administration panel'
    },
    'citizen-app': {
      color: colors.green,
      emoji: '📱',
      name: 'Citizen App',
      description: 'Citizen issue reporting app'
    },
    'field-engineer-app': {
      color: colors.magenta,
      emoji: '🔧',
      name: 'Field Engineer App',
      description: 'Government worker mobile app'
    }
  };

  const info = appInfo[appName] || {
    color: colors.cyan,
    emoji: '🚀',
    name: appName,
    description: 'Application'
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
  let expoAddress = null;
  let webAddress = null;
  
  const child = spawn(command, args, {
    cwd: config.folder,
    stdio: 'pipe',
    shell: true
  });

  // Capture output to detect when app is ready
  child.stdout.on('data', (data) => {
    const output = data.toString();
    
    // Forward output to console
    process.stdout.write(output);
    
    // Detect Expo/Metro addresses - improved patterns
    const expoMatch = output.match(/Metro waiting on (exp:\/\/[^\s\n]+)/);
    const webMatch = output.match(/Web is waiting on (http:\/\/[^\s\n]+)|Waiting on (http:\/\/[^\s\n]+)/);
    const qrMatch = output.match(/█/); // QR code detection
    
    if (expoMatch) {
      expoAddress = expoMatch[1];
    }
    if (webMatch) {
      webAddress = webMatch[1] || webMatch[2];
    }
    
    // For React Native/Expo apps, wait for QR code or specific ready indicators
    if (config.type === 'mobile') {
      if ((output.includes('Metro waiting on') || 
           output.includes('Web is waiting on') || 
           output.includes('Waiting on http://') ||
           output.includes('Press s │ switch to') ||
           qrMatch) && !isReady) {
        isReady = true;
        // Small delay to ensure all addresses are captured
        setTimeout(showReadyMessage, 1000);
      }
    }
    
    // For Next.js apps, wait for "Ready in" message
    if (config.type === 'web' && output.includes('Ready in')) {
      if (!isReady) {
        isReady = true;
        showReadyMessage();
      }
    }
  });

  child.stderr.on('data', (data) => {
    process.stderr.write(data);
  });

  function showReadyMessage() {
    log(`\n${info.emoji} ${info.name} is ready!`, info.color + colors.bright);
    
    if (config.type === 'mobile') {
      if (expoAddress) {
        log(`📱 Expo: ${expoAddress}`, colors.magenta);
      }
      if (webAddress) {
        log(`🌐 Web: ${webAddress}`, colors.cyan);
      } else {
        // Fallback for web address
        log(`🌐 Web: http://localhost:8081`, colors.cyan);
      }
      log(`📱 Scan the QR code above with Expo Go app`, colors.green);
      log(`🌐 Or open web version in your browser`, colors.blue);
    } else {
      log(`🌐 Access it at: http://localhost:${config.port}`, colors.cyan);
    }
    
    log(`Press Ctrl+C to stop`, colors.yellow);
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
    if (!isReady) {
      log(`\n${info.emoji} ${info.name} is starting up...`, info.color);
      log(`Check the output above for QR code and access URLs`, colors.cyan);
      log(`Press Ctrl+C to stop`, colors.yellow);
      log('', colors.reset);
    }
  }, 15000); // Increased timeout for Expo apps
}

// Start the app
startSingleApp();