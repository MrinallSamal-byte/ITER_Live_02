# 📱 Android App Download Setup Guide

## Quick Setup (3 Options)

### Option 1: Use External APK URL (Recommended - Fastest)

If you have your APK hosted externally (GitHub Releases, Google Drive, Dropbox, etc.):

1. **Get a direct download link** to your APK file
   - GitHub Releases: `https://github.com/username/repo/releases/download/v1.0.0/app.apk`
   - Google Drive: Use direct download link (not share link)
   - Dropbox: Change `?dl=0` to `?dl=1` at the end
   - Any CDN or file hosting

2. **Add to your `.env` file:**
   ```bash
   ANDROID_APK_URL=https://your-direct-link-here.apk
   ANDROID_APK_VERSION=1.0.0
   ANDROID_APK_SIZE_BYTES=15728640
   ```

3. **Restart the server:**
   ```powershell
   npm start
   ```

4. **Test it:**
   - Open: http://localhost:5000
   - Scroll to "Android App" card
   - Click "Download APK" button
   - Should start downloading immediately!

---

### Option 2: Build APK from Source

If you have Android SDK installed:

1. **Run the build script:**
   ```powershell
   npm run build:android-apk
   ```

2. **This will:**
   - Build the APK using Gradle
   - Copy to `uploads/android-app/ITER-EduHub-release.apk`
   - Create `uploads/android-app/version.json`
   - Enable the download button automatically

3. **Restart and test:**
   ```powershell
   npm start
   ```

---

### Option 3: Use a Demo/Placeholder APK

For testing purposes, you can use any APK file:

1. **Download any Android APK** (or use an existing one)

2. **Copy it to:**
   ```
   uploads/android-app/ITER-EduHub-release.apk
   ```

3. **The version.json file is already created**, just restart:
   ```powershell
   npm start
   ```

---

## Testing the Download

### Local Testing:
```powershell
# Start server
npm start

# Open in browser
# http://localhost:5000

# OR use the dedicated download page:
# http://localhost:5000/download
```

### Test on Android Phone:

1. **Connect phone to same WiFi as your PC**

2. **Find your PC's IP address:**
   ```powershell
   ipconfig
   # Look for IPv4 Address (e.g., 192.168.1.100)
   ```

3. **On your phone's browser, open:**
   ```
   http://YOUR-PC-IP:5000
   ```
   Example: `http://192.168.1.100:5000`

4. **Or scan QR code:**
   ```
   http://YOUR-PC-IP:5000/download
   ```

5. **Click "Download APK"**
   - APK will download to your phone
   - Open the APK file
   - Tap "Install"
   - Allow installation from unknown sources if prompted
   - Done! 🎉

---

## Available Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /api/download-app` | Downloads the APK file |
| `GET /api/app-version` | Returns version info JSON |
| `GET /api/download-qr` | QR code image for download URL |
| `GET /download` | Simple download page with QR code |

---

## Troubleshooting

### Button shows "Coming Soon"
- **Cause:** No APK configured
- **Fix:** Set `ANDROID_APK_URL` in .env OR place APK file in `uploads/android-app/`

### Download doesn't start
- **Cause:** Link might be incorrect
- **Fix:** Test the endpoint directly:
  ```powershell
  Invoke-WebRequest http://localhost:5000/api/app-version
  ```

### Can't install on Android
- **Cause:** Security settings
- **Fix:** Enable "Install from Unknown Sources" in Android Settings → Security

### Phone can't access local server
- **Cause:** Firewall or different network
- **Fix:** 
  - Ensure phone and PC on same WiFi
  - Add firewall rule for port 5000:
    ```powershell
    New-NetFirewallRule -DisplayName "Node Server" -Direction Inbound -LocalPort 5000 -Protocol TCP -Action Allow
    ```

---

## Production Deployment

When deploying to Render, Vercel, or other platforms:

1. **Upload APK to cloud storage** (recommended)
2. **Set environment variables** in platform settings:
   ```
   ANDROID_APK_URL=https://your-cdn.com/app.apk
   ANDROID_APK_VERSION=1.0.0
   ANDROID_APK_SIZE_BYTES=15728640
   ```
3. **Deploy** and test with your production URL

---

## Example: Using GitHub Releases

1. **Create a release on GitHub:**
   ```powershell
   git tag v1.0.0
   git push origin v1.0.0
   ```

2. **Upload your APK to the release**

3. **Get the download URL:**
   ```
   https://github.com/MrinallSamal-byte/ITER_Live_02/releases/download/v1.0.0/ITER-EduHub.apk
   ```

4. **Add to .env:**
   ```bash
   ANDROID_APK_URL=https://github.com/MrinallSamal-byte/ITER_Live_02/releases/download/v1.0.0/ITER-EduHub.apk
   ANDROID_APK_VERSION=1.0.0
   ANDROID_APK_SIZE_BYTES=15728640
   ```

---

## Quick Commands Reference

```powershell
# Start server
npm start

# Build APK (requires Android SDK)
npm run build:android-apk

# Check version endpoint
Invoke-WebRequest http://localhost:5000/api/app-version | Select-Object -ExpandProperty Content

# Test download
Invoke-WebRequest http://localhost:5000/api/download-app -OutFile test.apk

# Get your PC's IP
ipconfig | Select-String "IPv4"

# Open firewall for phone access
New-NetFirewallRule -DisplayName "Node Server" -Direction Inbound -LocalPort 5000 -Protocol TCP -Action Allow
```

---

## Need Help?

Check the main documentation: `ANDROID_APP_DOWNLOAD_README.md`
