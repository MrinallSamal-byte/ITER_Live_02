# 🚀 Android App Download - Quick Reference

## ⚡ Quick Start (5 Minutes)

### 1️⃣ Build APK
```bash
npm run build:android-apk
```

### 2️⃣ Start Server
```bash
npm start
```

### 3️⃣ Test Download
Open: http://localhost:5000
Click: "Download APK" button

### 4️⃣ Deploy
```bash
git add .
git commit -m "Add Android app download"
git push origin main
```

---

## 📁 Important Files

| File | Purpose |
|------|---------|
| `uploads/android-app/ITER-EduHub-release.apk` | The APK file users download |
| `uploads/android-app/version.json` | Version metadata (auto-generated) |
| `scripts/build-and-deploy-android.js` | Build automation script |
| `.github/workflows/build-android.yml` | CI/CD workflow (auto-builds) |
| `server/index.js` | Backend endpoints (lines 175-240) |
| `client/index.html` | Download button (lines 335-350, 790-860) |

---

## 🔗 API Endpoints

### Download APK
```
GET /api/download-app
Response: Binary APK file
MIME: application/vnd.android.package-archive
```

### Get Version Info
```
GET /api/app-version
Response: JSON with version, size, date
```

Example:
```json
{
  "success": true,
  "available": true,
  "version": "1.0.0",
  "versionCode": 1,
  "fileName": "ITER-EduHub-release.apk",
  "fileSize": 15728640,
  "buildDate": "2025-10-26T12:00:00Z"
}
```

---

## 🔨 NPM Scripts

```bash
# Build release APK (optimized, signed)
npm run build:android-apk

# Build debug APK (faster, for testing)
npm run build:android-debug

# Start server
npm start
```

---

## 🧪 Testing Commands

```bash
# Test version endpoint
curl http://localhost:5000/api/app-version

# Test download endpoint
curl -o test.apk http://localhost:5000/api/download-app

# Check APK file
ls -lh uploads/android-app/ITER-EduHub-release.apk

# Verify APK signature (requires Android SDK)
apksigner verify uploads/android-app/ITER-EduHub-release.apk
```

---

## 🚀 Deployment Checklist

- [ ] Build APK locally: `npm run build:android-apk`
- [ ] Test download on localhost
- [ ] Verify APK installs on Android device
- [ ] Commit changes: `git add . && git commit -m "Add APK"`
- [ ] Push to GitHub: `git push origin main`
- [ ] Wait for GitHub Actions to complete
- [ ] Verify Render deployment succeeds
- [ ] Test download from live URL
- [ ] Share link with users! 🎉

---

## 🐛 Common Issues

### APK Not Building
```bash
# Check Android SDK
echo $ANDROID_HOME

# Clean and rebuild
cd android-app && ./gradlew clean assembleRelease
```

### Button Shows "Coming Soon"
```bash
# APK file missing - build it:
npm run build:android-apk

# Restart server
npm start
```

### Download Fails (404)
```bash
# Check file exists
ls uploads/android-app/ITER-EduHub-release.apk

# Check filename matches (case-sensitive!)
```

### GitHub Actions Fails
- Check Actions tab on GitHub
- Re-run workflow
- Verify Java/Android SDK versions

---

## 📱 Android App Info

| Property | Value |
|----------|-------|
| **Package Name** | com.iter.eduhub |
| **Version** | 1.0.0 |
| **Version Code** | 1 |
| **Min SDK** | 29 (Android 10) |
| **Target SDK** | 35 (Android 15) |
| **Size** | ~12-20 MB |
| **Signed** | ✅ Yes |

---

## 🌐 URLs

### Local Development
```
Landing Page: http://localhost:5000
Download API: http://localhost:5000/api/download-app
Version API: http://localhost:5000/api/app-version
```

### Production (Replace with your domain)
```
Landing Page: https://your-app.onrender.com
Download API: https://your-app.onrender.com/api/download-app
Version API: https://your-app.onrender.com/api/app-version
```

---

## 🔄 Automatic Updates

### How It Works:
1. Change Android app code
2. Push to main branch
3. GitHub Actions builds new APK
4. APK committed automatically [skip ci]
5. Render deploys updated version
6. Users get latest APK ✅

### Manual Trigger:
GitHub → Actions → "Build Android APK" → Run workflow

---

## 📊 File Locations

```
Project Root/
├── uploads/android-app/
│   ├── ITER-EduHub-release.apk    ← Users download this
│   └── version.json                ← Version metadata
│
├── scripts/
│   └── build-and-deploy-android.js ← Build script
│
└── .github/workflows/
    └── build-android.yml           ← CI/CD workflow
```

---

## ✅ Success Indicators

You'll know it's working when:

✅ Version info shows on landing page
✅ Download button is enabled (not grayed)
✅ Click triggers immediate download
✅ APK installs on Android device
✅ App opens and functions correctly

---

## 📞 Help

**Full Documentation:** `ANDROID_APP_DOWNLOAD_COMPLETE.md`

**Android App Guide:** `android-app/BUILD_GUIDE.md`

**Deployment Guide:** `DEPLOYMENT_GUIDE.md`

---

**Status:** ✅ COMPLETE  
**Last Updated:** October 26, 2025  
**Ready for Production:** YES 🚀
