package com.iter.eduhub

import android.app.DownloadManager
import android.content.Context
import android.net.Uri
import android.os.Environment
import android.widget.Toast
import com.iter.eduhub.utils.Constants

class DownloadHandler(private val context: Context) {

    fun onDownloadStart(
        url: String,
        userAgent: String,
        contentDisposition: String,
        mimeType: String,
        contentLength: Long
    ) {
        try {
            val request = DownloadManager.Request(Uri.parse(url))
            request.setMimeType(mimeType)
            request.addRequestHeader("User-Agent", userAgent)
            request.setDescription("Downloading file...")
            request.setTitle(getFileName(url, contentDisposition))
            request.setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED)
            request.setDestinationInExternalPublicDir(
                Environment.DIRECTORY_DOWNLOADS,
                "${Constants.DOWNLOAD_DIRECTORY}/${getFileName(url, contentDisposition)}"
            )

            val dm = context.getSystemService(Context.DOWNLOAD_SERVICE) as DownloadManager
            dm.enqueue(request)

            Toast.makeText(context, "Downloading...", Toast.LENGTH_SHORT).show()
        } catch (e: Exception) {
            Toast.makeText(context, "Download failed", Toast.LENGTH_SHORT).show()
            e.printStackTrace()
        }
    }

    private fun getFileName(url: String, contentDisposition: String): String {
        var filename = "download"
        
        if (contentDisposition.contains("filename=")) {
            filename = contentDisposition
                .substringAfter("filename=")
                .replace("\"", "")
                .trim()
        } else {
            filename = url.substringAfterLast("/")
                .substringBefore("?")
                .ifEmpty { "download" }
        }
        
        return filename
    }
}
