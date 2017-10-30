using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SqlSugar;
using ExtJsTest.Dao.Class;

namespace ExtJsTest.Dao.Dao
{
    public class DalUser
    {
        private readonly SqlSugarClient _dbManage;

        public DalUser(string strConn)
        {
            _dbManage = new SqlSugarClient(new ConnectionConfig()
            {
                ConnectionString = strConn,
                DbType = DbType.SqlServer
            });
        }
        /// <summary>
        /// 查询所有用户
        /// </summary>
        public IEnumerable<User> SelectUsers()
        {
            return _dbManage.Queryable<User>().AS("BUSER").ToList();
        }
        /// <summary>
        /// 新增用户
        /// </summary>
        public int InsertUser(User user)
        {
            return _dbManage.Insertable(user).AS("BUSER")
                .IgnoreColumns(n => new { n.USR_UPDATEUID, n.USR_UPDATE_DT }).ExecuteCommand();
        }
        /// <summary>
        /// 更新用户
        /// </summary>
        public int UpdateUser(User user)
        {
            return _dbManage.Updateable(user)
                .AS("BUSER").Where(n => n.USR_ID == user.USR_ID)
                .UpdateColumns(g => new { g.USR_LOGIN_NAME, g.USR_FLAG, g.USR_UPDATEUID, g.USR_UPDATE_DT })
                .ExecuteCommand();
        }
        /// <summary>
        /// 删除用户
        /// </summary>
        public int DeleteUser(int id)
        {
            return _dbManage.Deleteable<User>().AS("BUSER")
                .Where(n => n.USR_ID == id ).ExecuteCommand();
        }
    }
}
