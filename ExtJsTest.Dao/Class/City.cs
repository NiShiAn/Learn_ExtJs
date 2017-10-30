
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace ExtJsTest.Dao.Class
{
    public class City
    {
        [Key]
        public int CTY_ID { get; set; }
        public int CTY_PRV_ID { get; set; }
        public string CTY_NAME { get; set; }
        public string CTY_CREATIONUID { get; set; }
        public string CTY_UPDATEUID { get; set; }
    }

    public class Region
    {
        [Key]
        public int REG_ID { get; set; }
        public int REG_CTY_ID { get; set; }
        public string REG_NAME { get; set; }
    }
    public class CityInfo
    {
        public int CityId { get; set; }
        public int ParentId { get; set; }
        public string CityName { get; set; }
        public string CreateBy { get; set; }
        public string UpdateBy { get; set; }
        public string ParentCity { get; set; }

    }
}
