using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using DashboardApp.Models;

namespace DashboardApp.Services;

public interface IAuthService
{
    Task<LoginResponse?> AuthenticateAsync(LoginRequest request);
    Task<User?> GetUserByUsernameAsync(string username);
}

public class AuthService : IAuthService
{
    private readonly IConfiguration _configuration;
    private readonly List<User> _users; // In-memory storage for demo

    public AuthService(IConfiguration configuration)
    {
        _configuration = configuration;

        // Mock users for demo - In production, use a database
        _users = new List<User>
        {
            new User
            {
                Id = 1,
                Username = "admin",
                Email = "admin@dashboard.com",
                // Password: admin123
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin123"),
                Role = "Admin",
                CreatedAt = DateTime.UtcNow.AddMonths(-6)
            },
            new User
            {
                Id = 2,
                Username = "user",
                Email = "user@dashboard.com",
                // Password: user123
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("user123"),
                Role = "User",
                CreatedAt = DateTime.UtcNow.AddMonths(-3)
            }
        };
    }

    public Task<LoginResponse?> AuthenticateAsync(LoginRequest request)
    {
        var user = _users.FirstOrDefault(u => u.Username == request.Username);

        if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
        {
            return Task.FromResult<LoginResponse?>(null);
        }

        var token = GenerateJwtToken(user);

        return Task.FromResult<LoginResponse?>(new LoginResponse
        {
            Token = token,
            Username = user.Username,
            Email = user.Email,
            Role = user.Role
        });
    }

    public Task<User?> GetUserByUsernameAsync(string username)
    {
        var user = _users.FirstOrDefault(u => u.Username == username);
        return Task.FromResult(user);
    }

    private string GenerateJwtToken(User user)
    {
        var jwtSettings = _configuration.GetSection("JwtSettings");
        var secretKey = jwtSettings["SecretKey"];
        var issuer = jwtSettings["Issuer"];
        var audience = jwtSettings["Audience"];
        var expirationMinutes = int.Parse(jwtSettings["ExpirationMinutes"]!);

        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey!));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Username),
            new Claim(JwtRegisteredClaimNames.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim("userId", user.Id.ToString())
        };

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(expirationMinutes),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
