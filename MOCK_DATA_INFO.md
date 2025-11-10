# Mock Data Information

This dashboard comes with pre-configured mock data for demonstration purposes.

## Mock Users

Located in: `Services/AuthService.cs`

| Username | Password | Role  | Email |
|----------|----------|-------|-------|
| admin    | admin123 | Admin | admin@dashboard.com |
| user     | user123  | User  | user@dashboard.com |

## Dashboard Statistics

Located in: `Services/DashboardService.cs` → `GetDashboardStatsAsync()`

### Summary Stats
- **Total Users**: 1,247
- **Total Revenue**: $524,890
- **Total Orders**: 250
- **Conversion Rate**: 3.24%

### Revenue Data (Monthly)
12 months of revenue data from January to December:
- Range: $45,000 - $85,000 per month
- Trend: Generally increasing throughout the year
- Used in: Line chart on Overview page

### User Growth Data
6 months of user growth data:
- Starting: 850 users (January)
- Ending: 1,247 users (June)
- Growth: ~65 users per month
- Used in: Bar chart on Overview page

### Category Distribution
5 product categories with sales counts:

| Category | Count | Percentage |
|----------|-------|------------|
| Electronics | 145 | 35.5% |
| Clothing | 98 | 24.0% |
| Books | 76 | 18.6% |
| Home & Garden | 54 | 13.2% |
| Sports | 35 | 8.7% |

Used in: Doughnut chart on Overview page

## Transaction Data

Located in: `Services/DashboardService.cs` → `GenerateMockTransactions()`

### Generation Details
- **Total Transactions**: 250
- **Date Range**: Last 180 days
- **Amount Range**: $100 - $1,000 (random)

### Data Fields
- **ID**: Sequential (1-250)
- **Customer Name**: 15 random customer names
- **Product**: 25 different products across all categories
- **Amount**: Random value between $100-$1,000
- **Status**: Completed, Pending, Processing, or Cancelled
- **Date**: Random date within last 180 days
- **Category**: Electronics, Clothing, Books, Home & Garden, or Sports

### Customers (Sample Pool)
```
John Smith, Emma Johnson, Michael Brown, Sarah Davis, James Wilson,
Emily Taylor, David Anderson, Jessica Martinez, Robert Thomas, Lisa Garcia,
William Rodriguez, Mary Lee, Richard White, Jennifer Harris, Charles Clark
```

### Products (Sample Pool)
```
Electronics: Laptop Pro 15, Wireless Headphones, Smart Watch, 4K Monitor, Gaming Mouse
Clothing: Winter Jacket, Running Shoes, Designer Jeans, Wool Sweater, Sports Cap
Books: Programming Guide, Fiction Novel, Cookbook, Biography, Science Textbook
Home & Garden: Garden Tools Set, Kitchen Appliances, Office Chair, LED Lamp, Storage Box
Sports: Yoga Mat, Dumbbells Set, Tennis Racket, Basketball, Fitness Tracker
```

### Status Distribution
- Completed: ~25%
- Pending: ~25%
- Processing: ~25%
- Cancelled: ~25%

## Replacing Mock Data with Real Data

### Step 1: Set Up Database Connection

Add Entity Framework Core:
```bash
dotnet add package Microsoft.EntityFrameworkCore.SqlServer
dotnet add package Microsoft.EntityFrameworkCore.Design
```

### Step 2: Create DbContext

```csharp
public class ApplicationDbContext : DbContext
{
    public DbSet<User> Users { get; set; }
    public DbSet<Transaction> Transactions { get; set; }

    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }
}
```

### Step 3: Update Services

Replace the mock data in `DashboardService.cs`:

```csharp
public class DashboardService : IDashboardService
{
    private readonly ApplicationDbContext _context;

    public DashboardService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<DashboardStats> GetDashboardStatsAsync()
    {
        var stats = new DashboardStats
        {
            TotalUsers = await _context.Users.CountAsync(),
            TotalRevenue = await _context.Transactions
                .Where(t => t.Status == "Completed")
                .SumAsync(t => t.Amount),
            TotalOrders = await _context.Transactions.CountAsync(),
            // ... etc
        };
        return stats;
    }
}
```

### Step 4: Update Authentication

Replace the mock users in `AuthService.cs`:

```csharp
public async Task<LoginResponse?> AuthenticateAsync(LoginRequest request)
{
    var user = await _context.Users
        .FirstOrDefaultAsync(u => u.Username == request.Username);

    if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
    {
        return null;
    }

    var token = GenerateJwtToken(user);
    return new LoginResponse { Token = token, ... };
}
```

### Step 5: Register DbContext

In `Program.cs`:

```csharp
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")));
```

### Step 6: Update Connection String

In `appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=DashboardDB;Trusted_Connection=True;"
  }
}
```

## Data Seeding

To seed your database with the mock data for testing:

```csharp
public static class DbInitializer
{
    public static void Initialize(ApplicationDbContext context)
    {
        context.Database.EnsureCreated();

        if (context.Users.Any())
        {
            return; // DB has been seeded
        }

        var users = new User[]
        {
            new User { Username = "admin", ... },
            new User { Username = "user", ... }
        };

        context.Users.AddRange(users);
        context.SaveChanges();

        // Add transactions...
    }
}
```

Call in `Program.cs`:
```csharp
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    DbInitializer.Initialize(context);
}
```

## Customizing Mock Data

To modify the mock data without replacing it entirely:

### Change Number of Transactions
In `DashboardService.cs`, find:
```csharp
for (int i = 1; i <= 250; i++) // Change 250 to your desired number
```

### Change Date Range
Find:
```csharp
Date = DateTime.UtcNow.AddDays(-random.Next(0, 180)) // Change 180 to days
```

### Change Amount Range
Find:
```csharp
Amount = Math.Round(random.NextDouble() * 900 + 100, 2) // Min: 100, Max: 1000
```

### Add More Products/Customers
Add to the arrays:
```csharp
var customers = new[]
{
    // Add more names here
};

var products = new[]
{
    // Add more products here
};
```

## API Response Examples

### Dashboard Stats Response
```json
{
  "totalUsers": 1247,
  "totalRevenue": 524890,
  "totalOrders": 250,
  "conversionRate": 3.24,
  "revenueData": [
    { "label": "Jan", "value": 45000 },
    ...
  ],
  "userGrowthData": [...],
  "categoryData": [...]
}
```

### Transactions Response
```json
{
  "data": [
    {
      "id": 1,
      "customerName": "John Smith",
      "product": "Laptop Pro 15",
      "amount": 899.99,
      "status": "Completed",
      "date": "2024-10-15T10:30:00Z",
      "category": "Electronics"
    },
    ...
  ],
  "totalRecords": 250,
  "totalPages": 25,
  "currentPage": 1
}
```
