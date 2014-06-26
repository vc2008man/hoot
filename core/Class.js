/**
 * Created by jiawei.sun on 14-6-20.
 *
 *
 * Class.create('Model',function(){
 * this.fields = {
 *  'username' : {
 *  }
 * }
 *
 * }).pro().static().impl().init()
 *
 * Model.create()..
 */
define(function(require,exports,module){
    var ClassDefault = require('ClassDefault');

    function Class(){}

    // 继承Class属性
    Class.classify = function(obj){
        if(typeof obj === 'function' && !(this instanceof Class)){
            Class.mix.call(this,obj);
        }
        return obj;
    }

    // 混合两个对象
    Class.mix = function(obj){
        var key,lower;
        for(key in this){
            lower = key.toLowerCase();
            if(this.hasOwnProperty(key) &&
                lower !== 'prototype' &&
                lower !== 'constructor' &&
                lower !== 'classname' &&
                lower !== 'superclass' &&
                lower !== 'isclass'){
                obj[key] = this[key];
            }
        }
        return this;
    }

    // 类名 构造函数
    Class.create = function(name,cons){
        var klass = ClassDefault(this,name,cons);
        Class.classify(klass);
        if(this !== Class){
            Class.mix.call(this,klass);
            Class.mix.call(this.prototype,klass.prototype);
        }
        return klass;
    }

    // 设置属性
//    Class.fields = function(fields){
//
//    }

    // 设置原型属性
    Class.proto = function(options){
        Class.mix.call(options,this.prototype);
        return this;
    }

    // 设置静态属性
    Class.static = function(options){
        Class.mix.call(options,this);
        return this;
    }

    // 实现一个或者多个类 用于继承属性
    Class.impl = function(classes){
        var i = 0,
            len = classes.length;
        for(;i<len;i++){
            Class.mix.call(classes[i],this);
            Class.mix.call(classes[i].prototype,this.prototype);
        }
        return this;
    }

    // 类初始化希望执行的函数
    Class.init = function(ready){
        var last = this.initialize;
        this.initialize = function(){
            last.apply(this,arguments);
            ready.apply(this,arguments);
        }
        return this;
    }

    // 实例化一个类
    // TODO:传递参数
    Class.instance = function(){
        return new this();
    }

    // 类名
    Class.className = 'Class';
    // 用于判断当前对象是否为Class创建或者继承于Class
    Class.isClass = true;

    module.exports = Class;
});
