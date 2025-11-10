namespace DashboardApp.Models;

public class DashboardStats
{
    public int TotalUsers { get; set; }
    public int TotalRevenue { get; set; }
    public int TotalOrders { get; set; }
    public double ConversionRate { get; set; }
    public List<ChartData> RevenueData { get; set; } = new();
    public List<ChartData> UserGrowthData { get; set; } = new();
    public List<CategoryData> CategoryData { get; set; } = new();
}

public class ChartData
{
    public string Label { get; set; } = string.Empty;
    public double Value { get; set; }
}

public class CategoryData
{
    public string Category { get; set; } = string.Empty;
    public int Count { get; set; }
    public double Percentage { get; set; }
}

public class TableDataRequest
{
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public string? SortBy { get; set; }
    public string SortOrder { get; set; } = "asc";
    public string? SearchTerm { get; set; }
}

public class TableDataResponse<T>
{
    public List<T> Data { get; set; } = new();
    public int TotalRecords { get; set; }
    public int TotalPages { get; set; }
    public int CurrentPage { get; set; }
}

public class Transaction
{
    public int Id { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public string Product { get; set; } = string.Empty;
    public double Amount { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime Date { get; set; }
    public string Category { get; set; } = string.Empty;
}
