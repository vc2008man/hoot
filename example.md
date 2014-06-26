# RadioList 单选框列表 #
这个例子作用是演示纯View的组件

#### RadioListView ####
```` javascript
define(function(require,exports,module){
	// 引入View基类
    var View = require('View'),
		// 引入jQuery
        $ = require('jQuery'),
		// 定义RadioListView变量
        RadioListView;
	// 通过View类创建出RadioListView类
	// RadioListView是View的一个子类 继承了View的所有属性 所有静态方法 所有原型属性及方法
	// 包括View继承或者实现的类
	// 可以通过RadioListView.superClass访问其父类 即View类
	// create函数的参数为RadioListView的类名 非必须参数
	// 类名将注册在Controller中当做属性名 以此来引用当前RadioListView类
	// 返回一个默认类
    RadioListView = View.create('RadioListView');
	// 设置RadioListView的事件
    RadioListView.setEvents({
		// 注册RadioListView下的input标签的点击事件
		// 由于是采用jquery绑定的事件 在事件的执行函数中this指向了事件源 这样不便于在事件执行函数中调用RadioListView自身
		// 所以在此做了处理 修改了事件执行函数的this指向
		// this指向RadioListView的实例
		// 事件执行函数第一个参数为事件源
        'click input' : function(element,e){
            e.stopPropagation();
            $('#selectedItem').html($(element).val());
        }
		// 设置RadioListView的原型属性及方法
    }).setPrototype({
			// 渲染组件
            'render' : function(){
                this.get('wrapper').append(this.parse());
            }
        });
	// CMD 对象输出
    module.exports = RadioListView;
});
````
```` html
<body>
<div id="radioListWrapper">
</div>
seleceted :
<span id="selectedItem">

</span>


<script type="text/javascript" src="/lib/sea.js"></script>
<script type="text/javascript" src="/release/config.js"></script>
<script type="text/javascript">
	// 使用RadioListView
    seajs.use(['jQuery','RadioListView','RadioListViewTemplate'],function($,RadioListView,RadioListViewTemplate){
        var list = RadioListView.getInstance($('#radioListWrapper'),RadioListViewTemplate.html);
        list.render();
    });
</script>
</body>
````

# UserForm 表单及表单验证 #
#### UserModel ####
````javascript
define(function(require,exports,module){
	// 引入Model基类
    var Model = require('Model'),
	// 定义UserModel变量
        UserModel;
	// 通过Model类创建出UserModel类
    UserModel = Model.create('UserModel');
	// 设置UserModel的属性
	// 属性可以以对象形式配置 也可以以字符串形式配置
	// UserModel采用的是对象形式
	// name : 属性名
	// type : 属性类型
	// 支持
	// 		string 字符串
	// 		number 数字 可以是浮点型 也可以是数字
	// 		digit 整数 不包含浮点型
	// 		float 浮点型
	// 		email 邮件
	// 		boolean 布尔
	// 		letter 字母
	// 		char 字母和数字的组合
	// rule : 验证规则
	// 支持
	//		required 必要值
	// 		len 字符长度
	// 		equal 对比
    UserModel.setFields([
        {
            'name' : 'userName',
            'type' : 'string',
            'rule' : {
                'required' : true
            }
        },
        {
            'name' : 'password',
            'type' : 'digit',
            'rule' : {
                'required' : true,
                'len' : [6,20]
            }
        }
    ]).setPrototype({
			// 原型方法
            'save' : function(){
                if(!this.invalid()){
                    this.trigger('save');
                }
            }
        });
	// CMD 对象输出
    module.exports = UserModel;
});
````
#### UserView ####
````javascript
define(function(require,exports,module){
    var View = require('View'),
        $ = require('jQuery');
	// 通过View类创建出UserView类
	module.exports = View.create('UserView');
});
````
#### UserController ####
````javascript
define(function(require,exports,module){
		// 引入jQuery
    var $ = require('jQuery'),
		// 工具类
        Utils = require('Utils'),
		// 引入Controller基类
        Controller = require('Controller'),
		// 引入UserModel类
        UserModel = require('UserModel'),
		// 引入UserView
        UserView = require('UserView'),
		// 定义UserController变量
        UserController;
	// 通过Controller类创建UserController类
    UserController = Controller.create('UserController');
	// 设置UserController中的View对象
	// 用于将UserController中的Model对象与之对应
	// 可以设置多个View对象 以对象形式配置
	// class : 类
	// args : 实例化需要的参数
	// events : 事件
    UserController.setView([
        {
            'class' : UserView,
            'args' : [$('#userForm')],
            'events' : {
                'click #subBtn' : function(){
                    this.UserView.get('wrapper').find('#errMsg').html('');
                    this.setEntity();
                }
            }
        }
    ]);
	// 设置Model对象
    UserController.setModel(UserModel);
	// 设置UserController原型防范
    UserController.setPrototype({
		// Model中属性验证失败的回调方法 通过invalid.field事件触发
		// 此方法在Controller中默认包含 不实现即为空方法
		// 同形式的还有OnChangeField方法 通过change.field事件触发 在当属性值改变的时候触发
        'onInvalidField' : function(fieldName,value,result){
            this.UserView.get('wrapper').find('#errMsg').append(fieldName + ' : ' + Utils.JSON.stringify(result) + '<br>');
        },
		// Model中save方法触发的回调函数
        'onSave' : function(){
            this.UserView.get('wrapper').find('#errMsg').append(Utils.JSON.stringify(this.UserModel.toJSON()));
        },
		// 设置Model实体
        'setEntity' : function(){
            var p1 = Number(this.UserView.get('wrapper').find('#password').val()),
                p2 = Number(this.UserView.get('wrapper').find('#confirm_password').val());
			// 设置UserModel中userName属性的值
			// 所有Model的属性都是通过get/set方式获取
			// 		get方法中会调用在Model对象中当前需要属性的getter方法 getter方法可以在setFields中配置
			// 		同get方法 set方法也会调用当前需要属性的setter方法 setter也在setFields中配置
			// 		getter/setter不配置有默认方法
			// 		set方法会触发invalid.field和change.field事件
            this.UserModel.set('userName',this.UserView.get('wrapper').find('#userName').val());
            this.UserModel.set('password',p1);
			// 不在UserModel中的属性 可以通过调用Model基类中的validate方法来进行验证
			// 参数形式与setFields方法的参数一致
            var result = this.UserModel.validate({
                'name' : 'confirm_password',
                'value' : p2,
                'type' : 'digit',
                'rule' : {
                    'equal' : p1
                }
            });
			// result为属性验证结果
			// code值为1000 即为验证通过
			// 依次其他的值代表
			//		1001 : 类型错误
			// 		1002 : 验证规则错误
            if(result.code === 1000){
				// 调用UserModel的save方法
                this.UserModel.save();
            }
        }
    }).setInitialize(function(){
			// 监听UserModel的属性验证失败事件
			// 参数分别为:被监听的对象 事件名 事件回调方法 回调方法的作用域
            this.listenTo(this.UserModel,'save',this.onSave,this);
        });
	// CMD 对象输出
    module.exports = UserController;
});
````
````html
<div id="userForm">
    <div>
        <span>username:</span>
        <input type="text" id="userName"/>
    </div>
    <div>
        <span>password:</span>
        <input type="password" id="password"/>
    </div>
    <div>
        <span>confirm password:</span>
        <input type="password" id="confirm_password"/>
    </div>
    <div>
        <input type="button" value="submit" id="subBtn"/>
    </div>
    <div style="line-height:30px;color:red;" id="errMsg"></div>
</div>

<script type="text/javascript" src="/lib/sea.js"></script>
<script type="text/javascript" src="/release/config.js"></script>
<script type="text/javascript">
	// 使用UserController
    seajs.use(['jQuery', 'UserController'], function ($, UserController) {
        UserController.getInstance();
    });
</script>
</body>
````