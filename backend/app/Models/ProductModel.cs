using App.Services;
using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Bson.Serialization.Attributes;

namespace App.Models
{
    public class ProductModel : Model<ProductModel>
    {
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

        public static void Initialize(DatabaseService dbService)
        {
            Collection = dbService.GetCollection<ProductModel>("products");
            CreateIndexes().Wait();
        }

        private static async Task CreateIndexes()
        {
            try {
                if (Collection is null)
                    throw new InvalidOperationException($"Collection for {typeof(ProductModel).Name} is not initialized.");
                
                var categoryIndexKeysDefinition = Builders<ProductModel>.IndexKeys.Ascending(x => x.CategoryID);
                var categoryIndexOptions = new CreateIndexOptions {
                    Unique = false,
                    Name = "CategoryIDIndex"
                };

                var categoryIndexModel = new CreateIndexModel<ProductModel>(categoryIndexKeysDefinition, categoryIndexOptions);
                await Collection.Indexes.CreateOneAsync(categoryIndexModel);
            } catch (Exception ex) {
                Console.WriteLine($"Error creating indexes for ProductModel: {ex.Message}");
            }
        }
    }
}