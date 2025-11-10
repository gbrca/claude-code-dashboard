using DashboardApp.Models;

namespace DashboardApp.Services;

public interface IDashboardService
{
    Task<DashboardStats> GetDashboardStatsAsync();
    Task<TableDataResponse<Transaction>> GetTransactionsAsync(TableDataRequest request);
}

public class DashboardService : IDashboardService
{
    private readonly List<Transaction> _transactions;

    public DashboardService()
    {
        // Generate mock data
        _transactions = GenerateMockTransactions();
    }

    public Task<DashboardStats> GetDashboardStatsAsync()
    {
        var stats = new DashboardStats
        {
            TotalUsers = 1247,
            TotalRevenue = 524890,
            TotalOrders = _transactions.Count,
            ConversionRate = 3.24,

            RevenueData = new List<ChartData>
            {
                new ChartData { Label = "Jan", Value = 45000 },
                new ChartData { Label = "Feb", Value = 52000 },
                new ChartData { Label = "Mar", Value = 48000 },
                new ChartData { Label = "Apr", Value = 61000 },
                new ChartData { Label = "May", Value = 55000 },
                new ChartData { Label = "Jun", Value = 67000 },
                new ChartData { Label = "Jul", Value = 72000 },
                new ChartData { Label = "Aug", Value = 68000 },
                new ChartData { Label = "Sep", Value = 75000 },
                new ChartData { Label = "Oct", Value = 82000 },
                new ChartData { Label = "Nov", Value = 78000 },
                new ChartData { Label = "Dec", Value = 85000 }
            },

            UserGrowthData = new List<ChartData>
            {
                new ChartData { Label = "Jan", Value = 850 },
                new ChartData { Label = "Feb", Value = 920 },
                new ChartData { Label = "Mar", Value = 980 },
                new ChartData { Label = "Apr", Value = 1050 },
                new ChartData { Label = "May", Value = 1120 },
                new ChartData { Label = "Jun", Value = 1247 }
            },

            CategoryData = new List<CategoryData>
            {
                new CategoryData { Category = "Electronics", Count = 145, Percentage = 35.5 },
                new CategoryData { Category = "Clothing", Count = 98, Percentage = 24.0 },
                new CategoryData { Category = "Books", Count = 76, Percentage = 18.6 },
                new CategoryData { Category = "Home & Garden", Count = 54, Percentage = 13.2 },
                new CategoryData { Category = "Sports", Count = 35, Percentage = 8.7 }
            }
        };

        return Task.FromResult(stats);
    }

    public Task<TableDataResponse<Transaction>> GetTransactionsAsync(TableDataRequest request)
    {
        var query = _transactions.AsQueryable();

        // Apply search filter
        if (!string.IsNullOrWhiteSpace(request.SearchTerm))
        {
            query = query.Where(t =>
                t.CustomerName.Contains(request.SearchTerm, StringComparison.OrdinalIgnoreCase) ||
                t.Product.Contains(request.SearchTerm, StringComparison.OrdinalIgnoreCase) ||
                t.Status.Contains(request.SearchTerm, StringComparison.OrdinalIgnoreCase));
        }

        // Apply sorting
        if (!string.IsNullOrWhiteSpace(request.SortBy))
        {
            query = request.SortBy.ToLower() switch
            {
                "customername" => request.SortOrder == "desc"
                    ? query.OrderByDescending(t => t.CustomerName)
                    : query.OrderBy(t => t.CustomerName),
                "product" => request.SortOrder == "desc"
                    ? query.OrderByDescending(t => t.Product)
                    : query.OrderBy(t => t.Product),
                "amount" => request.SortOrder == "desc"
                    ? query.OrderByDescending(t => t.Amount)
                    : query.OrderBy(t => t.Amount),
                "status" => request.SortOrder == "desc"
                    ? query.OrderByDescending(t => t.Status)
                    : query.OrderBy(t => t.Status),
                "date" => request.SortOrder == "desc"
                    ? query.OrderByDescending(t => t.Date)
                    : query.OrderBy(t => t.Date),
                _ => query.OrderByDescending(t => t.Date)
            };
        }
        else
        {
            query = query.OrderByDescending(t => t.Date);
        }

        var totalRecords = query.Count();
        var totalPages = (int)Math.Ceiling(totalRecords / (double)request.PageSize);

        // Apply pagination
        var data = query
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToList();

        var response = new TableDataResponse<Transaction>
        {
            Data = data,
            TotalRecords = totalRecords,
            TotalPages = totalPages,
            CurrentPage = request.Page
        };

        return Task.FromResult(response);
    }

    private List<Transaction> GenerateMockTransactions()
    {
        var random = new Random();
        var statuses = new[] { "Completed", "Pending", "Processing", "Cancelled" };
        var categories = new[] { "Electronics", "Clothing", "Books", "Home & Garden", "Sports" };
        var customers = new[]
        {
            "John Smith", "Emma Johnson", "Michael Brown", "Sarah Davis", "James Wilson",
            "Emily Taylor", "David Anderson", "Jessica Martinez", "Robert Thomas", "Lisa Garcia",
            "William Rodriguez", "Mary Lee", "Richard White", "Jennifer Harris", "Charles Clark"
        };
        var products = new[]
        {
            "Laptop Pro 15", "Wireless Headphones", "Smart Watch", "4K Monitor", "Gaming Mouse",
            "Winter Jacket", "Running Shoes", "Designer Jeans", "Wool Sweater", "Sports Cap",
            "Programming Guide", "Fiction Novel", "Cookbook", "Biography", "Science Textbook",
            "Garden Tools Set", "Kitchen Appliances", "Office Chair", "LED Lamp", "Storage Box",
            "Yoga Mat", "Dumbbells Set", "Tennis Racket", "Basketball", "Fitness Tracker"
        };

        var transactions = new List<Transaction>();
        for (int i = 1; i <= 250; i++)
        {
            transactions.Add(new Transaction
            {
                Id = i,
                CustomerName = customers[random.Next(customers.Length)],
                Product = products[random.Next(products.Length)],
                Amount = Math.Round(random.NextDouble() * 900 + 100, 2),
                Status = statuses[random.Next(statuses.Length)],
                Date = DateTime.UtcNow.AddDays(-random.Next(0, 180)),
                Category = categories[random.Next(categories.Length)]
            });
        }

        return transactions;
    }
}
