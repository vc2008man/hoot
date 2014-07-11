/**
 * Created by jiawei.sun on 2014-03-20 11:47.
 */
define({
    /**
     * 获取对象的准确类型
     * @param obj 对象
     * @returns {string} 对象类型
     */
    'getType' : function(obj){
        // 定义所有的类型字典
        // key值为原生类型
        // value值为原生类型的自定义名称
        var objTypes = {
                '[object Array]' : 'array',
                '[object Boolean]' : 'boolean',
                '[object Date]' : 'date',
                '[object Error]' : 'error',
                '[object Function]' : 'function',
                '[object Number]' : 'number',
                '[object RegExp]' : 'regexp',
                '[object String]' : 'string'
            },
        // 检测对象的nodeType 按照nodeType的序列作为数组的下标
            nodeTypes = [,'HTMLElement','Attribute','Text',,,,,'Comment','Document',,'DocumentFragment'];

        return (obj === null ?
            'null' : (obj._type_ || objTypes[objTypes.toString.call(obj)] || nodeTypes[obj.nodeType] || (obj === obj.window ? 'Window' : '') || 'object'));
    },
    'isEmptyObject' : function(obj){
        var key;
        for(key in obj){
            return false;
        }
        return true;
    },
    'isPlainObject' : function(obj){
        var key;
        if(!obj || this.getType(obj) !== 'object'){
            return false;
        }
        try{
            if(obj.constructor && !obj.hasOwnProperty('constructor') && !obj.constructor.prototype.hasOwnProperty('isPrototypeOf')){
                return false;
            }
        }catch(e){
            return false;
        }
        for(key in obj){};
        return key === undefined || obj.hasOwnProperty(key);
    },
    'Browser' : {
        'ie' : function(){
            // 原理:
            // 利用IE浏览器中<!--[if gt IE 6]><i></i><![endif]-->的hack 判断当前IE浏览器的版本
            // 因为是之后采用++v 所以将v置为3
            var v = 3,
            // 创建div
                div = document.createElement('DIV'),
            // 创建i
                nodes = div.getElementsByTagName('I');
            // 循环v值 判断当前浏览器是否大于v所指定的版本 实际就是循环IE浏览器版本 创建i标签
            while(div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',nodes[0]);
            // 返回浏览器版本
            return v > 4 ? v : 0;
        },
        /**
         * 获取浏览器类型及版本
         * @returns {{ie: (number|Array),
         *              firefox: (Array|{index: number, input: string}),
         *              chrome: (Array|{index: number, input: string}),
         *              opera: (Array|{index: number, input: string}),
         *              safari: (Array|{index: number, input: string})}}
         */
        'nav' : function(){
            // 根据浏览器的userAgent获取浏览器的类型和版本
            var agent = navigator.userAgent.toLowerCase(),
                isIE = this.ie();
            return {
                'ie' : isIE && ['ie',isIE],
                'firefox' : agent.match(/firefox\/([\d.]+)/),
                'chrome' : agent.match(/chrome\/([\d.]+)/),
                'opera' : agent.match(/opera.([\d.]+)/),
                'safari' : window.openDatabase ? agent.match(/version\/([\d.]+)/) : undefined
            }
        }
    },
    'JSON' : {
        'stringify' : function(obj){
            if(window.JSON && window.JSON.stringify){
                return window.JSON.stringify(obj);
            }else{
                var result = [],
                    type = typeof obj,
                    i = 0,
                    count,key,len;
                if(type === 'string'){
                    return '"' + obj + '"';
                }
                if(type === 'undefined' || type === 'boolean' || type === 'number' || obj === null){
                    return obj;
                }
                if(Object.prototype.toString.call(obj) == '[object Array]'){
                    count = obj.length;
                    result.push('[');
                    for(;i<count;i++){
                        result.push(JSON.stringify(obj[i]) + ',');
                    }
                    result.push(']');
                }else{
                    result.push('{');
                    for(key in obj){
                        obj.hasOwnProperty(key) && result.push('"' + key + '":' + Mar.stringify(obj[key]) + ',');
                    }
                    len = result.length - 1;
                    result[len] = result[len].replace(/,$/,'');
                    result.push('}');
                }
                return result.join('');
            }
        },
        /**
         * 字符串转JSON
         * Thanks To:
         *   https://github.com/douglascrockford/JSON-js/blob/master/json2.js
         * @param str
         * @param reviver
         * @returns {*}
         */
        'parse' : function(str,reviver){
            var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
                j;
            function walk(holder, key) {
                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }
            str = String(str);
            cx.lastIndex = 0;
            if (cx.test(str)) {
                str = str.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }
            if (/^[\],:{}\s]*$/
                .test(str.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                    .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                    .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
                j = eval('(' + str + ')');
                return (typeof reviver === 'function') ? walk({'': j},'') : j;
            }
        }
    },
    'Cookie' : {
        /**
         * 返回指定键值的COOKIE值
         * @param key 键值
         * @returns {string} COOKIE值
         *
         * TODO:加入回调函数
         */
        'get' : function(key){
            // 获取能够获取到的所有cookie
            var cook = document.cookie,
            // 找到当前名称的cookie所在起始位置
                start = cook.indexOf(key + '='),
            // 结束位置
                end;
            // 如果包含此名称的cookie
            if(start !== -1){
                // 则此cookie的值的起始位置即从名称长度加上等号长度
                start += key.length + 1;
                // 结束位置为从值的起始位置到最近的一个分号的位置
                end = cook.indexOf(';',start);
                // 去除值 并解码
                return decodeURIComponent(cook.substring(start,(end === -1 ? cook.length : end)));
            }
        },
        /**
         * 设置COOKIE
         * @param key 键值
         * @param value COOKIE值
         * @param options COOKIE条件 {domain : 所属域, path : 保存路径, expires : 有效期(天), secure : 传输过程是否加密}
         *
         */
        'set' : function(key,value,options){
            // domain:cookie的存储域
            // path:cookie存储路径
            // expires:cookie有效期
            // secure:是否传输过程中加密
            var domain,path,expires,secure,
            // date:保存有效期
            // str:cookie串
                date,str;
            // 如果没有传入options配置信息
            // 则置为空
            if(options === undefined){
                options = {};
            }
            // 初始化各个变量
            domain = options['domain'];
            path = options['path'];
            expires = options['expires'];
            secure = options['secure'];
            // 将名称和值拼接 值转码
            str = key + '=' + encodeURIComponent(value);

            // 如果有效期的类型为数字
            if(typeof expires === 'number'){
                // 则计算当前cookie的有效期 并拼接至str
                date = new Date();
                date.setDate(date.getDate() + expires);
                str += '; expires=' + date.toUTCString();
            }
            // 如果options中含有以下三个任意参数 则都拼接至str中
            if(!domain === false){
                str += '; domain=' + domain;
            }
            if(!path === false){
                str += '; path=' + path;
            }
            if(!secure === false){
                str += '; secure';
            }
            // 写入cookie
            document.cookie = str;
        },
        /**
         * 删除指定键值的COOKIE
         * @param key 键值
         * @param options COOKIE条件 {domain : 所属域, path : 保存路径, expires : 有效期, secure : 传输过程是否加密}
         */
        'del' : function(key,options){
            // 如果没有传入options配置信息
            // 则置为空
            if(options === undefined){
                options = {};
            }
            // 将cookie的有效期置为0 也就是当前时间
            // 因为当代码执行完毕之后 即cookie超时 则过期
            // 也可写作其他时间
            options['expires'] = new Date(0);
            // 调用set方法
            this.set(key,'',options);
        }
    },
//    'guid' : function(){
//        function generate(g){
//            this.g = g;
//            this.arr = [];
//            if(typeof g === 'string'){
//                this.string();
//            }else{
//                this.other();
//            }
//        }
//        generate.prototype = {
//            'string' : function(){
//                this.g = this.g.replace(/\{|\(|\)|\}|-/g,'').toLowerCase();
//                if(this.g.length !== 32 || this.g.search(/[^0-9,a-f]/i) !== -1){
//                    this.other();
//                }else{
//                    this.arr = g.split('');
//                }
//            },
//            'stringFormat' : function(format){
//                switch(format){
//                    case 'N':
//                        return this.arr.join('');
//                        break;
//                    case 'D':
//                        this.arr.splice(8,0,'-');
//                        this.arr.splice(13,0,'-');
//                        this.arr.splice(18,0,'-');
//                        this.arr.splice(23,0,'-');
//                        return this.arr.join('');
//                        break;
//                    case 'B':
//                        return '{' + this.stringFormat('D') + '}';
//                        break;
//                    case 'P':
//                        return '(' + this.stringFormat('D') + ')';
//                        break;
//                    default:
//                        return new generate();
//                        break;
//                }
//            },
//            'other' : function(){
//                while(this.arr.length < 32){
//                    this.arr.push('0');
//                }
//            },
//            'value' : function(format){
//                if('NDBP'.indexOf(format) !== -1){
//                    return this.stringFormat(format);
//                }
//                return this.stringFormat('D');
//            }
//        }
//
//        var g = '',
//            i = 32;
//        while(i--){
//            g += Math.floor(Math.random() * 16.0).toString(16);
//        }
//        return (new generate(g)).value();
//    },
    'guid' : function(){
        function s4(){
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        }
        return (s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4());
    }
});