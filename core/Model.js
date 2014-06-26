/**
 * Created by jiawei.sun on 14-6-20.
 */
define(function(require,exports,module){
    var Class = require('Class'),
        Event = require('Event'),
        Validate = require('Validate'),
        Utils = require('Utils'),
        Model = Class.create('Model').impl([Event])
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
    module.exports = Model;
});
