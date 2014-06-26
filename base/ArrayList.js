/**
 * Created by jiawei.sun on 2014-03-25 08:46.
 *
 */
define(function(require,exports,module){
    var Class = require('Class'),
        Event = require('Event');
    function ArrayList(generics){
        this.generics = generics;
        if(!this.generics){
            throw new ReferenceError('generics is undefined');
        }
    }
    ArrayList.prototype = new Array();
    ArrayList.prototype.constructor = ArrayList;
    Class.mix.call(Event.prototype,ArrayList.prototype);
    Class.mix.call({
        'loop' : function(callback){
            var i = 0,
                len = this.length;
            for(;i<len;i++){
                if(callback.call(this,i,this[i]) === false){
                    break;
                }
            }
            return this;
        },
        'create' : function(){
            return this.generics.instance.apply(this.generics,arguments);
        },
        'add' : function(){
            var i = 0,
                len = arguments.length;
            for(;i<len;i++){
                if(arguments[i] instanceof this.generics){
                    this.push(arguments[i]);
                    arguments[i].listIndex = this.length - 1;
                }
            }
            return this;
        },
        'remove' : function(index,type){
            this.splice(this.get(index,type).listIndex,1);
            return this;
        },
        'replace' : function(index,newItem,type){
            var item = this.get(index,type);
            newItem.set('guid',item.get('guid'));
            this[item.listIndex] = newItem;
            return this;
        },
        'get' : function(index,type){
            var item,guid;
            if(!type){
                item = this[index];
            }else{
                this.loop(function(i,it){
                    guid = it.get('guid');
                    if(it && guid && String(guid) === String(index)){
                        item = it;
                        item.listIndex = i;
                        return false;
                    }
                });
            }
            return item;
        },
        'clean' : function(){
            this.length = 0;
            return this;
        },
        'sortBy' : function(fieldName,mode){
            var model = this.get(0),
                value1,value2;
            if(model.field(fieldName)){
                this.sort(function(m,n){
                    value1 = m.get(fieldName);
                    value2 = n.get(fieldName);
                    if(mode === 'desc'){
                        return value1 < value2;
                    }else{
                        return value1 > value2;
                    }
                });
            }
            return this;
        },
        'toJSON' : function(){
            var len = this.length,
                i = 0,
                json = [];
            for(;i<len;i++){
                json.push(this[i].toJSON());
            }
            return json;
        }
    },ArrayList.prototype);

    ArrayList.className = 'ArrayList';
    module.exports = Class.classify(ArrayList);
});