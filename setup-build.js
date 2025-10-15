#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Hifz Tracker Android Build Environment...\n');

// Function to run command with error handling
function runCommand(command, description) {
  console.log(`📋 ${description}...`);
  try {
    execSync(command, { stdio: 'inherit' });
    console.log(`✅ ${description} completed\n`);
    return true;
  } catch (error) {
    console.error(`❌ ${description} failed: ${error.message}\n`);
    return false;
  }
}

// Check if EAS CLI is available
console.log('🔍 Checking EAS CLI availability...');
try {
  execSync('npx eas-cli --version', { stdio: 'pipe' });
  console.log('✅ EAS CLI is available\n');
} catch (error) {
  console.error('❌ EAS CLI is not available. Installing...');
  if (!runCommand('npm install -g eas-cli', 'Installing EAS CLI')) {
    console.error('Failed to install EAS CLI. Please install manually: npm install -g eas-cli');
    process.exit(1);
  }
}

// Check if user is logged in
console.log('🔍 Checking Expo login status...');
try {
  execSync('npx eas-cli whoami', { stdio: 'pipe' });
  console.log('✅ Already logged in to Expo\n');
} catch (error) {
  console.log('⚠️  Not logged in to Expo. Please login manually:');
  console.log('   Run: npx eas-cli login');
  console.log('   Create a free account at: https://expo.dev\n');
}

// Validate configuration files
console.log('🔍 Validating configuration files...');

const easJsonPath = path.join(__dirname, 'eas.json');
const appJsonPath = path.join(__dirname, 'app.json');

if (!fs.existsSync(easJsonPath)) {
  console.error('❌ eas.json not found');
  process.exit(1);
}

if (!fs.existsSync(appJsonPath)) {
  console.error('❌ app.json not found');
  process.exit(1);
}

console.log('✅ Configuration files found\n');

// Test EAS configuration
console.log('🔍 Testing EAS configuration...');
try {
  execSync('npx eas-cli build:configure --non-interactive', { stdio: 'pipe' });
  console.log('✅ EAS configuration is valid\n');
} catch (error) {
  console.log('⚠️  EAS project needs to be configured');
  console.log('   This will be done automatically when you run your first build\n');
}

console.log('🎉 Setup completed successfully!\n');
console.log('📋 Next steps:');
console.log('1. Login to Expo: npx eas-cli login');
console.log('2. Build APK: npm run build:android');
console.log('3. Build AAB: npm run build:android-aab');
console.log('4. Or use the automated script: node build-android.js\n');

console.log('📚 For detailed instructions, see: BUILD_INSTRUCTIONS.md');
