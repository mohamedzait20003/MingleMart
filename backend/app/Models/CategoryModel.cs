using App.Services;
using MongoDB.Bson;
using MongoDB.Driver;
using System.Text.Json.Serialization;
using MongoDB.Bson.Serialization.Attributes;

namespace App.Models
{
    public class CategoryModel : Model<CategoryModel>
    {
        [BsonElement("Name")]
        public string Name { get; set; } = string.Empty;

        public static void Initialize(DatabaseService dbService)
        {
            Collection = dbService.GetCollection<CategoryModel>("Categories");
        }
    }
}