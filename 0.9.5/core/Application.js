/**
 * Created by jiawei.sun on 14-7-4.
 */
define(function(require,exports,module){
    //module.exports = require('Class').create('Application').instance();
    var Application = require('Class').create('Application'),
        single = Application.instance();
    Application.singleton = function(){
        if(undefined === single){
            single = Application.instance();
        }
        return single;
    }
    module.exports = Application;
});