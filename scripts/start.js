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

const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const repos = packageJson.config.repos;

const runningProcesses = [];

function startApp(name, config) {
  if (!fs.existsSync(config.folder)) {
    log(`❌ ${name} folder not found. Run "npm run setup" first.`, colors.red);
    return null;
  }

  if (!fs.existsSync(path.join(config.folder, 'package.json'))) {
    log(`⚠️  ${name} has no package.json, skipping...`, colors.yellow);
    return null;
  }

  log(`🚀 Starting ${name} (${config.type}) on port ${config.port}...`, colors.green);
  
  const [command, ...args] = config.startCommand.split(' ');
  
  const child = spawn(command, args, {
    cwd: config.folder,
    stdio: 'pipe',
    shell: true
  });

  // Add colored output for each app
  const appColors = {
    'admin-dashboard': colors.blue,
    'citizen-app': colors.green,
    'field-engineer-app': colors.magenta
  };

  const appColor = appColors[name] || colors.cyan;

  child.stdout.on('data', (data) => {
    const lines = data.toString().split('\n').filter(line => line.trim());
    lines.forEach(line => {
      console.log(`${appColor}[${name}]${colors.reset} ${line}`);
    });
  });

  child.stderr.on('data', (data) => {
    const lines = data.toString().split('\n').filter(line => line.trim());
    lines.forEach(line => {
      console.log(`${colors.red}[${name}]${colors.reset} ${line}`);
    });
  });

  child.on('close', (code) => {
    log(`${name} exited with code ${code}`, code === 0 ? colors.green : colors.red);
  });

  child.on('error', (error) => {
    log(`Failed to start ${name}: ${error.message}`, colors.red);
  });

  return child;
}

async function startAllApps() {
  log('🎯 SIH 2025 Civic App - Starting All Applications...', colors.cyan + colors.bright);
  log('', colors.reset);

  // Show what will be started
  log('Applications to start:', colors.yellow);
  Object.entries(repos).forEach(([name, config]) => {
    if (fs.existsSync(config.folder)) {
      log(`  ✅ ${name} (${config.type}) - Port ${config.port}`, colors.green);
    } else {
      log(`  ❌ ${name} - Folder not found`, colors.red);
    }
  });
  log('', colors.reset);

  // Start all applications
  for (const [name, config] of Object.entries(repos)) {
    const process = startApp(name, config);
    if (process) {
      runningProcesses.push({ name, process });
    }
    
    // Small delay between starting apps
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  if (runningProcesses.length === 0) {
    log('❌ No applications could be started. Run "npm run setup" first.', colors.red);
    process.exit(1);
  }

  log('', colors.reset);
  log('🎉 All applications started!', colors.green + colors.bright);
  log('', colors.reset);
  log('Access your applications:', colors.cyan);
  log('  🌐 Admin Dashboard: http://localhost:3000', colors.blue);
  log('  📱 Citizen App: http://localhost:19006', colors.green);
  log('  🔧 Field Engineer App: http://localhost:19007', colors.magenta);
  log('', colors.reset);
  log('Press Ctrl+C to stop all applications', colors.yellow);
}

// Handle graceful shutdown
function gracefulShutdown() {
  log('\n⚠️  Shutting down all applications...', colors.yellow);
  
  runningProcesses.forEach(({ name, process }) => {
    log(`  Stopping ${name}...`, colors.blue);
    process.kill('SIGTERM');
  });

  // Force kill after 5 seconds
  setTimeout(() => {
    runningProcesses.forEach(({ name, process }) => {
      if (!process.killed) {
        log(`  Force killing ${name}...`, colors.red);
        process.kill('SIGKILL');
      }
    });
    process.exit(0);
  }, 5000);

  // Exit cleanly if all processes stop
  let processesRunning = runningProcesses.length;
  runningProcesses.forEach(({ process }) => {
    process.on('exit', () => {
      processesRunning--;
      if (processesRunning === 0) {
        log('✅ All applications stopped cleanly', colors.green);
        process.exit(0);
      }
    });
  });
}

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

// Start all apps
startAllApps().catch(error => {
  log(`❌ Failed to start applications: ${error.message}`, colors.red);
  process.exit(1);
});