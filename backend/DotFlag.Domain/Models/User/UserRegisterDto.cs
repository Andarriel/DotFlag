using System.ComponentModel.DataAnnotations;

namespace DotFlag.Domain.Models.User;

public class UserRegisterDto
{
    [Required]
    [StringLength(30, MinimumLength = 5)]
    public string Username { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    [StringLength(50)]
    public string Email { get; set; } = string.Empty;

    [Required]
    [StringLength(100, MinimumLength = 8)]
    public string Password { get; set; } = string.Empty;
}