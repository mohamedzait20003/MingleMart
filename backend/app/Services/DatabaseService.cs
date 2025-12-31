using MongoDB.Driver;

namespace App.Services
{
    public class DatabaseService
    {
        private readonly IMongoDatabase _database;
        
        public DatabaseService(IConfiguration configuration)
        {
            var connectionString = Environment.GetEnvironmentVariable("MONGODB_CONNECTION_URI")  ?? configuration["MongoDB:ConnectionURI"];
            var databaseName = Environment.GetEnvironmentVariable("MONGODB_DATABASE_NAME") ?? configuration["MongoDB:DatabaseName"];

            if (string.IsNullOrEmpty(connectionString))
                throw new InvalidOperationException("MongoDB connection string is not configured.");
            if (string.IsNullOrEmpty(databaseName))
                throw new InvalidOperationException("MongoDB database name is not configured.");

            var client = new MongoClient(connectionString);
            _database = client.GetDatabase(databaseName);
        }

        public IMongoDatabase Database => _database;

        public IMongoCollection<T> GetCollection<T>(string name)
        {
            return _database.GetCollection<T>(name);
        }
    }
}