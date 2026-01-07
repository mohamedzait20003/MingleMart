using MongoDB.Bson;
using MongoDB.Driver;
using System.Linq.Expressions;
using MongoDB.Bson.Serialization.Attributes;

namespace App.Models
{
    public abstract class Model<T> where T : Model<T>
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public ObjectId Id { get; set; }

        [BsonElement("createdAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [BsonElement("updatedAt")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        [BsonIgnore]
        protected static IMongoCollection<T>? Collection { get; set; }

        public static async Task<List<T>> All()
        {
            if (Collection is null)
                throw new InvalidOperationException($"Collection for {typeof(T).Name} is not initialized.");
            return await Collection.Find(_ => true).ToListAsync();
        }

        public static async Task<T?> FindById(object id)
        {
            if (Collection is null)
                throw new InvalidOperationException($"Collection for {typeof(T).Name} is not initialized.");

            ObjectId objectId;
            
            if (id is string stringId){
                if (!ObjectId.TryParse(stringId, out objectId))
                    return null;
            } else if (id is ObjectId oid) {
                objectId = oid;
            } else {
                throw new ArgumentException($"Id must be either string or ObjectId, got {id.GetType().Name}");
            }

            return await Collection.Find(x => x.Id == objectId).FirstOrDefaultAsync();
        }

        public static async Task<T> FindOrFail(object id)
        {
            var entity = await FindById(id);

            if (entity == null)
            {
                throw new Exception($"{typeof(T).Name} with id {id} not found.");
            }

            return entity;
        }

        public static async Task<List<T>> Where(Expression<Func<T, bool>> filter)
        {
            if (Collection is null)
                throw new InvalidOperationException($"Collection for {typeof(T).Name} is not initialized.");
                
            return await Collection.Find(filter).ToListAsync();
        }

        public virtual async Task<T> Save()
        {
            UpdatedAt = DateTime.UtcNow;
            
            if (Collection is null)
                throw new InvalidOperationException($"Collection for {typeof(T).Name} is not initialized.");

            if (Id == ObjectId.Empty)
            {
                Id = ObjectId.GenerateNewId();
                CreatedAt = DateTime.UtcNow;
                await Collection.InsertOneAsync((T)this);
            }
            else
            {
                await Collection.ReplaceOneAsync(x => x.Id == Id, (T)this);
            }
            
            return (T)this;
        }

        public async Task<T> Update(Dictionary<string, object> updates)
        {
            if (Collection is null)
                throw new InvalidOperationException($"Collection for {typeof(T).Name} is not initialized.");
            
            if (updates == null || updates.Count == 0)
                return (T)this;
            
            var updateDefinitions = updates
                .Select(kvp => Builders<T>.Update.Set(kvp.Key, kvp.Value))
                .ToList();

            updateDefinitions.Add(Builders<T>.Update.Set(x => x.UpdatedAt, DateTime.UtcNow));

            var combinedUpdate = Builders<T>.Update.Combine(updateDefinitions);
            
            var options = new FindOneAndUpdateOptions<T>
            {
                ReturnDocument = ReturnDocument.After
            };
            
            return await Collection.FindOneAndUpdateAsync(x => x.Id == this.Id, combinedUpdate, options);
        }


        public static async Task<T> UpdateOrCreate(Expression<Func<T, bool>> filter, Dictionary<string, object> updates)
        {
            if (Collection is null)
                throw new InvalidOperationException($"Collection for {typeof(T).Name} is not initialized.");

            if (updates == null || updates.Count == 0)
                throw new ArgumentException("Updates dictionary cannot be null or empty.", nameof(updates));

            var updateDefinitions = updates.Select(kvp => Builders<T>.Update.Set(kvp.Key, kvp.Value)).ToList();

            updateDefinitions.Add(Builders<T>.Update.SetOnInsert(x => x.CreatedAt, DateTime.UtcNow));
            updateDefinitions.Add(Builders<T>.Update.Set(x => x.UpdatedAt, DateTime.UtcNow));
            
            var combinedUpdate = Builders<T>.Update.Combine(updateDefinitions);

            var options = new FindOneAndUpdateOptions<T>
            {
                IsUpsert = true,
                ReturnDocument = ReturnDocument.After
            };
            
            return await Collection.FindOneAndUpdateAsync(filter, combinedUpdate, options);
        }

        public async Task<bool> Delete()
        {
            if (Collection is null)
                throw new InvalidOperationException($"Collection for {typeof(T).Name} is not initialized.");
            
            var result = await Collection.DeleteOneAsync(x => x.Id == Id);
            return result.DeletedCount > 0;
        }
    }
}
