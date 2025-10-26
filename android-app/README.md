# ITER EduHub Android App

Production-grade hybrid Android wrapper for ITER College Management System.

## 🎯 Features

- ✅ Native Android wrapper for existing website
- ✅ Supports Android 9 (API 28) and higher
- ✅ Full WebView integration with JavaScript bridge
- ✅ Camera & file upload support
- ✅ Push notifications via Firebase (FCM)
- ✅ Deep linking support
- ✅ Offline caching
- ✅ Secure cookie & session management
- ✅ Download manager integration
- ✅ No backend modifications required

## 📋 Prerequisites

- **Android Studio:** Arctic Fox or newer
- **JDK:** 11 or higher
- **Min SDK:** 28 (Android 9.0)
- **Target SDK:** 34 (Android 14)
- **Backend URL:** Your deployed ITER backend (HTTPS required)

## 🚀 Quick Start

### 1. Setup Project in Android Studio

1. Open Android Studio
2. Click "Open an Existing Project"
3. Navigate to this `android-app` folder
4. Let Android Studio sync Gradle
5. Wait for dependencies to download

### 2. Configure Backend URL

Edit `app/src/main/java/com/iter/eduhub/utils/Constants.kt`:

```kotlin
const val BASE_URL = "https://your-backend-url.com"
```

Replace with your deployed backend URL.

### 3. Setup Firebase (Optional but Recommended)

For push notifications:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use existing
3. Add Android app with package name: `com.iter.eduhub`
4. Download `google-services.json`
5. Place it in `app/` directory
6. Firebase is already configured in `build.gradle`

### 4. Build & Run

#### Debug Build
```bash
./gradlew assembleDebug
```
Output: `app/build/outputs/apk/debug/app-debug.apk`

#### Release Build
```bash
./gradlew assembleRelease
```
Output: `app/build/outputs/apk/release/app-release.apk`

#### Install on Device
```bash
./gradlew installDebug
```

Or use Android Studio's "Run" button (Shift+F10).

## 📱 Testing

### Device Requirements
- Android 9.0+ (API 28+)
- WebView version 80+
- Internet connection
- Camera permission (for file uploads)
- Storage permission (for downloads)

### Test Scenarios
- [ ] Login with demo credentials
- [ ] Navigate to all dashboard pages
- [ ] Upload profile photo (camera)
- [ ] Upload assignment (file picker)
- [ ] Download PDF (admit card, notes)
- [ ] Receive push notification
- [ ] Test offline mode
- [ ] Test deep links
- [ ] Test back button navigation

## 🏗️ Build Types

### Debug Build
- Debuggable: Yes
- Minify: No
- Shrink resources: No
- Signing: Debug keystore (auto-generated)

### Release Build
- Debuggable: No
- Minify: Yes (R8)
- Shrink resources: Yes
- Signing: Release keystore (requires configuration)
- ProGuard rules applied

## 📦 APK Size Optimization

- Base APK: ~8-10 MB
- With dependencies: ~15-20 MB
- ProGuard/R8 reduces by ~30%
- Resource shrinking reduces by ~20%

## 🔒 Permissions

```xml
<!-- Required -->
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

<!-- File uploads & downloads -->
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />

<!-- Camera for profile photo -->
<uses-permission android:name="android.permission.CAMERA" />

<!-- Push notifications -->
<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
```

## 🛠️ Troubleshooting

### WebView not loading
- Check backend URL in Constants.kt
- Verify HTTPS certificate is valid
- Check network connectivity
- View logs: `adb logcat | grep ITEREduHub`

### File upload not working
- Grant storage & camera permissions
- Check WebChromeClient implementation
- Ensure MIME types are correct

### Push notifications not received
- Verify `google-services.json` is in app/ folder
- Check Firebase project configuration
- Ensure device has Play Services
- Check notification permissions (Android 13+)

### App crashes on startup
- Clear app data: `adb shell pm clear com.iter.eduhub`
- Check logs for stack trace
- Verify all resources are present
- Rebuild project: Build > Clean Project > Rebuild

## 📖 Documentation

- [Site Analysis](./site_analysis.md) - Complete website analysis
- [API Documentation](./API_REFERENCE.md) - Backend API details
- [Security Guide](./SECURITY.md) - Security best practices

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 👥 Credits

- **Backend:** ITER Development Team
- **Android Wrapper:** Hybrid WebView Implementation
- **Design:** Material Design 3

## 📞 Support

For issues and questions:
- GitHub Issues
- Email: support@iter.edu

---

**Built with ❤️ for ITER/SOA University Students**
