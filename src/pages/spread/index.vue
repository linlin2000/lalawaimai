<template>
	<div id="spread-index1">
		<public-header title="推广员"></public-header>
		<public-footer :preLoading="showPreLoading" :menufooter="menufooter"></public-footer>
		<div class="content">
			<div class="header-info bg-danger">
				<div class="flex-lr">
					<div class="spreader-info flex">
						<div class="avatar">
							<img :src="member.avatar" alt="">
						</div>
						<div class="">
							<div class="flex margin-15-b">
								<span class="nickname font-20 ellipsis">{{member.nickname}}</span><span class="group-name">{{member.groupname ? member.groupname : '暂无等级'}}</span>
							</div>
							<div class="font-14">邀请码: {{member.uid}}</div>
						</div>
					</div>
					<router-link tag="div" :to="util.getUrl({path: '/pages/spread/qrcode'})">
						<i class="icon icon-qrcode"></i>
					</router-link>	
				</div>
				<div class="flex-lr font-13 padding-15-tb">
					<div>成功提现佣金 ¥{{spread.commission_getcash_success}}</div>
					<div>可提现佣金 ¥{{spread.spreadcredit2}}</div>
				</div>
			</div>
			<div class="link-group">
				<van-cell-group class="border-0px">
					<van-cell is-link :value="'¥' + spread.commission_grandtotal" :to="util.getUrl({path: '/pages/spread/commission'})">
						<div slot="title" class="flex">
							<i class="icon icon-refund"></i>
							推广佣金
						</div>
					</van-cell>
					<van-cell is-link :value="current + '笔'" :to="util.getUrl({path: '/pages/spread/current'})">
						<div slot="title" class="flex">
							<i class="icon icon-list"></i>
							佣金明细
						</div>
					</van-cell>
					<van-cell is-link :value="commission + '笔'" :to="util.getUrl({path: '/pages/spread/getCash/index'})">
						<div slot="title" class="flex">
							<i class="icon icon-sort"></i>
							提现明细
						</div>
					</van-cell>
					<van-cell is-link :value="order + '笔'" :to="util.getUrl({path: '/pages/spread/order'})">
						<div slot="title" class="flex">
							<i class="icon icon-order"></i>
							推广订单
						</div>
					</van-cell>
					<van-cell is-link :value="down + '人'" :to="util.getUrl({path: '/pages/spread/down'})">
						<div slot="title" class="flex">
							<i class="icon icon-friend"></i>
							我的团队
						</div>
					</van-cell>
					<van-cell is-link value="" :to="util.getUrl({path: '/pages/spread/rank'})">
						<div slot="title" class="flex">
							<i class="icon icon-hot1"></i>
							佣金排名
						</div>
					</van-cell>
				</van-cell-group>
				<div class="padding-15-tb">
					<div class="invite" @click="onTogglePopup">邀请好友赚佣金</div>
				</div>
			</div>
		</div>
		<van-popup class="popup-invite" v-model="popupStatus" position="bottom">
			<van-row>
				<van-col span="8">
					<router-link tag='div' :to="util.getUrl({path: '/pages/spread/poster'})">
						<img src="static/img/poster.png" alt="" >
						<div class="margin-10-t">生成海报</div>
					</router-link>
				</van-col>
				<van-col span="8">
					<router-link tag='div' :to="util.getUrl({path: '/pages/spread/qrcode'})">
						<img src="static/img/qrcode.png" alt="">
						<div class="margin-10-t">分享二维码</div>
					</router-link>
				</van-col>
				<van-col
					span="8"
					v-clipboard:copy="member.spread_url"
					v-clipboard:success="onCopy"
					v-clipboard:error="onError"
				>
					<img src="static/img/link.png" alt="">
					<div class="margin-10-t">复制链接</div>
				</van-col>
			</van-row>
			<div class="icon icon-close" @click="onTogglePopup"></div>
		</van-popup>
	</div>
</template>

<script>
	import PublicHeader from '@/components/header'
	import PublicFooter from '@/components/footer'
	export default {
		components: {
			PublicHeader,
			PublicFooter,
		},
		data() {
			return {
				popupStatus: false,
				agreementShow: false,
				member: {},
				spread: {},
				order: '',
				down: '',
				current: '',
				commission: '',
				upgrade_explain: '',
				showPreLoading: true,
				menufooter: {}
			}
		},
		methods: {
			onLoad() {
				this.util.request({
					url: 'spread/index',
					data: {
						menufooter: 1
					}
				}).then((res) => {
					let result = res.data.message;
					if(result.errno == -1000) {
						this.$router.push(this.util.getUrl({path: '/pages/spread/register'}));
						return;
					} 
					result = result.message;
					this.member = result.member;
					this.commission = result.commission;
					this.order = result.order;
					this.spread = result.spread;
					this.down = result.down;
					this.current = result.current;
					this.upgrade_explain = result.upgrade_explain;
					this.showPreLoading = false;
					this.menufooter = window.menufooter;
				})
			},
			onTogglePopup() {
				this.popupStatus = !this.popupStatus;
			},
			onCopy(e) {
				this.onTogglePopup();
				this.util.$toast('复制成功')
			},
			onError: function (e) {
				this.util.$toast('复制失败')
			}
		},
		mounted() {
			this.onLoad()
		}
	}
</script>

<style>
	@import "../../../static/css/test.css";
	#spread-index1 .header-info{
		padding: 20px 15px 30px;
	}
	#spread-index1 .header-info .spreader-info .avatar{
		width: 70px;
		height: 70px;
		border-radius: 50%;
		border: 2px solid #fff;
		overflow: hidden;
		background-color: #fff;
		margin-right: 10px;
	}
	#spread-index1 .header-info .spreader-info .avatar img{
		width: 100%;
		height: 100%;
		border-radius: 50%;
	}
	#spread-index1 .header-info .spreader-info .group-name{
		font-size: 12px;
		padding: 3px 8px;
		border-radius: 3px;
		background-color: #fff;
		color: #ff2d4b;
		margin-left: 10px;
	}
	#spread-index1 .header-info .spreader-info .nickname{
		max-width: 150px;
		font-weight: 500;
	}
	#spread-index1 .header-info .icon-qrcode{
		font-size: 30px;
	}
	#spread-index1 .link-group{
		position: absolute;
		top: 134px;
		left: 15px;
		right: 15px;
		border-radius: 3px;
		overflow: hidden;
	}
	#spread-index1 .link-group .van-cell__title{
		font-size: 15px;
		font-weight: 500;
	}
	#spread-index1 .link-group  .van-cell__value span{
		color: #7a7a7a;
	}
	#spread-index1 .link-group .van-cell:nth-child(odd) .icon{
		color: #0894ec;
	}
	#spread-index1 .link-group .van-cell:nth-child(even) .icon{
		color: #AFD728;
	}
	#spread-index1 .link-group .icon{
		font-size: 18px;
		margin-right: 8px;
	}
	#spread-index1 .link-group .invite{
		background-color: #ff2d4b;
		color: #fff;
		border-radius: 3px;
		text-align: center;
		padding: 15px 0;
	}
	#spread-index1 .popup-invite .van-col{
		text-align: center;
		font-size: 13px;
		color: #7a7a7a;
		padding: 40px 0 20px;
	}
	#spread-index1 .popup-invite img{
		width: 60px;
		height: 60px;
	}
	#spread-index1 .popup-invite .icon-close{
		position: absolute;
		top: 10px;
		right: 10px;
		font-size: 18px;
		color: #7a7a7a;
	}
</style>


// WEBPACK FOOTER //
// src/pages/spread/index.vue