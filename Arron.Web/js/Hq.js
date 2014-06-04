(function () {
    var HqCollections = window.HqCollections = function (Username, Password, User, UserR, Ser) {
        this.Username = Username;
        this.Password = Password;
        this.User = User;
        this.UserR = UserR;
        this.Ser = Ser;
    };

    HqCollections.prototype.SupportWebSocket = function () {
        var reValue = true;
        if (!window.WebSocket) {
            reValue = false;
        } else {
            var ua = navigator.userAgent;
            if (ua.indexOf('Android') > -1) {
                reValue = false;
            } else {
                if ((ua.indexOf('Android 4.1.2') > -1) && (ua.indexOf('Linux') > -1) && (ua.indexOf('AppleWebKit') > -1)) {
                    reValue = false;
                }
            }
        }

        return false;
        //return reValue;
    };


    HqCollections.prototype.SendReq = function (req) {
        if (this.Ser instanceof Array) {
            if (!this.hqNet) {
                var Server = undefined, Port = undefined;
                for (var i in this.Ser) {
                    if (this.Ser[i].TY == "QT") {
                        Server = this.Ser[i].IP;
                        Port = 8503;
                    }
                };
                var hqNet = this.hqNet = new window.HtNet(Server, Port);
            }
            this.hqNet.SendReq(req);
        }
    };

    HqCollections.prototype.Close = function () {
        this.Ser = null;
        if (this.hqNet) { this.hqNet = null; }
        if (this.hqNetSocket) { this.hqNetSocket = null; }
    };



    HqCollections.prototype.SendSocketReq = function (req) {
        var $this = this;
        if (this.Ser instanceof Array) {
            if (!this.hqNetSocket) {
                var Server = undefined, Port = undefined;
                for (var i in this.Ser) {
                    if (this.Ser[i].TY == "QT") {
                        Server = this.Ser[i].IP;
                        Port = 8502;
                    }
                };
                var hqNetSocket = this.hqNetSocket = new window.SocketNet(Server, Port);
            }

            this.hqNetSocket.SendReq(req);
        }
    };

    HqCollections.prototype.doHqAuth = function (doSuc, doErr) {
        var req = new window.hqReq(), user = this.User[0], $this = this;
        this.isDoHqAuth = false;
        this.HqAuth = null;
        this.ConnectionSession = null;
        this.Session = null;

        req.Head.Type = window.ReqType.CRTAuth;
        req.UName = this.Username;
        req.Pwd = this.Password;
        req.AuthSerID = user.AuthID;
        req.UserID = user.ID;
        req.Session = user.Se;
        req.Product = user.Pro;
        req.SubProduct = user.SubPro;
        req.Block = [];
        req.Market = [];
        for (var i in this.UserR) {
            if (this.UserR[i].M) {
                req.Market.push(this.UserR[i].M);
            }
        }
        req.SucCallBack = function (data) {
            $this.isDoHqAuth = true;
            $this.HqAuth = JSON.parse(data.Data);
            $this.ConnectionSession = $this.HqAuth.ConnectionSession;
            $this.Session = $this.HqAuth.Session;

            //console.log("没有启动打卡动作");
            //还木有错误处理
            $this.Live();

            doSuc(data);
        };
        req.ErrCallBack = doErr;

        if (this.SupportWebSocket()) {
            this.SendSocketReq(req);
        } else {
            this.SendReq(req);
        }
    };

    HqCollections.prototype.Send = function (req, doSuc, doErr) {
        if (typeof doSuc !== "function") { doSuc = function () { }; }
        if (typeof doErr !== "function") { doErr = function () { }; }
        req.Head.Session = this.ConnectionSession;
        req.SucCallBack = doSuc;
        req.ErrCallBack = function (data) {
            var Json = JSON.parse(data.Data);
            if (Json.ErrMsg == "你需要登录") {
                if (typeof window.AuthLogin == "function") {
                    window.AuthLogin();
                    window.Manager.onHqLoad = function () {
                        //需要改动，否则会刷新
                        //Quetations.Option.commit();
                        if (Manager && typeof Manager.onReAuth === "function") { Manager.onReAuth(); }
                        window.Manager.onHqLoad = function () { };
                    };
                }
            }
            doErr(data);
        };
        if (this.SupportWebSocket()) {
            this.SendSocketReq(req);
        } else {
            this.SendReq(req);
        }
    };

    HqCollections.prototype.doReqTradeTime = function (doSuc, doErr, TradeTimeIDList) {
        if (this.isDoHqAuth) {
            var req = new window.hqReq();
            req.Head.Type = window.ReqType.PRTReqTradeTime;
            var list = [{ TradeTimeID: 0}];
            if (TradeTimeIDList instanceof Array) {
                list = [];
                for (var t = 0; t < TradeTimeIDList.length; t++) {
                    list.push({ TradeTimeID: TradeTimeIDList[t] });
                }
            }
            req.TradeTimeIDList = list;
            this.Send(req, doSuc, doErr);
        }
    };

    HqCollections.prototype.Live = function () {
        var $this = this;
        if (!$this.LiveHandler) { clearTimeout($this.LiveHandler); }
        $this.LiveHandler = setTimeout(function () {
            $this.doCRTCkLive(function () {
                console.log("打卡成功:" + (new Date()));
                $this.Live();
            }, function () {
                $this.Live();
                console.log("打卡失败:" + (new Date()));
            });
        }, 60 * 1000);
    };

    HqCollections.prototype.doCRTCkLive = function (doSuc, doErr) {
        if (this.isDoHqAuth) {
            var req = new window.hqReq();
            req.Head.Type = window.ReqType.CRTCkLive;
            this.Send(req, doSuc, doErr);
        }
    };

    //更新推送
    HqCollections.prototype.doReqUpdatePush = function (doSuc, doErr, Symbol, Type) {
        if (this.isDoHqAuth) {
            var req = new window.hqReq();
            req.Head.Type = window.ReqType.CRTRequestUpdatePush;

            req.PushFlag = 0;
            req.Language = 0;
            //            enum E_PushType
            //            {
            //	            enDPTPrice = 1,		// 行情
            //	            enDPTTick = 2,		// 分笔
            //                enPNPTOddLot = 0x04,	// 碎股
            //                enPNPTLevel2 = 0x10,	// 经纪人
            //            };
            req.Type = Type;
            req.BrokerCount = 20;
            req.Symbol = Symbol;

            this.Send(req, doSuc, doErr);
        }
    };


    HqCollections.prototype.PushCall = function (doSuc, doErr, Symbol, PushFlag, GetSymInfo) {
        var $this = this;
        if (!PushFlag) { PushFlag = 0; }
        if (!GetSymInfo) { GetSymInfo = 1; }
        if (typeof doErr !== "function") { doErr = function () { }; }
        if (typeof doSuc === "function") {
            $this.PushClose();
            var timeOutFuc = function () { }, timeoutTime = 1000 * 5;
            if (this.SupportWebSocket()) {
                window.PushDataSuccessCallback = function (data) {
                    doSuc(data);
                };
                timeoutTime = 1000 * 60;
                timeOutFuc = function () {
                    $this.doReqUpdatePush(function (data) {
                        //console.log("doReqUpdatePush:Data -- >", data);
                        $this.PusllTimeout = setTimeout(timeOutFuc, timeoutTime);
                    }, doErr, Symbol, 1);
                };
                timeOutFuc();
            } else {
                timeOutFuc = function () {
                    $this.doReqRealTimePrice(function (data) {
                        doSuc(data);
                        $this.PushCall(doSuc, doErr, Symbol, PushFlag, GetSymInfo);
                    }, doErr, Symbol, PushFlag, GetSymInfo);
                };
                $this.PusllTimeout = setTimeout(timeOutFuc, timeoutTime);
            }

        }
    };
    HqCollections.prototype.PushClose = function () {
        var $this = this;
        if ($this.PusllTimeout) { clearTimeout($this.PusllTimeout); $this.PusllTimeout = null; }
    };


    HqCollections.prototype.doReqRealTimePrice = function (doSuc, doErr, Symbol, PushFlag, GetSymInfo) {
        if (this.isDoHqAuth) {
            var req = new window.hqReq();
            req.Head.Type = window.ReqType.CRTReqRealTimePrice;

                        req.PushFlag = 0;
                        req.GetSymInfo = 1;
                        req.Symbol = [{ Market: 1000, Code: "00001" }, { Market: 2002, Code: "00002"}];

            //req.PushFlag = PushFlag;
            //req.GetSymInfo = GetSymInfo;
            //req.Symbol = Symbol;

            this.Send(req, doSuc, doErr);
        }
    };

    HqCollections.prototype.doReqMtInfo = function (doSuc, doErr, Market) {
        if (this.isDoHqAuth) {
            var req = new window.hqReq();
            req.Head.Type = window.ReqType.CRTReqMtInfo;

            //req.Market = [2002, 2004];
            req.Market = Market;

            this.Send(req, doSuc, doErr);
        }
    };

    HqCollections.prototype.doReqSbInfo = function (doSuc, doErr, Symbol) {
        if (this.isDoHqAuth) {
            var req = new window.hqReq();
            req.Head.Type = window.ReqType.CRTReqSbInfo;

            //req.Symbol = [{ Market: 2002, Code: "00001" }, { Market: 2002, Code: "00002"}];
            req.Symbol = Symbol;

            this.Send(req, doSuc, doErr);
        }
    };

    HqCollections.prototype.doTreqSbList = function (doSuc, doErr, Market, IDType, Pos, Count, GetQuote, PushFlag) {
        if (this.isDoHqAuth) {
            var req = new window.hqReq();
            req.Head.Type = window.ReqType.CRTreqSbList;

            req.Market = 2002;
            req.IDType = 1;
            req.Pos = 0;
            req.Count = 10;
            req.GetQuote = 1;
            req.PushFlag = 0;

            //req.Market = Market;
            //req.IDType = IDType;
            //req.Pos = Pos;
            //req.Count = Count;
            //req.GetQuote = GetQuote;
            //req.PushFlag = PushFlag;

            this.Send(req, doSuc, doErr);
        }
    };



    //获取有排序的行情
    HqCollections.prototype.doReqSbReport = function (doSuc, doErr, Market, Desc, iType, Pos, Count, GetQuote, PushFlag) {
        if (this.isDoHqAuth) {

            var req = new window.hqReq();
            req.Head.Type = window.ReqType.PRTReqSbReport;

            req.iType = 1;
            req.Desc = 1;
            req.Pos = 0;
            req.Count = 10;
            req.GetQuote = 1;
            req.PushFlag = 0;
            req.Market = [{ MarketID: 3000, IDType: 1}];

            //req.Market = Market;
            //req.Desc = Desc;
            //req.iType = iType;
            //req.Pos = Pos;
            //req.Count = Count;
            //req.GetQuote = GetQuote;
            //req.PushFlag = PushFlag;

            this.Send(req, doSuc, doErr);
        }
    };

    HqCollections.prototype.doReqSubMtList = function (doSuc, doErr) {
        if (this.isDoHqAuth) {
            var req = new window.hqReq();
            req.Head.Type = window.ReqType.PRTReqSubMtList;
            this.Send(req, doSuc, doErr);
        }
    };

    HqCollections.prototype.doReqMinutesKLine = function (doSuc, doErr, Market, Code, PushFlag, Minute, TypeCount, Weight, TimeType, Count, Time0, Time1) {
        if (this.isDoHqAuth) {
            var req = new window.hqReq();
            req.Head.Type = window.ReqType.PRTReqMinutesKLine;

            //            req.Market = 2002;
            //            req.Code = "00001";
            //            req.PushFlag = 0;
            //            req.Minute = 1;
            //            req.TypeCount = 5;
            //            req.Weight = 0;
            //            req.TimeType = 2;
            //            req.Count = 20;
            //            req.Time0 = "";
            //            req.Time1 = "2013-09-22 09:00:00";

            req.Market = Market;
            req.Code = Code;
            req.PushFlag = PushFlag;
            req.Minute = Minute;
            req.TypeCount = TypeCount;
            req.Weight = Weight;
            req.TimeType = TimeType;
            req.Count = Count;
            req.Time0 = Time0;
            req.Time1 = Time1;

            this.Send(req, doSuc, doErr);
        }
    };

    HqCollections.prototype.doReqSbKLine = function (doSuc, doErr, Market, Code, PushFlag, KLineType, Weight, TimeType, Count, Time0, Time1) {
        if (this.isDoHqAuth) {

            var req = new window.hqReq();
            req.Head.Type = window.ReqType.CRTReqSbKLine;

                                   req.Market = 2002;
                                   req.Code = "00001";
                                   req.PushFlag = 0;
                                   req.KLineType = 2;
                                   req.Weight = 0;
                                   req.TimeType = 2;
                                   req.Count = 20;
                                   req.Time0 = "2013-10-10 00:00:00";
                                   req.Time1 = "";

            // req.Market = Market;
            // req.Code = Code;
            // req.PushFlag = PushFlag;
            // req.KLineType = KLineType;
            // req.Weight = Weight;
            // req.TimeType = TimeType;
            // req.Count = Count;
            // req.Time0 = Time0;
            // req.Time1 = Time1;

            this.Send(req, doSuc, doErr);
        }
    };

    //走势图
    HqCollections.prototype.doReqTrend = function (doSuc, doErr, Market, Code, PushFlag, TimeType, TimeValue0, TimeValue1, Day) {
        if (this.isDoHqAuth) {

            var req = new window.hqReq();
            req.Head.Type = window.ReqType.CRTReqTrend;

            req.Market = 2002;
            req.Code = "00001";
            req.PushFlag = 0;
            req.TimeType = 1;
            req.TimeValue0 = 90;
            req.TimeValue1 = 380;
            req.Day = "2014-04-8 00:00:00";

            //req.Market = Market;
            //req.Code = Code;
            //req.PushFlag = PushFlag;
            //req.TimeType = TimeType;
            //req.TimeValue0 = TimeValue0;
            //req.TimeValue1 = TimeValue1;
            //req.Day = Day;

            this.Send(req, doSuc, doErr);
        }
    };

    HqCollections.prototype.doReqFinance = function (doSuc, doErr, Market, Code) {
        if (this.isDoHqAuth) {
            var req = new window.hqReq();
            req.Head.Type = window.ReqType.PRTReqFinance;
            req.Market = Market;
            req.Code = Code;
            this.Send(req, doSuc, doErr);
        }
    };

    //键盘精灵/股票搜索
    HqCollections.prototype.doReqCodeList = function (doSuc, doErr, Code) {
        if (this.isDoHqAuth) {
            var req = new window.hqReq();
            req.Head.Type = window.ReqType.CRTReqCodeList;
            req.Code = Code;
            this.Send(req, doSuc, doErr);
        }
    };
    HqCollections.prototype.doReqNews = function (doSuc, doErr, param) {
        if (this.isDoHqAuth) {
            var req = new window.hqReq();
            req.Head.Type = param.Type;
            req.NewsInType = param.NewsInType;
            req.NewsType = param.NewsType;
            req.Page = param.Page;
            req.Size = param.Size;
            req.Lan = param.Lan;
            this.Send(req, doSuc, doErr);
        }
    };
    HqCollections.prototype.doReqNewsContent = function (doSuc, doErr, param) {//新闻具体内容请求
        if (this.isDoHqAuth) {
            var req = new window.hqReq();
            req.Head.Type = param.Type;
            req.NewsInType = param.NewsInType;
            req.Nid = param.Nid;
            req.Lan = param.Lan;
            this.Send(req, doSuc, doErr);
        }
    }
    HqCollections.prototype.doReqSpreadCodeTable = function (doSuc, doErr, param) {
        if (this.isDoHqAuth) {
            var req = new window.hqReq();
            req.Head.Type = window.ReqType.PRTReqSpreadCodeTable;
            req.Market = param.Market;
            req.Reserve = param.Reserve;
            this.Send(req, doSuc, doErr);
        }
    }

    //请求合约信息
    HqCollections.prototype.doReqDealInfo = function (doSuc, doErr) {
        if (this.isDoHqAuth) {
            var req = new window.hqReq();
            req.Head.Type = window.ReqType.PRTReqDealInfo;
            // req.Code = Code;
            this.Send(req, doSuc, doErr);
        }
    };
    //合约请求完整行情
    HqCollections.prototype.doReqFullPriceUseTradeCode = function (doSuc, doErr, Code, PushFlag) {
        if (this.isDoHqAuth) {
            var req = new window.hqReq();
            req.Head.Type = window.ReqType.PRTeqFullPriceUseTradeCode;
            req.Code = Code;
            req.PushFlag = PushFlag;
            this.Send(req, doSuc, doErr);
        }
    };

})();