using App.Services;
using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Bson.Serialization.Attributes;

namespace App.Models
{
    public class PTokenModel : Model<PTokenModel>
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
            Collection = dbService.GetCollection<PTokenModel>("Ptokens");
            CreateIndexes().Wait();
        }

        public static async Task<PTokenModel?> FindForUser(ObjectId userId)
        {
            if (Collection is null)
                throw new InvalidOperationException($"Collection for {typeof(PTokenModel).Name} is not initialized.");
            return await Collection.Find(x => x.UserId == userId).FirstOrDefaultAsync();
        }

        public static async Task<PTokenModel?> FindByToken(string token)
        {
            if (Collection is null)
                throw new InvalidOperationException($"Collection for {typeof(PTokenModel).Name} is not initialized.");
            return await Collection.Find(x => x.Token == token).FirstOrDefaultAsync();
        }

        public static async Task DeleteByUserId(ObjectId userId)
        {
            if (Collection is null)
                throw new InvalidOperationException($"Collection for {typeof(PTokenModel).Name} is not initialized.");
            await Collection.DeleteManyAsync(x => x.UserId == userId);
        }

        private static async Task CreateIndexes()
        {
            try {
                if (Collection is null)
                    throw new InvalidOperationException($"Collection for {typeof(PTokenModel).Name} is not initialized.");

                var ttlIndexKeysDefinition = Builders<PTokenModel>.IndexKeys.Ascending(x => x.ExpiresAt);
                var ttlIndexOptions = new CreateIndexOptions {
                    ExpireAfter = TimeSpan.FromHours(24),
                    Name = "ExpireAtIndex"
                };

                var ttlIndexModel = new CreateIndexModel<PTokenModel>(ttlIndexKeysDefinition, ttlIndexOptions);

                var userIdIndexKeysDefinition = Builders<PTokenModel>.IndexKeys.Ascending(x => x.UserId);
                var userIdIndexOptions = new CreateIndexOptions {
                    Unique = false,
                    Name = "UserIdIndex"
                };

                var userIdIndexModel = new CreateIndexModel<PTokenModel>(userIdIndexKeysDefinition, userIdIndexOptions);
                await Collection.Indexes.CreateOneAsync(ttlIndexModel);
                await Collection.Indexes.CreateOneAsync(userIdIndexModel);
            } catch (MongoCommandException ex) when (ex.CodeName == "IndexOptionsConflict") {
                Console.WriteLine("Indexes already exist.");
            }
        }
    }
}