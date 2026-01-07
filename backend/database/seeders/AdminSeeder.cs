using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Bson.Serialization.Attributes;
using System.Text.Json.Serialization;

namespace Database.Seeders
{
    public class UserDocument
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public ObjectId Id { get; set; }

        [BsonElement("FirstName")]
        public string FirstName { get; set; } = string.Empty;

        [BsonElement("LastName")]
        public string LastName { get; set; } = string.Empty;

        [BsonElement("Username")]
        public string Username { get; set; } = string.Empty;

        [BsonElement("Email")]
        public string Email { get; set; } = string.Empty;

        [JsonIgnore]
        [BsonElement("Password")]
        public string Password { get; set; } = string.Empty;

        [BsonElement("ProfilePicURL")]
        public string? ProfilePicURL { get; set; }

        [BsonElement("IsVerified")]
        public bool IsVerified { get; set; } = false;

        [BsonElement("2FaEnabled")]
        public bool FaEnabled { get; set; } = false;

        [BsonElement("Gender")]
        public string Gender { get; set; } = string.Empty;

        [BsonElement("DateOfBirth")]
        public DateTime DateOfBirth { get; set; }

        [BsonElement("Language")]
        public string Language { get; set; } = string.Empty;

        [BsonElement("TimeZone")]
        public string TimeZone { get; set; } = string.Empty;

        [BsonElement("IsActivityTracked")]
        public bool IsActivityTracked { get; set; } = true;

        [BsonElement("IsDataShared")]
        public bool IsDataShared { get; set; } = false;

        [BsonElement("IsEmailNotified")]
        public bool IsEmailNotified { get; set; } = true;

        [BsonElement("IsSecurityNotified")]
        public bool IsSecurityNotified { get; set; } = true;

        [BsonElement("IsUpdateNotified")]
        public bool IsUpdateNotified { get; set; } = true;

        [BsonElement("RoleID")]
        public ObjectId RoleID { get; set; }

        [BsonElement("createdAt")]
        public DateTime CreatedAt { get; set; }

        [BsonElement("updatedAt")]
        public DateTime UpdatedAt { get; set; }
    }

    public class AdminSeeder : ISeeder
    {
        private readonly IMongoDatabase _database;
        private readonly IMongoCollection<UserDocument> _collection;

        public int Order => 2;
        public string Name => "admin";
        public string Icon => "👑";

        public AdminSeeder(IMongoDatabase database)
        {
            _database = database;
            _collection = database.GetCollection<UserDocument>("Users");
        }

        public async Task SeedAsync()
        {
            var count = await _collection.CountDocumentsAsync(Builders<UserDocument>.Filter.Empty);
            if (count > 0)
            {
                Console.WriteLine("✓ Admin already seeded. Skipping...");
                return;
            }

            var rolesCollection = _database.GetCollection<BsonDocument>("Roles");
            var adminRole = await rolesCollection.Find(Builders<BsonDocument>.Filter.Eq("Name", "Admin")).FirstOrDefaultAsync();
            if (adminRole == null)
            {
                Console.WriteLine("✗ Admin role not found. Please run RoleSeeder first.");
                return;
            }

            var adminRoleId = adminRole["_id"].AsObjectId;

            var admin = new UserDocument
            {
                Id = ObjectId.GenerateNewId(),
                FirstName = "Admin",
                LastName = "User",
                Username = "admin",
                Email = "admin@zcommerce.com",
                Password = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
                ProfilePicURL = null,
                IsVerified = true,
                FaEnabled = false,
                Gender = "Male",
                DateOfBirth = new DateTime(2003, 7, 1),
                Language = "en",
                TimeZone = "UTC",
                IsActivityTracked = true,
                IsDataShared = false,
                IsEmailNotified = true,
                IsSecurityNotified = true,
                IsUpdateNotified = true,
                RoleID = adminRoleId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _collection.InsertOneAsync(admin);
            Console.WriteLine("✓ Seeded 1 admin user successfully.");
        }
    }
}