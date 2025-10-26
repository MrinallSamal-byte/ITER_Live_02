package com.iter.eduhub

import android.net.Uri
import android.webkit.ValueCallback
import android.webkit.WebChromeClient
import android.webkit.WebView
import androidx.appcompat.app.AppCompatActivity

class CustomWebChromeClient(
    private val activity: AppCompatActivity,
    private val onShowFileChooser: (ValueCallback<Array<Uri>>?, FileChooserParams?) -> Unit
) : WebChromeClient() {

    override fun onProgressChanged(view: WebView?, newProgress: Int) {
        super.onProgressChanged(view, newProgress)
    }

    override fun onShowFileChooser(
        webView: WebView?,
        filePathCallback: ValueCallback<Array<Uri>>?,
        fileChooserParams: FileChooserParams?
    ): Boolean {
        onShowFileChooser(filePathCallback, fileChooserParams)
        return true
    }

    override fun onReceivedTitle(view: WebView?, title: String?) {
        super.onReceivedTitle(view, title)
        activity.title = title ?: "ITER EduHub"
    }
}
