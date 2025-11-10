using Microsoft.AspNetCore.Mvc;
using DashboardApp.Models;
using DashboardApp.Services;

namespace DashboardApp.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly ILogger<AuthController> _logger;

    public AuthController(IAuthService authService, ILogger<AuthController> logger)
    {
        _authService = authService;
        _logger = logger;
    }

    [HttpPost("login")]
    public async Task<ActionResult<LoginResponse>> Login([FromBody] LoginRequest request)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(request.Username) || string.IsNullOrWhiteSpace(request.Password))
            {
                return BadRequest(new { message = "Username and password are required" });
            }

            var result = await _authService.AuthenticateAsync(request);

            if (result == null)
            {
                return Unauthorized(new { message = "Invalid username or password" });
            }

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during login");
            return StatusCode(500, new { message = "An error occurred during login" });
        }
    }

    [HttpGet("demo-credentials")]
    public IActionResult GetDemoCredentials()
    {
        return Ok(new
        {
            credentials = new[]
            {
                new { username = "admin", password = "admin123", role = "Admin" },
                new { username = "user", password = "user123", role = "User" }
            }
        });
    }
}
