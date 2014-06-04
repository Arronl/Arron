using log4net;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace Arron.Web
{
    public partial class Default : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            ILog log = LogManager.GetLogger(typeof(Default));
            try
            {
                int id = int.Parse(Request.QueryString["ID"].ToString());
                log.Debug("测试");
            }
            catch (Exception ex)
            {
                log.Error(ex.Message, ex);
            }
        }
    }
}