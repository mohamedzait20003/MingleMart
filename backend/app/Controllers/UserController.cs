using App.DTOs;
using App.Models;
using App.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace App.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly JwtService _jwtService;
        private readonly CloudinaryService _cloudinaryService;

        public UserController(JwtService jwtService, CloudinaryService cloudinaryService)
        {
            _jwtService = jwtService;
            _cloudinaryService = cloudinaryService;
        }

        [HttpPut("update-password")]
        [Authorize]
        public async Task<IActionResult> UpdatePassword([FromBody] UPasswordDto request)
        {
            try{
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var user = HttpContext.Items["User"] as UserModel;
                if (user == null)
                    return Unauthorized(new { message = "User not authenticated" });

                await user.UpdatePassword(request.CurrentPassword, request.NewPassword);
                return Ok(new { 
                    message = "Password updated successfully" 
                });
            } catch (Exception ex) {
                return StatusCode(500, new { 
                    message = ex.Message
                });
            }
        }

        [HttpPut("update-picture")]
        [Authorize]
        public async Task<IActionResult> UpdateProfilePic([FromForm] UProfilePicDto request)
        {
            try
            {
                if(!ModelState.IsValid)
                    return BadRequest(ModelState);

                var user = HttpContext.Items["User"] as UserModel;
                if(user == null)
                    return Unauthorized(new { message = "User not authenticated" });

                
                var updatedUser = await user.UpdateProfilePic(request.ImageFile, _cloudinaryService);
                return Ok(new { 
                    message = "Profile picture updated successfully",
                    data = updatedUser.ProfilePicURL
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { 
                    message = "Failed to update profile picture", 
                    error = ex.Message 
                });
            }
        }
    }
}