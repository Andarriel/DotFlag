using System.ComponentModel.DataAnnotations;

namespace DotFlag.Domain.Models.User
{
    public class UpdateUserProfileDto
    {
        [Required]
        [StringLength(30, MinimumLength = 5, ErrorMessage = "Username cannot be longer than 30 characters")]
        public string Username { get; set; }

        [Required]
        [EmailAddress]
        [StringLength(50)]
        public string Email { get; set; }
        
        [Required]
        public string CurrentPassword { get; set; }
        
        public string? NewPassword { get; set; }
    }
}
