using System.ComponentModel.DataAnnotations;

namespace App.DTOs
{
    public class SubsDto : Dto
    {
        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        public required string Email { get; set; }
    }
}