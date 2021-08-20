<template>
	<div id="freeLunch-luckier">
		<public-header title="往期幸运星"></public-header>
		<div class="content">
			<van-list class="luckier-list"
				v-model="luckiers.loading"
				:finished="luckiers.loaded"
				:immediate-check="false"
				:offset="100"
				@load="onLoad"
				v-if="!luckiers.empty"
			>
				<router-link :to="util.getUrl({path: '/package/pages/freelunch/detail', query: {record_id: item.id}})" class="luckier-item" v-for="(item,index) in luckiers.data" :key="index">
					<div class="participant-title van-hairline--bottom">
						<span>第{{item.serial_sn}}期 <span class="plus" v-if="item.type == 'plus'">Plus</span></span>
						<span class="prize-time">开奖时间：{{item.endtime}}</span>
					</div>
					<div class="luckier-info">
						<div class="col-20">
							<img :src="item.avatar" alt="">
						</div>
						<div class="col-80">
							<div>
								<span class="luckier-key">幸运星：</span>
								<span class="luckier-value">{{item.nickname}}</span>
							</div>
							<div>
								<span class="luckier-key">手机号：</span>
								<span class="luckier-value">{{item.mobile}}</span>
							</div>
							<div>
								<span class="luckier-key">本期参与：</span>
								<span class="luckier-value"><span>{{item.total}}</span> 次</span>
							</div>
							<div>
								<span class="luckier-key">幸运号码：</span>
								<span class="luckier-value">{{item.reward_number}}</span>
							</div>
						</div>
						<van-icon name='right'></van-icon>
					</div>
				</router-link>
				<div class="loaded" v-if="luckiers.loaded">
					<div class="loaded-tips">我是有底线的</div>
				</div>
			</van-list>
			<div class="loaded" v-else>
				<div class="loaded-tips">暂无记录</div>
			</div>
		</div>
	</div>
</template>

<script>
	import PublicHeader from '@/components/header'
	export default {
		components: {
			PublicHeader,
		},
		data() {
			return {
				luckiers: {
					min: 0,
					loading: false,
					loaded: false,
					empty: false,
					data: []
				}
			}
		},
		methods: {
			onLoad() {
				this.util.request({
					url: 'freeLunch/freeLunch/luckier',
					data: {
						min: this.luckiers.min
					}
				}).then((res) => {
					let result = res.data.message;
					if(result.errno) {
						this.util.$toast(result.message);
						return false;
					}
					this.luckiers.min = result.min;
					this.luckiers.data = [...this.luckiers.data, ...result.message]
					if(result.message.length < 15) {
						this.luckiers.loaded = true;
					}
					if(!this.luckiers.data.length){
						this.luckiers.empty = true;
					}
					this.luckiers.loading = false;
				})
			},
		},
		mounted() {
			this.onLoad();
		}
	}
</script>

<style>
	.plus{
		display:inline-block;
		padding:0px 4px;
		background: #ff2d4b;
		border-radius: 2px;
		color: #fff;
		font-size: 12px;
		margin-left: 5px;
	}
	#freeLunch-luckier .content{
		position: fixed;
		top: 46px;
		right: 0;
		left: 0;
		bottom: 0;
		width: 100%;
		background: #f5f5f5;
		overflow-x: hidden;
		overflow-y: scroll;
	}
	#freeLunch-luckier .content::-webkit-scrollbar {
		display: none;
	}
	#freeLunch-luckier .van-nav-bar{
		background-color: #ff2d4b!important;
		color: #fff!important;
	}
	#freeLunch-luckier .van-hairline--bottom .van-icon-left{
		color: #fff!important;
	}
	#freeLunch-luckier .content .luckier-item{
		display: block;
		padding: 0 16px;
		margin: 10px 0;
		background-color: #fff;
	}
	#freeLunch-luckier .content .luckier-item .participant-title{
		font-size: 11px;
		padding: 10px 0;
		color: #333;
		line-height: 18px;
	}
	#freeLunch-luckier .content .luckier-item .participant-title .plus{
		display:inline-block;
		padding:0px 4px;
		background: #ff2d4b;
		border-radius: 2px;
		color: #fff;
		font-size: 12px;
		margin-left: 5px;
	}
	#freeLunch-luckier .content .luckier-item .participant-title .prize-time{
		color: #999;
		float: right;
	}
	#freeLunch-luckier .content .luckier-item .luckier-info{
		font-size: 11px;
		position: relative;
		margin-left: -4%;
		overflow: hidden;
	}
	#freeLunch-luckier .content .luckier-item .luckier-info .col-20{
		width: 16%;
		margin-left: 4%;
		text-align: center;
		float: left;
	}
	#freeLunch-luckier .content .luckier-item .luckier-info .col-20 img{
		width: 40px;
		height: 40px;
		margin-top: 20px;
		border-radius: 100%;
		border: none;
		max-width: 100%;
	}
	#freeLunch-luckier .content .luckier-item .luckier-info .col-80{
		width: 76%;
		margin-left: 4%;
		padding: 10px 0;
		float: left;
	}
	#freeLunch-luckier .content .luckier-item .luckier-info .col-80 .luckier-key{
		color: #666;
		line-height: 16px;
	}
	#freeLunch-luckier .content .luckier-item .luckier-info .col-80 .luckier-value{
		color: #000;
		line-height: 16px;
	}
	#freeLunch-luckier .content .luckier-item .luckier-info .col-80 .luckier-value span{
		color: #ff6000;
	}
	#freeLunch-luckier .content .luckier-item .luckier-info .van-icon{
		position: absolute;
		color: #999;
		top: 50%;
		right: 0;
		margin-top: -10px;
	}
</style>


// WEBPACK FOOTER //
// src/pages/freelunch/luckier.vue