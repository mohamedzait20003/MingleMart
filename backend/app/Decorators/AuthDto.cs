using System.ComponentModel.DataAnnotations;

namespace App.DTOs
{
    public class RegisterDto : Dto
    {
        [Required(ErrorMessage = "First name is required")]
        [StringLength(100, ErrorMessage = "First name must be between 2 and 100 characters", MinimumLength = 2)]
        public required string FName { get; set; }


        [Required(ErrorMessage = "Last name is required")]
        [StringLength(100, ErrorMessage = "Last name must be between 2 and 100 characters", MinimumLength = 2)]
        public required string LName { get; set; }

        [Required(ErrorMessage = "Username is required")]
        [StringLength(50, ErrorMessage = "Username must be between 3 and 50 characters", MinimumLength = 3)]
        public required string Username { get; set; }

        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        public required string Email { get; set; }

        [Required(ErrorMessage = "Password is required")]
        [StringLength(100, ErrorMessage = "Password must be at least 6 characters", MinimumLength = 6)]
        public required string Password { get; set; }

        [Required(ErrorMessage = "Password confirmation is required")]
        [Compare("Password", ErrorMessage = "Passwords do not match")]
        public required string PasswordConfirmation { get; set; }
    }

    public class LoginDto
    {
        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        public required string Email { get; set; }

        [Required(ErrorMessage = "Password is required")]
        public required string Password { get; set; }
    }

    public class GoogleSignDto
    {
        [Required(ErrorMessage = "ID Token is required")]
        public required string IdToken { get; set; }
    }

    public class VerifyEmailDto
    {
        [Required(ErrorMessage = "Verification token is required")]
        public required string Token { get; set; }
    }

    public class ForgotPassDto
    {
        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        public required string Email { get; set; }
    }

    public class ResetPassDto
    {
        [Required(ErrorMessage = "Reset token is required")]
        public required string Token { get; set; }

        [Required(ErrorMessage = "New password is required")]
        [StringLength(100, ErrorMessage = "Password must be at least 6 characters", MinimumLength = 6)]
        public required string NewPassword { get; set; }

        [Required(ErrorMessage = "Password confirmation is required")]
        [Compare("NewPassword", ErrorMessage = "Passwords do not match")]
        public required string NewPasswordConfirmation { get; set; }
    }

    public class GUserInfo
    {
        public required string Email { get; set; }
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public required string Username { get; set; }
    }
}