using System;
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
            CreateIndexes().Wait();
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

        private static async Task CreateIndexes()
        {
            try {
                if (Collection is null)
                    throw new InvalidOperationException($"Collection for {typeof(VTokenModel).Name} is not initialized.");

                var ttlIndexKeysDefinition = Builders<VTokenModel>.IndexKeys.Ascending(x => x.ExpiresAt);
                var ttlIndexOptions = new CreateIndexOptions {
                    ExpireAfter = TimeSpan.FromHours(24),
                    Name = "ExpireAtIndex"
                };

                var ttlIndexModel = new CreateIndexModel<VTokenModel>(ttlIndexKeysDefinition, ttlIndexOptions);

                var userIdIndexKeysDefinition = Builders<VTokenModel>.IndexKeys.Ascending(x => x.UserId);
                var userIdIndexOptions = new CreateIndexOptions {
                    Unique = false,
                    Name = "UserIdIndex"
                };

                var userIdIndexModel = new CreateIndexModel<VTokenModel>(userIdIndexKeysDefinition, userIdIndexOptions);
                await Collection.Indexes.CreateOneAsync(ttlIndexModel);
                await Collection.Indexes.CreateOneAsync(userIdIndexModel);
            } catch (MongoCommandException ex) when (ex.CodeName == "IndexOptionsConflict") {
                Console.WriteLine("Indexes already exist.");
            }
        }
    }
}