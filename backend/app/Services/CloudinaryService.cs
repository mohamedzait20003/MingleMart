using CloudinaryDotNet;
using CloudinaryDotNet.Actions;

namespace App.Services
{
    public class validatedImage
    {
        public required Stream fileStream { get; set; }
        public required string fileName { get; set; }
    }

    public class CloudinaryService
    {
        private readonly Cloudinary _cloudinary;
        private readonly ILogger<CloudinaryService> _logger;

        public CloudinaryService(IConfiguration configuration, ILogger<CloudinaryService> logger)
        {
            _logger = logger;
            var cloudinaryUrl = configuration["CLOUDINARY:URI"];
            
            if (string.IsNullOrEmpty(cloudinaryUrl))
            {
                _logger.LogError("CLOUDINARY:URI configuration is missing or empty");
                throw new ArgumentNullException(nameof(cloudinaryUrl), "CLOUDINARY_URL configuration is missing.");
            }
            
            try
            {
                // Parse the URL to validate it
                var urlWithoutScheme = cloudinaryUrl.Replace("cloudinary://", "");
                var parts = urlWithoutScheme.Split('@');
                var cloudName = parts.Length > 1 ? parts[1] : null;
                var credsPart = parts.Length > 0 ? parts[0].Split(':') : new string[0];
                var apiKey = credsPart.Length > 0 ? credsPart[0] : null;
                var apiSecret = credsPart.Length > 1 ? credsPart[1] : null;
                
                _logger.LogInformation("Initializing Cloudinary - Cloud: {CloudName}, API Key: {ApiKey}, Has Secret: {HasSecret}", 
                    cloudName, apiKey, !string.IsNullOrEmpty(apiSecret));
                
                if (string.IsNullOrEmpty(cloudName) || string.IsNullOrEmpty(apiKey) || string.IsNullOrEmpty(apiSecret))
                {
                    throw new ArgumentException("Invalid Cloudinary URL format. Expected: cloudinary://api_key:api_secret@cloud_name");
                }
                    
                var account = new Account(cloudName, apiKey, apiSecret);
                _cloudinary = new Cloudinary(account);
                _cloudinary.Api.Secure = true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to initialize Cloudinary with URL: {Url}", cloudinaryUrl);
                throw;
            }
        }

        public async Task<string> UploadImageAsync(IFormFile imageFile)
        {
            try {
                var validatedImage = await ValidateImageAsync(imageFile);

                using (validatedImage.fileStream)
                {
                    _logger.LogInformation("Uploading image: {FileName}, Size: {Size} bytes", 
                        validatedImage.fileName, validatedImage.fileStream.Length);

                    var uploadParams = new ImageUploadParams()
                    {
                        File = new FileDescription(validatedImage.fileName, validatedImage.fileStream),
                        Folder = "zcommerce",
                        UniqueFilename = true,
                        Transformation = new Transformation().Quality("auto").FetchFormat("auto"),
                        AllowedFormats = new string[] { "jpg", "jpeg", "png", "gif", "bmp", "webp" }
                    };

                    var uploadResult = await _cloudinary.UploadAsync(uploadParams);
                    
                    if (uploadResult.StatusCode == System.Net.HttpStatusCode.OK || uploadResult.StatusCode == System.Net.HttpStatusCode.Created) {
                        return uploadResult.SecureUrl.ToString();
                    } else {
                        var errorMsg = uploadResult.Error?.Message ?? "Unknown error";
                        throw new Exception($"Cloudinary upload failed with status {uploadResult.StatusCode}: {errorMsg}");
                    }
                }
            } catch (Exception ex) {
                throw new Exception("Image upload failed: " + ex.Message, ex);
            }
        }

        private async Task<validatedImage> ValidateImageAsync(IFormFile imagefile)
        {
            if(imagefile == null)
                throw new ArgumentNullException(nameof(imagefile), "Image file cannot be null.");

            var extension = Path.GetExtension(imagefile.FileName).ToLowerInvariant();
            var permittedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp" };

            if(!permittedExtensions.Contains(extension))
                throw new ArgumentException("Invalid image file extension.");

            const long maxFileSize = 5 * 1024 * 1024;
            if(imagefile.Length == 0)
                throw new ArgumentException("Image file is empty.");

            if(imagefile.Length > maxFileSize)
                throw new ArgumentException("Image file size exceeds the maximum allowed size of 5MB.");

            // Copy to MemoryStream to avoid disposed stream issues
            var memoryStream = new MemoryStream();
            await imagefile.CopyToAsync(memoryStream);
            memoryStream.Position = 0;

            if(!ValidateImageStream(memoryStream))
            {
                memoryStream.Dispose();
                throw new ArgumentException("Image file content is not valid.");
            }

            memoryStream.Position = 0;
            return new validatedImage { 
                fileStream = memoryStream, 
                fileName = imagefile.FileName 
            };
        }

        private static bool ValidateImageStream(Stream imageStream)
        {
            var buffer = new byte[8];
            imageStream.Position = 0;

            try {
                imageStream.ReadExactly(buffer, 0, 8);
            } catch (EndOfStreamException) {
                return false;
            }

            imageStream.Position = 0;

            if (buffer[0] == 0xFF && buffer[1] == 0xD8 && buffer[2] == 0xFF)
                return true;

             if (buffer[0] == 0x89 && buffer[1] == 0x50 && buffer[2] == 0x4E && buffer[3] == 0x47)
                return true;

            if (buffer[0] == 0x47 && buffer[1] == 0x49 && buffer[2] == 0x46 && buffer[3] == 0x38)
                return true;

            if (buffer[0] == 0x52 && buffer[1] == 0x49 && buffer[2] == 0x46 && buffer[3] == 0x46)
                return true;

            if (buffer[0] == 0x42 && buffer[1] == 0x4D)
                return true;

            return false;
        }
    }
}