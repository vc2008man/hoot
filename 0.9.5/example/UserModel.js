/**
 * Created by jiawei.sun on 14-7-4.
 */
define(function(require,exports,module){
    var Model = require('Model'),
        UserModel = Model.create('UserModel',function(){
            this.fields = ['username','password','gender','birthday'];
        }).proto({
                'getModel' : function(callback){
                    var that = this;
                    this.req('user.html').resolve(this.bag).done(function(model){
                        callback.call(that,model);
                    });
                }
            }).mapping({
                'username' : 'username',
                'password' : 'password',
                'gender' : 'gender',
                'birthday' : 'birthday'
            });
    module.exports = UserModel;
});