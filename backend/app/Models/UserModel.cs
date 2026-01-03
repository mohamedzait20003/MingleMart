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
            return await VTokenModel.UpdateOrCreate(
                filter: x => x.UserId == this.Id,
                updates: new Dictionary<string, object>
                {
                    { "UserId", this.Id },
                    { "Token", Guid.NewGuid().ToString() },
                    { "ExpiresAt", DateTime.UtcNow.AddHours(24) }
                }
            );
        }

        public async Task<RTokenModel> GenerateRefreshToken()
        {
            return await RTokenModel.UpdateOrCreate(
                filter: x => x.UserId == this.Id,
                updates: new Dictionary<string, object>
                {
                    { "UserId", this.Id },
                    { "Token", Guid.NewGuid().ToString() },
                    { "ExpiresAt", DateTime.UtcNow.AddHours(24) }
                }
            );
        }

        public async Task<PTokenModel> GeneratePasswordToken()
        {
            return await PTokenModel.UpdateOrCreate(
                filter: x => x.UserId == this.Id,
                updates: new Dictionary<string, object>
                {
                    { "UserId", this.Id },
                    { "Token", Guid.NewGuid().ToString() },
                    { "ExpiresAt", DateTime.UtcNow.AddHours(24) }
                }
            );
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

        public async Task<UserModel> ResetPassword(string newPassword)
        {
            this.Password = HashPassword(newPassword);
            await PTokenModel.DeleteByUserId(this.Id);
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

            try {
                return await base.Save();
            } catch (MongoWriteException mwx) when (mwx.WriteError.Category == ServerErrorCategory.DuplicateKey) {
                if (mwx.Message.Contains("EmailIndex"))
                    throw new InvalidOperationException("Email already in use.");
                else if (mwx.Message.Contains("UsernameIndex"))
                    throw new InvalidOperationException("Username already in use.");
                else
                    throw;
            }
        }

        public async Task<RoleModel?> GetRole()
        {
            return await RoleModel.FindById(RoleID);
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