using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Bson.Serialization.Attributes;

namespace Database.Migrations
{
    public class SubsDocument
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public ObjectId Id { get; set; }

        [BsonElement("Email")]
        public string Email { get; set; } = string.Empty;

        [BsonElement("createdAt")]
        public DateTime CreatedAt { get; set; }

        [BsonElement("updatedAt")]
        public DateTime UpdatedAt { get; set; }
    }

    public class SubsMigration : IMigration
    {
        private readonly IMongoDatabase _database;
        private readonly IMongoCollection<SubsDocument> _collection;

        public int Order => 6;
        public string Name => "NewsLetters";
        public string Icon => "📧";

        public SubsMigration(IMongoDatabase database)
        {
            _database = database;
            _collection = database.GetCollection<SubsDocument>("NewsLetters");
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

                // Email Index (Unique)
                if (!indexNames.Contains("EmailIndex"))
                {
                    var emailIndexKeysDefinition = Builders<SubsDocument>.IndexKeys.Ascending(x => x.Email);
                    var emailIndexOptions = new CreateIndexOptions
                    {
                        Unique = true,
                        Name = "EmailIndex"
                    };
                    var emailIndexModel = new CreateIndexModel<SubsDocument>(emailIndexKeysDefinition, emailIndexOptions);
                    await _collection.Indexes.CreateOneAsync(emailIndexModel);
                    Console.WriteLine("  • Created index: EmailIndex (unique)");
                }
                else
                {
                    Console.WriteLine("  • Index already exists: EmailIndex");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"  ⚠️  Error creating indexes: {ex.Message}");
            }
        }
    }
}
