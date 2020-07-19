/*
* @Author: 王侃
* @Date:   2019-07-19 15:46:02
* @Description: 'js工具'
*/
import {
    Message,
} from 'element-ui';
export const common = {
    /**
     * 时间转换
     * 时间字符串转换时间戳
     * @Description：'yyyy-MM-dd-HH-mm-ss格式转换
     */
    YMDHMSFormat: function(str) {
        let oDate = new Date(str),
            oYear = oDate.getFullYear(),
            oMonth = oDate.getMonth() + 1,
            oDay = oDate.getDate(),
            oHour = oDate.getHours(),
            oMin = oDate.getMinutes(),
            oSen = oDate.getSeconds(),
            oTime = oYear + '-' + this.getzf(oMonth) + '-' + this.getzf(oDay) + ' ' + this.getzf(oHour) + ':' + this.getzf(oMin) + ':' + this.getzf(oSen)//最后拼接时间
        return oTime
    },
    /**
     * 时间转换
     * 时间字符串转换时间戳
     * @Description：'yyyy-MM-dd格式转换'
     */
    YMDFormat: function(str) {
        if (str===null||typeof str === 'undefined'||str === '') {
            return undefined
        } else {
            let oDate = new Date(str),
                oYear = oDate.getFullYear(),
                oMonth = oDate.getMonth() + 1,
                oDay = oDate.getDate(),
                oTime = oYear + '-' + this.getzf(oMonth) + '-' + this.getzf(oDay)
            return oTime
        }
    },
    /**
     * 时间转换
     * 时间字符串转换时间戳
     * @Description：'yyyy-MM格式转换'
     */
    YMFormat: function(str) {
        if (str===null||typeof str === 'undefined'||str === '') {
            return undefined
        } else {
            let oDate = new Date(str),
                oYear = oDate.getFullYear(),
                oMonth = oDate.getMonth() + 1,
                oDay = oDate.getDate(),
                oTime = oYear + '-' + this.getzf(oMonth)
            return oTime
        }
    },
    /**
     * 时间转换
     * 时间字符串转换时间戳
     * @Description：'MM-dd-HH-mm-ss格式转换'
     */
    MDHMFormat: function (str) {
        let oDate = new Date(str),
            oYear = oDate.getFullYear(),
            oMonth = oDate.getMonth() + 1,
            oDay = oDate.getDate(),
            oHour = oDate.getHours(),
            oMin = oDate.getMinutes(),
            oSen = oDate.getSeconds(),
            oTime = this.getzf(oMonth) + '-' + this.getzf(oDay) + ' ' + this.getzf(oHour) + ':' + this.getzf(oMin)//最后拼接时间
        return oTime
    },
    /**
     * 时间转换
     * 时间字符串转换时间戳
     * @Description：'2019-07-30T02:26:12.000+0000' 转换为 '{y}-{m}-{d} {h}:{i}:{s}'
     */
    YMDHMSParseTime:function(time, cFormat){
        if (arguments.length === 0) {
            return null
        }
        const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
        let date
        if (typeof time === 'object') {
            date = time
        } else {
            if (('' + time).length === 10) time = parseInt(time) * 1000
            date = new Date(time)
        }
        const formatObj = {
            y: date.getFullYear(),
            m: date.getMonth() + 1,
            d: date.getDate(),
            h: date.getHours(),
            i: date.getMinutes(),
            s: date.getSeconds(),
            a: date.getDay()
        }
        const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
            let value = formatObj[key]
            if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
            if (result.length > 0 && value < 10) {
                value = '0' + value
            }
            return value || 0
        })
        return time_str
    },
    /**
     * 时间转换
     * 时间字符串转换时间戳
     * @Description：'2019-07-30T02:26:12.000+0000' 转换为 '{y}-{m}-{d}'
     */
    YMDParseTime:function(time, cFormat){
        if (arguments.length === 0) {
            return null
        }
        const format = cFormat || '{y}-{m}-{d}'
        let date
        if (typeof time === 'object') {
            date = time
        } else {
            if (('' + time).length === 10) time = parseInt(time) * 1000
            date = new Date(time)
        }
        const formatObj = {
            y: date.getFullYear(),
            m: date.getMonth() + 1,
            d: date.getDate(),
        }
        const time_str = format.replace(/{(y|m|d)+}/g, (result, key) => {
            let value = formatObj[key]
            if (result.length > 0 && value < 10) {
                value = '0' + value
            }
            return value || 0
        })
        return time_str
    },
    /**
     * 补0操作
     */
    getzf: function (num) {
        if (parseInt(num) < 10) {
            num = '0' + num
        }
        return num
    },
    /**
     * 时间转换
     * 时间字符串转换时间戳
     * @Description：'计算相差天数'
     */
    calculationDayDifference: function (str) {
        let date = str,
            // 计算出相差天数
            days = Math.floor(date/(24*3600*1000)),
            // 拼接
            duration = days + "天";
            if (duration == '0天') {
                duration = '不到1天';
            }
        return duration;
    },
    /**
     * 时间转换
     * 时间字符串转换时间戳
     * @Description：'计算时间差:格式'天时分秒''
     */
    calculationTimeDifference: function (str) {
        let date = str,
            // 计算出相差天数
            days = Math.floor(date/(24*3600*1000)),
            // 计算出小时数
            leave1 = date%(24*3600*1000), //计算天数后剩余的毫秒数
            hours = Math.floor(leave1/(3600*1000)),
            // 计算出相差分钟数
            leave2 = leave1%(3600*1000), //计算小时数后剩余的毫秒数
            minutes = Math.floor(leave2/(60*1000)),
            // 计算出相差秒数
            leave3 = leave2%(60*1000),  //计算分钟数后剩余的毫秒数
            seconds = Math.round(leave3/1000),
            // 拼接
            duration = days + "天" + hours + "小时" + minutes + "分钟" + seconds + "秒";
        return duration;
    },
    /**
     * 计算时间差:格式'几个月几天'
     * 时间字符串转换时间戳
     * @param {string} date1 - 时间1.
     * @param {string} date2 - 时间2.
     */
    calculationMonthDayDifference: function (date1,date2) {
        var obj = {};
        var beginDate = new Date(date1);
        var beginYear = beginDate.getFullYear();
        var beginMonth = beginDate.getMonth() + 1;
        var beginDay = beginDate.getDate();
        var endDate = new Date(date2);
        var endYear = endDate.getFullYear();
        var endMonth = endDate.getMonth() + 1;
        var endDay = endDate.getDate();
        //计算日期整月差
        var monthNum = (endYear*12+endMonth)-(beginYear*12+beginMonth);
        //判断天数大小
        if(endDay<beginDay){
            monthNum = monthNum - 1;
        }
        var month = beginMonth+monthNum;
        if(month>12){
            beginYear = beginYear +  Math.floor(month/12);
            beginMonth = month % 12;
        }else{
            beginMonth = month;
        }
        var newDate = beginYear+'-'+beginMonth+'-'+beginDay;
        // console.log(newDate)
        var days = this.dayDifference(newDate,date2);
        // alert(days)
        obj.month = monthNum;
        obj.days = days;
        // alert(monthNum+'---'+days)
        return obj;
    },
    /**
     * 计算时间相差天数，为了引用使用
     * @param {string} sDate1 - 时间1 格式为'2006-12-18'.
     * @param {string} sDate2 - 时间2 格式为'2006-12-18'.
     */
    dayDifference: function(sDate1, sDate2) {
        var dateSpan,
            tempDate,
            iDays;
        sDate1 = Date.parse(sDate1);
        sDate2 = Date.parse(sDate2);
        dateSpan = sDate2 - sDate1;
        dateSpan = Math.abs(dateSpan);
        iDays = Math.floor(dateSpan / (24 * 3600 * 1000));
        return iDays
    },
    /**
     * 去掉字符串的前后空格
     * @param {string} str - 字符串.
     */
    trim: function(str) {
        return str.replace(/(^\s*)|(\s*$)/g, "");
    },
    /**
     * 数组去重
     * @param {Array} arr - 数组.
     */
    unique: function(arr) {
        var newArr = [arr[0]];
        for(var i=1;i<arr.length;i++){
            if(newArr.indexOf(arr[i]) === -1 && arr[i].bac == true){
                newArr.push(arr[i]);
            }
        }
        return newArr;
    },
    /**
     * 从sessionStorage获取Token
     */
    getToken: function() {
        return sessionStorage.getItem('webToken') ? sessionStorage.getItem('webToken') : '';
    },
    /**
     * setToken值到sessionStorage
     */
    setToken: function(val) {
        sessionStorage.setItem('webToken',val);
    },
    /**
     * 从sessionStorage删除Token
     */
    delToken: function() {
        sessionStorage.removeItem('webToken');
    },
    /**
     * 从sessionStorage获取存储的值
     */
    getStore: function(key) {
        return sessionStorage.getItem(key) ? sessionStorage.getItem(key) : '';
    },
    /**
     * set值到sessionStorage
     */
    setStore: function(key,val) {
        sessionStorage.setItem(key,val);
    },
    /**
     * 从sessionStorage删除存储的值
     */
    delStore: function(key) {
        sessionStorage.removeItem(key);
    },
    /**
     * 使用indexof方法实现模糊查询
     * @param  {Array}  list      进行查询的数组
     * @param  {String} keyWord   查询的关键词
     * @param  {String} keyValue  所要匹配的字段
     * @return {Array}            查询的结果
     */
    fuzzyQuery(list, keyWord, keyValue){
        var arr = [];
        for (var i = 0; i < list.length; i++) {
            if (list[i][keyValue].indexOf(keyWord) >= 0) {
                arr.push(list[i]);
            }
        }
        return arr;
    },

    //表单校验
    formCheck(obj, name) {
        let result = false;
        obj.$refs[name].validate((valid) => {
          if (valid) {
            result = true;
          } else {
            Message.warning('必填项输入为空或错误！');
            result = false;
          }
        });
        return result;
    }
}
