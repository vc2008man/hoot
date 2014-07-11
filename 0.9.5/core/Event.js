/**
 * Created by jiawei.sun on 14-6-21.
 */
define(function(require,exports,module){
    var sp = /\s+/,
        Event = function(){};
    function emit(){
        var args = Array.prototype.slice.apply(arguments),
            ev = args.shift(),
            i = 0,
            callbacks;
        if(ev !== '*'){
            callbacks = this.listeners[ev];
            if(!callbacks || callbacks.length < 1){
                return;
            }
            for(;i<callbacks.length;i++){
                if(callbacks[i][0].apply(callbacks[i][1],args) === false){
                    break;
                }
            }
        }
    }
    Event.prototype = {
        'constructor' : Event,
        'on' : function(listeners,callback,context){
            var ev;
            if(!listeners || !callback){
                return this;
            }
            listeners = listeners.split(sp);
            context = context || this;
            this.listeners = this.listeners || {};
            while(ev = listeners.shift()){
                if(this.listeners[ev]){
                    this.listeners[ev].push([callback,context]);
                }else{
                    this.listeners[ev] = [[callback,context]];
                }
            }
            return this;
        },
        'once' : function(listeners,callback,context){
            if(!listeners || !callback){
                return this;
            }
            function newCallback(){
                this.off(listeners,newCallback,context);
                callback.apply(this,arguments);
            }
            return this.on(listeners,newCallback,context);
        },
        'off' : function(listeners,callback,context){
            var ev,callbacks,len;
            if(arguments.length < 1 || !listeners || listeners === '*' || !this.listeners){
                this.listeners = undefined;
                return this;
            }
            listeners = listeners.split(sp);
            context = context || this;
            while(ev = listeners.shift()){
                if(!callback){
                    this.listeners[ev] = undefined;
                }else{
                    callbacks = this.listeners[ev];
                    len = callbacks.length;
                    while(len--){
                        if(callbacks[i][0] === callback && callbacks[i][1] === context){
                            callbacks.splice(i,1);
                        }
                    }
                    if(callbacks.length < 1){
                        this.listeners[ev] = undefined;
                    }else{
                        this.listeners[ev] = callbacks;
                    }
                }
            }
            return this;
        },
        'trigger' : function(){
            var args = Array.prototype.slice.call(arguments),
                events = args.shift(),
                ev,params;
            if(!this.listeners){
                return this;
            }
            if(!events || events === '*'){
                for(ev in this.listeners){
                    params = [ev];
                    params.push.apply(params,args);
                    emit.apply(this,params);
                }
            }else{
                events = events.split(sp);
                while(ev = events.shift()){
                    params = [ev];
                    params.push.apply(params,args);
                    emit.apply(this,params);
                }
            }
            return this;
        }
    }

    module.exports = Event;
});