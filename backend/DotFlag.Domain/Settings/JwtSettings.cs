namespace DotFlag.Domain.Settings
{
    public static class JwtSettings
    {
        public static string Key { get; set; } = string.Empty;
        public static string Issuer { get; set; } = string.Empty;
        public static string Audience { get; set; } = string.Empty;
        public static int ExpireMinutes { get; set; }
    }
}
