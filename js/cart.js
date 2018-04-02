var vm = new Vue({
	el:'#app',
	data:{
		productList:[],
		totalMoney:0,
		checkAllFlag:false,
		delFlag:false,
		cutProduct:''
	},
	// 局部过滤器
	filters:{
		formatMoney:function(value){
			return "￥"+value.toFixed(2);
		}
	},
	mounted:function(){
		this.$nextTick(function(){
			vm.cartView();
		});
		// this.cartView();
	},
	methods:{
		cartView:function(){
			// var _this = this;//this为该vue实例对象，在vue某个方法内部，this的作用域会发生变化，
			// this.$http.get("data/cartData.json", {"id":123}).then(function(res){
			// 	_this.productList = res.data.result.list;
			// 	_this.totalMoney = res.data.result.totalMoney;
			// });
			
			// ES6语法，改变了this的作用域
			let _this = this;//this为该vue实例对象，在vue某个方法内部，this的作用域会发生变化，
			this.$http.get("data/cartData.json", {"id":123}).then(res=>{
				this.productList = res.data.result.list;
				// this.totalMoney = res.data.result.totalMoney;
			});
		},

		changeQuantity:function(product,way){
			if(way >0){
				product.productQuantity++;
			}else{
				product.productQuantity--;
				if(product.productQuantity<1){
					product.productQuantity = 1;
				}
			}
			this.calcTotalPrice();
		},

		selectedProduct:function(product){
			// 判断是否有checked属性，因为需要商品中遍历，所以不能直接在data中注册
			if( typeof product.checked =='undefined'){
				Vue.set(product,"checked",true);//全局注册一个不存在的变量
				// this.$set(product,"checked",true);//局部注册一个不存在的变量
			} else{
				product.checked = !product.checked;
			}
			this.calcTotalPrice();
		},

		checkAll:function(flag){
			this.checkAllFlag = flag;
			var _this = this;
			this.productList.forEach(function(product,index){
				if( typeof product.checked =='undefined'){
						Vue.set(product,"checked",_this.checkAllFlag);//全局注册一个不存在的变量
					} else{
						product.checked = _this.checkAllFlag;
					}
				});
			this.calcTotalPrice();
		},

		calcTotalPrice:function(){
			var _this = this;
			_this.totalMoney = 0;
			this.productList.forEach(function(product,index){
				if(product.checked){
					_this.totalMoney += product.productPrice * product.productQuantity
				}
				
			});
		},

		delConfirm:function(product){
			this.delFlag = true;
			this.cutProduct = product;//保存 点击了删除的商品
		},

		delProduct:function(){
			var index = this.productList.indexOf(this.cutProduct);//获取 点击了删除的商品的索引
			this.productList.splice(index,1);//从当前元素开始删除1个元素
			this.delFlag = false;
		}
	}

});

//全局过滤器
Vue.filter("money",function(value,type){
	return "￥"+value.toFixed(2)+type;
});