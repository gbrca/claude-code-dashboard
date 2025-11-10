import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { dashboardApi } from '@/lib/api'
import type { DashboardStats } from '@/types'
import { formatCurrency, formatNumber } from '@/lib/utils'
import { Users, DollarSign, ShoppingCart, Percent } from 'lucide-react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

export function Overview() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const data = await dashboardApi.getStats()
      setStats(data)
    } catch (error) {
      console.error('Failed to load stats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <div className="text-center py-12">Loading dashboard...</div>
  }

  if (!stats) {
    return <div className="text-center py-12">Failed to load dashboard data</div>
  }

  const statCards = [
    {
      title: 'Total Users',
      value: formatNumber(stats.totalUsers),
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(stats.totalRevenue),
      icon: DollarSign,
      color: 'bg-green-500',
    },
    {
      title: 'Total Orders',
      value: formatNumber(stats.totalOrders),
      icon: ShoppingCart,
      color: 'bg-orange-500',
    },
    {
      title: 'Conversion Rate',
      value: `${stats.conversionRate}%`,
      icon: Percent,
      color: 'bg-purple-500',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon
          return (
            <Card key={card.title} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-lg ${card.color} flex items-center justify-center text-white`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{card.title}</p>
                    <p className="text-2xl font-bold">{card.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats.revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* User Growth Chart */}
        <Card>
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Category Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Sales by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={stats.categoryData}
                dataKey="count"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={120}
                label={(entry) => `${entry.category} (${entry.percentage}%)`}
              >
                {stats.categoryData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
