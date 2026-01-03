using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Bson.Serialization.Attributes;

namespace Database.Migrations
{
    public class RTokenDocument
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public ObjectId Id { get; set; }

        [BsonElement("userId")]
        [BsonRepresentation(BsonType.ObjectId)]
        public ObjectId UserId { get; set; }

        [BsonElement("Token")]
        public string Token { get; set; } = string.Empty;

        [BsonElement("expiresAt")]
        public DateTime ExpiresAt { get; set; }

        [BsonElement("createdAt")]
        public DateTime CreatedAt { get; set; }

        [BsonElement("updatedAt")]
        public DateTime UpdatedAt { get; set; }
    }

    public class RTokenMigration : IMigration
    {
        private readonly IMongoDatabase _database;
        private readonly IMongoCollection<RTokenDocument> _collection;

        public int Order => 4;
        public string Name => "Rtokens";
        public string Icon => "🔄";

        public RTokenMigration(IMongoDatabase database)
        {
            _database = database;
            _collection = database.GetCollection<RTokenDocument>("Rtokens");
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

                // Token Index (Unique)
                if (!indexNames.Contains("TokenIndex"))
                {
                    var tokenIndexKeysDefinition = Builders<RTokenDocument>.IndexKeys.Ascending(x => x.Token);
                    var tokenIndexOptions = new CreateIndexOptions
                    {
                        Unique = true,
                        Name = "TokenIndex"
                    };
                    var tokenIndexModel = new CreateIndexModel<RTokenDocument>(tokenIndexKeysDefinition, tokenIndexOptions);
                    await _collection.Indexes.CreateOneAsync(tokenIndexModel);
                    Console.WriteLine("  • Created index: TokenIndex (unique)");
                }
                else
                {
                    Console.WriteLine("  • Index already exists: TokenIndex");
                }

                // UserId Index
                if (!indexNames.Contains("UserIdIndex"))
                {
                    var userIdIndexKeysDefinition = Builders<RTokenDocument>.IndexKeys.Ascending(x => x.UserId);
                    var userIdIndexOptions = new CreateIndexOptions { Name = "UserIdIndex" };
                    var userIdIndexModel = new CreateIndexModel<RTokenDocument>(userIdIndexKeysDefinition, userIdIndexOptions);
                    await _collection.Indexes.CreateOneAsync(userIdIndexModel);
                    Console.WriteLine("  • Created index: UserIdIndex");
                }
                else
                {
                    Console.WriteLine("  • Index already exists: UserIdIndex");
                }

                // ExpiresAt Index (TTL)
                if (!indexNames.Contains("ExpireAtIndex"))
                {
                    var expiresAtIndexKeysDefinition = Builders<RTokenDocument>.IndexKeys.Ascending(x => x.ExpiresAt);
                    var expiresAtIndexOptions = new CreateIndexOptions
                    {
                        Name = "ExpireAtIndex",
                        ExpireAfter = TimeSpan.FromHours(24)
                    };
                    var expiresAtIndexModel = new CreateIndexModel<RTokenDocument>(expiresAtIndexKeysDefinition, expiresAtIndexOptions);
                    await _collection.Indexes.CreateOneAsync(expiresAtIndexModel);
                    Console.WriteLine("  • Created index: ExpireAtIndex (TTL)");
                }
                else
                {
                    Console.WriteLine("  • Index already exists: ExpireAtIndex");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"  ⚠️  Error creating indexes: {ex.Message}");
            }
        }
    }
}
