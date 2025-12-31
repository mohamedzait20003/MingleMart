using App.Services;
using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Bson.Serialization.Attributes;

namespace App.Models
{
    public class RoleModel : Model<RoleModel>
    {
        [BsonElement("Name")]
        public string Name { get; set; } = string.Empty;

        public static void Initialize(DatabaseService dbService)
        {
            Collection = dbService.GetCollection<RoleModel>("roles");
            CreateIndexes().Wait();
        }

        public static async Task<List<UserModel>> UsersWithRole(ObjectId roleId)
        {
            if (Collection is null)
                throw new InvalidOperationException($"Collection for {typeof(RoleModel).Name} is not initialized.");

            var userCollection = Collection.Database.GetCollection<UserModel>("users");
            return await userCollection.Find(x => x.RoleID == roleId).ToListAsync();
        }

        private static async Task CreateIndexes()
        {
            try {
                if (Collection is null)
                    throw new InvalidOperationException($"Collection for {typeof(RoleModel).Name} is not initialized.");

                var nameIndexKeysDefinition = Builders<RoleModel>.IndexKeys.Ascending(x => x.Name);
                var nameIndexOptions = new CreateIndexOptions {
                    Unique = true,
                    Name = "NameIndex"
                };

                var nameIndexModel = new CreateIndexModel<RoleModel>(nameIndexKeysDefinition, nameIndexOptions);

                await Collection.Indexes.CreateOneAsync(nameIndexModel);
            } catch (Exception ex) {
                Console.WriteLine($"Error creating indexes for RoleModel: {ex.Message}");
            }
        }
    }
}