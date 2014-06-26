/**
 * Created by jiawei.sun on 14-6-21.
 */
define(function(require,exports,module){
    var Class = require('Class'),
        Event = require('Event'),
        diglett = require('diglett'),
        View = Class.create('View',function(){
            this.fields = {
                'wrapper' : {
                    'setter' : function(self,value){
                        this.value = value;
                        self.bind(self.get('_events'));
                        return this;
                    }
                },
                'template' : {},
                '_events' : {}
            }
        })
            .impl([Event])
            .proto({
                'parse' : function(store){
                    store = store || {};
                    if(Object.prototype.toString.call(store) === '[object Array]' || !isNaN(store)){
                        return diglett(this.get('template'),{
                            'store' : store
                        });
                    }
                    return diglett(this.get('template'),store);
                },
                'bind' : function(events,context){
                    var ev,callback,
                        context = context || this,
                        wrapper = this.get('wrapper');
                    if(!events){
                        return this;
                    }
                    if(wrapper === undefined || wrapper.length < 1){
                        this.set('_events',events);
                        return this;
                    }
                    for(ev in events){
                        if(events.hasOwnProperty(ev)){
                            callback = events[ev];
                            ev = ev.split(/\s+/);
                            if(ev[0].split('.').length > 1){
                                wrapper.off(ev[0]);
                            }
                            wrapper.on(ev[0],ev.slice(1).join(' '),(function(method){
                                return function(e){
                                    method.call(context,this,e);
                                }
                            })(callback));
                        }
                    }
                    this.set('_events',undefined);
                    return this;
                }
            });
    View.events = function(events){
        this.init(function(){
            this.bind(events);
        });
        return this;
    }
    View.instance = function(wrapper,template){
        var obj = new this();
        obj.set('wrapper',wrapper);
        obj.set('template',template);
        return obj;
    }

    module.exports = View;

});