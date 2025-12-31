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

        public CloudinaryService(IConfiguration configuration)
        {
            var cloudinaryUrl = configuration["CLOUDINARY:URI"];
            if (string.IsNullOrEmpty(cloudinaryUrl))
                throw new ArgumentNullException(nameof(cloudinaryUrl), "CLOUDINARY_URL configuration is missing.");
                
            var account = new Account(cloudinaryUrl);
            _cloudinary = new Cloudinary(account);
            _cloudinary.Api.Secure = true;
        }

        public async Task<string> UploadImageAsync(IFormFile imageFile)
        {
            var validatedImage = ValidateImage(imageFile);

            var uploadParams = new ImageUploadParams()
            {
                File = new FileDescription(validatedImage.fileName, validatedImage.fileStream),
                Folder = "zcommerce",
                UniqueFilename = true,
                Transformation = new Transformation().Quality("auto").FetchFormat("auto"),
                AllowedFormats = new string[] { "jpg", "jpeg", "png", "gif", "bmp", "webp" }
            };

            var uploadResult = await _cloudinary.UploadAsync(uploadParams);
            return uploadResult.SecureUrl.ToString();
        }

        private validatedImage ValidateImage(IFormFile imagefile)
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

            using var stream = imagefile.OpenReadStream();

            if(!ValidateImageStream(stream))
                throw new ArgumentException("Image file content is not valid.");

            return new validatedImage { 
                fileStream = stream, 
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