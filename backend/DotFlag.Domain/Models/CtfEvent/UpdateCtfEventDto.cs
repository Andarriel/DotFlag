namespace DotFlag.Domain.Models.CtfEvent
{
    public class UpdateCtfEventDto
    {
        public string Name { get; set; }

        public DateTime StartTime { get; set; }

        public DateTime EndTime { get; set; }

        public bool IsComingSoon { get; set; }
    }
}
