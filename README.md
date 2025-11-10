# Modern Dashboard for .NET Core

A modern, responsive dashboard application for .NET Core with JWT authentication, real-time charts, and data table management.

## Features

- **Modern UI Design**: Clean, responsive interface with smooth animations
- **JWT Authentication**: Secure token-based authentication system
- **Interactive Charts**: Revenue trends, user growth, and category distribution using Chart.js
- **Data Tables**: Sortable, searchable, and paginated transaction tables
- **Responsive Layout**: Mobile-friendly design that works on all devices
- **Real-time Updates**: Dynamic data loading and refresh capabilities
- **Role-based Access**: Admin and User role support

## Technology Stack

### Backend
- .NET 8.0 Web API
- JWT Bearer Authentication
- BCrypt.Net for password hashing
- In-memory data storage (easily replaceable with EF Core)

### Frontend
- Vanilla JavaScript (ES6+)
- Chart.js for data visualization
- Font Awesome icons
- CSS Grid and Flexbox
- Local Storage for auth persistence

## Quick Start

### Prerequisites

- .NET 8.0 SDK or later
- A modern web browser

### Installation

1. **Clone or download the repository**

2. **Restore dependencies**
   ```bash
   dotnet restore
   ```

3. **Run the application**
   ```bash
   dotnet run
   ```

4. **Access the dashboard**
   Open your browser and navigate to:
   ```
   http://localhost:5000
   ```
   or
   ```
   https://localhost:5001
   ```

### Demo Credentials

The application comes with pre-configured demo users:

**Admin User:**
- Username: `admin`
- Password: `admin123`
- Role: Admin

**Regular User:**
- Username: `user`
- Password: `user123`
- Role: User

## Project Structure

```
DashboardApp/
├── Controllers/
│   ├── AuthController.cs       # Authentication endpoints
│   └── DashboardController.cs  # Dashboard data endpoints
├── Models/
│   ├── User.cs                 # User and authentication models
│   └── DashboardModels.cs      # Dashboard data models
├── Services/
│   ├── AuthService.cs          # Authentication logic
│   └── DashboardService.cs     # Dashboard data logic
├── wwwroot/
│   ├── css/
│   │   └── styles.css          # Application styles
│   ├── js/
│   │   └── app.js              # Frontend logic
│   └── index.html              # Main HTML file
├── Program.cs                  # Application entry point
├── appsettings.json           # Configuration
└── DashboardApp.csproj        # Project file
```

## API Endpoints

### Authentication

**POST /api/auth/login**
```json
Request:
{
  "username": "admin",
  "password": "admin123"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "username": "admin",
  "email": "admin@dashboard.com",
  "role": "Admin"
}
```

**GET /api/auth/demo-credentials**
Returns available demo credentials for testing.

### Dashboard (Requires Authentication)

**GET /api/dashboard/stats**
Returns dashboard statistics including:
- Total users
- Total revenue
- Total orders
- Conversion rate
- Revenue data for charts
- User growth data
- Category distribution

**POST /api/dashboard/transactions**
```json
Request:
{
  "page": 1,
  "pageSize": 10,
  "sortBy": "date",
  "sortOrder": "desc",
  "searchTerm": ""
}

Response:
{
  "data": [...],
  "totalRecords": 250,
  "totalPages": 25,
  "currentPage": 1
}
```

## Integration Guide

### Integrating into an Existing .NET Core Project

#### Step 1: Add Required Packages

Add these NuGet packages to your project:

```bash
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer
dotnet add package System.IdentityModel.Tokens.Jwt
dotnet add package BCrypt.Net-Next
```

#### Step 2: Configure JWT Authentication

In your `Program.cs`, add JWT authentication:

```csharp
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Configure JWT
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var secretKey = jwtSettings["SecretKey"];

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtSettings["Issuer"],
            ValidAudience = jwtSettings["Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(secretKey!))
        };
    });

builder.Services.AddAuthorization();
```

#### Step 3: Add JWT Settings to appsettings.json

```json
{
  "JwtSettings": {
    "SecretKey": "YourSuperSecretKeyThatIsAtLeast32CharactersLong!",
    "Issuer": "YourAppName",
    "Audience": "YourAppUsers",
    "ExpirationMinutes": 60
  }
}
```

#### Step 4: Copy Files to Your Project

Copy these directories to your project:
- `Models/` - Dashboard data models
- `Services/` - Authentication and data services
- `Controllers/` - API controllers
- `wwwroot/` - Frontend assets

#### Step 5: Register Services

In `Program.cs`:

```csharp
builder.Services.AddSingleton<IAuthService, AuthService>();
builder.Services.AddSingleton<IDashboardService, DashboardService>();
```

#### Step 6: Replace Mock Data with Real Data

The `DashboardService` uses mock data. Replace it with your actual data source:

```csharp
public class DashboardService : IDashboardService
{
    private readonly YourDbContext _context; // Use your DbContext

    public DashboardService(YourDbContext context)
    {
        _context = context;
    }

    public async Task<DashboardStats> GetDashboardStatsAsync()
    {
        var stats = new DashboardStats
        {
            TotalUsers = await _context.Users.CountAsync(),
            TotalRevenue = await _context.Orders
                .Where(o => o.Status == "Completed")
                .SumAsync(o => o.Amount),
            // ... map your actual data
        };
        return stats;
    }
}
```

### Customizing the Dashboard

#### Changing Colors

Edit `wwwroot/css/styles.css` and modify the CSS variables:

```css
:root {
    --primary-color: #4f46e5;      /* Main theme color */
    --secondary-color: #10b981;    /* Success/positive color */
    --danger-color: #ef4444;       /* Error/danger color */
    /* ... other colors */
}
```

#### Adding New Charts

In `wwwroot/js/app.js`, add new chart rendering code:

```javascript
function renderCustomChart() {
    const ctx = document.getElementById('customChart').getContext('2d');
    new Chart(ctx, {
        type: 'line', // or 'bar', 'doughnut', 'pie', etc.
        data: {
            labels: [...],
            datasets: [{
                label: 'Your Data',
                data: [...],
                backgroundColor: '#4f46e5'
            }]
        },
        options: {
            responsive: true
        }
    });
}
```

#### Adding New API Endpoints

1. Create a method in your service:
```csharp
public async Task<YourData> GetYourDataAsync()
{
    // Your logic
}
```

2. Add a controller endpoint:
```csharp
[HttpGet("your-endpoint")]
[Authorize]
public async Task<ActionResult<YourData>> GetYourData()
{
    var data = await _service.GetYourDataAsync();
    return Ok(data);
}
```

3. Call it from JavaScript:
```javascript
async function loadYourData() {
    const response = await fetch('/api/dashboard/your-endpoint', {
        headers: {
            'Authorization': `Bearer ${authToken}`
        }
    });
    const data = await response.json();
    // Process data
}
```

## Security Considerations

### Important for Production

1. **Change the JWT Secret Key**: Update the secret key in `appsettings.json` with a strong, unique key
2. **Use HTTPS**: Always use HTTPS in production
3. **Implement User Management**: Replace mock users with a proper user database
4. **Add Password Requirements**: Implement strong password policies
5. **Enable CORS Properly**: Configure CORS to only allow trusted origins
6. **Add Rate Limiting**: Implement rate limiting to prevent brute force attacks
7. **Secure Sensitive Data**: Never commit secrets to version control
8. **Use Environment Variables**: Store sensitive configuration in environment variables

### Recommended Security Enhancements

```csharp
// Add rate limiting
builder.Services.AddRateLimiter(options =>
{
    options.GlobalLimiter = PartitionedRateLimiter.Create<HttpContext, string>(
        context => RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: context.User.Identity?.Name ?? context.Request.Headers.Host.ToString(),
            factory: partition => new FixedWindowRateLimiterOptions
            {
                AutoReplenishment = true,
                PermitLimit = 100,
                Window = TimeSpan.FromMinutes(1)
            }));
});

// Use Entity Framework with proper security
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add password hashing validation
services.Configure<PasswordHasherOptions>(options =>
    options.IterationCount = 100000);
```

## Testing

### Running the Application

```bash
# Development mode with hot reload
dotnet watch run

# Production build
dotnet build -c Release
dotnet run -c Release
```

### Testing API Endpoints with curl

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Get dashboard stats (replace TOKEN with actual token)
curl http://localhost:5000/api/dashboard/stats \
  -H "Authorization: Bearer TOKEN"

# Get transactions
curl -X POST http://localhost:5000/api/dashboard/transactions \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"page":1,"pageSize":10,"sortBy":"date","sortOrder":"desc"}'
```

## Troubleshooting

### Common Issues

**Issue: CORS errors in browser**
- Solution: Ensure CORS is properly configured in `Program.cs`

**Issue: 401 Unauthorized errors**
- Solution: Check that JWT token is being sent in Authorization header
- Solution: Verify token hasn't expired (default: 60 minutes)

**Issue: Charts not displaying**
- Solution: Ensure Chart.js is loaded from CDN
- Solution: Check browser console for errors

**Issue: Mobile menu not working**
- Solution: Verify JavaScript is loaded correctly
- Solution: Check for JavaScript errors in console

## Performance Optimization

### For Production

1. **Enable Response Compression**:
```csharp
builder.Services.AddResponseCompression();
```

2. **Add Response Caching**:
```csharp
builder.Services.AddResponseCaching();
```

3. **Minify Frontend Assets**: Use a build tool to minify CSS and JavaScript

4. **Use CDN**: Host static assets on a CDN

5. **Database Indexing**: Add proper indexes to frequently queried columns

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

This project is provided as-is for educational and commercial use.

## Support

For issues, questions, or contributions, please refer to your internal development team or create an issue in your project repository.

## Changelog

### Version 1.0.0
- Initial release
- JWT authentication
- Dashboard with charts
- Transaction table with sorting/pagination
- Responsive design
- Mock data for demonstration
