using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Bson.Serialization.Attributes;

namespace Database.Migrations
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

    public class RoleMigration : IMigration
    {
        private readonly IMongoDatabase _database;
        private readonly IMongoCollection<RoleDocument> _collection;

        public int Order => 1;
        public string Name => "roles";
        public string Icon => "👑";

        public RoleMigration(IMongoDatabase database)
        {
            _database = database;
            _collection = _database.GetCollection<RoleDocument>("roles");
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

                if (!indexNames.Contains("NameIndex"))
                {
                    var nameIndexKeysDefinition = Builders<RoleDocument>.IndexKeys.Ascending(x => x.Name);
                    var nameIndexOptions = new CreateIndexOptions
                    {
                        Unique = true,
                        Name = "NameIndex"
                    };
                    var nameIndexModel = new CreateIndexModel<RoleDocument>(nameIndexKeysDefinition, nameIndexOptions);
                    await _collection.Indexes.CreateOneAsync(nameIndexModel);
                    Console.WriteLine("  • Created index: NameIndex (unique)");
                } else {
                    Console.WriteLine("  • Index already exists: NameIndex");
                }
            } catch (Exception ex) {
                Console.WriteLine($"  ⚠️  Error creating indexes: {ex.Message}");
            }
        }
    }
}