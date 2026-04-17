using DotFlag.Domain.Enums;
using System.ComponentModel.DataAnnotations;

namespace DotFlag.Domain.Models.User;

public class UserDto
{
    public int Id { get; set; }

    [Required]
    [StringLength(30, MinimumLength = 5, ErrorMessage = "Username cannot be longer than 30 characters")]
    public string Username { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    [StringLength(50)]
    public string Email { get; set; } = string.Empty;

    public int CurrentPoints { get; set; }
    public UserRole Role { get; set; }
    public bool IsBanned { get; set; }
    public DateTime RegisteredOn { get; set; }
    public DateTime? LastLoginAt { get; set; }
}