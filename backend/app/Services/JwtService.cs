using App.Models;
using System.Text;
using MongoDB.Bson;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.Extensions.Caching.Memory;

namespace App.Services
{
    public class JwtService
    {
        private readonly IMemoryCache _cache;
        private readonly IConfiguration _configuration;

        public JwtService(IConfiguration configuration, IMemoryCache cache)
        {
            _configuration = configuration;
            _cache = cache;
        }

        public string GenerateToken(UserModel user)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var jwtKey = _configuration["Jwt:Key"];
            if (string.IsNullOrEmpty(jwtKey))
                throw new InvalidOperationException("JWT key is not configured.");
                
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(30),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public Task BlackListToken(ClaimsPrincipal principal)
        {
            var jti = principal.FindFirst(JwtRegisteredClaimNames.Jti)?.Value;

            if (string.IsNullOrEmpty(jti))
                return Task.FromResult(false);

            var expClaim = principal.FindFirst(JwtRegisteredClaimNames.Exp)?.Value;
            if (string.IsNullOrEmpty(expClaim))
                return Task.FromResult(false);

            var expiration = DateTimeOffset.FromUnixTimeSeconds(long.Parse(expClaim)).UtcDateTime - DateTime.UtcNow;

            if(expiration > TimeSpan.Zero)
            {
                _cache.Set($"blacklist:{jti}", true, expiration);
            }

            return Task.FromResult(true);
        }

        public bool IsTokenBlacklisted(string jti)
        {
            if(string.IsNullOrEmpty(jti))
                return false;

            return _cache.TryGetValue($"blacklist:{jti}", out _);
        }

        public ObjectId? GetUserIdFromClaims(ClaimsPrincipal principal)
        {
            var userIdClaim = principal.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            
            if (string.IsNullOrEmpty(userIdClaim))
                return null;

            if (ObjectId.TryParse(userIdClaim, out var objectId))
                return objectId;

            return null;
        }

        public async Task<UserModel?> GetUserFromClaims(ClaimsPrincipal principal)
        {
            var userId = GetUserIdFromClaims(principal);
            if (userId == null)
                return null;

            return await UserModel.FindById(userId);
        }
    }
}
