//helper methods
var convert = {
    //[convert] csharp date -> js date
    todate: function (csharp_date) {
        if (csharp_date) {
            //silently accept date object passed from the user input
            if (typeof csharp_date == 'object') {
                return csharp_date;
            }
            //so now the input should be from .net server
            var regexp = /\/Date\((\d+)\)\//;
            var result = csharp_date.match(regexp);
            if (result) {
                var milli_sec = result[1];
                return new Date(new Number(milli_sec));
            }
            regexp = /\d+\-\d+\-\d+[T]?(\d+\:\d+\:\d+\.\d+)?/;
            result = csharp_date.match(regexp);
            if (result) {
                return new Date(csharp_date);
            }
        }
        return null;
    },
    //#region lx.yin 2016-07-04 日期转换为指定格式
    toDateTime:function(time, format){
        var t = new Date(time);
        var tf = function(i){return (i < 10 ? '0' : '') + i};
        return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function(a){
            switch(a){
                case 'yyyy':
                    return tf(t.getFullYear());
                    break;
                case 'MM':
                    return tf(t.getMonth() + 1);
                    break;
                case 'mm':
                    return tf(t.getMinutes());
                    break;
                case 'dd':
                    return tf(t.getDate());
                    break;
                case 'HH':
                    return tf(t.getHours());
                    break;
                case 'ss':
                    return tf(t.getSeconds());
                    break;
            }
        });
    },
    //#endregion
    //#region lx.yin 2016-08-11 格式转换为货币格式
    toMoney: function (money) { //lxyin 
        var regexp = "^(([0-9]|([1-9][0-9]{0,9}))((\.[0-9]{1,2})?))$";
        var result = money.match(regexp);
        return result;
    },
    //#endregion
    toPosInt:function(data){ //lxyin 20160311 非负整数
        var regexp = "/^(0|[1-9]\d*)$/;";
        return data.match(regexp);
    },
    formatTen: function (num) {
        return num > 9 ? (num + "") : ("0" + num); 
    },
    todateStringfunction:function  (date) { 
        var year = date.getFullYear(); 
        var month = date.getMonth() + 1; 
        var day = date.getDate(); 
        var hour = date.getHours(); 
        var minute = date.getMinutes(); 
        var second = date.getSeconds(); 
        return year + "-" + month+ "-" + day ;
        } ,
    tobool: function (bool) {
        if (bool == true) {
            return '是';
        }
        if (bool == false) {
            return '否';
        }
        if (bool == '是') {
            return true;
        }
        if (bool == '否') {
            return false;
        }
        return null;
    },
    date2string: function (date) {
        if (!date) {
            return null;
        }
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        if (month < 10) {
            month = '0' + month;
        }
        if (day < 10) {
            day = '0' + day;
        }
        return year + '-' + month + '-' + day;
    },
    dateFullstring: function (date) {
        if (!date) {
            return null;
        }
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var hour = date.getHours();
        var min = date.getMinutes();
        var sec = date.getSeconds();
        if (month < 10) {
            month = '0' + month;
        }
        if (day < 10) {
            day = '0' + day;
        }
        if (hour < 10) {
            hour = '0' + hour;
        }
        if (min < 10) {
            min = '0' + min;
        }
        if (sec < 10) {
            sec = '0' + sec;
        }
        return year + '-' + month + '-' + day + ' ' + hour+':'+min+':'+sec;
    },
    deepCopy: function (source) {
        if (typeof source !== "object" || source instanceof Date || !source) {
            return source;
        }
        var s = {};
        if (source.constructor == Array) {
            s = [];
        }
        for (var i in source) {
            s[i] = this.deepCopy(source[i]);
            if (typeof s[i] == "string") //lx.yin 20160505 去除首尾空格
                s[i] = Ext.util.Format.trim(s[i]);
        }
        return s;
    },
    round: function (value, decimalPoints) {
        return Math.round(value * Math.pow(10, decimalPoints)) / Math.pow(10, decimalPoints);
    }
}
Date.prototype.format = function (format) //author: meizz
{
    var o = {
        "M+": this.getMonth() + 1, //month
        "d+": this.getDate(),    //day
        "h+": this.getHours(),   //hour
        "m+": this.getMinutes(), //minute
        "s+": this.getSeconds(), //second
        "q+": Math.floor((this.getMonth() + 3) / 3),  //quarter
        "S": this.getMilliseconds() //millisecond
    }
    if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
    (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o) if (new RegExp("(" + k + ")").test(format))
        format = format.replace(RegExp.$1,
      RegExp.$1.length == 1 ? o[k] :
        ("00" + o[k]).substr(("" + o[k]).length));
    return format;
}
function formatTime(val) {
    var re = /-?\d+/;
    var m = re.exec(val);
    var d = new Date(parseInt(m[0]));
    // 按【2012-02-13 09:09:09】的格式返回日期
    return d.format("yyyy-MM-dd hh:mm:ss");
}
function formatDate(val) {
    var re = /-?\d+/;
    var m = re.exec(val);
    var d = new Date(parseInt(m[0]));
    // 按【2012-02-13 09:09:09】的格式返回日期
    return d.format("yyyy-MM-dd");
}