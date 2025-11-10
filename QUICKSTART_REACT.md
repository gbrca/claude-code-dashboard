# Quick Start Guide - React + shadcn/ui Dashboard

Get up and running in 3 minutes!

## Prerequisites

- Node.js 18+ ([Download](https://nodejs.org/))
- .NET 8 SDK ([Download](https://dotnet.microsoft.com/download))

## Installation

```bash
# 1. Install frontend dependencies
cd client
npm install

# 2. Go back to root and restore backend dependencies
cd ..
dotnet restore
```

## Run the Application

### Option 1: Development Mode with Hot Reload (Recommended)

**Terminal 1 - Start Backend:**
```bash
dotnet run
```
✅ Backend running at http://localhost:5000

**Terminal 2 - Start Frontend:**
```bash
cd client
npm run dev
```
✅ Frontend running at http://localhost:3000 with hot reload

**Open your browser:** http://localhost:3000

### Option 2: Production Build

```bash
# Build frontend
cd client
npm run build

# Run backend (serves built frontend)
cd ..
dotnet run
```

**Open your browser:** http://localhost:5000

## Login

Use these demo credentials:

| Username | Password | Role |
|----------|----------|------|
| `admin` | `admin123` | Admin |
| `user` | `user123` | User |

## What You'll See

### Dashboard Overview (/)
- 📊 4 statistics cards
- 📈 Revenue line chart (12 months)
- 📊 User growth bar chart
- 🥧 Category pie chart

### Transactions (/dashboard/transactions)
- 📋 Sortable data table
- 🔍 Search functionality
- 📄 Pagination (250 records)
- 🏷️ Color-coded status badges

### Analytics (/dashboard/analytics)
- 📈 Area chart for revenue trends
- 📊 Dual-axis bar chart for categories
- 📑 Key metrics summary

## Tech Stack Quick Reference

```
┌─────────────────────────────────────┐
│  React 18 + TypeScript              │  Frontend Framework
├─────────────────────────────────────┤
│  shadcn/ui + Radix UI               │  UI Components
├─────────────────────────────────────┤
│  Tailwind CSS                       │  Styling
├─────────────────────────────────────┤
│  Recharts                           │  Data Visualization
├─────────────────────────────────────┤
│  React Router                       │  Routing
├─────────────────────────────────────┤
│  Vite                               │  Build Tool
└─────────────────────────────────────┘
              ⬇  API Calls  ⬇
┌─────────────────────────────────────┐
│  .NET Core 8 Web API                │  Backend
├─────────────────────────────────────┤
│  JWT Authentication                 │  Security
├─────────────────────────────────────┤
│  BCrypt                             │  Password Hashing
└─────────────────────────────────────┘
```

## Project Structure

```
client/
├── src/
│   ├── components/ui/    # shadcn/ui components
│   ├── pages/           # Dashboard pages
│   ├── hooks/           # React hooks (auth)
│   ├── lib/             # Utils and API client
│   └── types/           # TypeScript types
└── package.json

Backend API/
├── Controllers/          # API endpoints
├── Models/              # Data models
└── Services/            # Business logic
```

## Common Tasks

### Start Development
```bash
# Terminal 1
dotnet run

# Terminal 2
cd client && npm run dev
```

### Build for Production
```bash
cd client
npm run build
cd ..
dotnet publish -c Release
```

### Add New Page

1. Create `client/src/pages/MyPage.tsx`
2. Add route in `client/src/App.tsx`
3. Add nav link in `client/src/components/DashboardLayout.tsx`

### Customize Colors

Edit `client/src/index.css`:
```css
:root {
  --primary: 221.2 83.2% 53.3%;  /* Change this! */
}
```

## Features to Try

✅ Login with different users
✅ Sort table columns (click headers)
✅ Search transactions
✅ Navigate between pages
✅ Resize browser (responsive design)
✅ Check out the charts
✅ Logout and login again

## Troubleshooting

**Backend won't start?**
```bash
dotnet clean
dotnet restore
dotnet run
```

**Frontend won't start?**
```bash
cd client
rm -rf node_modules
npm install
npm run dev
```

**API calls failing?**
- Check backend is running on port 5000
- Check browser console for CORS errors
- Verify you're logged in (check localStorage for 'authToken')

**Charts not showing?**
- Check browser console for errors
- Verify data is loading (Network tab in DevTools)
- Check API response format

## Next Steps

📖 Read [README_SHADCN.md](./README_SHADCN.md) for detailed documentation
🎨 Customize colors and styling
🔧 Add your own API endpoints
📊 Add more charts and visualizations
💾 Replace mock data with real database

## Useful Commands

```bash
# Frontend
cd client
npm run dev          # Dev server
npm run build        # Production build
npm run lint         # Check code quality

# Backend
dotnet run           # Start server
dotnet watch run     # Start with hot reload
dotnet test          # Run tests
dotnet build         # Build project
```

## Resources

- **shadcn/ui Docs**: https://ui.shadcn.com
- **React Docs**: https://react.dev
- **Tailwind CSS**: https://tailwindcss.com
- **Recharts**: https://recharts.org
- **.NET Docs**: https://learn.microsoft.com/dotnet

## Demo Data

- **Users**: 1,247
- **Revenue**: $524,890
- **Orders**: 250
- **Transactions**: 250 records with realistic data
- **Categories**: Electronics, Clothing, Books, Home & Garden, Sports

Enjoy building with React + shadcn/ui! 🚀
