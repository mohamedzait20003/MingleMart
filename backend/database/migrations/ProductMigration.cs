using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Bson.Serialization.Attributes;

namespace Database.Migrations
{
    public class ProductDocument
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public ObjectId Id { get; set; }

        [BsonElement("Name")]
        public string Name { get; set; } = string.Empty;

        [BsonElement("Description")]
        public string Description { get; set; } = string.Empty;

        [BsonElement("Price")]
        public decimal Price { get; set; }

        [BsonElement("Stock")]
        public int Stock { get; set; }

        [BsonElement("CategoryID")]
        [BsonRepresentation(BsonType.ObjectId)]
        public ObjectId CategoryID { get; set; }

        [BsonElement("ImagesURLs")]
        public List<string> ImagesURLs { get; set; } = new List<string>();

        [BsonElement("createdAt")]
        public DateTime CreatedAt { get; set; }

        [BsonElement("updatedAt")]
        public DateTime UpdatedAt { get; set; }
    }

    public class ProductMigration : IMigration
    {
        private readonly IMongoDatabase _database;
        private readonly IMongoCollection<ProductDocument> _collection;

        public int Order => 7;
        public string Name => "products";
        public string Icon => "🛍️";

        public ProductMigration(IMongoDatabase database)
        {
            _database = database;
            _collection = database.GetCollection<ProductDocument>("Products");
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

                // CategoryID Index
                if (!indexNames.Contains("CategoryIDIndex"))
                {
                    var categoryIndexKeysDefinition = Builders<ProductDocument>.IndexKeys.Ascending(x => x.CategoryID);
                    var categoryIndexOptions = new CreateIndexOptions
                    {
                        Unique = false,
                        Name = "CategoryIDIndex"
                    };
                    var categoryIndexModel = new CreateIndexModel<ProductDocument>(categoryIndexKeysDefinition, categoryIndexOptions);
                    await _collection.Indexes.CreateOneAsync(categoryIndexModel);
                    Console.WriteLine("  • Created index: CategoryIDIndex");
                }
                else
                {
                    Console.WriteLine("  • Index already exists: CategoryIDIndex");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"  ⚠️  Error creating indexes: {ex.Message}");
            }
        }
    }
}
