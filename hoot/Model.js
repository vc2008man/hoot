/**
 * Created by jiawei.sun on 14-6-20.
 */
define(function(require,exports,module){
    var Class = require('Class'),
        Event = require('Event'),
        Validate = require('Validate'),
        Utils = require('Utils');
    module.exports = Class.create('Model').impl([Event])
        .proto({
            'toJSON' : function(){
                var result = {},
                    i = 0;
                function parse(obj){
                    var props,key;
                    if(obj !== undefined && obj !== null){
                        if(obj._isClass){
                            return obj.toJSON();
                        }
                        if(Object.prototype.toString.call(obj) === '[object Array]'){
                            props = [];
                            for(;i<obj.length;i++){
                                props.push(parse(obj[i]));
                            }
                            return props;
                        }
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

                this.loop(function(name){
                    result[name] = parse(this.get(name));
                });
                return result;
            },
            'request' : function(urls){
                var that = this,
                    defer,success,failure,
                    i = 0,len,
                    store = [],
                    callee;
                if(Object.prototype.toString.call(urls) !== '[object Array]'){
                    len = 1;
                }else{
                    len = urls.length;
                }
                defer = {
                    'done' : function(){
                        success = arguments[0];
                        return defer;
                    },
                    'fail' : function(){
                        failure = arguments[0];
                        return defer;
                    }
                };
                (function(){
                    callee = arguments.callee;
                    if(typeof urls[i] === 'string'){
                        urls[i] = {
                            'path' : urls[i],
                            'type' : 'get'
                        }
                    }
                    $[urls[i].type](urls[i].path,function(resp){
                        if(resp && resp.code === 200){
                            store.push(resp.data);
                            if(++i >= len){
                                success.call(that,store);
                            }else{
                                callee();
                            }
                        }else{
                            failure.call(that,i,store);
                        }
                    });
                })();

                return defer;
            },
            'invalid' : function(){
                var result = false;
                this.loop(function(name,field){
                    if(field.invalid){
                        result = true;
                        return false;
                    }
                });
                return result;
            },
            'validate' : function(field,value){
                var result;
                if(typeof field === 'string'){
                    field = this.field(field);
                }
                value = value || field.value;
                if(field && field.type){
                    result = Validate.check(value,field.type,field.rule);
                    if(result.code !== 1000){
                        this.trigger('invalid.field',field.name,value,result);
                    }
                }
                return result;
            }
        });
});