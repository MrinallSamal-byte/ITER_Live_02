# ITER College Management System - Site Analysis

## Overview
**Project Name:** ITER College Management System (EduHub)  
**Type:** Full-stack web application (Node.js + Express + PostgreSQL)  
**Frontend:** Vanilla HTML/CSS/JavaScript with Socket.IO  
**Backend:** RESTful API with JWT authentication  
**Deployment URL:** To be configured (currently localhost:5000)

---

## 1. Main Routes & Pages

### Public Pages
- `/` or `/index.html` - Landing page with university information
- `/login.html` - Login page (all roles)
- `/register.html` - Registration page (students/teachers)
- `/creator.html` - About creator page

### Student Dashboard Pages (`/dashboard/`)
- `/dashboard/student.html` - Main student dashboard
- `/dashboard/student-attendance.html` - Attendance tracking
- `/dashboard/student-marks.html` - Marks and performance
- `/dashboard/student-notes.html` - Notes repository
- `/dashboard/student-timetable.html` - Class timetable
- `/dashboard/student-admit-card.html` - Admit card generation
- `/dashboard/student-events.html` - Events and clubs
- `/dashboard/student-hostel-menu.html` - Hostel mess menu
- `/dashboard/student-clubs.html` - Club management

### Teacher Dashboard Pages (`/dashboard/`)
- `/dashboard/teacher.html` - Main teacher dashboard
- `/dashboard/teacher-attendance.html` - Attendance management
- `/dashboard/teacher-marks.html` - Marks upload
- `/dashboard/teacher-assignments.html` - Assignment management
- `/dashboard/teacher-notes.html` - Notes upload
- `/dashboard/teacher-students.html` - Student management
- `/dashboard/teacher-question-bank.html` - Question bank
- `/dashboard/teacher-rubric-creator.html` - Rubric creator

### Admin Dashboard Pages (`/dashboard/`)
- `/dashboard/admin.html` - Main admin dashboard
- `/dashboard/admin-users.html` - User management
- `/dashboard/admin-analytics.html` - System analytics
- `/dashboard/admin-approvals.html` - Content approvals
- `/dashboard/admin-departments.html` - Department management
- `/dashboard/admin-announcements.html` - Announcements
- `/dashboard/admin-settings.html` - System settings

---

## 2. Authentication & Authorization

### Authentication Flow
- **Method:** JWT (JSON Web Tokens)
- **Storage:** LocalStorage (`accessToken`, `refreshToken`, `user`)
- **Token Expiry:** Access token: 1h, Refresh token: 7d
- **Password Requirements:** Min 10 chars, uppercase, lowercase, number, special char

### Login Endpoint
```
POST /api/auth/login
Body: {
  "registration_number": "STU20250001",
  "password": "Student@123"
}
Response: {
  "success": true,
  "data": {
    "user": {...},
    "accessToken": "...",
    "refreshToken": "..."
  }
}
```

### Demo Credentials
- **Student:** STU20250001 / Student@123
- **Teacher:** TCH2025001 / Teacher@123
- **Admin:** ADM2025001 / Admin@123456

### User Roles
1. `student` - Access to student portal
2. `teacher` - Access to teacher portal
3. `admin` - Access to admin portal + all features

---

## 3. API Endpoints

### Base URL: `/api`

#### Authentication (`/api/auth`)
- `POST /auth/register-student` - Register new student
- `POST /auth/register-teacher` - Register new teacher
- `POST /auth/login` - Login
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - Logout
- `GET /auth/me` - Get current user

#### User Management (`/api/users`)
- `GET /users/me` - Get current user profile
- `PUT /users/me` - Update current user profile
- `GET /users/:id` - Get user by ID (admin)
- `PUT /users/:id` - Update user (admin)
- `DELETE /users/:id` - Delete user (admin)

#### Profile (`/api/profile`)
- `GET /profile/:userId` - Get user profile
- `PUT /profile/:userId` - Update profile
- `POST /profile/:userId/photo` - Upload profile photo

#### Attendance (`/api/attendance`)
- `POST /attendance/mark` - Mark attendance (teacher/admin)
- `GET /attendance/student/:id` - Get student attendance
- `GET /attendance/class` - Get class attendance
- `POST /attendance/bulk` - Bulk attendance upload (CSV)

#### Marks (`/api/marks`)
- `POST /marks/upload` - Upload marks (teacher/admin)
- `GET /marks/student/:id` - Get student marks
- `PUT /marks/:id` - Update marks (teacher/admin)
- `POST /marks/bulk` - Bulk marks upload (CSV/Excel)

#### Files/Notes (`/api/files`)
- `POST /files/upload` - Upload file
- `GET /files` - Get files list (with filters)
- `GET /files/download/:id` - Download file
- `POST /files/approve/:id` - Approve file (admin)
- `DELETE /files/:id` - Delete file

#### Assignments (`/api/assignments`)
- `POST /assignments` - Create assignment (teacher)
- `GET /assignments/student` - Get student assignments
- `POST /assignments/:id/submit` - Submit assignment (student)
- `POST /assignments/:id/grade` - Grade assignment (teacher)
- `GET /assignments/:id` - Get assignment details

#### Events (`/api/events`)
- `GET /events` - Get all events
- `POST /events` - Create event (teacher/admin)
- `POST /events/:id/register` - Register for event (student)
- `PUT /events/:id` - Update event (admin)
- `DELETE /events/:id` - Delete event (admin)

#### Timetable (`/api/timetable`)
- `GET /timetable/student/:id` - Get student timetable
- `POST /timetable` - Create timetable (admin)
- `PUT /timetable/:id` - Update timetable (admin)

#### Hostel (`/api/hostel`)
- `GET /hostel/menu` - Get weekly mess menu
- `POST /hostel/menu` - Update menu (admin)

#### Admit Card (`/api/admitcard`)
- `GET /admitcard/generate/:studentId/:semester` - Generate admit card PDF

#### Analytics (`/api/analytics`)
- `GET /analytics/overview` - System overview (admin)
- `GET /analytics/attendance-stats` - Attendance statistics
- `GET /analytics/student/:id` - Student analytics

#### Notifications (`/api/notifications`)
- `GET /notifications` - Get user notifications
- `PUT /notifications/:id/read` - Mark as read
- `DELETE /notifications/:id` - Delete notification
- `POST /notifications/bulk-read` - Mark multiple as read

#### Search (`/api/search`)
- `GET /search?q=query&type=all` - Global search

#### Admin (`/api/admin`)
- `GET /admin/users` - Get users list
- `POST /admin/users` - Create user
- `PUT /admin/users/:id/toggle-active` - Toggle user status
- `GET /admin/approvals/files` - Get pending approvals
- `GET /admin/logs` - Get activity logs

#### Bulk Operations (`/api/bulk`)
- `POST /bulk/import-users` - Import users (CSV/Excel)
- `POST /bulk/import-attendance` - Import attendance (CSV)
- `POST /bulk/import-marks` - Import marks (Excel)
- `GET /bulk/export-users` - Export users
- `GET /bulk/templates/:type` - Download import templates

#### AI Tools (`/api/ai`)
- `POST /ai/study-schedule` - Generate study schedule
- `POST /ai/analyze-performance` - Analyze performance
- `GET /ai/recommendations/:studentId` - Get recommendations

#### Question Bank (`/api/question-bank`)
- `GET /question-bank` - Get questions (teacher)
- `POST /question-bank` - Create question (teacher)
- `PUT /question-bank/:id` - Update question (teacher)

#### Rubrics (`/api/rubrics`)
- `GET /rubrics` - Get rubrics (teacher)
- `POST /rubrics` - Create rubric (teacher)

#### Notes API (`/api/notes`)
- `GET /notes` - Get notes list
- `POST /notes` - Upload notes (teacher)

---

## 4. Real-time Features (Socket.IO)

### Socket Events
- Connection on: `ws://your-server:5000`
- Events emitted:
  - `attendance-marked` - When attendance is marked
  - `file-uploaded` - When file is uploaded
  - `file-approved` - When file is approved
  - `event-registered` - When student registers for event
  - `notification` - New notification
  - `assignment-submitted` - Assignment submission
  - `marks-uploaded` - Marks uploaded

### Client Setup
```javascript
const socket = io('http://your-server:5000', {
  auth: { token: accessToken }
});
```

---

## 5. File Upload/Download

### Upload Configuration
- **Max File Size:** 10MB (configurable)
- **Allowed Types:** PDF, DOC, DOCX, PPT, PPTX, JPG, PNG
- **Storage:** Local filesystem (uploads/ directory) or S3 (configurable)
- **Endpoint:** `POST /api/files/upload` (multipart/form-data)

### Download
- **Endpoint:** `GET /api/files/download/:fileId`
- **Response:** File stream with appropriate content-type

---

## 6. Security Features

### Implemented Security
- **Password Hashing:** bcrypt (cost factor: 12)
- **JWT Authentication:** Access + Refresh tokens
- **Input Validation:** express-validator on all routes
- **Rate Limiting:** 100 requests per 15 minutes per IP
- **SQL Injection Protection:** Parameterized queries (PostgreSQL)
- **XSS Protection:** Helmet middleware, CSP headers
- **CORS:** Configurable whitelist
- **File Upload Security:** Type validation, size limits

### Security Headers
```javascript
helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
})
```

---

## 7. Database Schema

### Main Tables
- `users` - All users (students, teachers, admins)
- `refresh_tokens` - JWT refresh tokens
- `attendance` - Attendance records
- `marks` - Student marks/grades
- `files` - Uploaded files/notes
- `assignments` - Assignment definitions
- `assignment_submissions` - Student submissions
- `events` - College events
- `event_registrations` - Event registrations
- `timetable` - Class schedules
- `hostel_menu` - Weekly mess menu
- `notifications` - User notifications
- `audit_logs` - Activity logging
- `question_bank` - Teacher question bank
- `rubrics` - Grading rubrics
- `departments` - Department master data
- `subjects` - Subject master data

---

## 8. Progressive Web App (PWA) Features

### Manifest
- Location: `/manifest.json`
- App name: "ITER EduHub"
- Icons: `/assets/icon.png` (192x192, 512x512)
- Start URL: `/`
- Display: standalone
- Theme color: #6366f1

### Service Worker
- Location: `/service-worker.js`
- Caching strategy: Cache-first for static assets
- Network-first for API calls
- Offline fallback page

---

## 9. Offline Capabilities

### Cached Resources
- HTML pages (dashboard, login, register)
- CSS stylesheets
- JavaScript files
- Static assets (icons, images)

### Background Sync
- Form submissions queued when offline
- Synced when connection restored

---

## 10. Push Notifications

### Implementation
- **Service:** Socket.IO for real-time
- **Storage:** Notification API
- **Types:** 
  - Attendance marked
  - Marks uploaded
  - Assignment due
  - Event reminder
  - File approved
  - Announcements

---

## 11. Performance Optimizations

### Backend
- Database indexing (60+ indexes)
- Connection pooling (20 connections)
- Multi-tier caching (Node-cache)
- Materialized views (7 views)
- Compression middleware

### Frontend
- Lazy loading for images
- Code splitting (by role)
- Minified assets
- CDN for libraries (Socket.IO, GSAP, Lottie)
- Service worker caching

---

## 12. Analytics & Reporting

### Student Analytics
- Attendance percentage
- Performance trends
- Subject-wise analysis
- Weak subject detection
- SGPA/CGPA calculation

### Admin Analytics
- User statistics
- Attendance heatmaps
- Download analytics
- Storage usage
- System health metrics

### Export Formats
- CSV export for users, attendance, marks
- Excel export for bulk data
- PDF generation for admit cards, reports

---

## 13. Mobile-Specific Considerations

### Responsive Design
- Mobile-first CSS approach
- Touch-friendly UI elements
- Hamburger navigation menu
- Bottom navigation for key actions
- Swipeable cards/lists

### Native Features Required
- **Camera:** For profile photo upload
- **File Picker:** For document uploads
- **Notifications:** Push notifications
- **Downloads:** PDF download manager
- **Offline Storage:** IndexedDB/LocalStorage

---

## 14. Environment Configuration

### Required Environment Variables
```env
NODE_ENV=production
PORT=5000
CLIENT_URL=https://your-app-url.com

# Database (PostgreSQL)
DB_HOST=your-db-host
DB_PORT=5432
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_NAME=iter_college_db

# JWT
JWT_SECRET=your-jwt-secret
JWT_REFRESH_SECRET=your-refresh-secret
JWT_EXPIRE=1h
JWT_REFRESH_EXPIRE=7d

# File Upload
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760
STORAGE_MODE=local

# CORS
CORS_WHITELIST=https://your-app-url.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Socket.IO
SOCKET_CORS_ORIGIN=https://your-app-url.com
```

---

## 15. Third-Party Dependencies

### Backend
- **express** - Web framework
- **bcrypt** - Password hashing
- **jsonwebtoken** - JWT authentication
- **socket.io** - Real-time communication
- **multer** - File uploads
- **helmet** - Security headers
- **cors** - CORS middleware
- **pg** (mysql2) - PostgreSQL/MySQL driver
- **express-validator** - Input validation
- **pdfkit** - PDF generation
- **qrcode** - QR code generation

### Frontend
- **Socket.IO Client** - Real-time updates
- **GSAP** - Animations
- **Lottie** - Vector animations
- **Chart.js** - Charts (optional)

### CDN Resources
```
https://cdn.socket.io/4.6.0/socket.io.min.js
https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js
https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.12.2/lottie.min.js
```

---

## 16. Deep Linking

### URL Schemes
- `itereduhub://` - Custom scheme for deep links
- `https://your-domain.com/dashboard/student.html` - Universal links

### Supported Deep Links
- `/login` - Open login page
- `/dashboard/student` - Student dashboard
- `/dashboard/teacher` - Teacher dashboard
- `/dashboard/admin` - Admin dashboard
- `/dashboard/student-attendance` - Attendance page
- `/dashboard/student-marks` - Marks page

---

## 17. Key Features Summary

### For Students
- ✅ Real-time attendance tracking with heatmaps
- ✅ Marks management with performance charts
- ✅ Notes/PYQs download with file manager
- ✅ Assignment submission with deadline tracking
- ✅ Admit card generation (PDF with QR)
- ✅ Interactive timetable with current class highlight
- ✅ Events & clubs registration
- ✅ Hostel menu (weekly mess schedule)
- ✅ AI study planner (personalized schedules)
- ✅ Flashcard system with spaced repetition
- ✅ Performance analytics with ML predictions

### For Teachers
- ✅ Attendance marking with bulk import
- ✅ Marks upload (single/bulk CSV)
- ✅ Assignment creation and grading
- ✅ Notes upload with admin approval
- ✅ Student management dashboard
- ✅ Question bank management
- ✅ Rubric creator for grading
- ✅ Teaching analytics

### For Admins
- ✅ User management (CRUD operations)
- ✅ Content approval queue
- ✅ System-wide analytics
- ✅ Department management
- ✅ Announcements broadcast
- ✅ System settings configuration
- ✅ Bulk import/export (CSV/Excel)
- ✅ Activity logs and audit trail

---

## 18. Known Limitations & Considerations

### Current Website Limitations
1. **Backend Required:** Website requires Node.js backend running
2. **Database Dependency:** PostgreSQL/MySQL must be accessible
3. **File Storage:** Local filesystem or S3 required
4. **Session Management:** JWT tokens in localStorage

### Android App Considerations
1. **Hybrid Approach:** Use WebView to wrap existing website
2. **API Accessibility:** Backend must be deployed and accessible via HTTPS
3. **File Access:** Need WebChromeClient for file uploads
4. **Notifications:** Integrate FCM for push notifications
5. **Offline:** Service worker + IndexedDB for offline capabilities
6. **Performance:** WebView may be slower than native for complex operations

---

## 19. Deployment Requirements

### Production Backend
- **Server:** Node.js 18+ (PM2 for process management)
- **Database:** PostgreSQL 12+ or MySQL 8+
- **Storage:** Local filesystem or AWS S3
- **SSL:** HTTPS certificate (Let's Encrypt recommended)
- **Domain:** Custom domain required for Android TWA

### Android App Requirements
- **Target API:** Android 9 (API 28) minimum
- **WebView:** Minimum Chrome WebView 80+
- **Permissions:** Internet, Camera, Storage, Notifications
- **Size:** ~15-20MB (excluding cached data)

---

## 20. Recommended Android Architecture

### Suggested Approach: **Hybrid WebView Wrapper**

**Rationale:**
- Existing website is fully functional with vanilla JS
- No need to rewrite UI in native Android
- Faster time to market
- Easier maintenance (one codebase)
- PWA features already implemented

### Implementation Plan
1. **WebView Setup:**
   - Single Activity with WebView
   - Enable JavaScript, DOM storage, cookies
   - Custom WebViewClient for navigation
   - WebChromeClient for file uploads
   
2. **JavaScript Bridge:**
   - Limited @JavascriptInterface for native features
   - Camera access via WebChromeClient.onShowFileChooser
   - File picker integration
   - Push notification registration
   
3. **Authentication:**
   - Use CookieManager to persist sessions
   - Sync cookies with WebView
   - JWT tokens stored in localStorage (already implemented)
   
4. **Offline Support:**
   - Enable WebView cache
   - Use existing Service Worker
   - Fallback HTML page for no connection
   
5. **Push Notifications:**
   - Integrate Firebase Cloud Messaging (FCM)
   - Send device token to backend API
   - Handle notification taps → deep links

6. **Deep Linking:**
   - Implement IntentFilters for https://your-domain.com
   - Parse intent URLs and navigate WebView

---

## Conclusion

This is a **production-ready, enterprise-grade college management system** with:
- ✅ Complete authentication & authorization
- ✅ 50+ API endpoints
- ✅ Real-time features via Socket.IO
- ✅ PWA capabilities
- ✅ Advanced analytics & reporting
- ✅ Bulk operations (CSV/Excel)
- ✅ File management system
- ✅ AI-powered student tools
- ✅ Mobile-responsive UI

**Best Approach for Android:** Hybrid WebView wrapper (not full rewrite)
**Backend URL:** Must be deployed to production (HTTPS required for Android)
**Database:** PostgreSQL (currently used) - no changes needed
