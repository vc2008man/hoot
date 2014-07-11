/**
 * Created by jiawei.sun on 14-7-2.
 */
define(function(require,exports,module){
    var Event = require('Event'),
        ClassDefault = require('ClassDefault');

    function Class(){}
    // 继承Class属性
    Class.classify = function(obj){
        if(('function' === typeof obj) && !(this instanceof Class)){
            Class.mix.call(this,obj);
        }
        return obj;
    }
    Class.mix = function(obj){
        var except = {
                'constructor' : 1,
                'classname' : 1,
                'superclass' : 1,
                'prototype' : 1,
                'listeners' : 1
            },
            key;
        for(key in this){
            if(this.hasOwnProperty(key) && 1 !== except[key.toLowerCase()]){
                obj[key] = this[key];
            }
        }
        return this;
    }
    Class.create = function(name,fields){
        var klass = ClassDefault(this,name,fields);
        Class.classify(klass);
        if(this !== Class){
            Class.mix.call(this,klass);
            Class.mix.call(this.prototype,klass.prototype);
        }
        Class.impl.call(klass,[Event]);
        return klass;
    }

    Class.proto = function(options){
        Class.mix.call(options,this.prototype);
        return this;
    }
    Class.static = function(options){
        Class.mix.call(options,this);
        return this;
    }
    Class.impl = function(classes){
        var klass;
        while(klass = classes.shift()){
            Class.mix.call(klass,this);
            Class.mix.call(klass.prototype,this.prototype);
        }
        return this;
    }

    Class.className = 'Class';

    module.exports = Class;
});
