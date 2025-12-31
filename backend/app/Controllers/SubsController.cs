using App.DTOs;
using App.Models;
using App.Mailers;
using App.Services;
using RazorEngineCore;
using Microsoft.AspNetCore.Mvc;

namespace Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SubsController : ControllerBase
    {
        private readonly IRazorEngine _razorEngine;
        private readonly IEmailService _emailService;
        private readonly IWebHostEnvironment _environment;

        public SubsController(IEmailService emailService, IWebHostEnvironment environment, IRazorEngine razorEngine)
        {
            _emailService = emailService;
            _razorEngine = razorEngine;
            _environment = environment;
        }

        [HttpPost("subscribe")]
        public async Task<IActionResult> Subscribe([FromBody] SubsDto request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var subs = new SubsModel
            {
                Email = request.Email
            };
            
            await subs.Save();

            var mailer = new ESubsMailer(subs.Email, _razorEngine, _environment);
            await _emailService.SendAsync(mailer);

            return Ok(new { message = "Subscribed successfully" });
        }
    }
}
