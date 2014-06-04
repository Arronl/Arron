(function () {
    var HtNet = window.HtNet = function (Server, Port) {
        if (!Server) { Server = "223.197.32.252"; }
        if (!Port) { Port = 8503; }
        Server = AppConfig && AppConfig.HqHttpAddress ? AppConfig.HqHttpAddress : "222.73.126.187";
        Port = AppConfig && AppConfig.HqHttpPort ? AppConfig.HqHttpPort : 8503;
        var net = new window.Net(Server, Port);
        net.ProcessRecData = function () {
            var res = new HqRes();
            var k = this.ResText.indexOf(res.Head.StrSplit);
            if (k > -7) {
                var strh = this.ResText.substring(0, k);
                res.Head.FromHeadString(strh);
                var strf = this.ResText.substring(k + 4, this.ResText.length);
                if (strf.length > 0) { res.Data = strf; };
                this.Callback(res);
            }
        };
        return net;
    };

    var SocketNet = window.SocketNet = function (Server, Port) {
        if (!Server) { Server = "223.197.32.252"; }
        if (!Port) { Port = 8502; }
        Server = AppConfig && AppConfig.HqSocketUrl ? AppConfig.HqSocketUrl : "222.73.126.187";
        Port = AppConfig && AppConfig.HqSocketPort ? AppConfig.HqSocketPort : 8502;
        var net = new window.Socket(Server, Port);
        return net;
    };


    var HqRes = window.HqRes = function () {
        this.Head = new window.HqHeader();
        this.Data = null;
    }

    var hqReq = window.hqReq = function () {
        this.Head = new window.HqHeader();
    };
    hqReq.prototype.GetReqCmd = function () {
        var strParm = "";

        switch (this.Head.Type) { //心跳包
            case ReqType.CRTCkLive:
                strParm = "{\"ConnectionID\":11}";
                break;
            case ReqType.CRTAuth: //行情服务器认证。			    
                strParm = "{\"User\":\"" + this.UName + "\", \"Pass\":\"" + this.Pwd + "\", \"AuthSerID\":" + this.AuthSerID + ", \"UserID\":" + this.UserID + ",\"Session\":" + this.Session + ",\"Product\":" + this.Product + ",\"SubProduct\":" + this.SubProduct,
                    strParm += ",\"Block\":[";
                var arBlock = [];
                for (var i = 0; i < this.Block.length; i++) {
                    var strBlock = "{\"Name\":" + this.Block[i].Name + ",\"Mask\":[";
                    var arMask = [];
                    for (j = 0; j < this.Block[i].Mask.lenth; j++) {
                        var strMask = "{\Market\":" + this.Block[i].Mask[j].Market + "\"Mask\":" + this.Block[i].Mask[j].Mask + "\"}";
                        arMask.push(strMask);
                    }
                    strBlock += arMask.join(",") + "]}";
                    arBlock.push(strBlock);
                }
                strParm += arBlock.join(",") + "],";
                strParm += "\"Market\":[" + this.Market.join(",") + "]}";
                break;
            case ReqType.PRTLogout: //登出
                strParm = "{\"UserID\":" + this.UserID + ", \"Session\":" + this.Session + ",\"Product\":" + this.Product3 + "}";
                break;
            case ReqType.CRTReqMtInfo: //请求市场信息
                var arMarket = [];
                for (var i = 0; i < this.Market.length; i++) {
                    arMarket.push("{\"Market\":" + this.Market[i] + "}");
                }
                strParm = "[" + arMarket.join(",") + "]";
                break;
            case ReqType.CRTReqSbInfo: //请求商品信息
                var arSymbol = [];
                for (var i = 0; i < this.Symbol.length; i++) {
                    arSymbol.push("{\"Market\":" + this.Symbol[i].Market + ",\"Code\":\"" + this.Symbol[i].Code + "\"}");
                }
                strParm = "[" + arSymbol.join(",") + "]";
                break;
            case ReqType.CRTreqSbList: //请求商品列表				
                strParm = "{\"MarketID\":" + this.Market + ",\"IDType\":" + this.IDType + ",\"BeginPos\":" + this.Pos + ",\"Count\":" + this.Count + ",\"GetQuote\":" + this.GetQuote + ",\"PushFlag\":" + this.PushFlag + "}";
                break;
            case ReqType.PRTReqSbReport: //请求商品排行				
                strParm = "{\"Type\":" + this.iType + ",\"Desc\":" + this.Desc + ",\"BeginPos\":" + this.Pos + ",\"Count\":" + this.Count + ",\"GetQuote\":" + this.GetQuote + ",\"PushFlag\":" + this.PushFlag + ",\"Market\":["
                var arMarket = [];
                for (var i = 0; i < this.Market.length; i++) {
                    arMarket.push("{\"MarketID\":" + this.Market[i].MarketID + ",\"IDType\":" + this.Market[i].IDType + "}");
                }
                strParm += arMarket.join(",") + "]}";
                //console.log(strParm);
                break;
            case ReqType.CRTRequestUpdatePush:
                for (var i in this.Symbol) {
                    this.Symbol[i].Type = (this.Type || 1);
                    this.Symbol[i].BrokerCount = (this.BrokerCount || 20);
                    this.Symbol[i].Language = (this.Language || 0);
                    this.Symbol[i].PushFlag = (this.PushFlag || 0);
                }
                strParm = JSON.stringify(this.Symbol);
                //console.log("pushCMD-->",strParm);
                break;
            case ReqType.CRTReqRealTimePrice: //请求行情
                strParm = "{\"PushFlag\":" + this.PushFlag + ",\"GetSymInfo\":" + this.GetSymInfo + ",\"Symbol\":[";
                var arMarket = [];
                for (var i = 0; i < this.Symbol.length; i++) {
                    arMarket.push("{\"Market\":" + this.Symbol[i].Market + ",\"Code\":\"" + this.Symbol[i].Code + "\"}");
                }
                strParm += arMarket.join(",") + "]}";
                break;
            case ReqType.PRTReqSubMtList: //请求子市场列表
                strParm = "{\"Req\":" + "\"SubMarket\"}";
                break;
            case ReqType.PRTReqMinutesKLine: //获取K线
                strParm = "{\"Market\":" + this.Market + ", \"Code\":\"" + this.Code + "\", \"PushFlag\":" + this.PushFlag + ", \"Minute\":" + this.Minute + ",\"TypeCount\":" + this.TypeCount + ",\"Weight\":" + this.Weight + ",";
                strParm += "\"TimeType\":" + this.TimeType + ",\"Count\":" + this.Count + ",\"Time0\":\"" + this.Time0 + "\",\"Time1\":\"" + this.Time1 + "\"}";
                break;
            case ReqType.CRTReqSbKLine: //获取K线
                strParm = "{\"Market\":" + this.Market + ", \"Code\":\"" + this.Code + "\", \"PushFlag\":" + this.PushFlag + ", \"KLineType\":" + this.KLineType + ",\"Weight\":" + this.Weight + ",";
                strParm += "\"TimeType\":" + this.TimeType + ",\"Count\":" + this.Count + ",\"Time0\":\"" + this.Time0 + "\",\"Time1\":\"" + this.Time1 + "\"}";
                break;
            case ReqType.CRTReqTrend: //请求走势
                strParm = "{\"Market\":" + this.Market + ", \"Code\":\"" + this.Code + "\", \"PushFlag\":" + this.PushFlag + ", \"TimeType\":" + this.TimeType + ",\"TimeValue0\":" + this.TimeValue0 + ",\"TimeValue1\":" + this.TimeValue1 + ",\"Day\":\"" + this.Day + "\"}";
                break;
            case ReqType.PRTReqFinance:
                strParm = "{\"Market\":" + this.Market + ", \"Code\":\"" + this.Code + "\"}";
                break;
            case ReqType.PRTReqTradeTime:
                var Sender = (this.TradeTimeIDList instanceof Array) ? this.TradeTimeIDList : [{ TradeTimeID: 0}];
                strParm = JSON.stringify(Sender);

                break;
            case ReqType.News:
                switch (this.NewsInType) {
                    case NewsInType.ERTCurNewsTitle:
                        strParm = "{\"Type\":" + this.NewsInType + ", \"Req\":{\"type\":" + this.NewsType + ",\"page\":" + this.Page + ",\"size\":" + this.Size + ",\"lan\":" + this.Lan + "}}";
                        break;
                    case NewsInType.ERTInfoTitle:
                        strParm = "{\"Type\":" + this.NewsInType + ", \"Req\":{\"type\":\"" + this.NewsType + "\",\"page\":" + this.Page + ",\"size\":" + this.Size + ",\"lan\":" + this.Lan + "}}";
                        break;
                    case NewsInType.ERTCurNewsContent:
                    case NewsInType.ERTInfoContent:
                        //alert(this.Nid);
                        strParm = "{\"Type\":" + this.NewsInType + ", \"Req\":{\"id\":" + this.Nid + ",\"lan\":" + this.Lan + "}}";
                        break;
                    case NewsInType.ERTExNewsTitle:
                        strParm = "{\"Type\":" + this.NewsInType + ", \"Req\":{\"page\":" + this.Page + ",\"size\":" + this.Size + ",\"lan\":" + this.Lan + "}}";
                        break;
                    case NewsInType.ERTExNewsContent:
                        strParm = "{\"Type\":" + this.NewsInType + ", \"Req\":{\"id\":" + this.Nid + ",\"lan\":" + this.Lan + "}}";
                        break;
                }


                break;
            case ReqType.CRTReqCodeList: //键盘精灵/股票搜索
                strParm = "{\"Code\":\"" + this.Code + "\"}";
                break;
            case ReqType.PRTReqSpreadCodeTable: //   请求差价表
                strParm = "{\"Market\":\"" + this.Market + "\"}";
                break;

        }
        return strParm;
    };

    hqReq.prototype.toHttpText = function () {
        var strCmd = this.GetReqCmd();
        this.Head.Len = strCmd.length;
        var strHead = this.Head.toHeadString();
        //console.log(strHead, strCmd);
        return strHead + strCmd;
    };
})();