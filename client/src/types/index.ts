export interface User {
  username: string
  email: string
  role: string
}

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
  username: string
  email: string
  role: string
}

export interface ChartData {
  label: string
  value: number
}

export interface CategoryData {
  category: string
  count: number
  percentage: number
}

export interface DashboardStats {
  totalUsers: number
  totalRevenue: number
  totalOrders: number
  conversionRate: number
  revenueData: ChartData[]
  userGrowthData: ChartData[]
  categoryData: CategoryData[]
}

export interface Transaction {
  id: number
  customerName: string
  product: string
  amount: number
  status: string
  date: string
  category: string
}

export interface TableDataRequest {
  page: number
  pageSize: number
  sortBy?: string
  sortOrder: string
  searchTerm?: string
}

export interface TableDataResponse<T> {
  data: T[]
  totalRecords: number
  totalPages: number
  currentPage: number
}
