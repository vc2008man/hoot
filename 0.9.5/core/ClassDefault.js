/**
 * Created by jiawei.sun on 14-7-2.
 */
define(function(require,exports,module){
    var Validate = require('Validate');

    module.exports = function(superClass,name,constructor){
        function klass(){
            // 保存类中的所有属性名 用作遍历属性用
            this.__fields__ = [];
            // 调用父类构造函数 继承父类的属性
            superClass && superClass.apply(this,arguments);
            // 执行构造函数 一般用来设置类的属性
            constructor && constructor.apply(this,arguments);
            // 执行初始化函数
            klass.initialize && klass.initialize.apply(this,arguments);
        }
        klass.prototype = {
            // 设置类的构造者
            'constructor' : klass,
            // 循环遍历自身属性或者执行的对象
            // @params 希望遍历的对象 Array|Object
            // @handler 处理函数
            'loop' : function(params,handler){
                var key;
                // 如果参数为1个 则遍历当前类的属性
                if(arguments.length < 2){
                    handler = params;
                    params = this.__fields__;
                }
                // 遍历对象
                for(key in params){
                    // 如果处理函数返回false 则停止遍历
                    if(params.hasOwnProperty(key)
                        && handler.call(this,key,params[key]) === false){
                        break;
                    }
                }
                return this;
            }
        }

        // 设置类的父类
        klass.superClass = superClass;
        // 设置类的类名
        klass.className = name;

        // 类的初始化函数
        klass.initialize = function(){
            var that = this;
            // 遍历设置的属性
            // 将属性变成属性函数
            this.loop(this.fields,function(key,value){
                // 如果当前属性为字符串 则将其转换成对象
                value = ('string' === typeof value) ? {
                    'name' : value
                } : value;
                // 如果当前类中没有此属性 则将其放入属性组中
                // 只保存属性名
                if(!this[value.name]){
                    this.__fields__.push(value.name);
                }
                // 使用匿名函数来保存当前属性的状态
                // 因为当前是在loop(循环)中
                (function(prop){
                    // 定义一个对象 作为属性的代理
                    // @val 需要设置的属性值
                    var attr = function(val){
                        // 如果当前没值
                        if(undefined === val){
                            // 则返回当前属性的值
                            return attr.__data__.getter();
                        }
                        // 反之 执行setter(设置)操作
                        attr.__data__.setter(val,that);
                        // 链式操作
                        return this;
                    }
                    // 当前属性的类型
                    attr.type = prop.type;
                    // 属性是否不合法
                    // :false 合法
                    // :true 不合法
                    attr.invalid = prop.invalid;
                    // 用于保存当前属性的值
                    attr.__data__ = {
                        // 属性名
                        'name' : prop.name,
                        // 属性的默认值 在当前value没值的时候 返回此
                        'default' : prop['default'],
                        // 属性值
                        'value' : prop.value,
                        // 取值函数
                        'getter' : prop.getter || function(){
                            return this.value === undefined ? this.default : this.value;
                        },
                        // 设值函数
                        // @val 值
                        // @options 设值的时的参数
                        /**
                         * options = {
                         *   是否验证此属性 验证 不验证
                         *   'valid' : true | false
                         *   是否触发值改变事件 触发 不触发
                         *   'change' : true | false
                         * }
                         *
                         * */
                        'setter' : function(val,options){
                            // 取出当前值
                            var o = this.getter(),
                                n,result;
                            // 如果设置了setter函数 则调用
                            if(prop.setter){
                                prop.setter.call(this,val,that);
                            }else{
                                // 否则直接设值
                                this.value = val;
                            }
                            // 取出新值
                            n = this.getter();
                            // 如果当前设置参数 设置了需要验证 且 当前属性设置过类型 则执行验证
                            if(false !== options.valid && undefined !== options.type){
                                // 执行验证
                                result = Validate.check(n,this.type,this.rule);
                                // 如果验证结果不通过
                                if(result && 1000 !== result.code){
                                    // 则重新将值设置成原值
                                    this.value = o;
                                    // 设置成不合法
                                    this.invalid = true;
                                    // 触发事件
                                    that.trigger('invalid.field',this.name,n,o,result);
                                }else{
                                    // 反之 设置为合法
                                    this.invalid = false;
                                }
                            }
                            // 如果设置参数 设置了属性改变的条件
                            if((options.change !== false) && (n !== o)){
                                // 则如果新值和旧值不相等 则触发事件
                                that.trigger('change.field',this.name,n,o);
                            }
                        },
                        // 属性类型
                        'type' : prop.type,
                        // 属性验证规则
                        'rule' : prop.rule,
                        // 属性是否不合法
                        'invalid' : prop.invalid
                    }
                    // 赋值当前类的属性
                    that[prop.name] = attr;
                })(value);
            });
            // 删除fields属性 不希望使用者通过fields直接点
            this.fields = null;
            delete this.fields;
        }

        // 初始化设置
        klass.init = function(method){
            // 缓存前一个初始化函数
            var last = this.initialize;
            this.initialize = function(){
                // 执行前一个初始化函数
                last.apply(this,arguments);
                // 执行当前的初始化函数
                method.apply(this,arguments);
            }
            // 链式操作
            return this;
        }

        klass.instance = function(params){
            // 返回当前类的实例
            // @params 构造函数的参数 对象类型
            return new this(params);
        }

        return klass;
    }
});