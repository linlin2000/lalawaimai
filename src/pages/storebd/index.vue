<template>
	<div id="storebd-index">
		<public-header :title="config.setting_meta_title ? config.setting_meta_title : '店铺推广员'"></public-header>
		<div class="content">
			<div class="storebd-title">
				<div class="storebd-member">
					<div class="member-img">
						<img :src="storebd_user.avatar" alt="">
					</div>
					<div>推广员：{{storebd_user.title}}</div>
				</div>
			</div>
			<div class="user-getcash flex">
				<div class="getcash-left">
					<div>成功提现佣金</div>
					<div class="price">￥ {{commission.getcash_success}}</div>
				</div>
				<div class="getcash-right">
					<div>可提现佣金</div>
					<div class="price">￥ {{storebd_user.credit2}}</div>
				</div>
			</div>
			<van-cell-group class="margin-10-t ellipsis">
				<van-cell title="我的佣金" />
				<router-link tag="div" :to="util.getUrl({path: '/package/pages/storebd/commission'})" class="commission">
					<div class="van-icon van-icon-refund"></div>
					<div class="commission-name">推广佣金</div>
					<div class="commission-price">{{commission.total}}元</div>
				</router-link>
				<router-link tag="div" :to="util.getUrl({path: '/package/pages/storebd/current'})" class="commission">
					<div class="van-icon van-icon-list"></div>
					<div class="commission-name">佣金明细</div>
					<div class="commission-price">{{current}}笔</div>
				</router-link>
				<router-link tag="div" :to="util.getUrl({path: '/package/pages/storebd/getcashlog'})" class="commission">
					<div class="van-icon van-icon-sort"></div>
					<div class="commission-name">提现明细</div>
					<div class="commission-price">{{getcash}}笔</div>
				</router-link>
			</van-cell-group>
			<van-cell-group class="margin-10-t ellipsis">
				<van-cell title="其他" />
				<router-link tag="div" :to="util.getUrl({path: '/package/pages/storebd/store'})" class="commission">
					<div class="van-icon van-icon-store"></div>
					<div class="commission-name">推广店铺</div>
					<div class="commission-price">{{stores}}家</div>
				</router-link>
			</van-cell-group>
		</div>
		<transition name="loading">
			<iloading v-if="showPreLoading"></iloading>
		</transition>
	</div>
</template>

<script>
	import PublicHeader from '@/components/header'
	import {getData} from "@/controller/funcCommon"
	export default {
		components: {
			PublicHeader,
		},
		data() {
			return {
				storebd_user: {},
				commission: {},
				current: '',
				getcash: '',
				stores: '',
				showPreLoading: true,
				config: []
			}
		},
		methods: {
			onLoad(){
				var that = this;
				getData({
					vue: that,
					url: 'storebd/index/index',
					data: {},
					success: (res) => {
						that.storebd_user = res.storebd_user;
						that.commission = res.commission;
						that.current = res.current;
						that.getcash = res.getcash;
						that.stores = res.stores;
						that.config = res.config;
						if(that.config.setting_meta_title) {
							that.util.setWXTitle(that.config.setting_meta_title);
						}
					}
				});
			},
		},
		mounted() {
			this.onLoad()
		}
	}
</script>

<style>
	#storebd-index .storebd-title{
		width: 100%;
		background-color: #ff2d4b;
	}
	#storebd-index .storebd-title .storebd-member{
		text-align: center;
		color: #fff;
		opacity: .9;
		padding: 20px 0px;
		font-size: 16px;
		overflow: hidden;
		position: relative;
	}
	#storebd-index .storebd-title .storebd-member .member-img{
		width: 65px;
		height: 65px;
		border: 2px solid #fff;
		margin: 0 auto 10px;
		border-radius: 50%;
	}
	#storebd-index .storebd-title .storebd-member .member-img img{
		width: 100%;
		height: 100%;
		border-radius: 50%;
	}
	#storebd-index .content .user-getcash{
		padding: 10px 0;
		background-color: #fff;
	}
	#storebd-index .content .user-getcash .getcash-left{
		width: 50%;
		text-align: center;
		font-size: 14px;
	}
	#storebd-index .content .user-getcash .getcash-right{
		width: 50%;
		text-align: center;
		font-size: 14px;
	}
	#storebd-index .content .user-getcash .price{
		padding-top: 10px;
		font-size: 18px;
		font-weight: bold;
	}
	#storebd-index .content .commission{
		float: left;
		width: 33.33%;
		text-align: center;
		padding: 10px 0;
	}
	#storebd-index .content .commission .van-icon{
		display: inline-block;
		width: 100%;
		font-size: 36px;
		color: #0894ec;
	}
	#storebd-index .content .commission .commission-name{
		font-size: 14px;
		padding: 10px 0 5px;
	}
	#storebd-index .content .commission .commission-price{
		font-size: 14px;
		color: #999;
	}
</style>


// WEBPACK FOOTER //
// src/pages/storebd/index.vue