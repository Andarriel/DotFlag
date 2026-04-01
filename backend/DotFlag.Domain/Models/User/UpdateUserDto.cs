using DotFlag.Domain.Enums;
using System.ComponentModel.DataAnnotations;

namespace DotFlag.Domain.Models.User
{
    public class UpdateUserDto
    {
        [Required]
        public string Username { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        public UserRole Role { get; set; }

        public string? Password { get; set; }
    }
}
