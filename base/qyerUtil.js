/**
 * qyer js 基础库，所有页面必须引入此库 <br/>
 * 功能：配置 requirejs.config 。 声明 window.qyerUtil ， window.qyerModelUtil
 * @module basic/js/qyerUtil
 */
! function() {

	requirejs.config({
		baseUrl: 'http://static.qyer.com/m',
		map: {
			'*': {
				'css': 'basic/js/require-css'
			}
		}
	});


	/* 	初始化 qyerUtil */
	! function() {

		if (window.qyerUtil) {return; }

		/**
		 * 常用基础操作封装
		 * @class window.qyerUtil
		 * @static
		 */
		window.qyerUtil = {

			EVENT:{
				CLICK:'click'
			},

			_head: null,
			_getHead: function() {
				if (!this._head) {
					this._head = document.getElementsByTagName("head")[0];
				}
				return this._head;
			},

			/**
			 * 加载 css 文件
			 * @method loadCss
			 * @param {String} aFilePath 文件路径
			 * @param {Boolean} aAsync 是否异步加载
			 */

			loadCss: function(aFilePath, aAsync) {
				if (aAsync === false) {
					this.insertStyle($.ajax({
						url: aFilePath,
						async: false
					}).responseText);
				} else {
					$('<link rel="stylesheet" type="text/css" />').attr("href", aFilePath).appendTo(this._getHead());
				}
			},

			/**
			 * 动态创建  style 节点，插入到 dom 文档
			 * @method insertStyle
			 * @param {String} aStr css 代码字符串
			 */
			insertStyle: function(aStr) {
				var nod = document.createElement("style");
				nod.type = "text/css";
				if (nod.styleSheet) { /* ie下   */
					nod.styleSheet.cssText = aStr;
				} else {
					nod.innerHTML = aStr; /* 或者写成 nod.appendChild(document.createTextNode(str))   */
				}
				this._getHead().appendChild(nod);
				nod = null;
			},

			/**
			 * 截取 arguments
			 * @method sliceArguments
			 * @param {arguments} aArgument function 的 arguments 对象
			 * @param {Int} aIndex 要从第几位开始截取
			 * @return {Array} 返回截取后的数组
			 */
			sliceArguments: function(aArgument, aIndex) {
				var ps = [];
				for (var i = aIndex; i < aArgument.length; i++) {
					ps.push(aArgument[i]);
				};
				return ps;
			},


			/**
			 * 是否是移动设备
			 * @method isMobile
			 * @return {Boolean}
			 */
			 isMobile:function () {
			 	var uA = navigator.userAgent;
			 	return ( uA.match(/Android/i) || uA.indexOf('iPhone') != -1 || uA.indexOf('iPad') != -1  );
			 },


			/**
			 * 返回字符串长度
			 * @method getWordLen
			 * @return {Number}
			 */
			getWordLen:function (aValue,g) {
				function byteLength(b){ 
					if (typeof b == "undefined") { 
						return 0 ;
					} 
					var a = b.match(/[^\x00-\x80]/g); 
					return (b.length + (!a ? 0 : a.length));
				}
	            function doublebyte (str){
	                return str.replace(/[^\x00-\xff]/g,'*') ;
	    		}

                if(g) {
                	aValue = doublebyte(aValue) ;
                }
				return byteLength($.trim(aValue));
			},


			/**
			 * 在一个时间段内，保证此方法只调用一次
			 * @method runOneInPeriodOfTime
			 * @param {Funtion} aFun 要运行的方法
			 * @param {Int} aTimer 多长时间范围内只运行一次（单位 ms）
			 * @return {Function}
			 */
			 runOneInPeriodOfTime:function(aFun,aTimer){
			    var timer ;
			    return function(){
			        window.clearTimeout(timer);
			        timer = window.setTimeout(function(){
			            aFun();
			        },aTimer||300);
			    };
			 },



			 __bodyTouchmoveFun__:function(aEvt){
 				aEvt.preventDefault();
			 },

			/**
			 * 禁用 body 的触摸滚动事件，一般弹层出现会把 body 的滚动屏蔽掉
			 * @method disableBodyScroll
			 */
			 disableBodyScroll:function(){
				document.body.addEventListener('touchmove', this.__bodyTouchmoveFun__, false);
			 },

 			/**
			 * 启用 body 的触摸滚动事件，与 disableBodyScroll 对应
			 * @method enableBodyScroll
			 */
			 enableBodyScroll:function(){
				document.body.removeEventListener('touchmove', this.__bodyTouchmoveFun__);
			 },


			/**
			 *	render template - basic, only var replacements
			 */
			 renderTemplate : function (tmpl, data) {
			 	if (!data) return false;
			 	
			 	// replace {{= KEY}} with data.KEY
			 	return tmpl.replace(/{{(\/?)(\w+|.)(?:\((.*?)\))?(?: (.*?))?}}/g, function (match) {
			 		var key = match.slice(4,-2).replace(/(^\s*)|(\s*$)/g, "");
			 		return (key in data) ? data[key] : "";
			 	});
			 },



			/**
			 * ajax 封装
			 * @method ajax
			 * @param {Object} aOption ajax 配置
			 * <ul>
			 * 	<li>testData : 测试数据，有测试数据的话，模拟返回测试数据，不走真正的 ajax </li>
			 * 	<li>__defaultData__ : 当返回的 数据， data 未定义时，将此值赋值给 data  </li>
			 * 	<li>onCallSuccessBefore : Success 之前的回调 </li>
			 * 	<li>onSuccess : 成功回调 </li>
			 * 	<li>onError : 失败回调 </li>
			 * 	<li>url :  post 的 url </li>
			 * </ul>
			 */
			ajax:function (aOption) {
				
				if(aOption.testData){
					if(!aOption.testData.data){aOption.testData.data = aOption.__defaultData__; }
					aOption.onCallSuccessBefore && aOption.onCallSuccessBefore(aOption.testData);
					setTimeout(function () {
						aOption.onSuccess(aOption.testData);
					},200);
					return ;
				}

				$.ajax({
					type: "POST",
					url: aOption.url,
					dataType: "json",
					data:aOption.data,
					cache:false,
					success:function (aJSON) {
						if(aJSON.error_code==0){
							if(!aJSON.data){aJSON.data = aOption.__defaultData__; }
							aOption.onCallSuccessBefore && aOption.onCallSuccessBefore(aJSON);
							aOption.onCallSuccessBefore && aOption.onSuccess(aJSON);
						}else{
							aOption.onError && aOption.onError(aJSON);
						}
					},
					error:function (aXhr,aInfo) {
						aOption.onError &&  aOption.onError({"error_code": -1, "result": "erro", "data":{"msg":aInfo||""} });
					}
				});
			},


			/**
			 * 强制执行 track 代码
			 * @method doTrackCode
			 * @param {String} aCode track代码
			 */
			doTrackCode:function(aCode){
				var id = '__dotarckcodebutton__';
				if( !document.getElementById(id) ){
					$('<button id="'+id+'" style="display:none;">dotarckcodebutton</button>').appendTo(document.body);
				}
				$('#'+id).attr('data-bn-ipg',aCode).trigger('click');
				id=null;
			},


			/**
			 * 统一处理一下 zepto 里面 ajax 的成功回调，增加自己的业务逻辑 
			 * @method ajaxFillter
			 */
			ajaxFillter:function(data, xhr, settings, deferred){
				if( typeof(data) == 'object' ){
					if(data.extra && data.extra.code){
						switch(data.extra.code|0){
							case 1:
								// 触发敏感词
								window.qyerUtil.showAntiSpam(data.extra.msg);
							break;
						}
					}
				}

			},

			/**
			 * 弹出警告层（ 只要 ajax 返回结果中有 extra && extra.code != 0 ）
			 * @param {String} aText 要显示的文本
			 */
			showAntiSpam:function(aText){
				requirejs(['common/component/antiSpam/antiSpam'],  function (m) {m.show(aText); });
			}


		};
	}();



	/*  初始设定 */
	!function(){
		if(qyerUtil.isMobile()){qyerUtil.EVENT.CLICK = 'tap'; }
	}();


	// 原型扩展 
	!function () {
		function ex(aObj,aEx) {for(var key in aEx ){aObj[key] = aEx[key]; } }

		/**
		 * models Date原型扩展
		 * @class Date.prototype
		 */
		ex(Date.prototype,{
			/**
			 * 返回中文，星期几
			 * @method qGetWeekStr
			 * @return {String}
			 */
			qGetWeekStr:function () {
				return '星期' + ["日","一","二","三","四","五","六"][this.getDay()];
			},

			/**
			 * 设置几天之后的日期
			 * @method qAddDate
			 * @param {Number} aNum 
			 */
			qAddDate:function (aNum) {
				this.setDate( this.getDate() + aNum );
				return this;
			},

			/**
			 * 转换成字符串 类似 2014-1-1 ， 可以自定义分隔符
			 * @method qToString
			 * @param {String} aSplit 分隔符
			 */
			 qToString:function (aSplit) {
				var  str = [ this.getFullYear(), this.getMonth()+1, this.getDate() ];
				return str.join(aSplit||'-');
			}

		});


		/**
		 * models String原型扩展
		 * @class String.prototype
		 */
		ex(String.prototype,{
			/**
			 * 转换成 Date 对象
			 * @method qToDate
			 * @param {String} aSplit 分隔符
			 * @return {Date} 
			 */
			qToDate:function (aSplit) {
				var s = this.split(aSplit||'-');
				s = [s[0]|0, (s[1]|0)-1, s[2]|0];
				var d = new Date(s[0],s[1],s[2]);
				s.length=0;
				s=null; 
				return d;
			},


			/**
			 * 转换成 两位整数 不足补零
			 * @method qToIntFixed
			 * @param {Number} aLen 要转换成几位
			 * @return {String} 
			 */
			qToIntFixed:function () {
				var n = this|0;
				return n<10 ? '0'+n : n.toString();
			},

			/**
			 * 转换成 html 代码，替换回车等特殊字符
			 * @method qToHTML
			 * @return {String} 
			 */
			qToHTML:function () {
				return this
						   .replace(/</gi,"&lt;")
						   .replace(/>/gi,"&gt;")
						   .replace(/\n/gi,"<br />")
						   .replace(/\t/gi,"&nbsp;&nbsp;&nbsp;&nbsp;");
			}



		});



	}();
	

}();