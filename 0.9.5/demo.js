/**
 * Created by jiawei.sun on 14-7-1.
 *
 * BigPipe、RESTFUL
 *
 * 请求简化
 * 对象引用简化
 * 去除请求callback
 * 全局自定义事件
 * Validate强化
 * 事件合并
 * module方法集成
 * 去除guid
 *
 *
 */
function TaiChi(){}
TaiChi.Application = function(name,factory){
}
TaiChi.Application('IndexApplication',function(app){

});


TaiChi.Module = function(name,factory){}
TaiChi.Module('UserModule',function(module){
    module.model = {};
    module.view = {};
});


TaiChi.Model = function(name,factory){
    function klass(){
    }
    var fields = undefined,
        init = function(){},
        Model = {
            'fields' : function(fields){
                fields = fields;
            },
            'init' : function(cons){
                init = function(){
                    init();
                    cons();
                }
            }
        }


    TaiChi.Model.Mapping[name] = factory(Model);
}
TaiChi.Model.Mapping = {};
TaiChi.Model('UserModel',function(M){
    return M.fields(['userName','password']);
});


TaiChi.View = function(name,factory){}
TaiChi.View('UserView',function(view){

});



TaiChi.Application(function(app){
    app.load('')
});





require('Class')
    .create('Model')
    .init()
    .fields()
    .proto()
    .impl()
    .static()
    .listen({
        '.close' : {
            'click' : function(){

            },
            'mouseenter' : function(){

            }
        }
    },{
        'some' : function(){

        }
    })

this.when('xxx')
    .when('yyy')
    .when('zzz')
    .done()

define(function(Application){

    require('UserModule').instance(function(M,V){

    });

    Application
        .load('UserModule',function(module,model,view){

        })
        .load('OrderModule',function(module,model,view){

        })


    Application(function(app){
        user = require('UserModule')
        app.trigger('order.count')

        app.on('order.count',order.showCount);
    })
});


fields = function(){
    this.init(function(){
        this.userName()
    })
}

Class.create('UserModel',{
    'fields' : []
})
