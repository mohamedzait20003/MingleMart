using System.ComponentModel.DataAnnotations;

namespace App.DTOs
{
    public class UPasswordDto : Dto
    {
        [Required(ErrorMessage = "Current password is required")]
        public required string CurrentPassword { get; set; }

        [Required(ErrorMessage = "New password is required")]
        public required string NewPassword { get; set; }

        [Required(ErrorMessage = "Password confirmation is required")]
        [Compare("NewPassword", ErrorMessage = "Passwords do not match")]
        public required string PasswordConfirmation { get; set; }
    }

    public class UProfilePicDto : Dto
    {
        [Required(ErrorMessage = "Image data is required")]
        public required IFormFile ImageFile { get; set; }
    }
}