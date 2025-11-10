# Quick Start Guide

## Get Started in 3 Steps

### 1. Install .NET SDK
If you don't have .NET 8.0 SDK installed:
- Download from: https://dotnet.microsoft.com/download
- Verify installation: `dotnet --version`

### 2. Run the Application
```bash
cd claude-code-dashboard
dotnet restore
dotnet run
```

### 3. Open in Browser
Navigate to: `http://localhost:5000` or `https://localhost:5001`

## Login Credentials

**Admin Access:**
- Username: `admin`
- Password: `admin123`

**User Access:**
- Username: `user`
- Password: `user123`

## What You'll See

### Dashboard Overview
- 4 statistics cards (Users, Revenue, Orders, Conversion Rate)
- Revenue chart showing monthly trends
- User growth bar chart
- Category distribution doughnut chart

### Transactions Page
- Searchable data table
- Sortable columns (click column headers)
- Pagination controls
- 250 mock transactions

### Analytics Page
- Detailed revenue trend analysis
- Category performance breakdown

## Features to Try

1. **Login**: Try both admin and user accounts
2. **Search**: Search transactions by customer, product, or status
3. **Sort**: Click any column header to sort
4. **Navigate**: Use the sidebar to switch between pages
5. **Mobile**: Resize your browser to see responsive design
6. **Logout**: Click logout button in sidebar

## API Testing

Test the API endpoints directly:

```bash
# Get demo credentials
curl http://localhost:5000/api/auth/demo-credentials

# Login (get token)
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Use token to access protected endpoints
curl http://localhost:5000/api/dashboard/stats \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Next Steps

1. Read `README.md` for detailed documentation
2. Customize colors in `wwwroot/css/styles.css`
3. Replace mock data with your real data in `Services/DashboardService.cs`
4. Add your own charts and widgets
5. Integrate with your existing authentication system

## Troubleshooting

**Port already in use?**
```bash
dotnet run --urls "http://localhost:5002"
```

**Need to see detailed logs?**
```bash
dotnet run --environment Development
```

**Want hot reload?**
```bash
dotnet watch run
```

## Project Structure

```
DashboardApp/
├── Controllers/        # API endpoints
├── Models/            # Data models
├── Services/          # Business logic
├── wwwroot/          # Frontend files
│   ├── css/          # Styles
│   ├── js/           # JavaScript
│   └── index.html    # Main page
├── Program.cs         # App configuration
└── appsettings.json  # Settings
```

## Support

For detailed integration instructions, see `README.md`
