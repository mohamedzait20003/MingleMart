using App.Models;
using App.Services;

namespace App.Middleware
{
    public class UserContextMiddleware
    {
        private readonly RequestDelegate _next;

        public UserContextMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context, JwtService jwtService)
        {
            if (context.User.Identity?.IsAuthenticated == true)
            {
                var user = await jwtService.GetUserFromClaims(context.User);
                if (user != null)
                {
                    context.Items["User"] = user;
                }
            }

            await _next(context);
        }
    }
}
