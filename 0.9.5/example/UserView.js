/**
 * Created by jiawei.sun on 14-7-4.
 */
define(function(require,exports,module){
    var View = require('View');
    module.exports = View.create('UserView')
        .events({
            'span' : {
                'click' : function(){
                    console.log('click');
                },
                'mouseenter' : function(){
                    $(this).css('color','red');
                },
                'mouseleave' : function(){
                    $(this).css('color','black');
                }
            },
            '.result' : {
                'mouseenter' : function(){
                    $(this).css('background','#EEE');
                },
                'mouseleave' : function(){
                    $(this).css('background','transparent');
                }
            },
            'input[type="text"]' : {
                'focus' : function(){
                    $(this).css('border-color','green');
                },
                'blur' : function(){
                    $(this).css('border-color','#CCC');
                }
            }
        })
        .proto({
            'fill' : function(store){
                $('#username').val(store.username());
                $('#password').val(store.password());
            }
        });
});