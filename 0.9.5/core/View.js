/**
 * Created by jiawei.sun on 14-7-3.
 */
define(function(require,exports,module){
    var Class = require('Class'),
        diglett = require('diglett'),
        View = Class.create('View',function(){
            this.fields = [
                {
                    // View的外层包装
                    'name' : 'wrapper',
                    'setter' : function(value,that){
                        this.value = value;
                        // 设置wrapper的时候都执行事件绑定操作
                        // 因为在没有wrapper的时候 事件没有绑定
                        // 当wrapper更改的时候 事件需要重新绑定
                        that.bind();
                        return this;
                    }
                },
                // 模板
                'template',
                // TODO: 隐藏_events
                {
                    // 用来缓存DOM事件
                    // 在绑定结束后都清空
                    'name' : '_events',
                    'default' : []
                }
            ];
        })
            .proto({
                // 简化 this.get('wrapper').find(selector)
                // @selector jquery选择器
                'find' : function(selector){
                    return this.wrapper().find(selector);
                },
                'append' : function(html){
                    return this.wrapper().append(html);
                },
                // 简化 this.get('wrapper').append(this.parse(store));
                // @store 数据
                'render' : function(store){
                    this.wrapper().append(this.parse(store));
                    return this;
                },
                // 解析模板
                // @store 数据
                'parse' : function(store){
                    store = store || {};
                    if(Object.prototype.toString.call(store) === '[object Array]' || !isNaN(store)){
                        store = {
                            'store' : store
                        }
                    }
                    return diglett(this.template(),store);
                },
                // 事件绑定
                // @events 需要绑定的事件
                // @context 事件处理的上下文
                // 支持一下两种输入方式
                /**
                *   this.bind({
                *       'click.xxx .selector' : function(){}
                *   })
                *
                *   this.bind({
                *       '.selector' : {
                *           'click.xx' : function(){},
                *           'change.yy' : function(){}
                *       }
                *   })
                * */
                'bind' : function(events,context){
                    // 缓存wrapper
                    var wrapper = this.wrapper(),
                        // 去除_events
                        _events = this['_events']();
                    context = context || this;
                    // 如果当前参数events不存在 则从_events中取数据
                    events = arguments.length < 1 ? _events : [events];
                    // 如果events无值 则直接返回
                    if(events.length < 1 || !events){
                        return this;
                    }
                    // 如果wrapper为空 则将events保存入_events中 以便之后绑定使用
                    // 并返回
                    if(undefined === wrapper || wrapper.length < 1){
                        this['_events']().push(events);
                        return this;
                    }

                    // 卸载之前已经绑定的相同的事件 以免重复绑定
                    function off(key){
                        if(key.split('.').length > 1){
                            wrapper.off(key);
                        }
                    }

                    this.loop(events,function(index,element){
                        // 遍历events 并判断当前events为何种类型
                        this.loop(element,function(key,value){
                            // 'click.xxx .selector' : function(){} 形式
                            if('function' === typeof value){
                                key = key.split(/\s+/);
                                off(key[0]);
                                wrapper.on(key[0],key.slice(1).join(' '),function(e){
                                    value.call(this,e,context);
                                });
                            }else{
                                // '.selector' : {
                                //      'click.xxx' : function(){}
                                // } 形式
                                this.loop(value,function(ev,callback){
                                    off(ev);
                                    wrapper.on(ev,key,function(e){
                                        // 增加回调函数的参数
                                        // @e 事件
                                        // @that 当前View对象 非事件绑定对象
                                        callback.call(this,e,context);
                                    })
                                });
                            }
                        });
                    });
                    // TODO: maybe error
                    // 删除已经绑定过的事件
                    this['_events']([]);
                    return this;
                }
            })
            .init(function(){
                // 对象初始化时绑定事件
                this.bind();
            });

    // 添加需要绑定的事件
    // 推荐此events仅支持DOM事件
    // @events 需要绑定的事件
    View.events = function(events){
        this.init(function(){
            this['_events']().push(events);
        });
        return this;
    }

    View.instance = function(wrapper,template){
        //return (new this()).wrapper(wrapper).template(template);
        var ins = new this();
        ins.wrapper(wrapper)
            .template(template);
        return ins;
    }

    module.exports = View;
});