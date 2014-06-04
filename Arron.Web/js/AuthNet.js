(function () {
    var AuReqType = window.AuReqType = {
        None: 0,
        Auth: 1,
        Error: 3
    };

    var AuthReq = window.AuthReq = function () {
        this.Head = new window.Header();
    };
    AuthReq.prototype.GetReqCmd = function () {
        var strParm = [];
        switch (this.Head.Type) { //心跳包
            case AuReqType.Auth:
                strParm.push("<?xml version=\"1.0\" encoding=\"utf-8\" standalone=\"yes\" ?>");
                strParm.push("<XMLDATA version=\"1.0\" data=\"UserAuth\">");
                strParm.push(["<Auth Na='", this.UName, "' Pa='", this.Pwd, "' Pr='H5' CarType='1' CR='1' SR='1' BM='1' UR='13' UD='1,2'  OD='1001,1002' SER='TD,NS,QT'></Auth>"].join(''));
                strParm.push("</XMLDATA>");
                break;
        }
        return strParm.join('');
    };
    AuthReq.prototype.toHttpText = function () {
        var strCmd = this.GetReqCmd();
        this.Head.Len = strCmd.length;
        var strHead = this.Head.toHeadString();

        return strHead + strCmd;
    };

    var AuthRes = window.AuthRes = function () {
        this.Head = new window.Header();
        this.Data = null;
    };


    var AuthNet = window.AuthNet = function (Server, Port) {
        if (!Server) { Server = AppConfig && AppConfig.AuthAddress ? AppConfig.AuthAddress : "222.73.126.187"; }
        console.log(Server, AppConfig);
        //if (!Server) { Server = "117.135.137.144"; }
        if (!Port) { Port = AppConfig && AppConfig.AuthPort ? AppConfig.AuthPort : 8007; }
        var net = new window.Net(Server, Port);
        net.ProcessRecData = function () {
            var res = new AuthRes();
            var k = this.ResText.indexOf(res.Head.StrSplit)
            if (k > -7) {
                var strh = this.ResText.substring(0, k);
                res.Head.FromHeadString(strh);
                var strf = this.ResText.substring(k + 4, this.ResText.length);
                if (strf.length > 0) {
                    res.Data = strf;
                }

                switch ((res.Head.Type << 0)) {
                    case AuReqType.Auth:
                        this.SucTaskList["SucCallBack" + res.Head.ID] && this.SucTaskList["SucCallBack" + res.Head.ID](res);
                        this.DeleteCallBack(res)
                        break;
                    default:
                    case AuReqType.Error:
                        this.ErrTaskList["ErrCallBack" + res.Head.ID] && this.ErrTaskList["ErrCallBack" + res.Head.ID](res);
                        this.DeleteCallBack(res)
                        break;
                }
            }
        };
        return net;
    };

})();