using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using log4net;
using log4net.Config;
using System.Text.RegularExpressions;

[assembly: log4net.Config.XmlConfigurator(ConfigFile = @"Config\log4net.config", Watch = true)]
namespace Arron.Console
{
    class Program
    {

        static void Main(string[] args)
        {
            //ILog log = LogManager.GetLogger(typeof(Program));
            //log.Debug("测试");

            //string str = "体验刮刮卡17fdsfds5@13188661444@490980804";
            //Regex reg = new Regex(@"^\S+@\d{11}@\d{9}$");
            //bool isMatch = reg.IsMatch(str);
            //var result = reg.Match(str);
            //System.Console.WriteLine(isMatch.ToString());

            //string str = "<xml><ArticleCount>1</ArticleCount><Articles><item><Title><![CDATA[公司简介]]></Title><PicUrl><![CDATA[http://LOCALHOST:880/Institution/5/Images/130440173530069570.jpg]]></PicUrl><Url><![CDATA[http://wx1.sjqh.net/admin/newspage/9/5?wid=8]]></Url></item></Articles><ToUserName><![CDATA[]]></ToUserName><FromUserName><![CDATA[]]></FromUserName><CreateTime>130440173618984655</CreateTime><MsgType><![CDATA[news]]></MsgType></xml>http://wx1.sjqh.net/admin/newspage/9/5";


            //var data = AppendOpenID(str, "dfsfasd3245");
            //var a = 1;

            //var a = 200 / (90 * 0.01M);
            //System.Console.WriteLine(a.ToString());

            System.Console.WriteLine("Begin");
            Task<int> task = Test();
            System.Console.WriteLine("End");

            Task tsk = task.ContinueWith((t) =>
            {
                System.Console.WriteLine("Result:{0}", t.Result);
            });

            System.Console.WriteLine("new task");
            System.Threading.Thread.Sleep(1000);

            System.Console.ReadLine();
        }

        static async Task<int> Test()
        {
            await Task.Run(() => { System.Console.WriteLine("awiat"); });
            return 100;
        }

        static string AppendOpenID(string data, string openID)
        {
            StringBuilder sb = new StringBuilder();
            Regex reg = new Regex(@"http(s)?://([\w-]+\.)+[\w-]+(/[\w- ./?%&=]*)?");
            MatchCollection urls = reg.Matches(data);
            if (urls.Count > 0)
            {
                int index = 0;
                foreach (Match match in urls)
                {
                    var url = match.Value;
                    string newUrl = url;
                    if (newUrl.IndexOf("?") < 0)
                    {
                        newUrl += "?";
                    }
                    else
                    {
                        newUrl += "&";
                    }
                    newUrl += "OpenID=" + openID;
                    sb.Append(data.Substring(index, match.Index - index));
                    sb.Append(newUrl);
                    index = match.Index + url.Length;
                }

                if (index < data.Length)
                {
                    sb.Append(data.Substring(index, data.Length - index));
                }

                return sb.ToString();
            }
            else return data;
        }
    }
}
