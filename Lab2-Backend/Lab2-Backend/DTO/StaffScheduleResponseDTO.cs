public class StaffScheduleResponseDTO
{
    public int ScheduleID { get; set; }
    public int StaffID { get; set; }
    public string DayOfWeek { get; set; }
    public string StartTime { get; set; }
    public string EndTime { get; set; }
    public int? AssignedBy { get; set; }
    public string StaffFirstName { get; set; }
    public string StaffLastName { get; set; }
    public string AssignedByFirstName { get; set; }
    public List<TableDTO> Tables { get; set; }
}

public class TableDTO
{
    public int TableID { get; set; }
}
