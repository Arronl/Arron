(function () {
    var Header = window.Header = function () {
        var $this = this;
        $this.Ver = 3;
        $this.Len = 0;
        $this.OrgLen = 0;
        $this.Type = 1;
        $this.ID = 0;
        $this.ComCode = 0;
        $this.EnCryCode = 0;
        $this.Binary = 0;
        $this.Encode = 0;
        $this.StrSplit = "\r\n\r\n";


        $this.toHeadText = function () {
            var arHeader = [];
            for (var i in $this) {
                if (typeof $this[i] !== "function" && i != "StrSplit") {
                    arHeader.push($this[i]);
                }
            }
            return arHeader.join(',');
        };

        $this.toHeadString = function () {
            var arHeader = this.toHeadText() + $this.StrSplit;
            return arHeader;
        };

        $this.FromHeadString = function (stringHeader) {
            if (stringHeader.indexOf(',') > -1) {
                var arHeader = stringHeader.split(","), index = 0;
                for (var i in $this) {
                    if (typeof $this[i] !== "function" && i != "StrSplit") {
                        $this[i] = arHeader[index];
                        index += 1;
                    }
                }
            }
            return $this;
        };
    };

    var HqHeader = window.HqHeader = function () {
        var h = new Header;
        h.Session = 0;
        h.Stime = 0;
        return h;
    };

})();