/**
 * Created by jiawei.sun on 14-7-8.
 */
define(function (require, exports, module) {
    /**
     * [{
     *      'url' : xxx,
     *      'type' : 'get',
     *      'cross' : 'jsonp'
     * }]
     *
     * Ajax(xxx,yyy)
     *      .done(function(){})
     *      .fail(function(){})
     *      .then(function(){})
     *      .always(function(){});
     *
     *
     * Ajax(xxx).done()
     * Ajax(yyy).done()
     *
     * Ajax.all(ax,ay).done().fail().then().always();
     *
     *
     *
     * */

    function funA(){}
    function funB(){}
    function funC(){}
    function funD(){}
    Ajax('http://www.vip.com/').done(funA).fail(funB).then(funC).always(funD);
    Ajax('http://www.vipshop.com/').done(funA).fail(funB).then(funC).always(funD);
    // ================
    Ajax('http://www.vip.com','http://www.vipshop.com').done(funA).fail(funB).then(funC).always(funD);
    // ===============
    Ajax.all(Ajax('http://www.vip.com'),Ajax('http://www.vip.com')).done(funA).fail(funB).then(funC).always(funD);







    var Ajax = {
        'req' : function(){

        },
        'all' : function(){

        }
    }


    function Ajax(){

    }
    Ajax.all = function(){

    }



    function Ajax() {
        var urls = Array.prototype.slice.call(arguments),
            len = urls.length,
            success = [],
            failure = [],
            after = [],
            result = [],
            i = 0,
            remote, deal,
            add = function (array, element) {
                if (undefined !== element) {
                    array.push(callback);
                }
                return deferred;
            },
            deferred = {
                'done': function( callback ){
                    return add(success, callback);
                },
                'fail': function (callback) {
                    return add(failure, callback);
                },
                'then': function (callback) {
                    return add(after, callback);
                },
                'resolve': function (index, resp) {
                    if (undefined !== deal && 'function' === typeof deal) {
                        resp = deal.apply(this, arguments);
                    }
                    result[index] = resp;
                    return resp;
                }
            };
        for (; i < len; i++) {
            remote = {
                'url': urls[i].url,
                'type': urls[i].type || 'get',
                'cross': undefined === urls[i].cross ? 'json' : 'jsonp'
            };
            $[remote.type](remote.url, (function (index) {
                return function (resp) {
                    deferred.resolve(index, resp);
                }
            })(i));
        }
    }
});