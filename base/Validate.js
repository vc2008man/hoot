/**
 * Created by jiawei.sun on 2014-03-06 13:15.
 * TODO:正数 正整数 负数 负整数
 *
 * code : 1000 correct
 *        1001 type error
 *        1002 role error
 */
define(function(require,exports,module){
    var Utils = require('Utils'),
        regex = {
            // 验证是否包含|| && 语法
            'operator' : /(\&\&)|(\|\|)/g,
            // 分离|| && 语句
            'splitOperator' : /(\w+)|(\&\&)|(\|\|)/g,
            // 验证邮件格式
            'email' : /^[\w-]+(\.[\w-]+)*@([\w-]+)(\.[\w-]+)+$/,
            // 验证是否为 非 数字
            // 直接验证是否 是 数字 容易造成如'11a'也验证通过
            // 所以采用取反的做法
            'digit' : /[^0-9]/g,
            // 验证是否为 非 字母
            'letter' : /[^a-z]/gi,
            // 验证是否为浮点型
            'float' : /^([0-9]+\.[0-9]*)$/,
            // 验证是否包含字母和数字 不验证是以英文或者数字开头
            'char' : /^([a-z]+|[0-9]+)([a-z0-9]+)$/i,
            'boolean' : /^true$|^false$/gi
        },
        message = {
            'type' : '\u7c7b\u578b\u9519\u8bef',    // 类型错误
            'len' : '\u957f\u5ea6\u9519\u8bef',     // 长度错误
            'required' : '\u4e0d\u80fd\u4e3a\u7a7a', // 不能为空
            'equal' : '\u4e24\u8005\u4e0d\u76f8\u540c' // 两者不相同
        };
    module.exports = {
        'check' : function(value,type,rule){
            var result;
            type = type.toLowerCase();
            if(type === 'custom'){
                return this.rule(value);
            }
            // || type === 'float'
            if((type === 'number' || type === 'digit') && this.string(value) || !this[type](value)){
                return {
                    'code' : 1001,
                    'message' : message.type
                };
            }
            if(rule){
                result = this.rule(value,rule);
                if(result !== true){
                    return {
                        'code' : 1002,
                        'message' : result
                    };
                }
            }
            return {
                'code' : 1000
            };
        },
        'string' : function(value){
            return (typeof value === 'string');
        },
        'number' : function(value){
            return !isNaN(Number(value));
        },
        'digit' : function(value){
            return !(regex.digit.test(value));
        },
        'float' : function(value){
            return regex.float.test(value);
        },
        'boolean' : function(value){
            return regex.boolean.test(value);
        },
        'letter' : function(value){
            return !regex.letter.test(value);
        },
        'char' : function(value){
            return regex.char.test(value);
        },
        'email' : function(value){
            return regex.email.test(value);
        },
        'rule' : function(value,rule){
            var result = {
                    'count' : 0
                },
                key;
            for(key in rule){
                if(!this[key](value,rule[key])){
                    result[key] = message[key];
                    result.count++;
                }
            }
            return result.count !== 0 ? result : true;
        },
        // [min,max]
        'len' : function(value,rule){
            var min = rule[0],
                max = rule[1],
                len = String(value).length;
            return (min === undefined ? true : (len >= min)) && (max === undefined ? true : (len <= max));
        },
        'required' : function(value){
            return !(String(value).length <= 0);
        },
        'equal' : function(value,value2){
            return value === value2;
        }
    };
});