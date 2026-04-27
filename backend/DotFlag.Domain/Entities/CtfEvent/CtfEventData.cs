using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DotFlag.Domain.Entities.CtfEvent
{
    public class CtfEventData
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        public string Name { get; set; } = string.Empty;

        [DataType(DataType.DateTime)]
        public DateTime StartTime { get; set; }

        [DataType(DataType.DateTime)]
        public DateTime EndTime { get; set; }

        public bool IsComingSoon { get; set; } = false;
        public bool IsFinalized { get; set; } = false;
    }
}
