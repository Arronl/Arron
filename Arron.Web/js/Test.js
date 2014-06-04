(function ($) {
    if (!window.Login) {
        //登录
        window.Login = {
            userName: "",
            passWord: ""
        };
    }

    window.AuthLogin = function () {
        var userName = window.Login.userName, passWord = window.Login.passWord, sAuth = new window.AuthNet();
        var req = new window.AuthReq();
        req.Head.Type = window.AuReqType.Auth;
        req.UName = userName;
        req.Pwd = passWord;
        req.SucCallBack = function (data) {
            //console.log(data.Data);
            var xmlobject = (new DOMParser()).parseFromString(data.Data, "text/xml");
            var xml = $(xmlobject);

            //User  /UserR R/  /Ser S/ 
            var u = window.XmlHelper(xmlobject, "User");
            var r = window.XmlHelper(xmlobject, "UserR MR R");
            var s = window.XmlHelper(xmlobject, "Ser S");
            var n = window.XmlHelper(xmlobject, "UserR FC R");


            var order = function (m, n) {
                if ((m.BS << 0) != (n.BS << 0)) {//大市场
                    return (m.BS << 0) <= (n.BS << 0);
                }
                return (m.SID << 0) <= (n.SID << 0); //小市场ID
            };

            //排序
            for (var i = 1; i < r.length; ++i) {
                for (var j = 0; j < r.length - i - 1; ++j) {
                    if (!order(r[j], r[j + 1])) {
                        var temp = r[j];
                        r[j] = r[j + 1];
                        r[j + 1] = temp;
                    }
                }
            };


            if (!window.AuthHelper) { window.AuthHelper = {}; }
            var c = window.HqServer = new window.HqCollections(userName, passWord, u, r, s);
            if (window.AuthHelper.SubMarket) { c.SubMarket = window.AuthHelper.SubMarket; }
            if (window.AuthHelper.mList) { c.mList = window.AuthHelper.mList; }





            var tradeTM = function (data) {
                c.nowTradeTime = JSON.parse(data.Data).TradeTime;
                window.HqServer.isLoad = true;
                window.Manager.onHqLoad();
            };
            var subML = function (data) {
                c.SubMarket = JSON.parse(data.Data).SubMarket;
                if (!window.AuthHelper.SubMarket) { window.AuthHelper.SubMarket = c.SubMarket; }
                _.each(c.SubMarket, function (m, Key) {
                    if (c.mpList[m.Market]) {
                        if (!c.mpList[m.Market].SubMarket) { c.mpList[m.Market].SubMarket = []; }
                        c.mpList[m.Market].SubMarket.push(m);
                    }
                });
                c.doReqTradeTime(tradeTM, tradeTM);
            };

            var ifF = function (data) {
                var list = c.mList = JSON.parse(data.Data).Market;
                if (!window.AuthHelper.mList) { window.AuthHelper.mList = c.mList; }
                var parseList = c.mpList = {};
                _.each(list, function (m, Key) {
                    parseList[m.Market] = m;
                });

                c.doReqSubMtList(subML, subML);
                //window.HqServer.isLoad = true;
                //window.Manager.onHqLoad();
            };
            var mtF = function (data) {
                var mtList = [];
                _.each(c.UserR, function (R, Key) {
                    if (R.M) mtList.push(R.M);
                });
                c.doReqMtInfo(ifF, function () { alert("报错了"); }, mtList);
            };
            c.doHqAuth(mtF, function () { alert("报错了"); });
        };
        req.ErrCallBack = function (data) {
            alert(data.Data);
        };
        sAuth.SendReq(req);
    };

    AuthLogin();

})();