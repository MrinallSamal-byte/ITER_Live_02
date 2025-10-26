require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const QRCode = require('qrcode');

// Import routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const profileRoutes = require('./routes/profile.routes');
const admitCardRoutes = require('./routes/admitcard.routes');
const attendanceRoutes = require('./routes/attendance.routes');
const marksRoutes = require('./routes/marks.routes');
const fileRoutes = require('./routes/file.routes');
const eventRoutes = require('./routes/event.routes');
const assignmentRoutes = require('./routes/assignment.routes');
const timetableRoutes = require('./routes/timetable.routes');
const hostelRoutes = require('./routes/hostel.routes');
const adminRoutes = require('./routes/admin.routes');
const teacherRoutes = require('./routes/teacher.routes');
const analyticsRoutes = require('./routes/analytics.routes');
const notificationRoutes = require('./routes/notification.routes');
const searchRoutes = require('./routes/search.routes');
const healthRoutes = require('./routes/health.routes');
const bulkRoutes = require('./routes/bulk.routes');
const aiRoutes = require('./routes/ai.routes');
const questionBankRoutes = require('./routes/question-bank.routes');
const rubricRoutes = require('./routes/rubric.routes');
const notesRoutes = require('./routes/notes.routes');

// Import middleware
const errorHandler = require('./middleware/errorHandler');
const { initializeSocket } = require('./socket/socket');

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
const io = socketIo(server, {
  cors: {
    origin: process.env.SOCKET_CORS_ORIGIN || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

initializeSocket(io);

// Make io accessible to routes
app.set('io', io);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disable for development
  crossOriginEmbedderPolicy: false
}));

// CORS configuration
const corsWhitelist = (process.env.CORS_WHITELIST || '').split(',');
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || corsWhitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true); // Allow all in development
    }
  },
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP, please try again later.'
});

app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Ensure all API responses are JSON
app.use('/api', (req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  next();
});

// Compression middleware
app.use(compression());

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/static/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/static', express.static(path.join(__dirname, '../client')));

// Serve client files directly from root
app.use(express.static(path.join(__dirname, '../client')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api', profileRoutes); // Profile routes (includes /api/users/me and /api/profile/*)
app.use('/api/admitcard', admitCardRoutes);
app.use('/api/users', userRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/marks', marksRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/timetable', timetableRoutes);
app.use('/api/hostel', hostelRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/bulk', bulkRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/question-bank', questionBankRoutes);
app.use('/api/rubrics', rubricRoutes);
app.use('/api/notes', notesRoutes);

// Serve landing page (index.html) for root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

// Redirect /home to landing page
app.get('/home', (req, res) => {
  res.redirect('/');
});

// Serve static HTML pages
app.get('/about', (req, res) => {
  res.redirect('/#about');
});

app.get('/features', (req, res) => {
  res.redirect('/#features');
});

app.get('/academics', (req, res) => {
  res.redirect('/#academics');
});

app.get('/contact', (req, res) => {
  res.redirect('/#contact');
});

// Android App Download Endpoint
app.get('/api/download-app', (req, res) => {
  const externalApkUrl = process.env.ANDROID_APK_URL;
  const apkPath = path.join(__dirname, '../uploads/android-app/ITER-EduHub-release.apk');

  // If an external URL is configured, redirect to it
  if (externalApkUrl && /^https?:\/\//i.test(externalApkUrl)) {
    return res.redirect(302, externalApkUrl);
  }

  // Otherwise, serve local APK if present
  if (!require('fs').existsSync(apkPath)) {
    return res.status(404).json({
      success: false,
      message: 'Android app not available for download yet. Please check back later.'
    });
  }

  // Set proper headers for APK download
  res.setHeader('Content-Type', 'application/vnd.android.package-archive');
  res.setHeader('Content-Disposition', 'attachment; filename="ITER-EduHub.apk"');
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // Send the file
  res.sendFile(apkPath, (err) => {
    if (err) {
      console.error('Error sending APK file:', err);
      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          message: 'Error downloading the app. Please try again later.'
        });
      }
    }
  });
});

// Get Android App Version Info
app.get('/api/app-version', (req, res) => {
  const externalApkUrl = process.env.ANDROID_APK_URL;
  const versionPath = path.join(__dirname, '../uploads/android-app/version.json');

  // If external URL configured, expose version info from env when available
  if (externalApkUrl && /^https?:\/\//i.test(externalApkUrl)) {
    const version = process.env.ANDROID_APK_VERSION || '1.0.0';
    const fileSizeRaw = parseInt(process.env.ANDROID_APK_SIZE_BYTES || '0', 10);
    const fileSize = Number.isFinite(fileSizeRaw) && fileSizeRaw > 0 ? fileSizeRaw : 0;
    return res.json({
      success: true,
      available: true,
      version,
      fileSize
    });
  }

  // Fallback to local version.json
  if (!require('fs').existsSync(versionPath)) {
    return res.json({
      success: true,
      available: false,
      message: 'Android app coming soon!'
    });
  }

  try {
    const versionData = JSON.parse(require('fs').readFileSync(versionPath, 'utf8'));
    res.json({
      success: true,
      available: true,
      ...versionData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching app version information'
    });
  }
});

// Generate a QR code PNG for the download URL
app.get('/api/download-qr', async (req, res) => {
  try {
    const downloadUrl = `${req.protocol}://${req.get('host')}/api/download-app`;
    const png = await QRCode.toBuffer(downloadUrl, { type: 'png', width: 400, margin: 1 });
    res.setHeader('Content-Type', 'image/png');
    res.send(png);
  } catch (err) {
    console.error('QR code generation error:', err);
    res.status(500).json({ success: false, message: 'Failed to generate QR code' });
  }
});

// Simple download helper page with QR code
app.get('/download', (req, res) => {
  const externalApkUrl = process.env.ANDROID_APK_URL;
  const apkPath = path.join(__dirname, '../uploads/android-app/ITER-EduHub-release.apk');
  const hasLocalApk = require('fs').existsSync(apkPath);
  const available = (externalApkUrl && /^https?:\/\//i.test(externalApkUrl)) || hasLocalApk;

  const html = `<!doctype html>
  <html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Download ITER EduHub</title>
    <style>
      body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;background:#0b1120;color:#e5e7eb;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0}
      .card{background:#111827;border:1px solid #1f2937;border-radius:12px;padding:24px;max-width:520px;text-align:center;box-shadow:0 10px 30px rgba(0,0,0,.4)}
      .btn{display:inline-block;padding:12px 18px;border-radius:10px;background:#6d28d9;color:white;text-decoration:none;font-weight:600}
      .muted{color:#9ca3af;font-size:14px;margin-top:10px}
      img{border-radius:8px;border:1px solid #1f2937}
    </style>
  </head>
  <body>
    <div class="card">
      <h1>ITER EduHub – Android APK</h1>
      ${available ? `
        <p>Scan the QR code or tap the button below to download.</p>
        <p><img src="/api/download-qr" alt="Download QR" width="200" height="200" /></p>
        <p><a class="btn" href="/api/download-app">Download APK</a></p>
        <p class="muted">If prompted, allow installs from unknown sources.</p>
      ` : `
        <p>Android app is not available yet.</p>
        <p class="muted">Please check back soon.</p>
      `}
    </div>
  </body>
  </html>`;

  res.setHeader('Content-Type', 'text/html');
  res.send(html);
});

// 404 handler for API routes only
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Catch-all error handler to ensure JSON responses
app.use((err, req, res, next) => {
  if (!res.headersSent) {
    res.setHeader('Content-Type', 'application/json');
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || 'Internal Server Error'
    });
  }
});

// Start server
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════╗
║   ITER College Management System                     ║
║   Server running on port ${PORT}                        ║
║   Environment: ${process.env.NODE_ENV || 'development'}                      ║
║   Socket.IO: Enabled                                  ║
╚═══════════════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, closing server gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

module.exports = { app, server, io };
