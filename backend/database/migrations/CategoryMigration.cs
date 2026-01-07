using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Bson.Serialization.Attributes;

namespace Database.Migrations
{
    public class CategoryDocument
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

    public class CategoryMigration : IMigration
    {
        private readonly IMongoDatabase _database;
        private readonly IMongoCollection<CategoryDocument> _collection;

        public int Order => 8;
        public string Name => "categories";
        public string Icon => "📁";

        public CategoryMigration(IMongoDatabase database)
        {
            _database = database;
            _collection = database.GetCollection<CategoryDocument>("Categories");
        }

        public async Task MigrateAsync()
        {
            await CreateCollection();
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
    }
}
