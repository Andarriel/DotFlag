using DotFlag.Domain.Enums;

namespace DotFlag.Domain.Models.User;

public class UserDto
{
    public int Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public int CurrentPoints { get; set; }
    public UserRole Role { get; set; }
}