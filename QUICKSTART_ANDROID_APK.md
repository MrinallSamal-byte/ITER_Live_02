# 🚀 QUICK START - Make Download Button Work NOW!

## The download button shows "Coming Soon" because no APK is configured yet.

### ⚡ Fastest Solution (2 minutes):

#### Option A: Use an External APK URL

1. **Open your `.env` file and add:**
   ```bash
   # Use any of these examples, or your own APK URL:
   
   # Example 1: Public demo APK (replace with your own)
   ANDROID_APK_URL=https://github.com/owner/repo/releases/download/v1.0.0/app.apk
   
   # Example 2: Your own hosted APK
   # ANDROID_APK_URL=https://your-server.com/path/to/app.apk
   
   ANDROID_APK_VERSION=1.0.0
   ANDROID_APK_SIZE_BYTES=15728640
   ```

2. **Restart the server:**
   ```powershell
   npm start
   ```

3. **DONE!** The button will now work and download the APK.

---

#### Option B: Place APK File Locally

1. **Get any Android APK file** (build your own or use a test APK)

2. **Copy it to:**
   ```
   uploads/android-app/ITER-EduHub-release.apk
   ```

3. **Restart server:**
   ```powershell
   npm start
   ```

4. **DONE!** The button will now work.

---

## 📱 Test on Your Phone

1. **Find your PC's IP address:**
   ```powershell
   ipconfig
   ```
   Look for something like: `192.168.1.100`

2. **On your phone's browser, open:**
   ```
   http://192.168.1.100:5000/download
   ```

3. **Click "Download APK"** and install!

---

## 🔥 If you don't have an APK yet:

### Build from source (requires Android SDK):
```powershell
npm run build:android-apk
```

### Or use a public demo APK temporarily:
Just add any working APK download URL to your `.env` as shown above.

---

## Still stuck?

Check: `ANDROID_APK_SETUP_GUIDE.md` for detailed instructions.
