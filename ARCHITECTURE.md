# 🏗️ System Architecture - ITER EduHub

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │   Web App    │  │  Mobile PWA  │  │ Desktop App  │              │
│  │  (Browser)   │  │ (Installable)│  │  (Electron)  │              │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘              │
│         │                  │                  │                       │
│         └──────────────────┴──────────────────┘                       │
│                            │                                          │
│              ┌─────────────▼─────────────┐                           │
│              │  Vanilla HTML/CSS/JS      │                           │
│              │  + Chart.js + Socket.IO   │                           │
│              └─────────────┬─────────────┘                           │
└─────────────────────────────┼─────────────────────────────────────────┘
                              │
┌─────────────────────────────▼─────────────────────────────────────────┐
│                      NETWORK LAYER                                     │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  ┌─────────────────┐              ┌──────────────────┐               │
│  │  HTTP/HTTPS     │◄────────────►│   WebSocket      │               │
│  │  (REST API)     │              │  (Socket.IO)     │               │
│  └────────┬────────┘              └────────┬─────────┘               │
└───────────┼────────────────────────────────┼─────────────────────────┘
            │                                │
┌───────────▼────────────────────────────────▼─────────────────────────┐
│                      API GATEWAY / REVERSE PROXY                      │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│         ┌────────────────────────────────────────┐                    │
│         │         Nginx (Production)             │                    │
│         │  - Load Balancing                      │                    │
│         │  - SSL/TLS Termination                 │                    │
│         │  - Static File Serving                 │                    │
│         │  - Rate Limiting                       │                    │
│         └────────────────┬───────────────────────┘                    │
└──────────────────────────┼────────────────────────────────────────────┘
                           │
┌──────────────────────────▼────────────────────────────────────────────┐
│                    APPLICATION LAYER                                   │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  ┌───────────────────────────────────────────────────────────────┐   │
│  │                 Node.js + Express.js Server                    │   │
│  │                                                                 │   │
│  │  ┌──────────────────────────────────────────────────────────┐ │   │
│  │  │              Middleware Stack                             │ │   │
│  │  │  • Helmet (Security Headers)                             │ │   │
│  │  │  • CORS (Cross-Origin)                                   │ │   │
│  │  │  • Express Rate Limit                                    │ │   │
│  │  │  • Body Parser (JSON/URL-encoded)                        │ │   │
│  │  │  • Compression                                           │ │   │
│  │  │  • Morgan (Logging)                                      │ │   │
│  │  │  • Auth Middleware (JWT Verification)                   │ │   │
│  │  │  • Role Middleware (RBAC)                               │ │   │
│  │  │  • Error Handler                                         │ │   │
│  │  └──────────────────────────────────────────────────────────┘ │   │
│  │                                                                 │   │
│  │  ┌──────────────────────────────────────────────────────────┐ │   │
│  │  │                 Route Modules                             │ │   │
│  │  │                                                            │ │   │
│  │  │  /api/auth          - Authentication (login, register)   │ │   │
│  │  │  /api/files         - File upload/download/approve       │ │   │
│  │  │  /api/users         - User profile management            │ │   │
│  │  │  /api/student       - Student-specific endpoints         │ │   │
│  │  │  /api/teacher       - Teacher-specific endpoints         │ │   │
│  │  │  /api/admin         - Admin-specific endpoints           │ │   │
│  │  │  /api/attendance    - Attendance management              │ │   │
│  │  │  /api/marks         - Marks management                   │ │   │
│  │  │  /api/assignments   - Assignment CRUD                    │ │   │
│  │  │  /api/events        - Event management                   │ │   │
│  │  │  /api/timetable     - Timetable management               │ │   │
│  │  │  /api/hostel        - Hostel menu management             │ │   │
│  │  │  /api/analytics     - Analytics & reports                │ │   │
│  │  │                                                            │ │   │
│  │  └──────────────────────────────────────────────────────────┘ │   │
│  │                                                                 │   │
│  │  ┌──────────────────────────────────────────────────────────┐ │   │
│  │  │            Socket.IO Server                               │ │   │
│  │  │  • JWT Authentication                                     │ │   │
│  │  │  • Room-based Events (dept/year/section)                 │ │   │
│  │  │  • Real-time Notifications                               │ │   │
│  │  │  • Broadcast Announcements                               │ │   │
│  │  └──────────────────────────────────────────────────────────┘ │   │
│  └───────────────────────────────────────────────────────────────┘   │
│                                                                        │
└────────────────────────────────┬───────────────────────────────────────┘
                                 │
┌────────────────────────────────▼───────────────────────────────────────┐
│                       DATA LAYER                                        │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌────────────────────────────────────────────────────────────────┐   │
│  │                MySQL Database (mysql2/promise)                  │   │
│  │                                                                  │   │
│  │  ┌─────────────────┐    ┌─────────────────┐                   │   │
│  │  │  Connection     │    │   Tables (15+)  │                   │   │
│  │  │  Pool           │◄───┤   • users       │                   │   │
│  │  │  • min: 2       │    │   • attendance  │                   │   │
│  │  │  • max: 10      │    │   • marks       │                   │   │
│  │  │                 │    │   • files       │                   │   │
│  │  └─────────────────┘    │   • events      │                   │   │
│  │                         │   • assignments │                   │   │
│  │                         │   • timetable   │                   │   │
│  │                         │   • hostel_menu │                   │   │
│  │                         │   • admit_cards │                   │   │
│  │                         │   • clubs       │                   │   │
│  │                         │   • announcements│                  │   │
│  │                         │   • activity_log│                   │   │
│  │                         │   • ... more    │                   │   │
│  │                         └─────────────────┘                   │   │
│  └────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
                                 │
┌────────────────────────────────▼────────────────────────────────────────┐
│                       FILE STORAGE LAYER                                 │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │                    Local File System                            │    │
│  │                                                                  │    │
│  │  /uploads/                   - User uploaded files              │    │
│  │  /server/seed/uploads/       - Seed sample files                │    │
│  │  /backups/                   - Database backups                 │    │
│  │                                                                  │    │
│  │  Future: S3/CloudStorage abstraction ready                      │    │
│  └────────────────────────────────────────────────────────────────┘    │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## Authentication Flow

```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │
       │ 1. POST /api/auth/login
       │    { registration_number, password }
       │
       ▼
┌──────────────────────────────┐
│  Auth Route Handler          │
│  1. Validate input           │
│  2. Query user from DB       │
│  3. Compare bcrypt hash      │
│  4. Generate JWT tokens      │
│     - accessToken (15m)      │
│     - refreshToken (7d)      │
│  5. Return tokens + user     │
└──────┬───────────────────────┘
       │
       │ { success, data: { accessToken, refreshToken, user } }
       │
       ▼
┌──────────────────────────────┐
│  Client Storage              │
│  localStorage.setItem(...)   │
│  - accessToken               │
│  - refreshToken              │
│  - user (role, name, etc.)   │
└──────┬───────────────────────┘
       │
       │ Subsequent Requests
       │ Authorization: Bearer <accessToken>
       │
       ▼
┌──────────────────────────────┐
│  Auth Middleware             │
│  1. Extract JWT from header  │
│  2. Verify signature         │
│  3. Check expiration         │
│  4. Attach user to req       │
│  5. Check role (if needed)   │
└──────┬───────────────────────┘
       │
       │ req.user = { id, role, ... }
       │
       ▼
┌──────────────────────────────┐
│  Protected Route Handler     │
│  Access user data via req.user│
└──────────────────────────────┘
```

---

## File Upload Flow

```
┌─────────────┐
│   Client    │
│  (Teacher)  │
└──────┬──────┘
       │
       │ 1. POST /api/files/upload
       │    FormData: { file, title, type, department }
       │
       ▼
┌────────────────────────────────────────────┐
│  Multer Middleware                          │
│  1. Validate file type/size                │
│  2. Generate unique filename (UUID)        │
│  3. Save to /uploads/                      │
│  4. Attach file info to req.file           │
└──────┬─────────────────────────────────────┘
       │
       ▼
┌────────────────────────────────────────────┐
│  File Upload Handler                        │
│  1. Calculate MD5 checksum                 │
│  2. Insert metadata to files table         │
│     - uploaded_by, title, type, path      │
│     - status: 'pending' (teacher uploads) │
│     - status: 'approved' (admin uploads)  │
│  3. Log activity                           │
│  4. Emit Socket.IO event                   │
└──────┬─────────────────────────────────────┘
       │
       │ Socket.IO: 'file:upload'
       │
       ▼
┌────────────────────────────────────────────┐
│  Admin Dashboard (Real-time)               │
│  Receives notification                     │
│  Shows in approval queue                   │
└──────┬─────────────────────────────────────┘
       │
       │ 2. Admin approves: POST /api/files/approve/:id
       │
       ▼
┌────────────────────────────────────────────┐
│  File Approval Handler                     │
│  1. Update status to 'approved'            │
│  2. Emit Socket.IO event                   │
│  3. Log activity                           │
└──────┬─────────────────────────────────────┘
       │
       │ Socket.IO: 'file:approved'
       │
       ▼
┌────────────────────────────────────────────┐
│  Student Dashboard (Real-time)             │
│  File appears in downloads list            │
└────────────────────────────────────────────┘
```

---

## Real-time Updates (Socket.IO)

```
┌─────────────────────────────────────────────────────────┐
│                    Socket.IO Server                      │
└─────────────────────────────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  Room: CSE-3A│  │  Room: ECE-2B│  │  Room: Admin │
├──────────────┤  ├──────────────┤  ├──────────────┤
│ • Student 1  │  │ • Student X  │  │ • Admin 1    │
│ • Student 2  │  │ • Student Y  │  │ • Admin 2    │
│ • Teacher 1  │  │ • Teacher 2  │  └──────────────┘
└──────────────┘  └──────────────┘
        │                  │
        │  Events:         │
        │  • attendance:update
        │  • marks:update
        │  • file:upload
        │  • assignment:new
        │  • event:created
        │  • announcement:send
        └──────────────────┘
```

**Room Naming Convention:**
- `{department}-{year}{section}` → e.g., "CSE-3A"
- `admin` → All admins
- `teachers` → All teachers
- `students` → All students

---

## Data Flow Example: Marking Attendance

```
1. Teacher Dashboard
   ├─ Select: Department, Year, Section, Subject
   ├─ Load Students (GET /api/teacher/students?...)
   ├─ Check/Uncheck attendance boxes
   └─ Submit (POST /api/teacher/attendance)
          │
          ▼
2. Server Processing
   ├─ Validate teacher authorization
   ├─ Insert attendance records (bulk)
   │  └─ attendance table: { student_id, date, status, subject }
   ├─ Calculate percentages
   ├─ Log activity
   └─ Emit Socket.IO event → 'attendance:update'
          │
          ▼
3. Real-time Updates
   ├─ All students in room 'CSE-3A' receive update
   ├─ Student dashboards refresh attendance widget
   └─ Attendance percentage recalculated
          │
          ▼
4. Student Dashboard
   └─ Chart.js pie chart updates automatically
      (Present vs Absent visualization)
```

---

## Security Layers

```
┌─────────────────────────────────────────────────────────┐
│  Layer 1: Network Security                               │
│  • HTTPS/TLS (in production)                            │
│  • Rate Limiting (100 req/15min)                        │
│  • CORS whitelist                                       │
└──────────────────┬──────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────┐
│  Layer 2: Application Security                          │
│  • Helmet (HTTP security headers)                       │
│  • Request size limits                                  │
│  • Express validator (input sanitization)               │
└──────────────────┬──────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────┐
│  Layer 3: Authentication & Authorization                │
│  • JWT with short expiry (15 min)                       │
│  • Refresh token rotation (7 days)                      │
│  • Bcrypt password hashing (10 rounds)                  │
│  • Role-based access control (RBAC)                     │
└──────────────────┬──────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────┐
│  Layer 4: Database Security                             │
│  • Prepared statements (SQL injection prevention)       │
│  • Connection pooling (prevents exhaustion)             │
│  • Parameterized queries                                │
└──────────────────┬──────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────┐
│  Layer 5: Activity Monitoring                           │
│  • Activity logging (all critical actions)              │
│  • Audit trails                                         │
│  • Error tracking                                       │
└─────────────────────────────────────────────────────────┘
```

---

## Deployment Architecture (Docker)

```
┌────────────────────────────────────────────────────────────┐
│                    Docker Host                             │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  ┌──────────────────────────────────────────────────┐    │
│  │         Nginx Container                           │    │
│  │         Port: 8080                                │    │
│  │  • Reverse proxy                                  │    │
│  │  • Static file serving                            │    │
│  │  • Load balancing                                 │    │
│  └────────────┬─────────────────────────────────────┘    │
│               │                                            │
│  ┌────────────▼─────────────────────────────────────┐    │
│  │         App Container                             │    │
│  │         Port: 5000                                │    │
│  │  • Node.js + Express                              │    │
│  │  • Socket.IO                                      │    │
│  │  • Application logic                              │    │
│  └────────────┬─────────────────────────────────────┘    │
│               │                                            │
│  ┌────────────▼─────────────────────────────────────┐    │
│  │         MySQL Container                           │    │
│  │         Port: 3306                                │    │
│  │  • Database storage                               │    │
│  │  • Persistent volumes                             │    │
│  └──────────────────────────────────────────────────┘    │
│                                                            │
│  Docker Network: iter-network                             │
│  Volumes: mysql_data, uploads_data                        │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

**Commands:**
```bash
docker-compose up --build    # Start all services
docker-compose down          # Stop all services
docker-compose logs -f app   # View app logs
```

---

## Technology Stack Summary

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Glassmorphism, animations, custom properties
- **Vanilla JavaScript** - No frameworks, pure JS
- **Chart.js** - Data visualization
- **Socket.IO Client** - Real-time updates

### Backend
- **Node.js 18+** - Runtime
- **Express.js** - Web framework
- **mysql2/promise** - Database driver with connection pooling
- **Socket.IO** - Real-time bidirectional communication
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **multer** - File uploads
- **helmet** - Security headers
- **express-rate-limit** - Rate limiting
- **express-validator** - Input validation

### Database
- **MySQL 8.0** - Relational database
- 15+ tables with proper relationships
- Indexes for performance
- Prepared statements for security

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Nginx** - Reverse proxy, load balancer
- **PM2** - Process manager
- **GitHub Actions** - CI/CD pipeline

### Testing
- **Jest** - Unit testing
- **Playwright** - E2E testing

### PWA/Desktop/Mobile
- **Service Worker** - Offline caching
- **Web App Manifest** - PWA metadata
- **Electron** - Desktop apps
- **TWA (Trusted Web Activity)** - Android apps

---

## Performance Optimizations

1. **Database**
   - Connection pooling (2-10 connections)
   - Prepared statements
   - Proper indexes
   - Query optimization

2. **API**
   - Compression middleware
   - Response caching (ready for Redis)
   - Efficient SQL queries
   - Pagination support

3. **Frontend**
   - Lazy loading potential
   - Service Worker caching
   - Minified assets (production)
   - Image optimization (manual)

4. **Real-time**
   - Socket.IO rooms for targeted updates
   - Event-driven architecture
   - Minimal payload sizes

---

**This architecture supports:**
- ✅ 1000+ concurrent users (with proper scaling)
- ✅ Real-time updates across all clients
- ✅ File uploads/downloads with tracking
- ✅ Role-based access control
- ✅ Horizontal scaling (with load balancer)
- ✅ Multi-platform deployment (Web, Mobile, Desktop)

**Ready for production with proper infrastructure! 🚀**
