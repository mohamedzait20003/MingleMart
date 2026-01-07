using DotNetEnv;
using App.Models;
using App.Services;
using App.Middleware;
using RazorEngineCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.JwtBearer;



Env.Load();

var builder = WebApplication.CreateBuilder(args);
builder.Configuration.AddEnvironmentVariables();

builder.Services.AddSwaggerGen();
builder.Services.AddControllers();
builder.Services.AddMemoryCache();
builder.Services.AddHttpContextAccessor();
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSingleton<JwtService>();
builder.Services.AddSingleton<GoogleService>();
builder.Services.AddSingleton<DatabaseService>();
builder.Services.AddSingleton<DetectionService>();
builder.Services.AddSingleton<CloudinaryService>();
builder.Services.AddSingleton<IRazorEngine, RazorEngine>();
builder.Services.AddSingleton<IAuthorizationHandler, RoleHandler>();

builder.Services.AddTransient<IEmailService, EmailService>();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(options =>
{
    var jwtKey = builder.Configuration["Jwt:Key"] ?? throw new Exception("JWT_SECRET is not set in environment variables");

    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = false,
        ValidateAudience = false,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(jwtKey)),
        ClockSkew = TimeSpan.Zero
    };

    options.Events = new JwtBearerEvents
    {
        OnTokenValidated = context =>
        {
            var jwtService = context.HttpContext.RequestServices.GetRequiredService<JwtService>();
            var jti = context.Principal?.FindFirst(JwtRegisteredClaimNames.Jti)?.Value;

            if (!string.IsNullOrEmpty(jti) && jwtService.IsTokenBlacklisted(jti))
            {
                context.Fail("Token has been revoked");
            }

            return Task.CompletedTask;
        },

        OnAuthenticationFailed = context =>
        {
            if (context.Exception.GetType() == typeof(SecurityTokenExpiredException))
            {
                context.Response.Headers.Append("Token-Expired", "true");
            }

            return Task.CompletedTask;
        }
    };
});

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("RequireAdmin", policy => policy.Requirements.Add(new RoleRequirement("Admin")));
    options.AddPolicy("RequireCustomer", policy => policy.Requirements.Add(new RoleRequirement("Customer")));
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.WithOrigins(
            "http://localhost:3000",
            "http://localhost:5173"
        ).AllowAnyMethod().AllowAnyHeader().AllowCredentials();
    });
});


var app = builder.Build();

var dbService = app.Services.GetRequiredService<DatabaseService>();
UserModel.Initialize(dbService);
RoleModel.Initialize(dbService);
SubsModel.Initialize(dbService);
VTokenModel.Initialize(dbService);
RTokenModel.Initialize(dbService);
PTokenModel.Initialize(dbService);
CategoryModel.Initialize(dbService);
ProductModel.Initialize(dbService);

if(app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowAll");
app.UseHttpsRedirection();

app.UseAuthorization();
app.UseAuthentication();
app.UseMiddleware<UserContextMiddleware>();

app.UseForwardedHeaders(new ForwardedHeadersOptions
{
    ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
});

app.MapControllers();
app.Run();
