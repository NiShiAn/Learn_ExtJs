using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web.Mvc;
using ExtJsTest.Dao.Dao;
using ExtJsTest.Dao.Class;
using Newtonsoft.Json;

namespace ExtJsTest.Controllers
{
    public class HomeController : Controller
    {
        private readonly string conn = ConfigurationManager.ConnectionStrings["Test"].ConnectionString;

        #region 页面一
        public ActionResult Index()
        {
            return View();
        }
        /// <summary>
        /// 用户查询
        /// </summary>
        public ActionResult GetUser(string userNo = "", string userName = "",
            bool? state = null, int start = 0, int limit = 25)
        {
            var list = new DalUser(conn).SelectUsers();

            if (!string.IsNullOrEmpty(userNo))
                list = list.Where(n => n.USR_ID.ToString() == userNo).ToList();

            if (!string.IsNullOrEmpty(userName))
                list = list.Where(n => n.USR_LOGIN_NAME == userName).ToList();

            if (state != null)
                list = list.Where(n => n.USR_FLAG == (bool)state).ToList();

            return Json(new { items = list.Skip(start).Take(limit), tc = list.Count() }, JsonRequestBehavior.AllowGet);
        }
        /// <summary>
        /// 用户修改
        /// </summary>
        public ActionResult UpdateUserInfo(int uId, string uName, int uState)
        {
            var id = new DalUser(conn).UpdateUser(new Dao.Class.User()
            {
                USR_ID = uId,
                USR_LOGIN_NAME = uName,
                USR_FLAG = uState == 1,
                USR_UPDATEUID = "任永强",
                USR_UPDATE_DT = DateTime.Now
            });

            return Json(id > 0, JsonRequestBehavior.AllowGet);
        }
        /// <summary>
        /// 用户添加
        /// </summary>
        public ActionResult InsertUserInfo(string uName, int uState)
        {
            var id = new DalUser(conn).InsertUser(new Dao.Class.User()
            {
                USR_LOGIN_NAME = uName,
                USR_FLAG = uState == 1,
                USR_CREATIONUID = "ABS",
                USR_CREATIONI_DT = DateTime.Now
            });

            return Json(id > 0, JsonRequestBehavior.AllowGet);
        }
        /// <summary>
        /// 用户删除
        /// </summary>
        public ActionResult DeleteUserInfo(int uId)
        {
            var id = new DalUser(conn).DeleteUser(uId);

            return Json(id > 0, JsonRequestBehavior.AllowGet);
        }

        public ActionResult GetUserAttribute()
        {
            var list1 = new List<UserState>(){
                new UserState(){ Name= "在职", Status = 1 },
                new UserState(){ Name= "离职", Status = 2 }
            };

            var list2 = new List<UserState>(){
                new UserState(){ Name= "群众", Status = 1 },
                new UserState(){ Name= "团员", Status = 2 },
                new UserState(){ Name= "党员", Status = 3 }
            };

            return Json(new { StateList = list1, PolityList = list2 }, JsonRequestBehavior.AllowGet);
        }
        #endregion

        #region 页面二
        public ActionResult Show()
        {
            return View();
        }

        public ActionResult GetCity(int start, int limit)
        {
            var result = new DalCity(conn).SelectCitys(start, limit);

            return Json(new { items = result.Item1, tc = result.Item2 }, JsonRequestBehavior.AllowGet);
        }

        public ActionResult GetSelectCity()
        {
            return Json(new { items = new DalCity(conn).GetParentCity() }, JsonRequestBehavior.AllowGet);
        }

        public ActionResult GetCityByParentId(int pid)
        {
            return Json(new { items = new DalCity(conn).GetCityByParentId(pid) }, JsonRequestBehavior.AllowGet);
        }
        #endregion

        #region 页面三
        public ActionResult Tree()
        {
            return View();
        }

        public ActionResult GetTreeNode()
        {
            var children = new DalCity(conn).GetTreeNode();

            return Content(JsonConvert.SerializeObject(new { root = new { children } }), 
                "application/json", System.Text.Encoding.UTF8);
        }
        #endregion

        #region 页面四
        public ActionResult Check()
        {
            return View();
        }
        #endregion
    }
}
