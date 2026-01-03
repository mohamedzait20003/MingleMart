using App.Models;
using Microsoft.AspNetCore.Authorization;

namespace App.Services
{
    public class RoleRequirement : IAuthorizationRequirement
    {
        public string[] Roles { get; }

        public RoleRequirement(params string[] roles)
        {
            Roles = roles;
        }
    }


    public class RoleHandler : AuthorizationHandler<RoleRequirement>
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public RoleHandler(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        protected override async Task HandleRequirementAsync(AuthorizationHandlerContext context, RoleRequirement requirement)
        {
            if (context.User.Identity?.IsAuthenticated != true){
                context.Fail();
                return;
            }

            var httpContext = _httpContextAccessor.HttpContext;
            if (httpContext == null)
            {
                context.Fail();
                return;
            }

            var user = httpContext.Items["User"] as UserModel;

            if (user == null)
            {
                context.Fail();
                return;
            }

            var role = await user.GetRole();

            if (role != null && requirement.Roles.Contains(role.Name)){
                context.Succeed(requirement);
            } else {
                context.Fail();
            }
        }
    }
}
