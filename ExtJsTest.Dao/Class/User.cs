using System;
using System.Collections.Generic;
using System.Linq;
using System.Data;
using System.ComponentModel;
using System.Text;
using System.Threading.Tasks;

namespace ExtJsTest.Dao.Class
{
    public class User
    {
        public int USR_ID { get; set; }
        public string USR_LOGIN_NAME { get; set; }
        public string USR_PWD { get; set; }
        public bool USR_FLAG { get; set; }
        public string USR_CREATIONUID { get; set; }
        public DateTime USR_CREATIONI_DT { get; set; }
        public string USR_UPDATEUID { get; set; }
        public DateTime USR_UPDATE_DT { get; set; }      
    }

    public class UserState
    {
        public string Name { get; set; }
        public int Status { get; set; }
    }
}
