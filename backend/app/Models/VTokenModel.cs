using App.Services;
using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Bson.Serialization.Attributes;

namespace App.Models
{
    public class VTokenModel : Model<VTokenModel>
    {
        [BsonElement("userId")]
        [BsonRepresentation(BsonType.ObjectId)]
        public ObjectId UserId { get; set; }

        [BsonElement("Token")]
        public string Token { get; set; } = string.Empty;

        [BsonElement("expiresAt")]
        public DateTime ExpiresAt { get; set; }
        
        public static void Initialize(DatabaseService dbService)
        {
            Collection = dbService.GetCollection<VTokenModel>("Vtokens");
        }

        public static async Task<VTokenModel?> FindForUser(ObjectId userId)
        {
            if (Collection is null)
                throw new InvalidOperationException($"Collection for {typeof(VTokenModel).Name} is not initialized.");
            return await Collection.Find(x => x.UserId == userId).FirstOrDefaultAsync();
        }

        public static async Task<VTokenModel?> FindByToken(string token)
        {
            if (Collection is null)
                throw new InvalidOperationException($"Collection for {typeof(VTokenModel).Name} is not initialized.");
            return await Collection.Find(x => x.Token == token).FirstOrDefaultAsync();
        }
    }
}