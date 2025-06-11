namespace Lab2_Backend.Model
{
    public class StaffScheduleTable
    {
        public int StaffScheduleID { get; set; }
        public StaffSchedule StaffSchedule { get; set; }

        public int TableID { get; set; }
        public Table Table { get; set; }
    }
}
