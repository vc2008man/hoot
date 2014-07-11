/**
 * Created by jiawei.sun on 14-7-3.
 */
define(function(require,exports,module){
    var Class = require('Class'),
        Validate = require('Validate'),
        Utils = require('Utils');
    module.exports = Class.create('Model',function(){
            this.mapping = null;
        })
        .proto({
            // 封装当前类的属性
            // @data 数据 一般为ajax请求的返回值
            'bag' : function(data){
                // 通过遍历和mapping属性 找出当前对应的属性 并赋值
                this.loop(this.mapping,function(key,name){
                    this[name](data[key]);
                });
                // 链式操作
                return this;
            },
            // 序列化当前类
            'serialize' : function(){
                // 保存结果
                var json = {};

                // 解析字段值
                // @obj 字段值
                function parse(obj){
                    var i = 0,
                        props,key;
                    // obj不为空才对其进行解析 否则直接返回obj
                    if(undefined !== obj && null !== obj){
                        // Model与Model之间可能相互引用 相互维护
                        // 所以需要对当前字段值 判断是否为一个Model(此处即为Class创建的类)
                        if(obj._isClass){
                            // 直接调用当前对象的toJSON方法
                            return obj.serialize();
                        }
                        // 如果字段值为数组
                        if('array' === Utils.getType(obj)){
                            props = [];
                            // 则遍历数组
                            // 对数组的每个值进行解析
                            // 因为数组的每个元素可能还是一个对象
                            for(;i<obj.length;i++){
                                props.push(parse(obj[i]));
                            }
                            return props;
                        }
                        // 如果obj的类型是字面量对象
                        // 则直接遍历此对象
                        // 同样因为对象的每个键值可能也是一个对象
                        // 所以也对结果进行解析
                        if(Utils.isPlainObject(obj)){
                            props = {};
                            for(key in obj){
                                props[key] = parse(obj[key]);
                            }
                            return props;
                        }
                    }
                    return obj;
                }

                // 循环遍历当前对象(实例)的字段
                this.loop(function(index,name){
                    // 保存字段的值
                    // 由于每个字段的值可能是一个对象
                    // 所以需要对值进行解析
                    json[name] = parse(this[name]());
                });
                return json;
            },
            // 查找当前对象是否包含未验证通过的字段
            'isInvalid' : function(){
                var result = false;
                this.loop(function(index,name){
                    if(this[name].invalid === true){
                        result = true;
                        return false;
                    }
                });
                return result;
            },
            // ajax请求
            /** @remote 请求配置
             *  {
             *      'url' : 请求地址
             *      'type' : 请求类型
             *      'cross' : 是否跨域
             *  }
             */
            'req' : function(remote){
                // 缓存当前对象
                var that = this,
                    ajaxOption,
                    // 请求成功执行的函数
                    success = function(){},
                    // 请求失败执行的函数
                    failure = function(){},
                    // 请求错误执行的函数
                    error = function(){},
                    // 请求成功后 处理返回的数据
                    deal = function(){},
                    // 不管成功与否都执行的函数
                    whatever = function(){},
                    deferred = {
                        // 设置各个执行函数
                        'done' : function(){
                            success = arguments[0];
                            return deferred;
                        },
                        'fail' : function(){
                            failure = arguments[0];
                            return deferred;
                        },
                        'err' : function(){
                            error = arguments[0];
                            return deferred;
                        },
                        'resolve' : function(){
                            deal = arguments[0];
                            return deferred;
                        },
                        'always' : function(){
                            whatever = arguments[0];
                            return deferred;
                        }
                    };
                // 格式化请求参数
                if('string' === typeof remote){
                    remote = {
                        'url' : remote
                    }
                }
                remote.type = remote.type || 'get';
                //remote.cross = remote.cross || '';

                ajaxOption = {
                    'url' : remote.url,
                    'type' : remote.type,
                    'success' : function(resp){
                        // (订制) 请求成功
                        if(resp && resp.code === 200){
                            // 如果设置了对返回结果的处理函数 则执行此函数
                            if('function' === typeof deal){
                                // 并将此函数的执行结果传递给成功回调函数
                                success.call(that,deal.call(that,resp.data));
                            }else{
                                // 否则直接执行成功的回调函数
                                success.call(that,resp.data);
                            }
                        }else{
                            // 请求失败执行的函数
                            failure.call(that,resp);
                        }
                        // 固定执行的函数
                        whatever.call(that,resp);
                    },
                    'error' : function(){
                        // 请求失败 执行此函数
                        error.apply(that,arguments);
                        // 固定执行的函数
                        whatever.apply(that,arguments);
                    }
                }
                if(remote.cross === 'jsonp'){
                    ajaxOption['dataType'] = 'jsonp';
                }

                $.ajax(ajaxOption);
                // 返回设置函数的对象
                return deferred;
            }
        })
        .static({
            'mapping' : function(mapping){
                this.init(function(){
                    this.mapping = mapping;
                });
                return this;
            }
        });
});