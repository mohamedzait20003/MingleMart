using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Bson.Serialization.Attributes;

namespace Database.Seeders
{
    public class RoleDocument
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public ObjectId Id { get; set; }

        [BsonElement("Name")]
        public string Name { get; set; } = string.Empty;

        [BsonElement("createdAt")]
        public DateTime CreatedAt { get; set; }

        [BsonElement("updatedAt")]
        public DateTime UpdatedAt { get; set; }
    }

    public class RoleSeeder : ISeeder
    {
        private readonly IMongoDatabase _database;
        private readonly IMongoCollection<RoleDocument> _collection;

        public int Order => 1;
        public string Name => "roles";
        public string Icon => "👑";

        public RoleSeeder(IMongoDatabase database)
        {
            _database = database;
            _collection = database.GetCollection<RoleDocument>("roles");
            CreateIndexes().Wait();
        }

        public async Task SeedAsync()
        {
            var count = await _collection.CountDocumentsAsync(Builders<RoleDocument>.Filter.Empty);
            if (count > 0)
            {
                Console.WriteLine("✓ Roles already seeded. Skipping...");
                return;
            }

            var Roles = new List<RoleDocument>
            {
                new RoleDocument
                {
                    Id = ObjectId.GenerateNewId(),
                    Name = "Admin",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                new RoleDocument
                {
                    Id = ObjectId.GenerateNewId(),
                    Name = "Customer",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                new RoleDocument
                {
                    Id = ObjectId.GenerateNewId(),
                    Name = "Moderator",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                }
            };

            await _collection.InsertManyAsync(Roles);
            Console.WriteLine($"✓ Seeded {Roles.Count} roles successfully.");
        }

        private async Task CreateIndexes()
        {
            try
            {
                var nameIndexKeysDefinition = Builders<RoleDocument>.IndexKeys.Ascending(x => x.Name);
                var nameIndexOptions = new CreateIndexOptions
                {
                    Unique = true,
                    Name = "NameIndex"
                };

                var nameIndexModel = new CreateIndexModel<RoleDocument>(nameIndexKeysDefinition, nameIndexOptions);
                await _collection.Indexes.CreateOneAsync(nameIndexModel);
            } catch (Exception) {
                Console.WriteLine("Index already exists for RoleDocument.");
            }
        }
    }
}