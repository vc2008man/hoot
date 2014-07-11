/**
 * Created by jiawei.sun on 14-7-3.
 */
define(function(require,exports,module){
    var Class = require('Class'),
        Application = require('Application').singleton(),
        Module = Class.create('Module',function(){
            this.app = Application;
            this.view = null;
            this.model = null;
            this.store = null;
//            this.fields = [
//                // 保存当前module的model对象(实例)
//                'model',
//                // 保存当前module的view对象(实例)
//                'view',
//                {
//                    // 用于保存数据
//                    'name' : 'store',
//                    'default' : []
//                }
//            ];
        })
            .proto({
                // 绑定自定义事件
                // @target 需要绑定的对象
                // @listeners 需要绑定的事件
                // @callback 事件的回调函数
                // @context 事件中执行的上下文
                'listenTo' : function(target,listeners,callback,context){
                    if(typeof target === 'function'){
                        target.prototype.on(listeners, callback, context);
                    }else{
                        target.on(listeners, callback, context);
                    }
                    return this;
                },
                // 序列化数据
                'serialize' : function(){
                    var json = [];
                    if(this.store && this.store.length > 0){
                        this.each(this.store,function(index,model){
                            json.push(model.serialize());
                        });
                    }
                    return json;
                }
            });
    // 设定当前module中使用到的view对象
    // @view
    Module.view = function(view){
        this.init(function(){
            var klass = view['class'],
                name = klass.className;
            // 讲view注册到module中
            this.view = this[name] = klass.instance.apply(klass,view['args']);
            // 执行事件绑定
            this[name].bind(view['events'],this);

            // 释放view
            view = null;
        });
        return this;
    }
    // 设定当前module中使用到的model对象
    // @model
    Module.model = function(model){
        this.init(function(){
            this.model = this[model.className] = model.instance();
        });
        return this;
    }

    // 实例化
    // @entrance 实例化之后希望调用的入口函数
    Module.instance = function(entrance){
        // 实例化
        var ins = new this();
        // 调用入口函数
        // @ins 当前实例
        // @ins.app 全局对象 单例模式
        // @ins.model 当前实例的model属性
        // @ins.view 当前实例的view属性
        entrance.call(ins,ins.app,ins.model,ins.view);
        // 返回实例
        return ins;
    }

    module.exports = Module;
});