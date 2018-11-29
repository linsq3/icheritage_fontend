// 工具类
var myUtil = {
    checkAuth(authKey) {
        let isTenantAdmin = localStorage.getItem('isTenantAdmin');
        let auth = localStorage.getItem('ms_userRight');
        let hasAuth = false;
        if (parseInt(isTenantAdmin)) {
            return hasAuth;
        } else {
            if (auth && auth.indexOf(authKey) > -1) {
                return hasAuth;
            } else {
                return !hasAuth;
            }
        }

    },
    // 时间补0
    timeAddZero(time) {
        return time < 10 ? `0${time}` : `${time}`;
    },
    dateFormat(date, fmt) {
        if (date && fmt) {
            const year = date.getFullYear(),
                month = date.getMonth() < 9 ? `0${parseInt(date.getMonth() + 1)}` : date.getMonth() + 1,
                day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate(),
                hour = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours(),
                minute = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes(),
                second = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds(),
                dayArr = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];

            switch (fmt) {
                case 'yy-mm-dd h:m:s':
                    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;

                case 'yy-mm-dd h:m':
                    return `${year}-${month}-${day} ${hour}:${minute}`;

                case 'yy-mm-dd':
                    return `${year}-${month}-${day}`;

                case 'mm-dd h:m':
                    return `${month}-${day} ${hour}:${minute}`;

                case 'mm-dd':
                    return `${month}-${day}`;

                case 'h:m':
                    return `${hour}:${minute}`;
                case 'h:m:s':
                    return `${hour}:${minute}:${second}`;

                case 'HH:mm MM/dd/yyyy':
                    return `${hour}:${minute} ${month}/${day}/${year}`;

                case 'mm-dd d':
                    return `${month}月${day} ${dayArr[date.getDay()]}`;
            }
        }
    },
    getDate(date, fmt) {
        if (date && fmt) {
            var date = new Date(date * 1000),
                year = date.getFullYear(),
                month = date.getMonth() < 9 ? `0${parseInt(date.getMonth() + 1)}` : date.getMonth() + 1,
                day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
            switch (fmt) {
                case 'yy-mm-dd':
                    return `${year}-${month}-${day}`;
            }
        }
    },
    getTime(date, fmt) {
        if (date && fmt) {
            var date = new Date(date * 1000),
                year = date.getFullYear(),
                month = date.getMonth() < 9 ? `0${parseInt(date.getMonth() + 1)}` : date.getMonth() + 1,
                day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate(),
                hour = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours(),
                minute = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes(),
                second = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds();
            switch (fmt) {
                case 'yy-mm-dd h:m:s':
                    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
            }
        }
    },
    getTimestamp(date) {
        if (date) {
            return date.getTime();
        }
    },
    getSeconds(date) {
        if (date) {
            var hour = date.getHours(),
                minites = date.getMinutes(),
                seconds = date.getSeconds();
            return hour * 60 * 60 + minites * 60 + seconds;
        }
    },
    //copyNode为要复制地址的节点
    copyText(copyNode) {
        /* 创建range对象   */
        const range = document.createRange();
        //range.selectNode(document.querySelector('.copy-content-'+scope.$index));    // 设定range包含的节点对象
        range.selectNode(copyNode); // 设定range包含的节点对象

        /* 窗口的selection对象，表示用户选择的文本 */
        const selection = window.getSelection();
        if (selection.rangeCount > 0) selection.removeAllRanges(); // 将已经包含的已选择的对象清除掉
        selection.addRange(range); // 将要复制的区域的range对象添加到selection对象中
        document.execCommand('Copy'); // 执行copy命令，copy用户选择的文本
    },

    //设置cookie
    setCookie: function(c_name, value, expiremMinutes) {
        var exdate = new Date();
        exdate.setTime(exdate.getTime() + expiremMinutes * 60 * 60 * 1000);
        document.cookie = c_name + "=" + escape(value) + ((expiremMinutes == null) ? "" : ";expires=" + exdate.toGMTString());
    },
    //读取cookie
    getCookie: function(c_name) {
        if (document.cookie.length > 0) {
            var c_start = document.cookie.indexOf(c_name + "=");
            if (c_start != -1) {
                c_start = c_start + c_name.length + 1;
                var c_end = document.cookie.indexOf(";", c_start);
                if (c_end == -1)
                    c_end = document.cookie.length
                return unescape(document.cookie.substring(c_start, c_end))
            }
        }
        return ""
    },
    //删除cookie
    delCookie: function(c_name) {
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var cval = this.getCookie(c_name);
        if (cval != null) {
            document.cookie = c_name + "=" + cval + ";expires=" + exp.toGMTString();
        }
    }


};
export default myUtil;