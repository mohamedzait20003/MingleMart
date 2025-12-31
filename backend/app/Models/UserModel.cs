using App.Services;
using MongoDB.Bson;
using MongoDB.Driver;
using System.Text.Json.Serialization;
using MongoDB.Bson.Serialization.Attributes;

namespace App.Models
{
    public class UserModel : Model<UserModel>
    {
        [BsonElement("FirstName")]
        public string FirstName { get; set; } = string.Empty;

        [BsonElement("LastName")]
        public string LastName { get; set; } = string.Empty;

        [BsonElement("Username")]
        public string Username { get; set; } = string.Empty;

        [BsonElement("Email")]
        public string Email { get; set; } = string.Empty;

        [JsonIgnore]
        [BsonElement("Password")]
        public string Password { get; set; } = string.Empty;

        [BsonElement("ProfilePicURL")]
        public string? ProfilePicURL { get; set; }

        [BsonElement("IsVerified")]
        public bool IsVerified { get; set; } = false;

        [BsonElement("2FaEnabled")]
        public bool FaEnabled { get; set; } = false;

        [BsonElement("RoleID")]
        public ObjectId RoleID { get; set; }

        public static void Initialize(DatabaseService dbService)
        {
            Collection = dbService.GetCollection<UserModel>("users");
            CreateIndexes().Wait();
        }

        public static async Task<UserModel?> FindByEmail(string email)
        {
            if (Collection is null)
                throw new InvalidOperationException($"Collection for {typeof(UserModel).Name} is not initialized.");
                
            return await Collection.Find(x => x.Email == email).FirstOrDefaultAsync();
        }

        public static async Task<UserModel?> CheckCredentials(string email, string password)
        {
            var user = await FindByEmail(email);

            if (user == null)
                return null;

            if (!string.IsNullOrEmpty(user.Password) && BCrypt.Net.BCrypt.Verify(password, user.Password))
                return user;

            return null;
        }

        public async Task<VTokenModel> GenerateVerifyToken()
        {
            var token = new VTokenModel
            {
                UserId = this.Id,
                Token = Guid.NewGuid().ToString(),
                ExpiresAt = DateTime.UtcNow.AddHours(24)
            };

            await token.Save();
            return token;
        }

        public async Task<RTokenModel> GenerateRefreshToken()
        {
            var token = new RTokenModel
            {
                UserId = this.Id,
                Token = Guid.NewGuid().ToString(),
                ExpiresAt = DateTime.UtcNow.AddHours(24)
            };

            await token.Save();
            return token;
        }

        public async Task<bool> InvokeRefreshToken()
        {
            var existingToken = await RTokenModel.FindForUser(this.Id);

            if (existingToken != null)
            {
                await existingToken.Delete();
                return true;
            }
            
            return false;
        }

        public async Task<UserModel> UpdatePassword(string oldPassword, string newPassword)
        {
            if (!BCrypt.Net.BCrypt.Verify(oldPassword, this.Password))
                throw new UnauthorizedAccessException("Old password is incorrect.");

            this.Password = HashPassword(newPassword);
            return await this.Save();
        }

        public async Task<UserModel> UpdateProfilePic(IFormFile imageFile, CloudinaryService cloudinaryService)
        {
            var imageUrl = await cloudinaryService.UploadImageAsync(imageFile);
            this.ProfilePicURL = imageUrl;

            return await this.Save();
        }

        public override async Task<UserModel> Save()
        {
            if (Collection is null)
                throw new InvalidOperationException($"Collection for {typeof(UserModel).Name} is not initialized.");   

            if (!IsHashed(Password))
            {
                Password = HashPassword(Password);
            }

            if(RoleID == ObjectId.Empty)
            {
                var defaultRole = await RoleModel.Where(r => r.Name == "Customer");
                var defaultRoleId = defaultRole.FirstOrDefault()?.Id;
                RoleID = defaultRoleId ?? ObjectId.Empty;
            }

            return await base.Save();
        }

        public async Task<RoleModel?> GetRole()
        {
            return await RoleModel.FindById(RoleID);
        }

        private static async Task CreateIndexes()
        {
            try {
                if (Collection is null)
                    throw new InvalidOperationException($"Collection for {typeof(UserModel).Name} is not initialized.");
                
                var roleIndexKeysDefinition = Builders<UserModel>.IndexKeys.Ascending(x => x.RoleID);
                var roleIndexOptions = new CreateIndexOptions {
                    Unique = false,
                    Name = "RoleIDIndex"
                };

                var roleIndexModel = new CreateIndexModel<UserModel>(roleIndexKeysDefinition, roleIndexOptions);
                await Collection.Indexes.CreateOneAsync(roleIndexModel);
            } catch (Exception ex) {
                Console.WriteLine($"Error creating indexes for UserModel: {ex.Message}");
            }
        }

        private static bool IsHashed(string password)
        {
            return !string.IsNullOrEmpty(password) && password.StartsWith("$2");
        }

        private static string HashPassword(string password)
        {
            return BCrypt.Net.BCrypt.HashPassword(password);
        }
    }
}