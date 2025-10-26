#!/usr/bin/env node

/**
 * Android APK Build and Deployment Script
 * 
 * This script:
 * 1. Builds the Android APK using Gradle
 * 2. Copies the APK to the uploads/android-app directory
 * 3. Renames it to a consistent name for easy serving
 * 
 * Usage:
 *   node scripts/build-and-deploy-android.js [debug|release]
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const BUILD_TYPE = process.argv[2] || 'release';
const PROJECT_ROOT = path.join(__dirname, '..');
const ANDROID_DIR = path.join(PROJECT_ROOT, 'android-app');
const UPLOADS_DIR = path.join(PROJECT_ROOT, 'uploads', 'android-app');
const BUILD_OUTPUT_DIR = path.join(ANDROID_DIR, 'app', 'build', 'outputs', 'apk', BUILD_TYPE);

// Output file names
const APK_FILENAME = `ITER-EduHub-${BUILD_TYPE}.apk`;
const VERSION_FILE = 'version.json';

console.log('🚀 Starting Android APK Build Process...\n');
console.log(`Build Type: ${BUILD_TYPE.toUpperCase()}`);
console.log(`Project Root: ${PROJECT_ROOT}`);
console.log(`Android Dir: ${ANDROID_DIR}`);
console.log(`Upload Dir: ${UPLOADS_DIR}\n`);

// Step 1: Ensure uploads directory exists
console.log('📁 Creating uploads directory...');
if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    console.log('✅ Uploads directory created\n');
} else {
    console.log('✅ Uploads directory already exists\n');
}

// Step 2: Clean previous build
console.log('🧹 Cleaning previous build...');
try {
    execSync(`cd "${ANDROID_DIR}" && gradlew clean`, { 
        stdio: 'inherit',
        shell: true 
    });
    console.log('✅ Clean completed\n');
} catch (error) {
    console.error('❌ Clean failed:', error.message);
    process.exit(1);
}

// Step 3: Build the APK
console.log(`🔨 Building ${BUILD_TYPE} APK...`);
console.log('This may take a few minutes...\n');
try {
    const buildCommand = BUILD_TYPE === 'release' 
        ? 'assembleRelease' 
        : 'assembleDebug';
    
    execSync(`cd "${ANDROID_DIR}" && gradlew ${buildCommand}`, { 
        stdio: 'inherit',
        shell: true 
    });
    console.log('✅ Build completed successfully\n');
} catch (error) {
    console.error('❌ Build failed:', error.message);
    console.error('\n⚠️  Make sure you have:');
    console.error('   - Android SDK installed');
    console.error('   - ANDROID_HOME environment variable set');
    console.error('   - Java JDK 11 or higher installed');
    process.exit(1);
}

// Step 4: Find the generated APK
console.log('🔍 Locating generated APK...');
let apkFile = null;

if (fs.existsSync(BUILD_OUTPUT_DIR)) {
    const files = fs.readdirSync(BUILD_OUTPUT_DIR);
    const apkFiles = files.filter(f => f.endsWith('.apk') && !f.includes('unsigned'));
    
    if (apkFiles.length > 0) {
        apkFile = path.join(BUILD_OUTPUT_DIR, apkFiles[0]);
        console.log(`✅ Found: ${apkFiles[0]}\n`);
    }
}

if (!apkFile || !fs.existsSync(apkFile)) {
    console.error('❌ APK file not found!');
    console.error(`Expected location: ${BUILD_OUTPUT_DIR}`);
    process.exit(1);
}

// Step 5: Copy APK to uploads directory
console.log('📦 Copying APK to uploads directory...');
const destinationPath = path.join(UPLOADS_DIR, APK_FILENAME);

try {
    fs.copyFileSync(apkFile, destinationPath);
    const stats = fs.statSync(destinationPath);
    const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);
    
    console.log(`✅ APK copied successfully`);
    console.log(`   Location: ${destinationPath}`);
    console.log(`   Size: ${fileSizeMB} MB\n`);
} catch (error) {
    console.error('❌ Failed to copy APK:', error.message);
    process.exit(1);
}

// Step 6: Create version metadata
console.log('📝 Creating version metadata...');
const versionData = {
    version: '1.0.0',
    versionCode: 1,
    buildType: BUILD_TYPE,
    buildDate: new Date().toISOString(),
    fileName: APK_FILENAME,
    fileSize: fs.statSync(destinationPath).size,
    packageName: 'com.iter.eduhub'
};

fs.writeFileSync(
    path.join(UPLOADS_DIR, VERSION_FILE),
    JSON.stringify(versionData, null, 2)
);
console.log('✅ Version metadata created\n');

// Step 7: Summary
console.log('=' .repeat(60));
console.log('🎉 BUILD AND DEPLOYMENT SUCCESSFUL!');
console.log('=' .repeat(60));
console.log('\n📱 APK Information:');
console.log(`   File: ${APK_FILENAME}`);
console.log(`   Path: ${destinationPath}`);
console.log(`   Size: ${(versionData.fileSize / (1024 * 1024)).toFixed(2)} MB`);
console.log(`   Build: ${BUILD_TYPE.toUpperCase()}`);
console.log(`   Date: ${new Date().toLocaleString()}`);
console.log('\n🌐 Download URL (once deployed):');
console.log(`   https://your-domain.com/api/download-app`);
console.log('\n✅ Next Steps:');
console.log('   1. Test the download locally: npm run test:download');
console.log('   2. Commit and push to GitHub');
console.log('   3. Deploy to Render');
console.log('   4. Test download from live URL');
console.log('\n' + '=' .repeat(60) + '\n');
