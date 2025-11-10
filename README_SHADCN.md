# Modern Dashboard with React + shadcn/ui

A modern, professional dashboard built with **.NET Core 8**, **React 18**, **TypeScript**, **shadcn/ui**, and **Tailwind CSS**.

## Features

### Frontend (React + shadcn/ui)
- **Modern UI Framework**: React 18 with TypeScript
- **shadcn/ui Components**: Beautiful, accessible components built on Radix UI
- **Tailwind CSS**: Utility-first CSS framework
- **Responsive Design**: Mobile-first, works on all devices
- **Interactive Charts**: Recharts library for data visualization
- **Type-Safe**: Full TypeScript support

### Backend (.NET Core 8)
- **RESTful API**: Clean API architecture
- **JWT Authentication**: Secure token-based auth
- **Mock Data**: 250+ transactions for demo
- **Role-Based Access**: Admin and User roles

### Dashboard Features
- 📊 **Statistics Cards**: Users, Revenue, Orders, Conversion Rate
- 📈 **Interactive Charts**: Line, Bar, Pie, and Area charts
- 📋 **Data Table**: Sorting, filtering, pagination
- 🔐 **Authentication**: Secure login with JWT
- 📱 **Responsive**: Works on desktop, tablet, and mobile
- 🎨 **Modern Design**: Clean, professional UI

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend Framework | React 18 + TypeScript |
| UI Components | shadcn/ui + Radix UI |
| Styling | Tailwind CSS |
| Charts | Recharts |
| Routing | React Router v6 |
| Build Tool | Vite |
| Backend | .NET Core 8 Web API |
| Authentication | JWT Bearer |
| Password Hashing | BCrypt |

## Project Structure

```
claude-code-dashboard/
├── client/                          # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/                 # shadcn/ui components
│   │   │   │   ├── button.tsx
│   │   │   │   ├── card.tsx
│   │   │   │   ├── input.tsx
│   │   │   │   ├── label.tsx
│   │   │   │   ├── table.tsx
│   │   │   │   ├── tabs.tsx
│   │   │   │   └── badge.tsx
│   │   │   └── DashboardLayout.tsx # Main layout with sidebar
│   │   ├── pages/
│   │   │   ├── Login.tsx           # Login page
│   │   │   ├── Overview.tsx        # Dashboard overview
│   │   │   ├── Transactions.tsx    # Transactions table
│   │   │   └── Analytics.tsx       # Analytics charts
│   │   ├── hooks/
│   │   │   └── useAuth.tsx         # Authentication hook
│   │   ├── lib/
│   │   │   ├── api.ts              # API client
│   │   │   └── utils.ts            # Utility functions
│   │   ├── types/
│   │   │   └── index.ts            # TypeScript types
│   │   ├── App.tsx                 # Main app component
│   │   ├── main.tsx                # Entry point
│   │   └── index.css               # Tailwind + globals
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── components.json             # shadcn/ui config
│
├── Controllers/                     # .NET API Controllers
├── Models/                          # Data models
├── Services/                        # Business logic
├── Program.cs                       # .NET entry point
└── DashboardApp.csproj             # .NET project file
```

## Quick Start

### Prerequisites

- **Node.js 18+** (for React frontend)
- **.NET 8 SDK** (for backend API)

### Installation

#### 1. Clone the repository
```bash
cd claude-code-dashboard
```

#### 2. Install frontend dependencies
```bash
cd client
npm install
```

#### 3. Install backend dependencies
```bash
cd ..
dotnet restore
```

### Development Mode

You have two options for development:

#### Option A: Run Frontend and Backend Separately (Recommended for Development)

**Terminal 1 - Backend API:**
```bash
# From project root
dotnet run
```
Backend will run on `http://localhost:5000` and `https://localhost:5001`

**Terminal 2 - Frontend Dev Server:**
```bash
# From project root
cd client
npm run dev
```
Frontend will run on `http://localhost:3000` with hot reload

Open `http://localhost:3000` in your browser. The Vite dev server will proxy API calls to the backend.

#### Option B: Build and Serve from .NET

```bash
# Build frontend
cd client
npm run build

# Run backend (which serves the built frontend)
cd ..
dotnet run
```

Open `http://localhost:5000` in your browser.

### Demo Credentials

| Role | Username | Password |
|------|----------|----------|
| Admin | `admin` | `admin123` |
| User | `user` | `user123` |

## Development

### Adding New shadcn/ui Components

shadcn/ui components can be added manually or via CLI. Since we don't have the CLI in this setup, components are already included. To add more:

1. Visit https://ui.shadcn.com/docs/components
2. Copy the component code
3. Add to `client/src/components/ui/`
4. Import and use in your pages

### Available Scripts

#### Frontend (in `client/` directory)

```bash
npm run dev      # Start dev server with hot reload
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

#### Backend (in root directory)

```bash
dotnet run       # Run the application
dotnet build     # Build the project
dotnet watch run # Run with hot reload
```

## Component Overview

### shadcn/ui Components Used

| Component | Purpose | Location |
|-----------|---------|----------|
| Button | Buttons with variants | ui/button.tsx |
| Card | Content containers | ui/card.tsx |
| Input | Form inputs | ui/input.tsx |
| Label | Form labels | ui/label.tsx |
| Table | Data tables | ui/table.tsx |
| Badge | Status badges | ui/badge.tsx |
| Tabs | Tab navigation | ui/tabs.tsx |

### Custom Components

| Component | Purpose |
|-----------|---------|
| DashboardLayout | Main layout with sidebar and header |
| Login | Login page with form |
| Overview | Dashboard with stats and charts |
| Transactions | Data table with sorting/filtering |
| Analytics | Advanced analytics charts |

### Pages

#### 1. Login Page (`/login`)
- Modern gradient background
- shadcn/ui Card and Form components
- Demo credentials display
- Error handling
- Redirects to dashboard on success

#### 2. Overview Page (`/dashboard`)
- 4 statistics cards with icons
- Revenue line chart (12 months)
- User growth bar chart (6 months)
- Category distribution pie chart
- Real-time data from API

#### 3. Transactions Page (`/dashboard/transactions`)
- Sortable data table (click headers)
- Search functionality (debounced)
- Pagination with page numbers
- Status badges (Completed, Pending, etc.)
- 250 mock transactions

#### 4. Analytics Page (`/dashboard/analytics`)
- Monthly revenue trend (area chart)
- Category performance (dual-axis bar chart)
- User growth correlation
- Key metrics summary cards

## API Endpoints

All endpoints are prefixed with `/api`

### Authentication

**POST /api/auth/login**
```typescript
Request: { username: string, password: string }
Response: { token: string, username: string, email: string, role: string }
```

**GET /api/auth/demo-credentials**
```typescript
Response: { credentials: Array<{ username, password, role }> }
```

### Dashboard (Requires Authentication)

**GET /api/dashboard/stats**
```typescript
Response: {
  totalUsers: number
  totalRevenue: number
  totalOrders: number
  conversionRate: number
  revenueData: Array<{ label: string, value: number }>
  userGrowthData: Array<{ label: string, value: number }>
  categoryData: Array<{ category: string, count: number, percentage: number }>
}
```

**POST /api/dashboard/transactions**
```typescript
Request: {
  page: number
  pageSize: number
  sortBy?: string
  sortOrder: 'asc' | 'desc'
  searchTerm?: string
}
Response: {
  data: Transaction[]
  totalRecords: number
  totalPages: number
  currentPage: number
}
```

## Customization

### Changing Colors

Edit `client/src/index.css` to modify Tailwind CSS variables:

```css
:root {
  --primary: 221.2 83.2% 53.3%;       /* Primary blue */
  --secondary: 210 40% 96.1%;         /* Light gray */
  --destructive: 0 84.2% 60.2%;       /* Red */
  /* ... more colors */
}
```

Or edit `client/tailwind.config.js` for more advanced theming.

### Adding New Pages

1. **Create page component:**
```typescript
// client/src/pages/NewPage.tsx
export function NewPage() {
  return (
    <div>
      <h1>New Page</h1>
    </div>
  )
}
```

2. **Add route in App.tsx:**
```typescript
<Route
  path="/dashboard/new-page"
  element={
    <ProtectedRoute>
      <DashboardLayout>
        <NewPage />
      </DashboardLayout>
    </ProtectedRoute>
  }
/>
```

3. **Add navigation link in DashboardLayout.tsx:**
```typescript
const navigation = [
  // ...
  { name: 'New Page', href: '/dashboard/new-page', icon: YourIcon },
]
```

### Adding New Charts

Using Recharts:

```typescript
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'

<ResponsiveContainer width="100%" height={300}>
  <LineChart data={yourData}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="label" />
    <YAxis />
    <Tooltip />
    <Line type="monotone" dataKey="value" stroke="#3b82f6" />
  </LineChart>
</ResponsiveContainer>
```

## TypeScript

All components are fully typed. Key types are in `client/src/types/index.ts`:

```typescript
interface User {
  username: string
  email: string
  role: string
}

interface DashboardStats {
  totalUsers: number
  totalRevenue: number
  // ...
}

interface Transaction {
  id: number
  customerName: string
  product: string
  amount: number
  status: string
  date: string
  category: string
}
```

## Authentication Flow

1. User enters credentials on Login page
2. Frontend calls `/api/auth/login`
3. Backend validates and returns JWT token
4. Frontend stores token in localStorage
5. All subsequent API calls include token in Authorization header
6. Protected routes check for valid token
7. Logout clears token and redirects to login

## Production Build

### Build Frontend
```bash
cd client
npm run build
```

This creates a production build in `wwwroot/` directory.

### Run Production
```bash
dotnet run --configuration Release
```

The .NET backend will serve the built React app.

### Deploy

For production deployment:

1. Build the frontend: `npm run build` (in client/ directory)
2. Build the backend: `dotnet publish -c Release`
3. Deploy the `bin/Release/net8.0/publish/` directory
4. Set environment variables for JWT secret
5. Configure your web server (IIS, Nginx, etc.)

## Environment Variables

For production, set these environment variables:

```bash
JwtSettings__SecretKey=YourSecureSecretKey
JwtSettings__Issuer=YourIssuer
JwtSettings__Audience=YourAudience
ASPNETCORE_ENVIRONMENT=Production
```

## Troubleshooting

### Frontend doesn't connect to backend
- Check that backend is running on port 5000
- Verify CORS settings in Program.cs
- Check browser console for errors

### Build errors
- Delete `node_modules` and run `npm install` again
- Clear `obj/` and `bin/` directories
- Run `dotnet clean && dotnet restore`

### Charts not displaying
- Ensure Recharts is installed: `npm install recharts`
- Check browser console for errors
- Verify data format matches chart expectations

### TypeScript errors
- Run `npm run build` to see all type errors
- Check `tsconfig.json` configuration
- Ensure all imports have proper types

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- **React**: Fast virtual DOM updates
- **Vite**: Lightning-fast HMR in development
- **Code Splitting**: Automatic route-based splitting
- **Tree Shaking**: Removes unused code
- **Tailwind CSS**: Purges unused styles

## Security

- JWT tokens with expiration
- BCrypt password hashing
- CORS configuration
- HTTPS ready
- Protected routes
- Input validation

## License

This project is open source and available for personal and commercial use.

## Support

For issues or questions:
1. Check this README
2. Review the code comments
3. Check browser/server console for errors
4. Refer to documentation:
   - [shadcn/ui](https://ui.shadcn.com)
   - [React](https://react.dev)
   - [Tailwind CSS](https://tailwindcss.com)
   - [Recharts](https://recharts.org)

## Changelog

### Version 2.0.0 (Current - React + shadcn/ui)
- Migrated to React 18 with TypeScript
- Integrated shadcn/ui components
- Added Tailwind CSS
- Improved chart interactions with Recharts
- Better mobile responsiveness
- Enhanced type safety

### Version 1.0.0 (Vanilla JS)
- Initial release with vanilla HTML/CSS/JS
- Basic dashboard functionality
- Chart.js integration
