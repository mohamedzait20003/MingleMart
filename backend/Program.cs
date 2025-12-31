using DotNetEnv;
using App.Models;
using App.Services;
using RazorEngineCore;

Env.Load();

var builder = WebApplication.CreateBuilder(args);
builder.Configuration.AddEnvironmentVariables();

builder.Services.AddSwaggerGen();
builder.Services.AddControllers();
builder.Services.AddMemoryCache();
builder.Services.AddAuthorization();
builder.Services.AddAuthentication();
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSingleton<JwtService>();
builder.Services.AddSingleton<GoogleService>();
builder.Services.AddSingleton<DatabaseService>();
builder.Services.AddSingleton<CloudinaryService>();
builder.Services.AddSingleton<IRazorEngine, RazorEngine>();

builder.Services.AddTransient<IEmailService, EmailService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});


var app = builder.Build();

var dbService = app.Services.GetRequiredService<DatabaseService>();
UserModel.Initialize(dbService);
RoleModel.Initialize(dbService);
SubsModel.Initialize(dbService);
VTokenModel.Initialize(dbService);
RTokenModel.Initialize(dbService);
CategoryModel.Initialize(dbService);
ProductModel.Initialize(dbService);

if(app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowAll");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();
