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
            Collection = dbService.GetCollection<ProductModel>("Products");
        }
    }
}