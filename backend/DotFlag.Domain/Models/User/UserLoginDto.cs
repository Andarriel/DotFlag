using System.ComponentModel.DataAnnotations;

namespace DotFlag.Domain.Models.User
{
    public class UserLoginDto
    {
        [Required]
        [EmailAddress]
        [StringLength(50)]
        public string Email { get; set; } = string.Empty;
        
        [Required]
        public string Password { get; set; } = string.Empty;
    }
}
