using DotFlag.Domain.Enums;
using System.ComponentModel.DataAnnotations;

namespace DotFlag.Domain.Models.User
{
    public class CreateUserDto
    {
        [Required]
        public string Username { get; set; }
        
        [Required]
        public string Password { get; set; }
        
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        
        [Required]
        public UserRole Role { get; set; }
    }
}
