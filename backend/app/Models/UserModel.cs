using App.Services;
using MongoDB.Bson;
using MongoDB.Driver;
using System.Text.Json.Serialization;
using MongoDB.Bson.Serialization.Attributes;
using CloudinaryDotNet.Actions;

namespace App.Models
{
    public class Session
    {
        public string DeviceType { get; set; } = string.Empty;

        public string IpAddress { get; set; } = string.Empty;

        public string DeviceOS { get; set; } = string.Empty;
        public DateTime LastUsedAt { get; set; }
    }


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

        [BsonElement("Gender")]
        public string Gender { get; set; } = string.Empty;

        [BsonElement("DateOfBirth")]
        public DateTime DateOfBirth { get; set; }

        [BsonElement("Language")]
        public string Language { get; set; } = string.Empty;

        [BsonElement("TimeZone")]
        public string TimeZone { get; set; } = string.Empty;

        [BsonElement("IsActivityTracked")]
        public bool IsActivityTracked { get; set; } = true;

        [BsonElement("IsDataShared")]
        public bool IsDataShared { get; set; } = false;

        [BsonElement("IsEmailNotified")]
        public bool IsEmailNotified { get; set; } = true;

        [BsonElement("IsSecurityNotified")]
        public bool IsSecurityNotified { get; set; } = true;

        [BsonElement("IsUpdateNotified")]
        public bool IsUpdateNotified { get; set; } = true;

        [BsonElement("RoleID")]
        public ObjectId RoleID { get; set; }

        [BsonIgnore]
        [JsonIgnore]
        private RoleModel? _role;


        [BsonIgnore]
        [JsonIgnore]
        private List<Session>? _sessions;


        [BsonIgnore]
        public RoleModel? Role
        {
            get
            {
                if (_role == null && RoleID != ObjectId.Empty)
                {
                    _role = RoleModel.FindById(RoleID).GetAwaiter().GetResult();
                }

                return _role;
            }
        }

        [BsonIgnore]
        public List<Session> Sessions
        {
            get
            {
                if (_sessions == null)
                {
                    _sessions = RTokenModel.FindForUser(this.Id).GetAwaiter().GetResult().Select(rt => new Session
                    {
                        DeviceType = rt.DeviceType,
                        IpAddress = rt.IpAddress,
                        DeviceOS = rt.DeviceOS,
                        LastUsedAt = rt.LastUsedAt
                    }).ToList();
                }

                return _sessions;
            }
        }

        public static void Initialize(DatabaseService dbService)
        {
            Collection = dbService.GetCollection<UserModel>("Users");
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

        public async Task<RTokenModel> GenerateRefreshToken(DeviceInfo deviceInfo)
        {
            if (Collection is null)
                throw new InvalidOperationException($"Collection for {typeof(RTokenModel).Name} is not initialized.");

            var newToken = new RTokenModel
            {
                UserId = this.Id,
                Token = Guid.NewGuid().ToString(),
                DeviceType = deviceInfo.DeviceType,
                DeviceOS = deviceInfo.OperatingSystem,
                IpAddress = deviceInfo.IpAddress,
                LastUsedAt = DateTime.UtcNow,
                ExpiresAt = DateTime.UtcNow.AddDays(7)
            };

            await newToken.Save();
            return newToken;
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

            Language = string.IsNullOrEmpty(Language) ? "en" : Language;
            TimeZone = string.IsNullOrEmpty(TimeZone) ? "UTC" : TimeZone;

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