<template>
	<div id="spread-register">
		<div class="content">
			<img :src="configTemplate.avatar" alt="">
			<template v-if="configRelate.become > 1 && spread_status == 1">
				<div class="list-group van-hairline--top" >
					<div class="list-group-title">
						<van-icon name='lights'></van-icon>友情提醒
					</div>
					<div class="list van-hairline--top van-hairline--bottom" v-if="configRelate.become == 2">
						<div class="list-inner">
							<div class="text">
								本店累计消费满 <span>{{configRelate.become_ordercount}}</span>次，才可能成为<<span>{{title}}</span>>平台推广员，您已消费<span>{{frquency}}</span>次
								，{{frquency >= configRelate.become_ordercount ? '请点击下方按钮申请成为推广员' : '请继续努力！'}}
							</div>
						</div>
					</div>
					<div class="list van-hairline--top van-hairline--bottom" v-else-if="configRelate.become == 3">
						<div class="list-inner">
							<div class="text">
								本店累计消费满 <span>{{configRelate.become_moneycount}}</span>元，才可能成为<<span>{{title}}</span>>平台推广员，您已消费<span>{{price}}</span>元
								，{{price >= configRelate.become_moneycount ? '请点击下方按钮申请成为推广员' : '请继续努力！'}}
							</div>
						</div>
					</div>
				</div>
				<div @click='onSubmit' id="confirm" v-if="(configRelate.become == 2 && frquency >= configRelate.become_ordercount) || (configRelate.become == 3 && price >= configRelate.become_moneycount)">申请成为推广员</div>
				<router-link :to="util.getUrl({path: '/pages/home/index'})" id="confirm" v-else>继续去购物</router-link>
			</template>
			<div class="cell-group van-hairline--top" v-else-if="configRelate.become == 1 && spread_status == 1">
				<div class="cell-title">
					欢迎加入 <span>{{title}}</span>，请填写申请信息
				</div>
				<van-cell-group>
					<van-field
						v-model="username"	
						label="姓名"
						placeholder="请填写真实姓名，用于结算"
						required
					/>

					<van-field
						v-model="mobile"
						type="mobile"
						label="手机号"
						placeholder="填写手机号方便联系"
						required
					/>
				</van-cell-group>
				<div class="cell-group" v-if="configRelate.open_protocol == 1">
					<div class="cell">
						<div class="checked"><van-icon name='check'></van-icon></div>
						我已经阅读并了解了 
						<router-link to="">【推广员申请协议】</router-link>
					</div>
				</div>
			</div>   
			<div id="application" v-if="configRelate.become == 1 && spread_status == 1" @click="onApplication">申请成为推广员</div>
			<div class="container" v-else-if="spread_status == 0">
				<div class="icon-area">
					<van-icon name='icon'></van-icon>
				</div>
				<div class="text-area">
					<div class="msg-title">您已提交推广员申请,请等待管理员审核</div>
					<div class="desc">请等待管理员审核</div>
				</div>
				<div class="btn-area">
					<router-link :to="util.getUrl({path: '/pages/home/index'})">确定</router-link>
				</div>
				<div class="extra-area">
					<router-link :to="util.getUrl({path: '/pages/home/index'})">返回首页</router-link>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		components: {

		},
  		data() {
  			return {
  				status: 0,
  				spread_status: 1,
  				checked: true,
  				configRelate: {},
  				configTemplate: {},
  				title: '',
  				spread: {},
  				price: 0,
  				frquency: 0,
  			}
  		},
		methods: {
			onLoad() {
				this.util.request({
					url: 'spread/register/index',
				}).then((res) => {
					let result = res.data.message;
					if(result.errno == -1000) {
						this.$router.replace(this.util.getUrl({path: '/pages/spread/index'}));
						return;
					} else if(result.errno == -1001) {
						this.spread_status = 0;
						return;
						//this.$toast(result.message);
						//this.$router.push(this.util.getUrl({path: '/'}));
					} 
					this.configRelate = result.message.configRelate;
	  				this.configTemplate = result.message.configTemplate;
	  				this.title = result.message.title;
	  				this.spread = result.message.spread;
	  				this.price = result.message.price ? result.message.price : 0;
	  				this.frquency = result.message.frquency ? result.message.frquency : 0;
				})
			},
			onApplication() {
				if(!this.username) {
					this.$toast('姓名不能为空');
					return false;
				}
				if(!this.mobile) {
					this.$toast('手机号不能为空');
					return false;
				}
				if(!this.util.isValidMobile(this.mobile)) {
					this.$toast('手机号格式错误');
					return false;
				}
				if(0) {
					if(this.checkbox == 0){
						this.$toast('请同意推广协议');
						return false;
					}
				}
				this.util.request({
					url: 'spread/register/application',
					data: {
						name: this.username,
						mobile: this.mobile
					}
				}).then((res) => {
					let result = res.data.message;
					if(result.errno) {
						if(result.errno == -1000) {
							this.$toast('恭喜您已成为推广员');
							this.$router.push(this.util.getUrl({path: '/'}));
							return;
						}
						this.$toast(result.message);
				  	} else {
						this.util.$toast('您已成功提交申请,等待管理员审核', '', 1000);
						this.onLoad();
					}
				})
			},
			onSubmit() {
				this.util.request({
					url: 'spread/register/index',
					method: 'POST'
				}).then((res) => {
					let result = res.data.message;
					if(result.errno == -1000) {
						this.$toast('恭喜您已成为推广员');
						this.$router.replace(this.util.getUrl({path: '/'}));
					} else {
						this.onLoad();
					}
				})
			}

		},
		mounted() {
			this.onLoad()
		}
	}
</script>

<style>
	#spread-register .content{
		position: fixed;
		top: 0;
		right: 0;
		left: 0;
		width: 100%;
		background: #fff;
		overflow-x: hidden;
        overflow-y: scroll;
	}
	#spread-register .content::-webkit-scrollbar {
        display: none;
    }
    #spread-register .content img{
    	max-height: 160px;
	    border: none;
	    width: 100%;
    }
    #spread-register .content .cell-group{
	    position: relative;
	    background-color: #fff;
	    line-height: 28px;
	    font-size: 16px;
	    overflow: hidden;
    }
    #spread-register .content .cell-group .cell-title{
		color: #333;
	    font-size: 15px;
	    padding: 10px 14px;
    }
    #spread-register .content .cell-group .cell-title span{
	    color: #ef4f4f;
    }
    #spread-register .content .cell-group .cell{
	    position: relative;
	    padding: 10px 10px;
	    display: flex;
	    -webkit-box-align: center;
	    align-items: center;
	    transition-duration: 300ms;
	    transition-property: background-color;
        position: relative;
    	font-size: 14px;
	    vertical-align: middle;
	    color: #666;
    }
    #spread-register .content .cell-group .cell .checked{
    	width: 12px;
    	height: 12px;
    	background: #fff;
    	border: 1px solid #bbb;
    	border-radius: 3px;
    	margin-right: 10px;
    	position: relative;
    }
    #spread-register .content .cell-group .cell .checked .van-icon{
    	position: absolute;
    	top: 0;
    	right: 0;
    	font-size: 11px;
    }
    #spread-register .content .cell-group .cell a{
	    color: #0894ec;
    }
    #spread-register .content #application{
    	display: block;
    	width: 95%;
	    margin: 10px;
	    height: 40px;
	    line-height: 38px;
	    font-size: 16px;
	    background-color: #ef4f4f;
	    color: #fff;
	    text-align: center;
	    border-radius: 5px;
    }
    #spread-register .content .list-group{
	    background-color: #fff;
	    position: relative;
	    margin-top: 10px;
    }
    #spread-register .content .list-group .list-group-title{
	    padding: 0 10px;
	    font-size: 14px;
	    color: #333;
	    height:36px;
	    line-height: 36px;
    }
    #spread-register .content .list-group .list-group-title .van-icon{
	    font-size: 16px;
	    margin-right: 4px;
    }
    #spread-register .content .list-group .list{
	    position: relative;
	    display: flex;
	    padding: 10px;
	    transition-duration: 300ms;
	    -webkit-box-align: center;
	    overflow: hidden;
	    align-items: center;
    }
    #spread-register .content .list-group .list .list-inner{
		position: relative;
	    width: 100%;
	    overflow: hidden;
	    box-sizing: border-box;
	    -webkit-box-flex: 1;
	    display: block;
    }
    #spread-register .content .list-group .list .list-inner .text{
		position: relative;
	    font-size: 13px;
	    color: #666;
	    line-height: 18px;
    }
    #spread-register .content .list-group .list .list-inner .text span{
	    color: #ef4f4f;
	    font-weight: bold;
    }
    #spread-register .content #confirm{
    	display: block;
    	width: 95%;
	    margin: 10px;
	    height: 40px;
	    line-height: 38px;
	    font-size: 16px;
	    background-color: #ef4f4f;
	    color: #fff;
	    text-align: center;
	    border-radius: 5px;
    }
    #spread-register .content .container{
	    padding: 0 30px;
	    text-align: center;
    }
    #spread-register .content .container .icon-area{
    	margin-top: 20px;
    }
    #spread-register .content .container .icon-area .van-icon{
    	height: 156px;
    	width: 104px;
    }
    #spread-register .content .container .text-area{
		margin-bottom: 25px;
	    padding: 0 20px;
    }
    #spread-register .content .container .text-area .msg-title{
	    margin-bottom: 5px;
	    font-weight: 400;
	    font-size: 20px;
	    margin-top: 0;
	    line-height: 30px;
    }
    #spread-register .content .container .text-area .desc{
	    font-size: 14px;
	    color: #888;
    }
    #spread-register .content .container .btn-area{
	    margin: 20px 0;
    }
    #spread-register .content .container .btn-area a{
    	display: block;
		background: #10aeff;
		color: #fff;
		border-color: #10aeff;
		height: 42px;
		line-height: 42px;
    	border-radius: 5px;
    }
    #spread-register .content .container .extra-area{  	
		position: fixed;
		left: 0;
		bottom: 0;
		width: 100%;
		text-align: center;
		margin-bottom: 15px;
    }
    #spread-register .content .container .extra-area a{
	    color: #61749B;
	    font-size: 14px;
    }
</style>


// WEBPACK FOOTER //
// src/pages/spread/register.vue