using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ExtJsTest.Dao.Class
{
    public class TreeItem
    {
        public int id { get; set; }
        public string text { get; set; }
        public bool leaf { get; set; }
        public bool check { get; set; }
        public IList<TreeItem> children { get; set; }
    }
}
