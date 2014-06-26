# 怎么实现一个模块 #
- 确定module是否仅仅为View
- 确定module中Model的属性 及 前后端交互接口
- 确定module中Controller需要操作几个View和Model

### 仅View的模块 ###
只需要通过View类 按照需求进行创建

### 完整的MVC模块 ###
- 确定View
	- 根据实际View的样式 确定需要几个模板
	- 绑定相应的事件
- 确定Model

- 确定Controller
	- 配置View选项
	- 配置Model选项 根据当前View判断是否为单个Model还是Model的ArrayList形式
	- 按需求给View与Model绑定相应的自定义事件回调

### 页面引入模块 ### 
引用时 只需要通过seajs对模块的主文件（入口文件）
- 仅View的模块 入口文件为自身
- 完整MVC的模块 Controller为入口文件
- 也可自行包装一个作为入口文件