/**
 * Created by jiawei.sun on 14-6-23.
 */
define(function(require,exports,module){
    var Class = require('Class'),
        Event = require('Event'),
        ArrayList = require('ArrayList'),
        Controller = Class.create('Controller').impl([Event])
            .proto({
                'listenTo' : function(target,listeners,callback,context){
                    if(typeof target === 'function'){
                        target.prototype.on(listeners, callback, context);
                    }else{
                        target.on(listeners, callback, context);
                    }
                    return this;
                },
                'onChangeField' : function(){},
                'onInvalidField': function(){}
            });
    Controller.views = function(views){
        this.init(function(){
            var name,
                i = 0;
            if(Object.prototype.toString.call(views) !== '[object Array]'){
                views = [views];
            }
            for(;i<views.length;i++){
                name = views[i].class.className;
                this[name] = views[i].class.instance.apply(views[i].class,views[i].args);
                this[name].bind(views[i].events,this);
            }
            i = 0;
        });
        return this;
    }
    Controller.models = function(models){
        this.init(function(){
            var model;
            if(Object.prototype.toString.call(models) === '[object Array]'){
                this.entries = new ArrayList(models[0]);
                model = models[0];
            }else{
                this[models.className] = models.instance();
                model = models;
            }
            this.listenTo(model,'invalid.field',this.onInvalidField,this)
                .listenTo(model,'change.field',this.onChangeField,this);
        });
        return this;
    }
    module.exports = Controller;
});
