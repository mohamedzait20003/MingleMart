using DotNetEnv;
using MongoDB.Driver;
using Database.Seeders;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Commands
{
    class SeederProgram
    {
        static async Task Main(string[] args)
        {
            Env.Load();
            Console.WriteLine("🌱 Database Seeder Tool\n");

            var host = CreateHostBuilder(args).Build();

            if (args.Length == 0)
            {
                ShowUsage(host.Services);
                return;
            }

            var command = args[0].ToLower();

            using var scope = host.Services.CreateScope();
            var services = scope.ServiceProvider;

            try {
                await ExecuteCommand(command, services);
            } catch (Exception ex) {
                Console.WriteLine($"\n❌ Error: {ex.Message}");
                
                if (args.Contains("--verbose")) {
                    Console.WriteLine($"\nStack Trace:\n{ex.StackTrace}");
                }

                Environment.Exit(1);
            }
        }

        static IHostBuilder CreateHostBuilder(string[] args) => Host.CreateDefaultBuilder(args).ConfigureAppConfiguration((context, config) => {
            config.SetBasePath(Directory.GetCurrentDirectory()).AddJsonFile("appsettings.json", optional: false, reloadOnChange: true).AddJsonFile($"appsettings.{context.HostingEnvironment.EnvironmentName}.json", optional: true).AddEnvironmentVariables();
        }).ConfigureServices((hostContext, services) => {
            var configuration = hostContext.Configuration;
            
            var connectionUri = Environment.GetEnvironmentVariable("MONGODB_CONNECTION_URI") ?? configuration["MongoDB:ConnectionURI"];
            var databaseName = Environment.GetEnvironmentVariable("MONGODB_DATABASE_NAME") ?? configuration["MongoDB:DatabaseName"];

            if (string.IsNullOrEmpty(connectionUri) || string.IsNullOrEmpty(databaseName))
            {
                throw new ArgumentNullException("MongoDB connection details are missing in environment variables or configuration.");
            }

            var mongoClient = new MongoClient(connectionUri);
            var mongoDatabase = mongoClient.GetDatabase(databaseName);

            services.AddSingleton<MongoClient>(mongoClient);
            services.AddSingleton<IMongoDatabase>(mongoDatabase);

            Console.WriteLine($"✓ Connected to database: {databaseName}\n");

            Console.WriteLine("📋 Discovering and registering seeders...");
            RegisterAllSeeders(services);
            Console.WriteLine();
        });

        static void ShowUsage(IServiceProvider services)
        {
            using var scope = services.CreateScope();
            var seeders = GetRegisteredSeeders(scope.ServiceProvider);

            Console.WriteLine("Usage:");
            Console.WriteLine("  dotnet run --project console/DatabaseSeeder [command] [options]\n");
            Console.WriteLine("Commands:");
            Console.WriteLine("  seed:all      - Seed all data");
            Console.WriteLine("  seed:fresh    - Drop collections and reseed");
            
            if (seeders.Any())
            {
                Console.WriteLine("\n  Individual Seeders:");
                foreach (var seeder in seeders.OrderBy(s => s.Order)) {
                    Console.WriteLine($"  seed:{seeder.Name,-12} - {seeder.Icon} Seed {seeder.Name} data (Order: {seeder.Order})");
                }
            }
            
            Console.WriteLine("\nOptions:");
            Console.WriteLine("  --verbose     - Show detailed error messages");
            Console.WriteLine("\nExamples:");
            Console.WriteLine("  dotnet run --project console/DatabaseSeeder seed:all");
            Console.WriteLine("  dotnet run --project console/DatabaseSeeder seed:roles");
            Console.WriteLine("  dotnet run --project console/DatabaseSeeder seed:fresh --verbose");
        }

        static async Task ExecuteCommand(string command, IServiceProvider services)
        {
            var parts = command.Split(':');

            if (parts.Length != 2 || parts[0] != "seed")
            {
                Console.WriteLine($"❌ Invalid command format: {command}");
                ShowUsage(services);
                Environment.Exit(1);
                return;
            }

            var target = parts[1].ToLower();

            switch (target)
            {
                case "all":
                    await SeedAll(services);
                    break;
                case "fresh":
                    await SeedFresh(services);
                    break;
                default:
                    await SeedSpecific(services, target);
                    break;
            }
        }

        static void RegisterAllSeeders(IServiceCollection services)
        {
            var seederTypes = GetAllSeederTypes();

            foreach (var seederType in seederTypes)
            {
                services.AddScoped(seederType);
                services.AddScoped(typeof(ISeeder), seederType);
                Console.WriteLine($"  ✓ Registered: {seederType.Name}");
            }

            Console.WriteLine($"\n📊 Total seeders registered: {seederTypes.Count}");
        }

        static List<Type> GetAllSeederTypes()
        {
            try {
                var assemblies = AppDomain.CurrentDomain.GetAssemblies();
                var types = new List<Type>();

                foreach (var assembly in assemblies)
                {
                    try {
                        var seederTypes = assembly.GetTypes()
                            .Where(t => typeof(ISeeder).IsAssignableFrom(t) 
                                && !t.IsInterface 
                                && !t.IsAbstract 
                                && t.Namespace == "Database.Seeders")
                            .ToList();
                        types.AddRange(seederTypes);
                    } catch {
                        continue;
                    }
                }

                return types;
            } catch (Exception ex) {
                Console.WriteLine($"❌ Error discovering seeder types: {ex.Message}");
                return new List<Type>();
            }
        }

        static List<ISeeder> GetRegisteredSeeders(IServiceProvider services)
        {
            var seederTypes = GetAllSeederTypes();
            var seeders = new List<ISeeder>();

            foreach (var seederType in seederTypes)
            {
                try {
                    var seeder = (ISeeder)services.GetRequiredService(seederType);
                    seeders.Add(seeder);
                } catch {
                    continue;
                }
            }

            return seeders.OrderBy(s => s.Order).ToList();
        }

        static async Task SeedAll(IServiceProvider services)
        {
            Console.WriteLine("📦 Seeding all data...\n");
            var startTime = DateTime.Now;

            var seeders = GetRegisteredSeeders(services);

            if (!seeders.Any())
            {
                Console.WriteLine("❌ No seeders found!");
                return;
            }

            foreach (var seeder in seeders)
            {
                await ExecuteSeeder(seeder);
            }

            var elapsed = DateTime.Now - startTime;
            Console.WriteLine($"\n✅ All data seeded successfully in {elapsed.TotalSeconds:F2}s!");
        }

        static async Task SeedSpecific(IServiceProvider services, string seederName)
        {
            var seeders = GetRegisteredSeeders(services);
            var seeder = seeders.FirstOrDefault(s => s.Name.Equals(seederName, StringComparison.OrdinalIgnoreCase));

            if (seeder == null)
            {
                Console.WriteLine($"❌ Seeder not found: {seederName}");
                var available = string.Join(", ", seeders.Select(s => s.Name));
                Console.WriteLine($"Available seeders: {available}");
                Environment.Exit(1);
                return;
            }

            await ExecuteSeeder(seeder);
            Console.WriteLine($"\n✅ Seeding {seeder.Name} completed!");
        }

        static async Task SeedFresh(IServiceProvider services)
        {
            Console.WriteLine("🔄 Fresh seeding (dropping and reseeding)...\n");
            
            Console.Write("⚠️  Are you sure you want to drop all data? Type 'yes' to confirm: ");
            var confirmation = Console.ReadLine()?.Trim().ToLower();
            
            if (confirmation != "yes")
            {
                Console.WriteLine("❌ Operation cancelled.");
                return;
            }
            
            var database = services.GetRequiredService<IMongoDatabase>();
            var seeders = GetRegisteredSeeders(services);
            
            Console.WriteLine("\n🗑️  Dropping collections...");
            foreach (var seeder in seeders)
            {
                try
                {
                    await database.DropCollectionAsync(seeder.Name);
                    Console.WriteLine($"  ✓ Dropped: {seeder.Name}");
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"  ⚠️  Skipped {seeder.Name}: {ex.Message}");
                }
            }

            Console.WriteLine();
            await SeedAll(services);
        }

        static async Task ExecuteSeeder(ISeeder seeder)
        {
            Console.Write($"{seeder.Icon} Seeding {seeder.Name}... ");
            await seeder.SeedAsync();
        }
    }
}