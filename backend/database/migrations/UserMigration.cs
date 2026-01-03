using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Bson.Serialization.Attributes;

namespace Database.Migrations
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

        [BsonElement("Password")]
        public string Password { get; set; } = string.Empty;

        [BsonElement("ProfilePicURL")]
        public string? ProfilePicURL { get; set; }

        [BsonElement("IsVerified")]
        public bool IsVerified { get; set; } = false;

        [BsonElement("2FaEnabled")]
        public bool FaEnabled { get; set; } = false;

        [BsonElement("RoleID")]
        [BsonRepresentation(BsonType.ObjectId)]
        public ObjectId RoleID { get; set; }

        [BsonElement("createdAt")]
        public DateTime CreatedAt { get; set; }

        [BsonElement("updatedAt")]
        public DateTime UpdatedAt { get; set; }
    }

    public class UserMigration : IMigration
    {
        private readonly IMongoDatabase _database;
        private readonly IMongoCollection<UserDocument> _collection;

        public int Order => 2;
        public string Name => "users";
        public string Icon => "👤";

        public UserMigration(IMongoDatabase database)
        {
            _database = database;
            _collection = database.GetCollection<UserDocument>("users");
        }

        public async Task MigrateAsync()
        {
            await CreateCollection();
            await CreateIndexes();
            Console.WriteLine($"✓ Migration completed for {Name}");
        }

        private async Task CreateCollection()
        {
            var collections = await _database.ListCollectionNamesAsync();
            var collectionList = await collections.ToListAsync();
            
            if (collectionList.Contains(Name))
            {
                Console.WriteLine("  • Collection already exists");
                return;
            }

            await _database.CreateCollectionAsync(Name);
            Console.WriteLine("  • Collection created");
        }

        private async Task CreateIndexes()
        {
            try
            {
                var indexes = await _collection.Indexes.ListAsync();
                var indexList = await indexes.ToListAsync();
                var indexNames = indexList.Select(i => i["name"].AsString).ToList();

                if (!indexNames.Contains("EmailIndex"))
                {
                    var emailIndexKeysDefinition = Builders<UserDocument>.IndexKeys.Ascending(x => x.Email);
                    var emailIndexOptions = new CreateIndexOptions
                    {
                        Unique = true,
                        Name = "EmailIndex"
                    };
                    var emailIndexModel = new CreateIndexModel<UserDocument>(emailIndexKeysDefinition, emailIndexOptions);
                    await _collection.Indexes.CreateOneAsync(emailIndexModel);
                    Console.WriteLine("  • Created index: EmailIndex (unique)");
                }
                else
                {
                    Console.WriteLine("  • Index already exists: EmailIndex");
                }

                if (!indexNames.Contains("RoleIDIndex"))
                {
                    var roleIdIndexKeysDefinition = Builders<UserDocument>.IndexKeys.Ascending(x => x.RoleID);
                    var roleIdIndexOptions = new CreateIndexOptions { Name = "RoleIDIndex" };
                    var roleIdIndexModel = new CreateIndexModel<UserDocument>(roleIdIndexKeysDefinition, roleIdIndexOptions);
                    await _collection.Indexes.CreateOneAsync(roleIdIndexModel);
                    Console.WriteLine("  • Created index: RoleIDIndex");
                }
                else
                {
                    Console.WriteLine("  • Index already exists: RoleIDIndex");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"  ⚠️  Error creating indexes: {ex.Message}");
            }
        }
    }
}