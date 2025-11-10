using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using DashboardApp.Models;
using DashboardApp.Services;

namespace DashboardApp.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class DashboardController : ControllerBase
{
    private readonly IDashboardService _dashboardService;
    private readonly ILogger<DashboardController> _logger;

    public DashboardController(IDashboardService dashboardService, ILogger<DashboardController> logger)
    {
        _dashboardService = dashboardService;
        _logger = logger;
    }

    [HttpGet("stats")]
    public async Task<ActionResult<DashboardStats>> GetStats()
    {
        try
        {
            var stats = await _dashboardService.GetDashboardStatsAsync();
            return Ok(stats);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting dashboard stats");
            return StatusCode(500, new { message = "An error occurred while fetching dashboard stats" });
        }
    }

    [HttpPost("transactions")]
    public async Task<ActionResult<TableDataResponse<Transaction>>> GetTransactions([FromBody] TableDataRequest request)
    {
        try
        {
            var result = await _dashboardService.GetTransactionsAsync(request);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting transactions");
            return StatusCode(500, new { message = "An error occurred while fetching transactions" });
        }
    }
}
