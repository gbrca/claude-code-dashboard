# Project Structure

```
claude-code-dashboard/
│
├── Controllers/                    # API Controllers
│   ├── AuthController.cs          # Authentication endpoints (login, demo creds)
│   └── DashboardController.cs     # Dashboard data endpoints (stats, transactions)
│
├── Models/                        # Data Models
│   ├── User.cs                    # User, LoginRequest, LoginResponse models
│   └── DashboardModels.cs         # Dashboard, Chart, Table, Transaction models
│
├── Services/                      # Business Logic Layer
│   ├── AuthService.cs             # JWT authentication & user management
│   └── DashboardService.cs        # Dashboard data & mock data generation
│
├── wwwroot/                       # Static Frontend Files
│   ├── css/
│   │   └── styles.css            # Complete dashboard styling
│   ├── js/
│   │   └── app.js                # Frontend logic, API calls, charts
│   └── index.html                # Main HTML page
│
├── Documentation Files
│   ├── README.md                 # Complete documentation & integration guide
│   ├── QUICK_START.md           # Quick start guide (3 steps to run)
│   ├── FEATURES.md              # Detailed features overview
│   ├── MOCK_DATA_INFO.md        # Mock data details & replacement guide
│   └── PROJECT_STRUCTURE.md     # This file
│
├── Configuration Files
│   ├── Program.cs               # Application entry point & configuration
│   ├── appsettings.json        # App settings (JWT config, etc.)
│   ├── DashboardApp.csproj     # Project file with dependencies
│   └── .gitignore              # Git ignore rules
│
└── .git/                        # Git repository

```

## File Purposes

### Backend (C# / .NET Core)

#### Controllers/
- **AuthController.cs** (57 lines)
  - `POST /api/auth/login` - Authenticates users and returns JWT
  - `GET /api/auth/demo-credentials` - Returns demo login info

- **DashboardController.cs** (51 lines)
  - `GET /api/dashboard/stats` - Returns dashboard statistics
  - `POST /api/dashboard/transactions` - Returns paginated transactions

#### Models/
- **User.cs** (24 lines)
  - User entity with authentication fields
  - LoginRequest DTO
  - LoginResponse DTO

- **DashboardModels.cs** (51 lines)
  - DashboardStats - Overall statistics
  - ChartData - Chart data points
  - CategoryData - Category distribution
  - TableDataRequest - Pagination/sort request
  - TableDataResponse - Paginated response
  - Transaction - Transaction entity

#### Services/
- **AuthService.cs** (100 lines)
  - IAuthService interface
  - JWT token generation
  - User authentication logic
  - Mock user data (admin, user)

- **DashboardService.cs** (170 lines)
  - IDashboardService interface
  - Dashboard statistics generation
  - Transaction data with pagination/sorting
  - Mock data generator (250 transactions)

#### Configuration
- **Program.cs** (55 lines)
  - App startup configuration
  - JWT authentication setup
  - CORS configuration
  - Service registration
  - Static file serving

- **appsettings.json** (15 lines)
  - Logging configuration
  - JWT settings (secret, issuer, audience)
  - App settings

- **DashboardApp.csproj** (17 lines)
  - .NET 8.0 target framework
  - NuGet packages:
    - BCrypt.Net-Next (password hashing)
    - Microsoft.AspNetCore.Authentication.JwtBearer
    - System.IdentityModel.Tokens.Jwt
    - Swashbuckle.AspNetCore (Swagger)

### Frontend (HTML/CSS/JavaScript)

#### HTML
- **index.html** (186 lines)
  - Login page structure
  - Dashboard layout (sidebar + main content)
  - Overview page with stats cards
  - Transactions page with data table
  - Analytics page with charts
  - Chart.js and Font Awesome CDN links

#### CSS
- **styles.css** (650 lines)
  - CSS variables for theming
  - Login page styling
  - Dashboard layout (sidebar, main content)
  - Statistics cards with icons
  - Chart containers
  - Data table styling
  - Pagination controls
  - Status badges
  - Responsive design (mobile, tablet, desktop)
  - Animations and transitions

#### JavaScript
- **app.js** (550 lines)
  - Authentication flow
  - API communication
  - Dashboard data loading
  - Chart.js integration:
    - Line charts (revenue)
    - Bar charts (user growth)
    - Doughnut charts (categories)
  - Data table management:
    - Sorting
    - Searching
    - Pagination
  - Navigation handling
  - Mobile menu toggle
  - Local storage for auth tokens

### Documentation

- **README.md** (500+ lines)
  - Complete feature overview
  - Technology stack
  - Installation instructions
  - API documentation
  - Integration guide
  - Security considerations
  - Troubleshooting

- **QUICK_START.md** (150+ lines)
  - 3-step quick start
  - Demo credentials
  - Features to try
  - API testing examples
  - Basic troubleshooting

- **FEATURES.md** (400+ lines)
  - Detailed feature breakdown
  - UI/UX features
  - Technical features
  - Security features
  - Future enhancement ideas

- **MOCK_DATA_INFO.md** (300+ lines)
  - Mock data specifications
  - Data replacement guide
  - Database integration steps
  - Customization options

## Component Relationships

```
User Browser
    ↓
index.html (Login/Dashboard UI)
    ↓
app.js (API Calls)
    ↓
Controllers (AuthController, DashboardController)
    ↓
Services (AuthService, DashboardService)
    ↓
Models (User, Transaction, etc.)
    ↓
Mock Data / Database (Future)
```

## Data Flow

### Authentication Flow
1. User enters credentials in login form
2. app.js sends POST to /api/auth/login
3. AuthController validates with AuthService
4. AuthService generates JWT token
5. Token returned to browser
6. Token stored in localStorage
7. Token sent with all subsequent requests

### Dashboard Data Flow
1. User navigates to dashboard page
2. app.js sends GET to /api/dashboard/stats
3. DashboardController retrieves from DashboardService
4. Service returns statistics and chart data
5. app.js renders charts using Chart.js
6. Data displayed in UI

### Table Data Flow
1. User searches/sorts/pages through table
2. app.js sends POST to /api/dashboard/transactions
3. Controller processes request with filters
4. Service applies sorting, filtering, pagination
5. Returns paginated result
6. app.js renders table rows
7. Updates pagination controls

## Key Technologies

### Backend Stack
- **.NET 8.0** - Framework
- **ASP.NET Core** - Web API
- **JWT** - Authentication
- **BCrypt** - Password hashing
- **Swagger** - API documentation

### Frontend Stack
- **HTML5** - Structure
- **CSS3** - Styling (Grid, Flexbox)
- **JavaScript ES6+** - Logic
- **Chart.js 4.4** - Data visualization
- **Font Awesome 6.4** - Icons
- **Fetch API** - HTTP requests
- **LocalStorage** - Auth persistence

## Lines of Code Summary

| Component | Files | Lines |
|-----------|-------|-------|
| Controllers | 2 | ~110 |
| Models | 2 | ~75 |
| Services | 2 | ~270 |
| Configuration | 2 | ~70 |
| Frontend HTML | 1 | ~190 |
| Frontend CSS | 1 | ~650 |
| Frontend JS | 1 | ~550 |
| Documentation | 4 | ~1500 |
| **Total** | **15** | **~3400** |

## Getting Started

For developers new to this project:

1. **Read First**: QUICK_START.md
2. **Then Read**: README.md
3. **Understand Data**: MOCK_DATA_INFO.md
4. **Explore Features**: FEATURES.md
5. **Start Coding**: Modify Services/ for business logic

## Common Tasks

### Add a New Chart
1. Add data to DashboardStats model
2. Update GetDashboardStatsAsync in DashboardService
3. Add canvas element in index.html
4. Render chart in app.js using Chart.js

### Add a New API Endpoint
1. Add method in appropriate Service
2. Add controller action
3. Call from app.js using fetch
4. Update UI with response

### Change Styling
1. Modify CSS variables in styles.css
2. Or update specific component styles

### Replace Mock Data
1. Follow guide in MOCK_DATA_INFO.md
2. Add EF Core
3. Create DbContext
4. Update Services to use DbContext
5. Add migrations and seed data
