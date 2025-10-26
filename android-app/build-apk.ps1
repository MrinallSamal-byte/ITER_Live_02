# ITER EduHub - Android APK Build Script
# Simplified version for reliable builds

param(
    [string]$Version = "1.0.0"
)

$ErrorActionPreference = "Stop"

# Change to script directory (android-app folder)
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptDir

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host " ITER EduHub - APK Builder v$Version" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Working directory: $scriptDir" -ForegroundColor Gray
Write-Host ""

# Variables
$APP_NAME = "ITER_EduHub"
$KEYSTORE_NAME = "release-keystore.jks"
$KEYSTORE_ALIAS = "iter-eduhub"
$KEYSTORE_PASSWORD = "iter@eduhub2025"

# Check Java
Write-Host "[1/5] Checking Java..." -ForegroundColor Yellow
$javaCheck = Get-Command java -ErrorAction SilentlyContinue
if ($null -eq $javaCheck) {
    Write-Host "ERROR: Java not found!" -ForegroundColor Red
    Write-Host "Please install JDK 11+ from https://adoptium.net/" -ForegroundColor Yellow
    exit 1
}
Write-Host "OK: Java is installed" -ForegroundColor Green

# Create keystore
Write-Host ""
Write-Host "[2/5] Setting up keystore..." -ForegroundColor Yellow
if (Test-Path "app\$KEYSTORE_NAME") {
    Write-Host "OK: Keystore already exists" -ForegroundColor Green
} else {
    Write-Host "Creating new keystore..." -ForegroundColor Gray
    $javaHome = $env:JAVA_HOME
    if (-not $javaHome) {
        # Try to find Java installation
        $javaCmd = Get-Command java -ErrorAction SilentlyContinue
        if ($javaCmd) {
            $javaHome = Split-Path (Split-Path $javaCmd.Source)
        }
    }
    
    $keytoolPath = "keytool"
    if ($javaHome) {
        $keytoolCandidate = Join-Path $javaHome "bin\keytool.exe"
        if (Test-Path $keytoolCandidate) {
            $keytoolPath = $keytoolCandidate
        }
    }
    
    try {
        $keytoolArgs = @(
            '-genkeypair', '-v',
            '-keystore', "app\$KEYSTORE_NAME",
            '-alias', $KEYSTORE_ALIAS,
            '-keyalg', 'RSA',
            '-keysize', '2048',
            '-validity', '10000',
            '-storepass', $KEYSTORE_PASSWORD,
            '-keypass', $KEYSTORE_PASSWORD,
            '-dname', 'CN=ITER EduHub, OU=Education, O=ITER, L=Bhubaneswar, ST=Odisha, C=IN'
        )
        & $keytoolPath $keytoolArgs
        if (Test-Path "app\$KEYSTORE_NAME") {
            Write-Host "OK: Keystore created successfully" -ForegroundColor Green
        } else {
            Write-Host "WARNING: Keystore creation may have failed" -ForegroundColor Yellow
            Write-Host "Will attempt unsigned debug build instead..." -ForegroundColor Yellow
        }
    }
    catch {
        Write-Host "WARNING: Could not create keystore automatically" -ForegroundColor Yellow
        Write-Host "Will attempt unsigned debug build instead..." -ForegroundColor Yellow
    }
}

# Clean build
Write-Host ""
Write-Host "[3/5] Cleaning previous builds..." -ForegroundColor Yellow
$gradlewBat = "gradlew.bat"
if (Test-Path $gradlewBat) {
    & ".\$gradlewBat" clean | Out-Null
    Write-Host "OK: Clean completed" -ForegroundColor Green
} else {
    Write-Host "WARNING: Gradle wrapper not found, skipping clean" -ForegroundColor Yellow
}

# Build APK
Write-Host ""
Write-Host "[4/5] Building release APK..." -ForegroundColor Yellow
Write-Host "This may take several minutes..." -ForegroundColor Gray
Write-Host ""

if (Test-Path $gradlewBat) {
    & ".\$gradlewBat" assembleRelease
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "OK: Build completed successfully!" -ForegroundColor Green
    } else {
        Write-Host ""
        Write-Host "ERROR: Build failed with exit code $LASTEXITCODE" -ForegroundColor Red
        exit $LASTEXITCODE
    }
} else {
    Write-Host "ERROR: Gradle wrapper not found at $gradlewBat" -ForegroundColor Red
    Write-Host "Please ensure you are in the android-app directory" -ForegroundColor Yellow
    exit 1
}

# Locate and copy APK
Write-Host ""
Write-Host "[5/5] Packaging APK..." -ForegroundColor Yellow

$APK_PATH = "app\build\outputs\apk\release\app-release.apk"
if (Test-Path $APK_PATH) {
    $apkSizeMB = [math]::Round((Get-Item $APK_PATH).Length / 1MB, 2)
    Write-Host "OK: APK found ($apkSizeMB MB)" -ForegroundColor Green
    
    # Create output directory
    $OUTPUT_DIR = "..\app-release"
    New-Item -ItemType Directory -Force -Path $OUTPUT_DIR | Out-Null
    $OUTPUT_APK = "$OUTPUT_DIR\${APP_NAME}_v${Version}.apk"
    Copy-Item $APK_PATH $OUTPUT_APK -Force
    
    Write-Host "OK: APK copied to: $OUTPUT_APK" -ForegroundColor Green
    
    # Create install instructions
    $INSTRUCTIONS = @"
ITER EduHub - Installation Guide
=================================

App Information:
- Name: $APP_NAME
- Version: $Version
- Size: $apkSizeMB MB
- Package: com.iter.eduhub
- Min Android: 10 (API 29)
- Target Android: 15 (API 35)

Installation Steps:
1. Download ${APP_NAME}_v${Version}.apk
2. Enable "Install unknown apps" in Android Settings
3. Open the APK file and tap Install
4. Grant permissions when prompted
5. Launch the app

The app will connect to: https://iters.live

Build Date: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')
"@
    
    $INSTRUCTIONS | Out-File -FilePath "$OUTPUT_DIR\README.txt" -Encoding UTF8
    
    Write-Host ""
    Write-Host "==========================================" -ForegroundColor Cyan
    Write-Host " BUILD COMPLETED SUCCESSFULLY!" -ForegroundColor Green
    Write-Host "==========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "APK Location:" -ForegroundColor Yellow
    Write-Host "  $OUTPUT_APK" -ForegroundColor White
    Write-Host ""
    Write-Host "Size: $apkSizeMB MB" -ForegroundColor Yellow
    Write-Host "Version: $Version" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Next Steps:" -ForegroundColor Yellow
    Write-Host "1. Test on Android device" -ForegroundColor White
    Write-Host "2. Upload to hosting service" -ForegroundColor White
    Write-Host "3. Share download link" -ForegroundColor White
    Write-Host ""
    
    # Open output folder
    Start-Process explorer.exe (Resolve-Path $OUTPUT_DIR)
    
} else {
    Write-Host "ERROR: APK not found at $APK_PATH" -ForegroundColor Red
    exit 1
}
