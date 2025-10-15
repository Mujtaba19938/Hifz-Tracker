#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Hifz Tracker Android Build Process...\n');

// Check if EAS CLI is installed
try {
  execSync('npx eas-cli --version', { stdio: 'pipe' });
  console.log('✅ EAS CLI is available');
} catch (error) {
  console.error('❌ EAS CLI is not available. Please run: npm install -g eas-cli');
  process.exit(1);
}

// Check if user is logged in to Expo
try {
  execSync('npx eas-cli whoami', { stdio: 'pipe' });
  console.log('✅ Logged in to Expo');
} catch (error) {
  console.log('⚠️  Not logged in to Expo. Please run: npx eas-cli login');
  console.log('   You can create a free Expo account at https://expo.dev');
  process.exit(1);
}

// Function to run build command
function runBuild(buildType = 'apk') {
  const profile = buildType === 'aab' ? 'production-aab' : 'production';
  const command = `npx eas-cli build --platform android --profile ${profile} --non-interactive`;
  
  console.log(`\n🔨 Building ${buildType.toUpperCase()}...`);
  console.log(`Command: ${command}\n`);
  
  try {
    execSync(command, { stdio: 'inherit' });
    console.log(`\n✅ ${buildType.toUpperCase()} build completed successfully!`);
    console.log('📱 Check your Expo dashboard for the download link.');
  } catch (error) {
    console.error(`\n❌ Build failed: ${error.message}`);
    process.exit(1);
  }
}

// Main execution
const args = process.argv.slice(2);
const buildType = args.includes('--aab') ? 'aab' : 'apk';

console.log(`📦 Build Type: ${buildType.toUpperCase()}`);
console.log(`📱 App: Hifz Tracker`);
console.log(`🏗️  Platform: Android\n`);

runBuild(buildType);

console.log('\n🎉 Build process completed!');
console.log('\nNext steps:');
console.log('1. Download your APK/AAB from the Expo dashboard');
console.log('2. Test the APK on a device');
console.log('3. Upload to Google Play Store (for AAB) or distribute APK');
