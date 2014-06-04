(function () {
    var ReqType = window.ReqType = {
        CRTNone: 0, 					// 无类型
        CRTCkLive: 1, 			// 存活包
        CRTAuth: 2, 					// 用户认证
        PRTLogout: 3, 				   // 退出登录, 只对HTTP用户	

        CRTReqMtInfo: 50, 	// 请求市场信息
        CRTReqSbInfo: 51, 			// 请求商品信息
        CRTreqSbList: 52, 		   // 获取商品列表
        PRTReqSbReport: 53, 		// 商品排行
        CRTReqCodeList: 54, 			// 用户输入代码
        PRTReqSomeSymReport: 55, 		// 指定商品排序
        PRTReqSubMtList: 56, 			// 请求子市场列表
        PRTReqDealInfo: 57, 				// 请求合约信息
        PRTReqConditionCode: 58, 			// 附加条件查询商品
        PRTReqTradeTime: 59, 				// 交易时间



        CRTReqSbKLine: 150, 	// 获取K线
        CRTRequestSymbolTick: 151, 			// 获取分笔数据
        CRTReqTrend: 152, 				// 获取分时走势
        CRTReqRealTimePrice: 153, 		// 获取一个商品行情, 并添加行情推送
        PRTReLevel2: 154, 				// 经纪人队列
        PRTeqFullPriceUseTradeCode: 155, 		// 使用合约号获取商品完整行情, 并添加行情推送
        PRTReqMinutesKLine: 156, 			// 获取多分钟或多日K线, 并添加推送
        PRTReqOddLot: 157, 					// 碎股
        PRTReqFinance: 158, 				// 财务
        PRTReqFreeText: 159, 				// FreeTExt
        PRTReqLinkSym: 160, 				// 关联商品

        CRTRequestAddPush: 200, 			// 请求添加推送记录, 只对CNET连接有效
        CRTRequestDeletePush: 201, 				// 删除推送数据的请求, 只对CNET连接有效
        CRTRequestUpdatePush: 202, 				// 同步推送请求, 只对CNET连接有效


        SERPushPrice: 250, 				// 数据推送行情,只会是服务器发向客户端, 只对CNET连接有效
        SERPushTick: 251, 					// 数据推送分笔,只会是服务器发向客户端, 只对CNET连接有效	
        PSERPushLevel2: 252, 				    // 经纪人
        PSERPPushOddLot: 253, 				// 碎股
        SERErrorMsg: 300, 				// 错误消息,只会是服务器发向客户端	

        PSerPushUpdateSym: 350, 			// 当服务器更新商品完列表时, 推送给客户, 只对非HTTP用户
        PCRTTickUser: 351, 					// 踢除用户

        PRTUploadUserData: 400, 		// 请求上传数据, 现在只有自选股
        PRTUploadOrgExData: 401, 			   // 请求上传机构额外数据
        PRTReqUserData: 402, 				// 请求用户数据
        PRTReqOrgExData: 403, 				// 请求机构额外数据

        News: 10000  //请求新闻

    }

    var RSType = window.RSType = {
        PRSTBegin: 0,
        PRSTRisePercent: 1, 	// 涨跌幅
        PRSTRiseValue: 2, 		// 涨跌
        PRSTPriceNew: 3, 		// 最新价
        PRSTPriceAverage: 4, 	// 均价
        PRSTSettle: 5, 			// 结算价
        PRSTCurVolume: 6, 		// 现手
        PRSTPriceBuy: 7, 		// 买价
        PRSTPriceSell: 8, 		// 卖价
        PRSTVolumeTotal: 9, 		// 总手
        PRSTPriceOpen: 10, 		// 今开
        PRSTPricePrevClose: 11, 	// 昨收价
        PRSTPriceHigh: 12, 		// 最高价
        PRSTPriceLow: 13, 		// 最低价
        PRSTAmountTotal: 14, 		// 总金额
        PRSTAmplitude: 15, 		// 振幅
        PRSTVolRatio: 16, 		// 量比
        PRSTBidRatio: 17, 		// 委比
        PRSTBidDifference: 18, 	// 委差
        PRSTIn: 19, 				// 内盘
        PRSTOut: 20, 			// 外盘
        PRSTInOutRatio: 21, 		// 内外盘比

        PRSTPricePrevAvg: 22, 	// 昨结算
        PRSTPriceHold: 23, 		// 持仓
        PRSTCurHold: 24, 		// 增仓
        PRSTPE: 25, 				// 动态市盈率
        PRSTTradeRate: 26, 		// 换手率
        PRSTMoneyIn: 27, 		// 资金流向
        PRSTRiseRate: 28, 		// 涨速(最新价和上个分钟收盘价的比率)
        PRSTEnd: 29
    };

    var NewsInType = window.NewsInType = {
        ERTCurNewsTitle: 10,
        ERTCurNewsContent: 11,
        ERTExNewsTitle: 12,
        ERTExNewsContent: 13,
        ERTInfoTitle: 14,
        ERTInfoContent: 15,
        ERTErrMsg: 300
    };

    //合并Buffer
    if (!!window.ArrayBuffer) {
        ArrayBuffer.prototype.zUnion = function (buf) {
            // console.log("uS:"+new Date());
            var buf3 = null;
            if (this.byteLength == 0) {
                buf3 = buf;
            } else {
                buf3 = new ArrayBuffer(this.byteLength + buf.byteLength);
                var u3 = new Uint8Array(buf3);
                u3.set(new Uint8Array(this), 0);
                u3.set(new Uint8Array(buf), this.byteLength);
            }
            return buf3;
        }

        ArrayBuffer.prototype.zCopy = function (startPos, buf) {
            var u1 = new Uint8Array(this);
            u1.set(new Uint8Array(buf), startPos);
            return u1.buffer;
        }

        ArrayBuffer.prototype.zToNewSize = function (length) {
            var buf = new ArrayBuffer(length);
            buf = buf.zCopy(0, this);
            return buf;
        }

        ArrayBuffer.prototype.Oslice = function (startPos, endPos) {
            var buf = null;
            if (typeof (this.slice) != "undefined") {
                buf = this.slice(startPos, endPos);
            } else {
                buf = new ArrayBuffer(endPos - startPos);
                if (endPos != startPos) {
                    var u81 = new Uint8Array(buf);
                    u81.set(new Uint8Array(this, startPos, endPos - startPos), 0);
                }
            }
            return buf;
        }
    };

    var NetCm = window.NetCommon = function () { };
    NetCm.prototype.BytesLength = function () {
        return {
            Uint8ArrayLength: 1,
            Int8ArrayLength: 1,

            Uint16ArrayLength: 2,
            Int16ArrayLength: 2,

            Uint32ArrayLength: 4,
            Int32ArrayLength: 4,

            Float32ArrayLength: 4,
            Float64ArrayLength: 8
        }
    } ();
    NetCm.prototype.base64ArrayBuffer = function (arrayBuffer) {
        var base64 = ''
        var encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'

        var bytes = new Uint8Array(arrayBuffer)
        var byteLength = bytes.byteLength
        var byteRemainder = byteLength % 3
        var mainLength = byteLength - byteRemainder

        var a, b, c, d
        var chunk

        // Main loop deals with bytes in chunks of 3
        for (var i = 0; i < mainLength; i = i + 3) {
            // Combine the three bytes into a single integer
            chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2]

            // Use bitmasks to extract 6-bit segments from the triplet
            a = (chunk & 16515072) >> 18 // 16515072 = (2^6 - 1) << 18
            b = (chunk & 258048) >> 12 // 258048   = (2^6 - 1) << 12
            c = (chunk & 4032) >> 6 // 4032     = (2^6 - 1) << 6
            d = chunk & 63               // 63       = 2^6 - 1

            // Convert the raw binary segments to the appropriate ASCII encoding
            base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d]
        }

        // Deal with the remaining bytes and padding
        if (byteRemainder == 1) {
            chunk = bytes[mainLength]

            a = (chunk & 252) >> 2 // 252 = (2^6 - 1) << 2

            // Set the 4 least significant bits to zero
            b = (chunk & 3) << 4 // 3   = 2^2 - 1

            base64 += encodings[a] + encodings[b] + '=='
        } else if (byteRemainder == 2) {
            chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1]

            a = (chunk & 64512) >> 10 // 64512 = (2^6 - 1) << 10
            b = (chunk & 1008) >> 4 // 1008  = (2^6 - 1) << 4

            // Set the 2 least significant bits to zero
            c = (chunk & 15) << 2 // 15    = 2^4 - 1

            base64 += encodings[a] + encodings[b] + encodings[c] + '='
        }

        return base64;
    };
    NetCm.prototype.SdecodeArrayBuffer = function (base64) {
        var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        var bufferLength = base64.length * 0.75,
            len = base64.length, i, p = 0,
            encoded1, encoded2, encoded3, encoded4;

        if (base64[base64.length - 1] === "=") {
            bufferLength--;
            if (base64[base64.length - 2] === "=") {
                bufferLength--;
            }
        }

        var arraybuffer = new ArrayBuffer(bufferLength),
        bytes = new Uint8Array(arraybuffer);

        for (i = 0; i < len; i += 4) {
            encoded1 = chars.indexOf(base64[i]);
            encoded2 = chars.indexOf(base64[i + 1]);
            encoded3 = chars.indexOf(base64[i + 2]);
            encoded4 = chars.indexOf(base64[i + 3]);

            bytes[p++] = (encoded1 << 2) | (encoded2 >> 4);
            bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
            bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63);
        }
        return arraybuffer;
    };

    NetCm.prototype.CusDataView = function (buff) {
        this.olittleEndian = new Int8Array(new Int16Array([1]).buffer)[0] > 0;
        this.buffer = buff;
        this.setUint8 = function (pos, ovalue) {
            var u8Arry = new Uint8Array(this.buffer);
            u8Arry[pos] = ovalue;
        }

        this.setUint16 = function (pos, ovalue, littleEndian) {
            var tBuf = new ArrayBuffer(2);
            var u16Arry = new Uint16Array(tBuf);
            u16Arry[0] = ovalue;
            tBuf = this.ExlittleEndian(tBuf, littleEndian);
            this.SetBuffValue(pos, tBuf);
        }

        this.setUint32 = function (pos, ovalue, littleEndian) {
            var tBuf = new ArrayBuffer(4);
            var u32Arry = new Uint32Array(tBuf);
            u32Arry[0] = ovalue;
            tBuf = this.ExlittleEndian(tBuf, littleEndian);
            this.SetBuffValue(pos, tBuf);
        }
        this.setInt8 = function (pos, ovalue) {
            var i8Arry = Int8Array(this.buffer);
            i8Arry[pos] = ovalue;
        }

        this.setInt16 = function (pos, ovalue, littleEndian) {
            var tBuf = new ArrayBuffer(2);
            var i16Arry = new Int16Array(tBuf);
            i16Arry[0] = ovalue;
            tBuf = this.ExlittleEndian(tBuf, littleEndian);
            this.SetBuffValue(pos, tBuf);
        }

        this.setInt32 = function (pos, ovalue, littleEndian) {
            var tBuf = new ArrayBuffer(4);
            var i32Arry = new Int32Array(tBuf);
            i32Arry[0] = ovalue;
            this.ExlittleEndian(pos, 4, littleEndian);
            this.SetBuffValue(pos, tBuf);
        }

        this.setFloat32 = function (pos, ovalue, littleEndian) {
            var tBuf = new ArrayBuffer(4);
            var f32Arry = new Float32Array(this.buffer);
            f32Arry[0] = ovalue;
            this.ExlittleEndian(tBuf, littleEndian);
            this.SetBuffValue(pos, tBuf);
        }

        this.setFloat64 = function (pos, ovalue, littleEndian) {
            var tBuf = new ArrayBuffer(8);
            var f64Arry = new Float64Array(this.buffer);
            f64Arry[0] = ovalue;
            tBuf = this.ExlittleEndian(tBuf, littleEndian);
            this.SetBuffValue(pos, tBuf);
        }


        this.ExlittleEndian = function (tBuf, littleEndian) {
            if (this.olittleEndian != littleEndian) {
                var u8Arry = new Uint8Array(tBuf);
                var kg = u8Arry.length / 2;
                for (var i = 0; i < kg; i++) {
                    var temp = u8Arry[i];
                    u8Arry[i] = u8Arry[u8Arry.length - i - 1];
                    u8Arry[u8Arry.length - i - 1] = temp;
                }
            }
            return tBuf;
        }

        this.SetBuffValue = function (pos, tBuf) {
            var u1 = new Uint8Array(tBuf);
            var u2 = new Uint8Array(this.buffer, pos, tBuf.byteLength);
            u2.set(u1, 0);
        }

        this.GetBuffValue = function (pos, length) {
            var tBuf = new ArrayBuffer(length);
            var u1 = new Uint8Array(tBuf);
            var u2 = new Uint8Array(this.buffer, pos, length);
            u1.set(u2, 0);
            return tBuf;
        }

        this.getUint8 = function (pos) {
            var u8Arry = new Uint8Array(this.buffer, pos, 1);
            return u8Arry[0];
        }

        this.getUint16 = function (pos, littleEndian) {
            var tBuf = this.GetBuffValue(pos, 2);
            tBuf = this.ExlittleEndian(tBuf, littleEndian);
            var u16Arry = new Uint16Array(tBuf, 0, 1);
            return u16Arry[0];
        }


        this.getUint32 = function (pos, littleEndian) {
            var tBuf = this.GetBuffValue(pos, 4);
            tBuf = this.ExlittleEndian(tBuf, littleEndian);
            var u32Arry = new Uint32Array(tBuf, 0, 1);
            return u32Arry[0];
        }

        this.getInt8 = function (pos) {
            var i8Arry = Int8Array(this.buffer, pos, 1);
            return i8Arry[0];
        }

        this.getInt16 = function (pos, littleEndian) {
            var tBuf = this.GetBuffValue(pos, 2);
            tBuf = this.ExlittleEndian(tBuf, littleEndian);
            var i16Arry = new Int16Array(tBuf, 0, 1);
            return i16Arry[0];
        }

        this.getInt32 = function (pos, littleEndian) {
            var tBuf = this.GetBuffValue(pos, 4);
            tBuf = this.ExlittleEndian(tBuf, littleEndian);
            var i32Arry = new Int32Array(tBuf, 0, 1);
            return i32Arry[0];
        }

        this.getFloat32 = function (pos, littleEndian) {
            var tBuf = this.GetBuffValue(pos, 4);
            tBuf = this.ExlittleEndian(tBuf, littleEndian);
            var f32Arry = new Float32Array(tBuf, 0, 1);
            return f32Arry[0];
        }

        this.getFloat64 = function (pos, littleEndian) {
            var tBuf = this.GetBuffValue(pos, 8);
            tBuf = this.ExlittleEndian(tBuf, littleEndian);
            var f64Arry = new Float64Array(tBuf, 0, 1);
            return f64Arry[0];
        }
    };
    NetCm.prototype.GetRealDataView = function (buff) {
        var dv = null;
        if (typeof (DataView) == "undefined") {
            dv = new this.CusDataView(buff);
        } else {
            dv = new DataView(buff);
        }
        return dv;
    };
    NetCm.prototype.DecodeCA = function (uint8array) {
        var szClientKey = [0x15, 0xe9, 0xf2, 0x7a, 0x89, 0x90, 0x73, 0x25];
        var i = 0;
        var iLen = uint8array.length;
        for (i = 0; i < iLen; ++i) {
            var cTmp = uint8array[i];
            uint8array[i] = ((cTmp << 4) & 0xf0) | ((cTmp >> 4) & 0x0f);
        }

        var iKeyLen = szClientKey.length;
        for (i = 0; i < iLen; i += iKeyLen) {
            for (var j = 0; j < iKeyLen; ++j) {
                var iIndex = i + j;
                if (iIndex < iLen) {
                    uint8array[iIndex] ^= szClientKey[j];
                }
            }
        }
        return uint8array;
    };
    var NetCm = window.NetCommon = new NetCm;

    var XmlHelper = window.XmlHelper = function (XmlDocment, TagName) {
        var list = [], children = $(XmlDocment).find(TagName);
        for (var i = 0; i < children.length; i++) {
            var Row = {}, abs = children[i].attributes;
            for (var x in abs) {
                if (abs[x].value && abs[x].name) {
                    Row[abs[x].name] = abs[x].value;
                }
            }
            list.push(Row);
        }
        return list;
    };

    var Callback = function (res) {
        switch ((res.Head.Type << 0)) {
            case window.ReqType.CRTCkLive:
            case window.ReqType.CRTAuth: //行情服务器认证。			
            case window.ReqType.PRTLogout: //登出			
            case window.ReqType.CRTReqMtInfo: //请求市场信息				
            case window.ReqType.CRTReqSbInfo: //请求商品信息				
            case window.ReqType.CRTreqSbList: //请求商品列表	
            case window.ReqType.PRTReqSbReport: //请求商品排行
            case window.ReqType.PRTReqSubMtList: //请求子市场列表                
            case window.ReqType.PRTReqMinutesKLine: //获取K线			   
            case window.ReqType.CRTReqTrend: //请求走势               
            case window.ReqType.CRTReqSbKLine: //获取K线
            case window.ReqType.CRTReqRealTimePrice:
            case window.ReqType.CRTReqCodeList: //键盘精灵/股票搜索
            case window.ReqType.PRTReqSpreadCodeTable: //差价表
            case window.ReqType.PRTReqFinance:
            case window.ReqType.CRTRequestUpdatePush: //更新推送
            case window.ReqType.PRTReqTradeTime:
                this.SucTaskList["SucCallBack" + res.Head.ID] && this.SucTaskList["SucCallBack" + res.Head.ID](res);
                this.DeleteCallBack(res);
                break;
            case window.ReqType.SERPushPrice: //推送
                if (typeof window.PushDataSuccessCallback === "function") {
                    window.PushDataSuccessCallback(res);
                }
                break;
            case window.ReqType.News:
                var Data = JSON.parse(res.Data);
                switch (Data.Type) {
                    case NewsInType.ERTCurNewsTitle:
                    case NewsInType.ERTInfoTitle:
                    case NewsInType.ERTExNewsTitle:
                    case NewsInType.ERTCurNewsContent:
                    case NewsInType.ERTExNewsContent:
                    case NewsInType.ERTExNewsTitle:
                    case NewsInType.ERTInfoContent:
                        this.SucTaskList["SucCallBack" + res.Head.ID] && this.SucTaskList["SucCallBack" + res.Head.ID](res);
                        this.DeleteCallBack(res);
                        break;
                    case NewsInType.ERTErrMsg:
                        this.ErrTaskList["ErrCallBack" + res.Head.ID] && this.ErrTaskList["ErrCallBack" + res.Head.ID](res);
                        this.DeleteCallBack(res);
                        break;
                }
                break;
            case window.ReqType.SERErrorMsg:
                this.ErrTaskList["ErrCallBack" + res.Head.ID] && this.ErrTaskList["ErrCallBack" + res.Head.ID](res);
                this.DeleteCallBack(res);
                break;
        }
    };


    var Net = window.Net = function (Server, Port) {
        this.ResText = "";
        this.Server = Server;
        this.Port = Port;
        this.SucTaskList = {};
        this.ErrTaskList = {};
        this.ReqID = 0;
    };

    Net.prototype.SendReq = function (req) {
        this.ReqID++;
        req.Head.ID = this.ReqID;
        if (!!req.SucCallBack) {
            this.SucTaskList["SucCallBack" + this.ReqID] = req.SucCallBack;
        }

        if (!!req.ErrCallBack) {
            this.ErrTaskList["ErrCallBack" + this.ReqID] = req.ErrCallBack;
        }

        var txtReq = req.toHttpText();
        this.GloabalXhr = new XMLHttpRequest();
        var url = "http://" + this.Server + ":" + this.Port + '?' + (new Date());
        this.GloabalXhr.open('POST', url, true);
        this.GloabalXhr.timeout = 30000;
        this.GloabalXhr.withCredentials = false;
        this.GloabalXhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;");  //
        this.GloabalXhr.responseType = 'text';
        var me = this;
        this.GloabalXhr.onload = function (e) {
            if (this.status == 200) {
                me.GloabalXhr = null;
                me.ResText = this.responseText;
                me.ProcessRecData();
            }
        };

        this.GloabalXhr.ontimeout = function (event) {
            alert('请求超时！');
        }

        this.GloabalXhr.onerror = function (e) {
            alert("报错了onerror");
        };
        this.GloabalXhr.send(txtReq);
    };

    Net.prototype.ProcessRecData = function () { };

    Net.prototype.DeleteCallBack = function (res) {
        this.SucTaskList["SucCallBack" + res.Head.ID] = null;
        delete this.SucTaskList["SucCallBack" + res.Head.ID];
        this.ErrTaskList["SucCallBack" + res.Head.ID] = null;
        delete this.ErrTaskList["SucCallBack" + res.Head.ID];
    };
    Net.prototype.Callback = Callback;


    var Socket = window.Socket = function (Server, Port) {
        this.ResText = "";
        this.Server = Server;
        this.Port = Port;
        this.SucTaskList = {};
        this.ErrTaskList = {};
        this.ReqID = 0;
        this.CommandList = [];
        this.GloableComFlag = false;
        this.IsConnected = false;
        this.StockWs = null;
        this.ConnectionSocket();
    };

    Socket.prototype.ProcessNextCommand = function () {
        var $this = this;
        if ($this.IsConnected && $this.CommandList.length > 0) {
            var req = $this.CommandList.shift();
            $this.SendReq(req);
        }
    };

    Socket.prototype.SendReq = function (req) {
        var $this = this;
        if ($this.IsConnected) {
            $this.ReqID++;
            req.Head.Comcode = 1;
            //req.Head.EnCryCode = 1;
            req.Head.ID = $this.ReqID;

            var n = req.toHttpText();
            var buf = TextEncoder('utf-8').encode(n).buffer;

            if ($this.GloableComFlag) {
                buf = window.NetCommon.base64ArrayBuffer(buf);
            }
            if (!!req.SucCallBack) {
                $this.SucTaskList["SucCallBack" + $this.ReqID] = req.SucCallBack;
            }
            if (!!req.ErrCallBack) {
                $this.ErrTaskList["ErrCallBack" + $this.ReqID] = req.ErrCallBack;
            }
            $this.StockWs.send(buf);
        } else {
            $this.CommandList.push(req);
        }
    };

    Socket.prototype.ConnectionSocket = function () {
        var $this = this;
        var ws = this.StockWs = new WebSocket("Ws://" + this.Server + ":" + this.Port);
        $this.ResText = "";
        $this.ResBuffer = new ArrayBuffer(0);
        ws.onopen = function () {
            ws.binaryType = "arraybuffer";
            $this.IsConnected = true;
            console.log("开始连接");
            $this.ProcessNextCommand();
        };
        ws.onclose = function () {
            $this.StockWs = null;
            $this.IsConnected = false;
            $this.ResText = "";
            $this.ResBuffer = new ArrayBuffer(0);
            console.log("关闭连接");
        };
        ws.onerror = function () {
            $this.ResText = "";
            $this.ResBuffer = new ArrayBuffer(0);
            console.log("发生错误");
        };
        ws.onmessage = function (evt) {
            $this.GloableComFlag = (typeof evt.data === "string");
            if (!$this.IsFirst) {
                $this.IsFirst = true; return;
            }
            var data = null;
            if ($this.GloableComFlag) {
                data = window.NetCommon.SdecodeArrayBuffer(evt.data);
            } else {
                data = evt.data;
            }

            $this.ResBuffer = $this.ResBuffer.zUnion(data);
            data = null;

            $this.ProcessRecData();
        };
    };

    Socket.prototype.ProcessRecData = function () {
        var $this = this;
        var res = new HqRes();
        var dv = window.NetCommon.GetRealDataView($this.ResBuffer);
        $this.ResText = TextDecoder('utf-8').decode(dv);
        var k = $this.ResText.indexOf(res.Head.StrSplit);
        if (k > -1) {
            var strh = $this.ResText.substring(0, k);
            res.Head.FromHeadString(strh);
            var headLength = (TextEncoder('utf-8').encode(res.Head.toHeadString()).buffer.byteLength << 0);
            if (!isNaN(res.Head.Len)) { res.Head.Len = res.Head.Len << 0; }
            if ($this.ResBuffer.byteLength >= headLength + res.Head.Len) {
                var strBuf = $this.ResBuffer.Oslice(headLength, headLength + res.Head.Len);
                $this.ResBuffer = $this.ResBuffer.Oslice(headLength + res.Head.Len, $this.ResBuffer.byteLength);

                var uint8array = new Uint8Array(strBuf);
                if (res.Head.EnCryCode == 1) {
                    uint8array = window.NetCommon.DecodeCA(uint8array);
                }
                if (res.Head.Comcode == 1)//解压
                {
                    uint8array = (new Zlib_Inflate(uint8array)).decompress();
                }
                //var dvc = window.NetCommon.GetRealDataView(uint8array);
                res.Data = TextDecoder('utf-8').decode(uint8array);
                //console.log(res);

                $this.Callback(res);
            }
        }
    };
    Socket.prototype.Callback = Callback;

    Socket.prototype.DeleteCallBack = function (res) {
        this.SucTaskList["SucCallBack" + res.Head.ID] = null;
        delete this.SucTaskList["SucCallBack" + res.Head.ID];
        this.ErrTaskList["SucCallBack" + res.Head.ID] = null;
        delete this.ErrTaskList["SucCallBack" + res.Head.ID];
    };
})(jQuery);