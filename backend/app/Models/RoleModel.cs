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
            Collection = dbService.GetCollection<RoleModel>("Roles");
        }

        public static async Task<List<UserModel>> UsersWithRole(ObjectId roleId)
        {
            if (Collection is null)
                throw new InvalidOperationException($"Collection for {typeof(RoleModel).Name} is not initialized.");

            var userCollection = Collection.Database.GetCollection<UserModel>("Users");
            return await userCollection.Find(x => x.RoleID == roleId).ToListAsync();
        }
    }
}