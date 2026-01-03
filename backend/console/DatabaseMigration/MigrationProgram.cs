using DotNetEnv;
using MongoDB.Driver;
using Database.Migrations;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Commands
{
    class MigrationProgram
    {
        public static async Task Main(string[] args)
        {
            Env.Load();
            Console.WriteLine("🚀 Starting Database Migrations...");

            var host = CreateHostBuilder(args).Build();

            if(args.Length == 0 || args[0].ToLower() != "migrate")
            {
                Console.WriteLine("❌ No valid command provided. Use 'migrate' to run migrations.");
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

            Console.WriteLine("📋 Discovering and registering migrations...");
            RegisterAllMigrations(services);
            Console.WriteLine();
        });

        private static async Task ExecuteCommand(string command, IServiceProvider services)
        {
            var parts = command.Split(':');

            if (parts.Length != 2 || parts[0] != "migrate")
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
                    await MigrateAll(services);
                    break;
                case "fresh":
                    await MigrateFresh(services);
                    break;
                default:
                    await MigrateSpecific(services, target);
                    break;
            }
        }

        private static void ShowUsage(IServiceProvider services)
        {
            using var scope = services.CreateScope();
            var migrations = GetRegisteredMigrations(scope.ServiceProvider);

            Console.WriteLine("Usage:");
            Console.WriteLine("  dotnet run --project console/DatabaseMigration [command] [options]\n");
            Console.WriteLine("Commands:");
            Console.WriteLine("  migrate:all      - Run all migrations");
            Console.WriteLine("  migrate:fresh    - Drop collections and run migrations");
            
            if (migrations.Any())
            {
                Console.WriteLine("\n  Individual Migrations:");
                foreach (var migration in migrations.OrderBy(m => m.Order)) {
                    Console.WriteLine($"  migrate:{migration.Name,-15} - {migration.Icon} Migrate {migration.Name} (Order: {migration.Order})");
                }
            }
            
            Console.WriteLine("\nOptions:");
            Console.WriteLine("  --verbose     - Show detailed error messages");
            Console.WriteLine("\nExamples:");
            Console.WriteLine("  dotnet run --project console/DatabaseMigration migrate:all");
            Console.WriteLine("  dotnet run --project console/DatabaseMigration migrate:roles");
            Console.WriteLine("  dotnet run --project console/DatabaseMigration migrate:fresh --verbose");
        }

        private static void RegisterAllMigrations(IServiceCollection services)
        {
            var migrationTypes = GetAllMigrationTypes();

            foreach (var migrationType in migrationTypes)
            {
                services.AddScoped(migrationType);
                services.AddScoped(typeof(IMigration), migrationType);
                Console.WriteLine($"  ✓ Registered: {migrationType.Name}");
            }

            Console.WriteLine($"\n📊 Total migrations registered: {migrationTypes.Count}");
        }

        private static List<Type> GetAllMigrationTypes()
        {
            try {
                var assemblies = AppDomain.CurrentDomain.GetAssemblies();
                var types = new List<Type>();

                foreach (var assembly in assemblies)
                {
                    try {
                        var migrationTypes = assembly.GetTypes()
                            .Where(t => typeof(IMigration).IsAssignableFrom(t) 
                                && !t.IsInterface 
                                && !t.IsAbstract 
                                && t.Namespace == "Database.Migrations")
                            .ToList();
                        types.AddRange(migrationTypes);
                    } catch {
                        continue;
                    }
                }

                return types;
            } catch (Exception ex) {
                Console.WriteLine($"❌ Error discovering migration types: {ex.Message}");
                return new List<Type>();
            }
        }

        private static async Task MigrateAll(IServiceProvider services)
        {
            Console.WriteLine("🔧 Running all migrations...\n");
            var startTime = DateTime.Now;

            var migrations = GetRegisteredMigrations(services);

            if (!migrations.Any())
            {
                Console.WriteLine("❌ No migrations found!");
                return;
            }

            foreach (var migration in migrations)
            {
                await ExecuteMigration(migration);
            }

            var elapsed = DateTime.Now - startTime;
            Console.WriteLine($"\n✅ All migrations completed successfully in {elapsed.TotalSeconds:F2}s!");
        }

        private static async Task MigrateSpecific(IServiceProvider services, string migrationName)
        {
            var migrations = GetRegisteredMigrations(services);
            var migration = migrations.FirstOrDefault(m => m.Name.Equals(migrationName, StringComparison.OrdinalIgnoreCase));

            if (migration == null)
            {
                Console.WriteLine($"❌ Migration not found: {migrationName}");
                var available = string.Join(", ", migrations.Select(m => m.Name));
                Console.WriteLine($"Available migrations: {available}");
                Environment.Exit(1);
                return;
            }

            await ExecuteMigration(migration);
            Console.WriteLine($"\n✅ Migration {migration.Name} completed!");
        }

        private static async Task MigrateFresh(IServiceProvider services)
        {
            Console.WriteLine("🔄 Fresh migration (dropping and recreating)...\n");
            
            Console.Write("⚠️  Are you sure you want to drop all collections? Type 'yes' to confirm: ");
            var confirmation = Console.ReadLine()?.Trim().ToLower();
            
            if (confirmation != "yes")
            {
                Console.WriteLine("❌ Operation cancelled.");
                return;
            }
            
            var database = services.GetRequiredService<IMongoDatabase>();
            var migrations = GetRegisteredMigrations(services);
            
            Console.WriteLine("\n🗑️  Dropping collections...");
            foreach (var migration in migrations)
            {
                try
                {
                    await database.DropCollectionAsync(migration.Name);
                    Console.WriteLine($"  ✓ Dropped: {migration.Name}");
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"  ⚠️  Skipped {migration.Name}: {ex.Message}");
                }
            }

            Console.WriteLine();
            await MigrateAll(services);
        }

        static async Task ExecuteMigration(IMigration migration)
        {
            Console.WriteLine($"\n{migration.Icon} Migrating {migration.Name}...");
            await migration.MigrateAsync();
        }
    }
}