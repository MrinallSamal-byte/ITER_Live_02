package com.iter.eduhub

import android.Manifest
import android.annotation.SuppressLint
import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.webkit.*
import android.widget.Toast
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout
import com.iter.eduhub.utils.Constants
import com.iter.eduhub.utils.NetworkUtils

class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView
    private lateinit var swipeRefreshLayout: SwipeRefreshLayout
    private var filePathCallback: ValueCallback<Array<Uri>>? = null
    private var lastBackPressTime: Long = 0

    private val cameraPermissionLauncher = registerForActivityResult(
        ActivityResultContracts.RequestPermission()
    ) { isGranted ->
        if (!isGranted) {
            Toast.makeText(this, "Camera permission required", Toast.LENGTH_SHORT).show()
        }
    }

    private val filePickerLauncher = registerForActivityResult(
        ActivityResultContracts.StartActivityForResult()
    ) { result ->
        if (result.resultCode == RESULT_OK) {
            filePathCallback?.onReceiveValue(
                WebChromeClient.FileChooserParams.parseResult(result.resultCode, result.data)
            )
        } else {
            filePathCallback?.onReceiveValue(null)
        }
        filePathCallback = null
    }

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        webView = findViewById(R.id.webView)
        swipeRefreshLayout = findViewById(R.id.swipeRefreshLayout)

        setupWebView()
        swipeRefreshLayout.setOnRefreshListener { webView.reload() }
        requestPermissions()
        handleIntent(intent)

        val startUrl = intent.getStringExtra("url") ?: Constants.BASE_URL
        if (NetworkUtils.isNetworkAvailable(this)) {
            webView.loadUrl(startUrl)
        } else {
            loadOfflinePage()
        }
    }

    @SuppressLint("SetJavaScriptEnabled")
    private fun setupWebView() {
        webView.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            databaseEnabled = true
            allowFileAccess = true
            allowContentAccess = true
            
            // Enhanced caching for performance and offline support
            cacheMode = if (NetworkUtils.isNetworkAvailable(this@MainActivity)) {
                WebSettings.LOAD_DEFAULT
            } else {
                WebSettings.LOAD_CACHE_ELSE_NETWORK
            }
            
            // Enable various web features
            setSupportZoom(false)
            loadWithOverviewMode = true
            useWideViewPort = true
            
            // Security and performance
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                mixedContentMode = WebSettings.MIXED_CONTENT_COMPATIBILITY_MODE
            }
            
            // Modern user agent
            userAgentString = "$userAgentString ITEREduHub/1.0 Android/${Build.VERSION.RELEASE}"
            
            // Additional performance optimizations
            setRenderPriority(WebSettings.RenderPriority.HIGH)
            setGeolocationEnabled(false)  // Disable if not needed
        }

        webView.addJavascriptInterface(WebAppInterface(this, webView), "Android")
        webView.webViewClient = CustomWebViewClient(this) { 
            swipeRefreshLayout.isRefreshing = true 
        }
        webView.webChromeClient = CustomWebChromeClient(this) { cb, params ->
            filePathCallback = cb
            handleFileChooser(params)
        }
        webView.setDownloadListener { url, ua, cd, mime, len ->
            DownloadHandler(this).onDownloadStart(url, ua, cd, mime, len)
        }

        CookieManager.getInstance().setAcceptCookie(true)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            CookieManager.getInstance().setAcceptThirdPartyCookies(webView, true)
        }
    }

    private fun handleFileChooser(params: WebChromeClient.FileChooserParams?) {
        params ?: return
        try {
            if (params.acceptTypes.contains("image/*")) requestCameraPermission()
            filePickerLauncher.launch(params.createIntent())
        } catch (e: Exception) {
            Toast.makeText(this, "Cannot open file chooser", Toast.LENGTH_SHORT).show()
            filePathCallback?.onReceiveValue(null)
            filePathCallback = null
        }
    }

    private fun requestPermissions() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.CAMERA) 
                != PackageManager.PERMISSION_GRANTED) {
                cameraPermissionLauncher.launch(Manifest.permission.CAMERA)
            }
        }
    }

    private fun requestCameraPermission() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M &&
            ContextCompat.checkSelfPermission(this, Manifest.permission.CAMERA)
            != PackageManager.PERMISSION_GRANTED) {
            cameraPermissionLauncher.launch(Manifest.permission.CAMERA)
        }
    }

    private fun loadOfflinePage() {
        val html = """<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width,initial-scale=1.0"><style>body{font-family:-apple-system,sans-serif;display:flex;justify-content:center;align-items:center;min-height:100vh;margin:0;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:white;text-align:center;padding:20px}.container{max-width:400px}.icon{font-size:80px;margin-bottom:20px}h1{font-size:24px;margin-bottom:10px}p{font-size:16px;opacity:.9;margin-bottom:30px}button{background:white;color:#667eea;border:none;padding:15px 40px;font-size:16px;font-weight:600;border-radius:30px;cursor:pointer;box-shadow:0 4px 15px rgba(0,0,0,.2)}button:active{transform:scale(.98)}</style></head><body><div class="container"><div class="icon">📡</div><h1>No Internet Connection</h1><p>Please check your connection and try again.</p><button onclick="location.reload()">Retry</button></div></body></html>"""
        webView.loadDataWithBaseURL(null, html, "text/html", "UTF-8", null)
    }

    override fun onNewIntent(intent: Intent?) {
        super.onNewIntent(intent)
        intent?.let { handleIntent(it) }
    }

    private fun handleIntent(intent: Intent) {
        when (intent.action) {
            Intent.ACTION_VIEW -> intent.data?.let { webView.loadUrl(it.toString()) }
        }
        intent.extras?.getString("url")?.let { webView.loadUrl(it) }
    }

    @Deprecated("Deprecated in Java")
    override fun onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack()
        } else if (System.currentTimeMillis() - lastBackPressTime < 2000) {
            super.onBackPressed()
        } else {
            lastBackPressTime = System.currentTimeMillis()
            Toast.makeText(this, "Press back again to exit", Toast.LENGTH_SHORT).show()
        }
    }

    override fun onResume() {
        super.onResume()
        webView.onResume()
    }

    override fun onPause() {
        super.onPause()
        webView.onPause()
    }

    override fun onDestroy() {
        super.onDestroy()
        webView.destroy()
    }
}
