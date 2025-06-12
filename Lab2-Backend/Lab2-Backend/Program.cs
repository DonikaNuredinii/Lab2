using Lab2_Backend;
using Lab2_Backend.Configurations;
using Lab2_Backend.MongoService;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Driver;
using Stripe;
using System.Runtime.InteropServices;
using System.Text;
using Microsoft.Extensions.Options;
using System.Security.Claims;
using Lab2_Backend.Hubs; // ✅ Import ChatHub

var builder = WebApplication.CreateBuilder(args);

// ✅ Load config and Stripe
builder.Configuration.AddJsonFile("appsettings.json", optional: false, reloadOnChange: true);
StripeConfiguration.ApiKey = builder.Configuration["Stripe:SecretKey"];

// ✅ SQL setup
var isWindows = RuntimeInformation.IsOSPlatform(OSPlatform.Windows);
var connectionString = isWindows
    ? builder.Configuration.GetConnectionString("TrustedConnection")
    : builder.Configuration.GetConnectionString("SqlAuthConnection");

builder.Services.AddDbContext<MyContext>(options =>
    options.UseSqlServer(connectionString));

// ✅ MongoDB
builder.Services.Configure<MongoDBSettings>(
    builder.Configuration.GetSection("MongoDBSettings"));

builder.Services.AddSingleton<IMongoClient>(sp =>
{
    var mongoSettings = sp.GetRequiredService<IOptions<MongoDBSettings>>().Value;
    return new MongoClient(mongoSettings.ConnectionString);
});

builder.Services.AddScoped<MongoAuditLogService>();
builder.Services.AddScoped<ChatService>();

// ✅ CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("https://localhost:7076", "http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// ✅ JWT Authentication
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var jwtKey = jwtSettings["SecretKey"];
var key = Encoding.UTF8.GetBytes(jwtKey);

var tokenValidationParams = new TokenValidationParameters
{
    ValidateIssuer = true,
    ValidateAudience = true,
    ValidateLifetime = true,
    ValidateIssuerSigningKey = true,
    ValidIssuer = jwtSettings["Issuer"],
    ValidAudience = jwtSettings["Audience"],
    IssuerSigningKey = new SymmetricSecurityKey(key)
};
builder.Services.AddSingleton(tokenValidationParams);

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                // ✅ Accept token from SignalR query string too
                var accessToken = context.Request.Query["access_token"];

                // If request is for SignalR hub
                var path = context.HttpContext.Request.Path;
                if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/chatHub"))
                {
                    context.Token = accessToken;
                }
                else if (string.IsNullOrEmpty(accessToken))
                {
                    // fallback to cookie (if used)
                    var cookieToken = context.Request.Cookies["jwt"];
                    if (!string.IsNullOrEmpty(cookieToken))
                        context.Token = cookieToken;
                }

                return Task.CompletedTask;
            }
        };

        options.TokenValidationParameters = tokenValidationParams;
    });

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminPolicy", policy =>
        policy.RequireClaim("RolesID", "1"));
});

builder.Services.AddSignalR(); // ✅ Add SignalR support
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// ✅ Middleware Order
app.UseHttpsRedirection();
app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// ✅ Routes
app.MapControllers();
app.MapHub<ChatHub>("/chatHub"); // ✅ Enable SignalR Hub route

app.Run();
