using App.DTOs;
using App.Models;
using App.Mailers;
using App.Services;
using RazorEngineCore;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Org.BouncyCastle.Ocsp;

namespace App.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly JwtService _jwtService;
        private readonly IRazorEngine _razorEngine;
        private readonly IEmailService _emailService;
        private readonly GoogleService _googleService;
        private readonly IWebHostEnvironment _environment;
        
        public AuthController(
            JwtService jwtService, 
            IRazorEngine razorEngine, 
            IEmailService emailService, 
            GoogleService googleService,
            IWebHostEnvironment environment
        )
        {
            _jwtService = jwtService;
            _razorEngine = razorEngine;
            _emailService = emailService;
            _googleService = googleService;
            _environment = environment;
        }

        [HttpPost("sign-up")]
        public async Task<IActionResult> SignUp([FromBody] RegisterDto request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var existingUser = await UserModel.FindByEmail(request.Email);
            if (existingUser != null)
                return Conflict(new { message = "Email already registered" });

            var user = new UserModel
            {
                FirstName = request.FName,
                LastName = request.LName,
                Email = request.Email,
                Password = request.Password,
                Username = request.Username,
                IsVerified = false
            };

            await user.Save();

            var verifyToken = await user.GenerateVerifyToken();

            var accessToken = _jwtService.GenerateToken(user);
            var refreshToken = await user.GenerateRefreshToken();

            var verificationUrl = $"{Request.Scheme}://{Request.Host}/verify-email?token={verifyToken.Token}";
            
            var mailer = new EVerifyMailer(
                user.Email,
                user.FirstName,
                user.LastName,
                verifyToken.Token,
                verificationUrl,
                _razorEngine,
                _environment
            );

            await _emailService.SendAsync(mailer);

            Response.Cookies.Append("refreshToken", refreshToken.Token, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Expires = refreshToken.ExpiresAt
            });

            return Ok(new {
                message = "User registered successfully. Please check your email to verify your account.",
                data = new {
                    token = accessToken,
                    role = (await user.GetRole())?.Name,
                    user = new {
                        user.FirstName,
                        user.LastName,
                        user.Username,
                        user.Email
                    }
                }
            });
        }

        [HttpPost("sign-in")]
        public async Task<IActionResult> SignIn([FromBody] LoginDto request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = await UserModel.CheckCredentials(request.Email, request.Password);
            if (user == null)
                return Unauthorized(new { message = "Invalid email or password" });

            var accessToken = _jwtService.GenerateToken(user);
            var refreshToken = await user.GenerateRefreshToken();

            Response.Cookies.Append("refreshToken", refreshToken.Token, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Expires = refreshToken.ExpiresAt
            });

            return Ok(new {
                message = "Singed in successfully",
                data = new {
                    token = accessToken,
                    role = (await user.GetRole())?.Name,
                    user = new {
                        user.FirstName,
                        user.LastName,
                        user.Username,
                        user.Email
                    }
                }
            });
        }

        [HttpPost("google-signin")]
        public async Task<IActionResult> GoogleSignIn([FromBody] GoogleSignDto request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var idToken = request.IdToken;
            var gUserInfo = await _googleService.GetInfo(idToken);

            if (gUserInfo == null)
                return Unauthorized(new { message = "Invalid Google ID token" });

            var user = await UserModel.FindByEmail(gUserInfo.Email);
            if (user == null)
            {
                user = new UserModel
                {
                    FirstName = gUserInfo.FirstName,
                    LastName = gUserInfo.LastName,
                    Email = gUserInfo.Email,
                    Username = gUserInfo.Username,
                    IsVerified = true
                };

                await user.Save();
            }

            var accessToken = _jwtService.GenerateToken(user);
            var refreshToken = await user.GenerateRefreshToken();

            Response.Cookies.Append("refreshToken", refreshToken.Token, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Expires = refreshToken.ExpiresAt
            });

            return Ok(new {
                message = "Singed in successfully",
                data = new {
                    token = accessToken,
                    role = (await user.GetRole())?.Name,
                    user = new {
                        user.FirstName,
                        user.LastName,
                        user.Username,
                        user.Email
                    }
                }
            });
        }

        [HttpPost("verify-email")]
        public async Task<IActionResult> VerifyEmail([FromBody] VerifyEmailDto request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var token = await VTokenModel.FindByToken(request.Token);
            if (token == null || token.ExpiresAt < DateTime.UtcNow)
                return BadRequest(new { message = "Invalid or expired verification token" });

            var user = await UserModel.FindById(token.UserId);
            if (user == null)
                return NotFound(new { message = "User not found" });

            user.IsVerified = true;
            await user.Save();

            await token.Delete();

            return Ok(new { message = "Email verified successfully" });
        }

        [HttpPut("logout")]
        [Authorize]
        public async Task<IActionResult> Logout()
        {
            await _jwtService.BlackListToken(User);

            var user = await _jwtService.GetUserFromClaims(User);
           
            if (user == null)
                return Unauthorized(new { message = "User not authenticated" });

            await user.InvokeRefreshToken();

            
            Response.Cookies.Delete("refreshToken", new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Path = "/"
            });

            return Ok(new { message = "Logged out successfully" });
        }
    }
}