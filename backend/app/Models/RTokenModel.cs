using System;
using App.Services;
using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Bson.Serialization.Attributes;

namespace App.Models
{
    public class RTokenModel : Model<RTokenModel>
    {
        [BsonElement("userId")]
        [BsonRepresentation(BsonType.ObjectId)]
        public ObjectId UserId { get; set; }

        [BsonElement("sessionId")]
        [BsonRepresentation(BsonType.ObjectId)]
        public ObjectId SessionId { get; set; }

        [BsonElement("Token")]
        public string Token { get; set; } = string.Empty;

        [BsonElement("deviceType")]
        public string DeviceType { get; set; } = string.Empty;

        [BsonElement("Location")]
        public string Location { get; set; } = string.Empty;

        [BsonElement("deviceOS")]
        public string DeviceOS { get; set; } = string.Empty;

        [BsonElement("lastUsedAt")]
        public DateTime LastUsedAt { get; set; }

        [BsonElement("expiresAt")]
        public DateTime ExpiresAt { get; set; }
        
        public static void Initialize(DatabaseService dbService)
        {
            Collection = dbService.GetCollection<RTokenModel>("Rtokens");
        }

        public static async Task<List<RTokenModel>> FindForUser(ObjectId userId)
        {
            if (Collection is null)
                throw new InvalidOperationException($"Collection for {typeof(RTokenModel).Name} is not initialized.");
            return await Collection.Find(x => x.UserId == userId).ToListAsync();
        }

        public static async Task<RTokenModel?> FindByToken(string token)
        {
            if (Collection is null)
                throw new InvalidOperationException($"Collection for {typeof(RTokenModel).Name} is not initialized.");
            return await Collection.Find(x => x.Token == token).FirstOrDefaultAsync();
        }
    }
}