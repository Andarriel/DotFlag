using System.ComponentModel.DataAnnotations;

namespace DotFlag.Domain.Models.User
{
    public class UserProfileDto
    {
        public int Id { get; set; }

        [Required]
        [StringLength(30, MinimumLength = 5, ErrorMessage = "Username cannot be longer than 30 characters")]
        public string Username { get; set; } = string.Empty;

        public int CurrentPoints { get; set; }
        public DateTime RegisteredOn { get; set; }
    }
}
