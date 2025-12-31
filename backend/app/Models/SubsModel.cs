using App.Services;
using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Bson.Serialization.Attributes;

namespace App.Models
{
    public class SubsModel : Model<SubsModel>
    {
        [BsonElement("Email")]
        public string Email { get; set; } = string.Empty;

        public static void Initialize(DatabaseService dbService)
        {
            Collection = dbService.GetCollection<SubsModel>("newsLetters");
        }

        public override async Task<SubsModel> Save()
        {
            if (Collection is null)
                throw new InvalidOperationException($"Collection for {typeof(SubsModel).Name} is not initialized.");

            var existing = await Collection.Find(x => x.Email == this.Email).FirstOrDefaultAsync();
            if (existing != null){
                throw new InvalidOperationException("This email is already subscribed.");
            }

            return await base.Save();
        } 
    }
}