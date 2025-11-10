import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { dashboardApi } from '@/lib/api'
import type { Transaction, TableDataResponse } from '@/types'
import { formatCurrency, formatDate } from '@/lib/utils'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, RefreshCw, ArrowUpDown } from 'lucide-react'

export function Transactions() {
  const [data, setData] = useState<TableDataResponse<Transaction> | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10

  useEffect(() => {
    loadTransactions()
  }, [currentPage, sortBy, sortOrder])

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1)
      loadTransactions()
    }, 500)
    return () => clearTimeout(timer)
  }, [searchTerm])

  const loadTransactions = async () => {
    setIsLoading(true)
    try {
      const result = await dashboardApi.getTransactions({
        page: currentPage,
        pageSize,
        sortBy,
        sortOrder,
        searchTerm,
      })
      setData(result)
    } catch (error) {
      console.error('Failed to load transactions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(column)
      setSortOrder('asc')
    }
  }

  const getStatusVariant = (status: string): 'success' | 'warning' | 'info' | 'destructive' => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'success'
      case 'pending':
        return 'warning'
      case 'processing':
        return 'info'
      case 'cancelled':
        return 'destructive'
      default:
        return 'info'
    }
  }

  if (!data && !isLoading) {
    return <div className="text-center py-12">Failed to load transactions</div>
  }

  const totalPages = data?.totalPages || 0
  const start = data ? (currentPage - 1) * pageSize + 1 : 0
  const end = data ? Math.min(currentPage * pageSize, data.totalRecords) : 0

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Recent Transactions</CardTitle>
            <div className="flex gap-2">
              <Input
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={loadTransactions}
                disabled={isLoading}
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 -ml-3"
                      onClick={() => handleSort('id')}
                    >
                      ID
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 -ml-3"
                      onClick={() => handleSort('customerName')}
                    >
                      Customer
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 -ml-3"
                      onClick={() => handleSort('product')}
                    >
                      Product
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 -ml-3"
                      onClick={() => handleSort('amount')}
                    >
                      Amount
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 -ml-3"
                      onClick={() => handleSort('status')}
                    >
                      Status
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 -ml-3"
                      onClick={() => handleSort('date')}
                    >
                      Date
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center h-24">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : data?.data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center h-24">
                      No transactions found
                    </TableCell>
                  </TableRow>
                ) : (
                  data?.data.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">{transaction.id}</TableCell>
                      <TableCell>{transaction.customerName}</TableCell>
                      <TableCell>{transaction.product}</TableCell>
                      <TableCell>{formatCurrency(transaction.amount)}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(transaction.status)}>
                          {transaction.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(transaction.date)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-2 py-4">
            <div className="text-sm text-muted-foreground">
              Showing {start} to {end} of {data?.totalRecords || 0} entries
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1 || isLoading}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1 || isLoading}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum
                  if (totalPages <= 5) {
                    pageNum = i + 1
                  } else if (currentPage <= 3) {
                    pageNum = i + 1
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i
                  } else {
                    pageNum = currentPage - 2 + i
                  }

                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? 'default' : 'outline'}
                      size="icon"
                      onClick={() => setCurrentPage(pageNum)}
                      disabled={isLoading}
                    >
                      {pageNum}
                    </Button>
                  )
                })}
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages || isLoading}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages || isLoading}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
