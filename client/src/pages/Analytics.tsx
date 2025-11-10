import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { dashboardApi } from '@/lib/api'
import type { DashboardStats } from '@/types'
import { formatCurrency } from '@/lib/utils'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts'

export function Analytics() {
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
    return <div className="text-center py-12">Loading analytics...</div>
  }

  if (!stats) {
    return <div className="text-center py-12">Failed to load analytics data</div>
  }

  return (
    <div className="space-y-6">
      {/* Revenue Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Revenue Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={stats.revenueData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Legend />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#3b82f6"
                fillOpacity={1}
                fill="url(#colorRevenue)"
                name="Revenue"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Category Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Category Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={stats.categoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
              <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="count" fill="#3b82f6" name="Sales Count" />
              <Bar yAxisId="right" dataKey="percentage" fill="#10b981" name="Percentage" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* User Growth vs Revenue */}
      <Card>
        <CardHeader>
          <CardTitle>User Growth Correlation</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={stats.userGrowthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#10b981"
                strokeWidth={3}
                name="Users"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Key Metrics Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Average Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {formatCurrency(
                stats.revenueData.reduce((sum, item) => sum + item.value, 0) /
                  stats.revenueData.length
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Based on {stats.revenueData.length} months
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Average Order Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {formatCurrency(stats.totalRevenue / stats.totalOrders)}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Across {stats.totalOrders} orders
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {stats.categoryData[0]?.category}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {stats.categoryData[0]?.percentage}% of all sales
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
