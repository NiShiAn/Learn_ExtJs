using ExtJsTest.Dao.Class;
using SqlSugar;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ExtJsTest.Dao.Dao
{
    public class DalCity
    {
        private readonly SqlSugarClient _dbManage;

        public DalCity(string strConn)
        {
            _dbManage = new SqlSugarClient(new ConnectionConfig()
            {
                ConnectionString = strConn,
                DbType = DbType.SqlServer
            });
        }
        /// <summary>
        /// 查询所有城市信息
        /// </summary>
        public Tuple<List<CityInfo>,int> SelectCitys(int start, int limit)
        {
            var dskt = _dbManage.Queryable<City>().AS("RCITY").ToList();

            var list = new List<CityInfo>();
                
            foreach(var n in dskt.Skip(start).Take(limit))
            {
                list.Add(new CityInfo()
                {
                    CityId = n.CTY_ID,
                    CityName = n.CTY_NAME,
                    ParentId = n.CTY_PRV_ID,
                    ParentCity = GetCityName(n.CTY_PRV_ID),
                    CreateBy = n.CTY_CREATIONUID,
                    UpdateBy = n.CTY_UPDATEUID
                });
            }   

            return new Tuple<List<CityInfo>, int>(list, dskt.Count);
        }

        public List<UserState> GetParentCity()
        {
            var desk = _dbManage.Queryable<City>().AS("RCITY").
                GroupBy(n => n.CTY_PRV_ID).Select(g => g.CTY_PRV_ID).ToList();

            var list = new List<UserState>();

            foreach(var n in desk)
            {
                var name = GetCityName(n);
                if (string.IsNullOrEmpty(name))
                    continue;

                list.Add(new UserState()
                {
                    Name = name,
                    Status = n
                });
            }

            return list;
        }
        public List<UserState> GetCityByParentId(int id)
        {
            return _dbManage.Queryable<City>().AS("RCITY")
                .Where(n => n.CTY_PRV_ID == id).Select(g => new UserState()
                {
                    Name = g.CTY_NAME,
                    Status = g.CTY_ID
                }).ToList();
        }
        public string GetCityName(int id)
        {
            var city = _dbManage.Queryable<City>().AS("RCITY").Where(n => n.CTY_ID == id).First();

            return city != null ? city.CTY_NAME : "";
        }

        public List<TreeItem> GetTreeNode()
        {
            var list = new List<TreeItem>()
            {
                new TreeItem(){ id = 2003, text="上海市", leaf=false, check=false },
                new TreeItem(){ id = 2004, text="重庆市", leaf=false, check=false },
                new TreeItem(){ id = 2005, text="邯郸市", leaf=false, check=false },
                new TreeItem(){ id = 2006, text="石家庄市", leaf=false, check=false },
                new TreeItem(){ id = 2007, text="保定市", leaf=false, check=false },
                new TreeItem(){ id = 2008, text="张家口市", leaf=false, check=false },
            };

            foreach (var info in list)
            {
                info.children = _dbManage.Queryable<Region>().AS("RREGION")
                    .Where(n => n.REG_CTY_ID == info.id).
                    Select(g => new TreeItem() {
                        id = g.REG_ID,
                        text = g.REG_NAME,
                        leaf = true,
                        check = false
                    }).ToList();
            }

            return list;
        }

    }
}
