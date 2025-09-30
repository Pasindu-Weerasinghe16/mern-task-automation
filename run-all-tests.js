#!/usr/bin/env node
/**
 * Complete Test Suite Runner
 * Runs all tests: Unit, API, Frontend, UI, Security
 */

const { spawn } = require('child_process');
const path = require('path');

console.log('Starting Test Suite...');

const runCommand = (command, args, cwd) => {
  return new Promise((resolve, reject) => {
    const process = spawn(command, args, { 
      cwd, 
      stdio: 'inherit',
      shell: true 
    });
    
    process.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with code ${code}`));
      }
    });
  });
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function runAllTests() {
  const rootDir = path.resolve(__dirname);
  const backendDir = path.join(rootDir, 'backend');
  const frontendDir = path.join(rootDir, 'frontend');
  
  try {
    await runCommand('npm', ['test'], backendDir);
    await runCommand('npm', ['test', '--', '--watchAll=false'], frontendDir);
    await runCommand('node', ['security-testing/security-config-tests.js'], rootDir);
    
  } catch (error) {
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  runAllTests();
}

module.exports = { runAllTests };