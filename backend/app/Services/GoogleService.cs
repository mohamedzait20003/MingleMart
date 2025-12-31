using App.DTOs;
using Google.Apis.Auth;

namespace App.Services
{
    public class GoogleService
    {
        private readonly GoogleJsonWebSignature.ValidationSettings _validationSettings;

        public GoogleService(IConfiguration configuration)
        {
            var clientId = configuration["Google:ClientId"];

            if (string.IsNullOrEmpty(clientId))
                throw new InvalidOperationException("Google Client ID is not configured.");

            _validationSettings = new GoogleJsonWebSignature.ValidationSettings{
                Audience = new[] { clientId }
            };
        }

        public async Task<GUserInfo?> GetInfo(string idToken)
        {
            try {
                var payload = await GoogleJsonWebSignature.ValidateAsync(idToken, _validationSettings);
                
                if(payload == null)
                    return null;

                return new GUserInfo {
                    Email = payload.Email,
                    FirstName = payload.GivenName ?? "",
                    LastName = payload.FamilyName ?? "",
                    Username = GenerateUsernameFromEmail(payload.Email),
                };
            } catch (InvalidJwtException) {
                return null;
            } catch (Exception) {
                return null;
            }
        }

        private string GenerateUsernameFromEmail(string email)
        {
            var username = email.Split('@')[0];

            username = new string(username.Where(c => char.IsLetterOrDigit(c)).ToArray()).ToLower();
            return username;
        }
    }
}