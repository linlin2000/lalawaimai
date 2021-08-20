<template>
	<div id="superRedpacket-index">
		<div class="content">
			<div class="banner">
				<img :src="activity_img" alt="">
			</div>
			<div class="receive">
				<van-field v-model="mobile" placeholder="请输入您的手机号" />
				<div @click="onSubmit" class="btn-get-superredpacket">立即领取</div>
			</div>
			<div class="records-agreement">
				<div class="agreement-title">活动规则</div>
				<div class="agreement-inner" v-html="agreement">
				</div>
			</div>
		</div>
		<transition name="loading">
			<iloading v-if="showPreLoading"></iloading>
		</transition>
	</div>
</template>

<script>
	export default {
		components: {
		},
  		data() {
  			return {
  				showPreLoading: true,
  				agreement: '',
  				mobile: '',
				activity_img: '',
  				activity_title: '分享超级红包',
  			}
  		},
  		methods: {
  			onSubmit() {
  				if(!this.mobile) {
  					this.$toast('请输入手机号');
  					return false;
  				}
  				if(!this.util.isValidMobile(this.mobile)) {
					this.$toast('手机号格式错误');
					return false;
				}
				this.util.request({
					url: 'superRedpacket/share/index',
					method: 'POST',
					data: {
						mobile: this.mobile,
						order_id: this.order_id,
					}
				}).then((res) => {
					let result = res.data.message
					if(result.errno) {
						this.$toast(result.message);
						return false;
					} else {
						this.$router.replace(this.util.getUrl({path: '/pages/superRedpacket/grant', query:{order_id: this.order_id}}));
					}
				})	
  			},
			onLoad() {
				this.util.request({
					url: 'superRedpacket/share/index',
					data: {
						order_id: this.order_id
					}
				}).then((res) => {
					this.showPreLoading = false;
					let result = res.data.message;
					if(result.errno) {
						if(result.errno == -1000) {
							this.$router.replace(this.util.getUrl({path: '/pages/superRedpacket/grant', query:{order_id: this.order_id}}));
							return false;
						}
						this.$toast(result.message);
						return false;
					}
					result = result.message;
					this.activity_img = result.activity_img;
					this.activity_title = result.activity_title;
					this.agreement = result.agreement;
					this.util.setWXTitle(this.activity_title);
				})
			},
		},
		created() {
			this.query = this.$route.query;
			if(this.query) {
				this.order_id = this.query.order_id;
			}
		},
		mounted () {
			this.onLoad();
		},
	}
</script>

<style>
	#superRedpacket-index .content{
		position: fixed;
		top: 0;
		right: 0;
		left: 0;
		bottom: 0;
		width: 100%;
		background: #e36e07;
		overflow-x: hidden;
        overflow-y: scroll;
	}
	#superRedpacket-index .content::-webkit-scrollbar {
        display: none;
    }
    #superRedpacket-index .content .banner{
	    line-height: 0.85;
    }
    #superRedpacket-index .content .banner img{
	    border: none;
	    max-width: 100%;
    }
    #superRedpacket-index .content .receive{
		width: 85%;
		margin: 0 auto;
		background: rgba(255,255,255,0.6);
		border-radius: 3px;
		padding: 10px 5%;
    }
    #superRedpacket-index .content .receive .van-cell{
    	padding: 0 0 0 10px;
		height: 48px;
		width: 100%;
		border: none;
		font-size: 16px;
		border-radius: 4px;
		margin-bottom: 16px;
    }
    #superRedpacket-index .content .receive .van-cell input{
    	height: 48px;
    	line-height: 48px;
    }
    #superRedpacket-index .content .receive .btn-get-superredpacket{
    	display: block;
		background: #ff3f26;
		color: #fff;
		height: 48px;
		line-height: 48px;
		border: none;
		font-size: 17px;
		padding: 0 10px;
		text-align: center;
		text-decoration: none;
		text-overflow: ellipsis;
		white-space: nowrap;
		cursor: pointer;
		border-radius: 5px;
    }
    #superRedpacket-index .content .records-agreement{
		width: 95%;
		margin: 10px auto 0;
		background: rgba(255,255,255,0.6);
		border-radius: 3px;
		padding: 10px 0;
    }
    #superRedpacket-index .content .records-agreement .agreement-title{
		background: url(http://mine/we7/addons/we7_wmall/plugin/superRedpacket/static/img/bg-ling.png) no-repeat;
		background-size: 100% auto;
		background-position: 0;
		color: #333;
		text-align: center;
		font-weight: normal;
		margin: 5px auto 0;
		width: 95%;
		font-size: 16px;
    }
    #superRedpacket-index .content .records-agreement .agreement-inner{
		padding: 0 5%;
		font-size: 15px;
		line-height: 15px;
    }
</style>


// WEBPACK FOOTER //
// src/pages/superRedpacket/index.vue