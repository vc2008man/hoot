/**
 * Created by jiawei.sun on 14-6-23.
 */
define(function(require,exports,module){
    var Utils = require('Utils'),
        Validate = require('Validate');

    module.exports = function(superClass,name,cons){
        var guid = Utils.guid(),
            klass = null;
        klass = function(){
            var attr;

            this.fields = {};

            superClass && superClass.apply(this,arguments);

            if(cons && (Object.prototype.toString.call(cons) !== '[object Array]')){
                while(attr = cons.shift()){
                    if(typeof attr === 'string'){
                        this.fields[attr] = {};
                    }else{
                        this.fields[attr.name] = attr;
                    }
                }
            }
            (cons && typeof cons === 'function') && cons.apply(this,arguments);

            this.fields['guid'] = {
                'default' : guid,
                'setter' : function(){return;}
            }

            for(name in this.fields){
                attr = this.fields[name];
                this.fields[name] = {
                    'default' : attr.default,
                    'value' : attr.value,
                    'type' : attr.type,
                    'getter' : attr.getter || function(){
                        if(this.value === undefined){
                            return this.default;
                        }
                        return this.value;
                    },
                    'setter' : attr.setter || function(self,value){
                        this.value = value;
                        return this;
                    },
                    'type' : undefined,
                    'rule' : undefined,
                    'invalid' : undefined
                }
            }

            klass.initialize.apply(this,arguments);

            //this.klass = klass;
        }

        klass.prototype = {
            'constructor' : klass,
            '_isClass' : true,
            'loop' : function(fields,handler){
                var key;
                if(arguments.length < 2){
                    handler = fields;
                    fields = this.fields;
                }

                for(key in fields){
                    if(fields.hasOwnProperty(key) &&
                        handler.call(this,key,fields[key]) === false){
                        break;
                    }
                }
                return this;
            },
            'get' : function(name){
                return this.fields[name].getter();
            },
            /*
             * options = {
             *   是否验证此属性 验证 | 不验证
             *   'valid' : true | false
             *   是否触发值改变事件 触发 | 不触发
             *   'change' : true | false
             * }
             *
             * */
            'set' : function(name,value,options){
                var field = this.fields[name],
                    n, o,
                    result;
                options = options || {};
                if(!field){
                    return this;
                }
                o = field.getter();
                n = field.setter(this,value).getter();
                if(options.valid !== false && field.type !== undefined){
                    result = Validate.check(n, field.type, field.rule);
                    if(result.code !== 1000){
                        field.value = o;
                        field.invalid = true;
                        this.trigger('invalid.field', name, value, result);
                    }else{
                        field.invalid = false;
                    }
                }
                if((options.change !== false) && (n !== o)){
                    this.trigger('change.field', name, value, o);
                }
                return this;
            }
        }
        klass.initialize = function(){};
        klass.superClass = superClass;
        klass.className = name;

        return klass;
    }
});