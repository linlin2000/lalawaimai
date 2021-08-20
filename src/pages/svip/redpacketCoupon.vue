<template>
	<div id="svip-redpacket">
		<public-header title="会员专属红包"></public-header>
		<public-footer :menufooter="menufooter" :preLoading="showPreLoading"></public-footer>
		<div class="content">
			<div class="table" v-if="filter.items.exchange_cost == -1">
				<div class="use-redpacket">
					<div class="use-redpacket-title">{{month.endday}}前可免费领红包：<span class="num">{{can_exchange}}</span>个</div>
					<div class="use-redpacket-list">
						<template v-for="(item, index) in member_redpackets" >
							<div class="use-redpacket-item active">
								<div class="redpacket-info">
									<div class="price ellipsis">
										<i>¥</i>
										<span>{{item.discount}}</span>
									</div>
									<div class="info">
										<div class="font-14 ellipsis">{{item.title}}</div>
										<div class="font-12 c-gray ellipsis padding-5-t" v-if="item.condition > 0">满{{item.condition}}元</div>
										<div class="font-12 c-gray ellipsis padding-5-t" v-else>无门槛</div>
									</div>
								</div>
							</div>
						</template>
						<div class="use-redpacket-item" v-for="(item, index) in can_exchange" :key="index" v-if="can_exchange > 0">
							<img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNjEiIGhlaWdodD0iNjEiPjxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+PHBhdGggc3Ryb2tlPSIjRjJENDk5IiBzdHJva2Utb3BhY2l0eT0iLjkiIHN0cm9rZS13aWR0aD0iLjUiIGQ9Ik00IC4yNUEzLjc1IDMuNzUgMCAwIDAgLjI1IDR2NTNBMy43NSAzLjc1IDAgMCAwIDQgNjAuNzVoMTUzYTMuNzUgMy43NSAwIDAgMCAzLjc1LTMuNzVWNEEzLjc1IDMuNzUgMCAwIDAgMTU3IC4yNUg0eiIvPjxwYXRoIHN0cm9rZT0iI0YyRDQ5OSIgc3Ryb2tlLW9wYWNpdHk9Ii45IiBzdHJva2Utd2lkdGg9Ii41IiBkPSJNMjYgMGM2IDguMzMzIDkgMTguNSA5IDMwLjVTMzIgNTIuNjY3IDI2IDYxIi8+PHRleHQgZmlsbD0iI0YzRDhBMyIgZm9udC1mYW1pbHk9IlBpbmdGYW5nU0MtTWVkaXVtLCBQaW5nRmFuZyBTQyIgZm9udC1zaXplPSIxMyIgZm9udC13ZWlnaHQ9IjQwMCI+PHRzcGFuIHg9IjYxIiB5PSIzNiI+5b6F6aKG5Y+WPC90c3Bhbj48L3RleHQ+PC9nPjwvc3ZnPg==" alt="">
						</div>
					</div>
				</div>
				<div class="redpacket-title" v-if="!redpackets.empty">
					<div class="text flex">以下专属红包任意领</div>
				</div>
			</div>
			<div class="table" v-else-if="filter.items.exchange_cost == 1">
				<header class="header-bounty">
					<section class="left-header-bounty">
						<span>奖励金</span>
						<i>{{member.svip_credit1}}</i>
						<span>个</span>
					</section>
					<router-link tag="div" :to="util.getUrl({path: '/package/pages/svip/record'})" class="right-header-bounty">
						<span>兑换记录</span>
						<van-icon name='right'></van-icon>
					</router-link>
				</header>
			</div>
			<van-list
				v-model="redpackets.loading"
				:finished="redpackets.loaded"
				@load="onGetRedpackets"
				:offset="100"
				:immediate-check="false"
				v-if="!redpackets.empty"
				class="table"
			>
				<template v-for="(item, index) in redpackets.data" >
					<template v-if="item.sid == 0">
						<section class="redpacket-item">
							<div class="top">
								<div class="left">
									<img src="static/img/svip_redpacket.png" alt="">
									<ul class="main">
										<li class="name">
											<h3>{{item.title}}</h3>
										</li>
										<li class="price">
											<i>¥</i>
											<span>{{item.discount}}</span>
											<div v-if="item.condition == 0">无门槛红包</div>
											<div v-else-if="item.condition > 0">满{{item.condition}}元可用</div>
										</li>
									</ul>
								</div>
								<div class="right">
									<div class="status ellipsis" v-if="filter.items.exchange_cost == 1 && item.exchange_cost > 0">需<i>{{item.exchange_cost}}个</i>奖励金</div>
									<div class="button" @click="onRedpacketShow(item.id)" v-if="filter.items.exchange_cost == 1 && item.exchange_cost > 0">兑换</div>
									<div class="button" @click="onRedpacketShow(item.id)" v-else>领取</div>
								</div>
							</div>
							<footer class="bottom" v-if="1">
								通用红包
							</footer>
							<ul class="item-footer" v-else>
								<li>
									<h4>
										<span>优惠可叠加</span>
									</h4>
									<span>满15减3，满26减10，满45减15，满75减20</span>
								</li>
							</ul>
						</section>
					</template>
					<template v-else-if="item.sid > 0">
						<section class="wrapper-item">
							<div class="item-header">
								<div class="item-left">
									<img :src="item.logo" alt="">
									<ul class="item-main">
										<li class="shop-name">
											<h3>{{item.store_title}}</h3>
											<van-icon name='right'></van-icon>
										</li>
										<li class="meta">评价{{item.score}}分　月售{{item.sailed}}份</li>
										<li class="price">
											<i>¥</i>
											<span>{{item.discount}}</span>
											<div class="padding-5-l ellipsis" v-if="item.condition == 0">满任意金额可用</div>
											<div class="padding-5-l ellipsis" v-else-if="item.condition > 0">满{{item.condition}}元可用</div>
										</li>
									</ul>
								</div>
								<div class="item-right">
									<div class="status ellipsis" v-if="filter.items.exchange_cost == 1 && item.exchange_cost > 0">
										需<i>{{item.exchange_cost}}个</i>奖励金
									</div>
									<div class="item-button" @click="onRedpacketShow(item.id)" v-if="filter.items.exchange_cost == 1 && item.exchange_cost > 0">兑换</div>
									<div class="item-button" @click="onRedpacketShow(item.id)" v-else>领取</div>
								</div>
							</div>
							<ul class="item-footer">
								<li>
									<h4>
										<span>优惠可叠加</span>
									</h4>
									<span v-if="item.activity && item.activity.items && item.activity.items.discount">{{item.activity.items.discount.title}}</span>
									<span v-else>暂无满减活动</span>
								</li>
							</ul>
							<div class="limit-today hide">限今日</div>
						</section>
					</template>
				</template>
				<div class="loaded" v-if="redpackets.loaded && !redpackets.empty">
					<div class="loaded-tips">没有更多了</div>
				</div>
			</van-list>
			<div class="loaded" v-else>
				<div class="loaded-tips">
					暂无可领取红包
				</div>
			</div>
		</div>
		<ul class="wrapper-list">
			<li @click="onToggleExchangeCost(-1)">
				<span class="item" :class="{active: filter.items.exchange_cost == -1}">每月领{{exchange_max}}个红包</span>
			</li>
			<li @click="onToggleExchangeCost(1)">
				<span class="item" :class="{active: filter.items.exchange_cost == 1}">奖励金兑换</span>
			</li>
		</ul>
		<!--领取红包弹出层-->
		<van-popup v-model="popup.redpacketExchange" position="bottom">
			<div class="redpacket-pop">
				<div class="redpacket-pop-title">领取红包</div>
				<div class="redpacket-info">
					<div class="flex redpacket-top">
						<div class="price">
							<i>¥</i>
							<span>{{redpacketActive.discount}}</span>
						</div>
						<div class="redpacket-left">
							<div class="font-15 font-bold ellipsis">{{redpacketActive.title}}</div>
							<div class="font-12 ellipsis padding-5-t c-gray">
								满{{redpacketActive.condition > 0 ? redpacketActive.condition + '元' : '任意金额'}}可用
								<span>，有效期{{redpacketActive.use_days_limit}}天</span>
							</div>
						</div>
					</div>
					<div class="flex redpacket-bottom" v-if="redpacketActive.sid > 0 && redpacketActive.activity && redpacketActive.activity.items && redpacketActive.activity.items.discount">
						<div class="redpacket-tips">优惠可叠加</div>
						<div class="font-12 c-default">{{redpacketActive.activity.items.discount.title}}</div>
					</div>
				</div>
				<div class="hot-goods margin-15-t" v-if="redpacketActive.sid > 0 && redpacketActive.hot_goods && redpacketActive.hot_goods.length > 0">
					<div class="flex-lr">
						<div class="font-14 font-bold">热销商品</div>
						<router-link tag="div" :to="util.getUrl({path: '/pages/store/goods', query: {sid: redpacketActive.sid}})" class="font-12 c-gray">查看更多商品 <span class="icon icon-right font-12"></span></router-link>
					</div>
					<div class="goods-list flex margin-10-t">
						<router-link tag="div" :to="util.getUrl({path: '/pages/store/goodsDetail', query: {sid: redpacketActive.sid, id: item.id}})" class="goods-item" v-for="(item, index) in redpacketActive.hot_goods" :key="item.id">
							<img :src="item.thumb" alt="">
							<div class="goods-title">{{item.title}}</div>
							<div class="goods-price">
								<i>¥</i>
								<span>{{item.price}}</span>
							</div>
						</router-link>
					</div>
				</div>
				<van-button size="normal" class="bg-danger font-16 margin-15-t" :disabled="!islegal || (filter.items.exchange_cost == 1 && redpacketActive.exchange_cost > member.svip_credit1)" block @click="onExchange(redpacketActive)">
					<template v-if="filter.items.exchange_cost == 1 && redpacketActive.exchange_cost > member.svip_credit1">
						余额不足(需{{redpacketActive.exchange_cost}}个奖励金)
					</template>
					<template v-else>
						<template v-if="filter.items.exchange_cost == 1">
							立即兑换(需{{redpacketActive.exchange_cost}}个奖励金)
						</template>
						<template v-else-if="filter.items.exchange_cost == -1">
							立即领取
						</template>
					</template>
				</van-button>
				<div class="bounty">奖励金余额：{{member.svip_credit1}}个</div>
			</div>
		</van-popup>
	</div>
</template>

<script>
	import publicHeader from "@/components/header"
	import publicFooter from "@/components/footer"
	import {getData, setData} from "@/controller/funcCommon"
	export default {
		components: {
			publicHeader,
			publicFooter
		},
		data() {
			return {
				redpackets: {
					page: 1,
					psize: 10,
					empty: false,
					loaded: false,
					loading: false,
					data: []
				},
				can_exchange: 0,
				exchange_max: 0,
				member_redpackets: [],
				member: {},
				month: {},
				redpacketActive: {},
				filter: {
					items: {
						exchange_cost: -1,
					}
				},
				popup: {
					redpacketExchange: false
				},
				showPreLoading: true,
				menufooter: {},
				islegal: false
			}
		},
		methods: {
			onLoad() {
				var that = this;
				getData({
					vue: that,
					url: 'svip/redpacket/list',
					data: {
						page: that.redpackets.page,
						psize: that.redpackets.psize,
						exchange_cost: that.filter.items.exchange_cost,
						menufooter: 1
					},
					success: (res) => {
						that.can_exchange = res.can_exchange;
						that.exchange_max = res.exchange_max;
						that.member = Object.assign(that.member, res.member);
						that.month = Object.assign(that.month, res.month);
						that.member_redpackets = [...res.member_redpackets];
						let redpackets = res.redpackets;
						that.redpackets.data = [...redpackets];
						if(!redpackets || redpackets.length < that.redpackets.psize) {
							that.redpackets.loaded = true;
						}
						if(!that.redpackets.data.length) {
							that.redpackets.empty = true;
						}
						that.redpackets.page++;
						that.islegal = true;
					}
				})
			},
			onGetRedpackets(force) {
				var that = this;
				if(force) {
					that.redpackets = {
						page: 1,
						psize: 10,
						empty: false,
						loaded: false,
						loading: true,
						data: []
					};
				}
				getData({
					vue: that,
					url: 'svip/redpacket/more',
					data: {
						page: that.redpackets.page,
						psize: that.redpackets.psize,
						exchange_cost: that.filter.items.exchange_cost
					},
					success: (res) => {
						let redpackets = res.redpackets;
						that.redpackets.data = [...that.redpackets.data, ...redpackets];
						if(!redpackets || redpackets.length < that.redpackets.psize) {
							that.redpackets.loaded = true;
						}
						if(!that.redpackets.data.length) {
							that.redpackets.empty = true;
						}
						that.redpackets.page++;
						that.redpackets.loading = false;
					}
				})
			},
			onToggleExchangeCost(value) {
				var that = this;
				if(value == that.filter.items.exchange_cost) {
					return;
				} else {
					that.filter.items.exchange_cost = value;
				}
			},
			onTogglePopup(key) {
				var that = this;
				that.popup[key] = !that.popup[key];
			},
			onRedpacketShow(id){
				var that = this;
				getData({
					vue: that,
					url: 'svip/redpacket/redpacket',
					data: {
						id: id
					},
					success: (res) => {
						that.redpacketActive = that.util.extend(that.redpacketActive, res.redpacket)
						that.onTogglePopup('redpacketExchange');
					}
				})
			},
			onExchange(redpacket) {
				var that = this;
				if(!that.islegal) {
					return;
				}
				that.islegal = false;
				setData({
					vue: that,
					url: 'svip/redpacket/exchange',
					data: {
						id: redpacket.id,
						exchange_cost: that.filter.items.exchange_cost
					},
					success: (res) => {
						let message = '领取成功';
						if(that.filter.items.exchange_cost == 1) {
							message = '兑换成功';
						}
						that.util.$toast(message);
						that.can_exchange = res.can_exchange;
						if(res.member_redpackets) {
							that.member_redpackets = [...res.member_redpackets];
						}
						that.member.svip_credit1 = res.svip_credit1;
						that.onTogglePopup('redpacketExchange');
						that.islegal = true;
					},
					fail: (res) => {
						that.util.$toast(res);
						that.onTogglePopup('redpacketExchange');
						that.islegal = true;
					}
				})
			}
		},
		mounted() {
			if(this.$route.query && this.$route.query.exchange_cost) {
				this.filter.items.exchange_cost = this.$route.query.exchange_cost
			}
			this.onLoad()
		},
		watch: {
			filter: {
				handler(newValue, oldValue) {
					this.onGetRedpackets(true)
				},
				deep: true
			}
		}
	}
</script>

<style>
	#svip-redpacket #public-header .van-nav-bar{
		background-color: #272320!important;
	}
	#svip-redpacket .content{
		top: 86px!important;
	}
	#svip-redpacket .wrapper-list{
		display: flex;
		width: 100%;
		height: 40px;
		background: #272320;
		position: absolute;
		top: 46px;
		left: 0;
		right: 0;
		z-index: 1;
	}
	#svip-redpacket .wrapper-list li{
		display: -webkit-flex;
		display: flex;
		-webkit-flex: 1;
		flex: 1;
		-webkit-align-items: center;
		align-items: center;
		-webkit-justify-content: center;
		justify-content: center;
		height: 100%;
	}
	#svip-redpacket .wrapper-list li .item{
		padding: 7px 0 5px;
		border-bottom: 2px solid transparent;
		color: #fff;
		font-size: 14px;
		line-height: 16px;
		opacity: .7;
	}
	#svip-redpacket .wrapper-list li .item.active{
		border-color: #fff;
		font-weight: 700;
		opacity: 1;
	}
	/*每月领红包样式*/
	#svip-redpacket .content .table{
		padding: 0 15px;
	}
	#svip-redpacket .content .table .use-redpacket{
		margin: 15px 0;
		padding: 0 10px;
		border-radius: 8px;
		box-shadow: 0 2px 4px 0 rgba(0,0,0,.03);
		border: 1px solid rgba(0,0,0,.08);
		background-color: #fff;
	}
	#svip-redpacket .content .table .use-redpacket .use-redpacket-title{
		font-size: 13px;
		padding: 10px 0;
		color: #666;
	}
	#svip-redpacket .content .table .use-redpacket .use-redpacket-title .num{
		font-size: 22px;
		font-weight: 500;
		color: #333;
	}
	#svip-redpacket .content .table .use-redpacket .use-redpacket-list{
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		padding-bottom: 8px;
	}
	#svip-redpacket .content .table .use-redpacket .use-redpacket-item{
		position: relative;
		width: 50%;
		height: 60px;
		margin-bottom: 6px;
		border-radius: 2px;
	}
	#svip-redpacket .content .table .use-redpacket .use-redpacket-item:nth-child(2n) {
		padding-left: 2px;
	}
	#svip-redpacket .content .table .use-redpacket .use-redpacket-item:nth-child(2n-1) {
		padding-right: 2px;
	}
	#svip-redpacket .content .table .use-redpacket .use-redpacket-item img{
		width: 100%;
		height: 100%;
	}
	#svip-redpacket .content .table .use-redpacket .use-redpacket-item .redpacket-info{
		display: flex;
		width: 100%;
		padding: 15px 10px;
		overflow: hidden;
		background-color: #fef9f0;
		border: .5px solid rgba(64,33,10,.03);
	}
	#svip-redpacket .content .table .use-redpacket .use-redpacket-item .redpacket-info .price{
		width: 40%;
		overflow: hidden;
		font-weight: bold;
		color: #333;
	}
	#svip-redpacket .content .table .use-redpacket .use-redpacket-item .redpacket-info .price i{
		font-style: normal;
		font-size: 12px;
		line-height: 17px;
		float: left;
	}
	#svip-redpacket .content .table .use-redpacket .use-redpacket-item .redpacket-info .price span{
		margin-right: 5px;
		font-size: 36px;
		line-height: 30px;
	}
	#svip-redpacket .content .table .use-redpacket .use-redpacket-item .redpacket-info .info{
		width: 60%;
	}
	#svip-redpacket .content .table .redpacket-title{
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 15px;
	}
	#svip-redpacket .content .table .redpacket-title .text{
		font-size: 13px;
		font-weight: 600;
		color: #333;
	}
	#svip-redpacket .content .table .redpacket-title .text:before,#svip-redpacket .content .table .redpacket-title .text:after{
		display: block;
		margin: 0 3.5px;
		width: 23px;
		height: 10px;
		background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAUCAYAAADyWA/8AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsSAAALEgHS3X78AAAD20lEQVRIx8WWbWiWVRjHf/9MN+fmZDk3l65trU1MaKRhIycuY8pCJvYmRrB9sTIKeiFGlC0SjMIioheiksLIJEcZQ33i0UKWLYUVmtiYY/kyxbmpm61tOa4+3O+PBeEt7Hx4nvu5znOu8zv/87/uc9Sxv2k90AgME7QLgLnPI8BQqG9TWWXTF4xzE0DHT680CjaCg2tK+QNg5gfGMB4sq3y5edzBATrbNjxr2BsgCcMAIXCf/QFOxyhoZenCF3eOOzjAsQMbn8DsHZAcQpwdcJfgfJgXHhKsuPmOF/aMOzhA18HX10p8YGaSwEzI1d/kLMEMnD4bEqopXvB867iDA3S3b6rH9BEwwVceHPP7pvczXMS4p+j2Zw6m5unY31QP5AF/A5fc8GVg0H0eAwaAI2WVTT2xwQGO//r2GtBnwASP1NU7NNRfVB+ouvC2pw6Fc3S2vTrHsKRMBd54FFS/MEwCrAeouWXh+t9igwOcOPTeAxKfY0yMyKyQXcDblF7E4lnz1h0N5+g68FopIgkUOsDmb5w5DvQKvg+oLVnQ+HNscICeIx+uBL40NElBYQYDLZgZOAm2pGDu2mPhHH/88lYRsAdUDOYsOoXCFWLQoK6o4um9scEBzvz+Sa2h7YJ0c8kVGh0UKwi6TVTNLG84Gc5x6vD7s4HvDMqDqCc5IdcxDDw0a97jO2KDA5zt3LIMoxnICMS2SO36GU2dJlucV/rI6YgARzfnIyUxm+vN7FhGhBMJLhtqyC+v3xIbHOBc19Zq4FtgSqTDcCSPHFUcBu6eXrK6NyVHLpAAKiKeC9e889sQT04vWf1ubHCA/u7tixAtwFR/Ys8/YRmdUDuiOuem+y6Gc5w//nUOkBDMR84B59jPfAG8K4bQS9MK6zbEBge4cOKbO4FdQHaqQf+ltQE102bXDYSDg6d3ZQM7gcqIAGELBX9/E3gua+ZyP3RV4AADp1rmIxIYOZFZw9cC868KP2BWO/XGe8O3TIZ692aBtQhV2RW7h1/xkjCzj0GPZsyoHosFDnDpzO4KjIRJufKulQp9471xBFgCWJGZv2w0nGOkf18Gph0GS71FB/yKLkZ8BXo4PWfRaCxwgD/PJm/FSCLLw/VqsNWOZ+Wdmk5h3z9lxtIU+B8nI2sGlvuFHn7Hhk5ckyVkWhUbHOCvc9/PMSMpVJD6foxcEByWbRhrJucuGYvAn2+dhLEOkeaesNnAdW53JjDR9Uc6Rvs1AQcY7ttXCpYEFQbI/5n+U6Ah/YYq+3/Zr2zXDBxgpL+1GNiMyHRVSyM4sK5HZDlbIIFtAx5Ly7nrquD/AdLdhfjY+4ZKAAAAAElFTkSuQmCC);
		background-position: 0 0;
		background-size: 100% auto;
		background-repeat: no-repeat;
		content: "";
	}
	#svip-redpacket .content .table .redpacket-title .text:after{
		transform: scaleX(-1);
	}

	#svip-redpacket .content .table .redpacket-item{
		position: relative;
		margin-bottom: 8px;
		border-radius: 2px;
		background: #fff;
	}
	#svip-redpacket .content .table .redpacket-item .top{
		display: -webkit-flex;
		display: flex;
		-webkit-justify-content: space-between;
		justify-content: space-between;
		padding: 12px 12px 8px;
		width: 100%;
	}
	#svip-redpacket .content .table .redpacket-item .top .left{
		display: -webkit-flex;
		display: flex;
		width: 75%;
	}
	#svip-redpacket .content .table .redpacket-item .top .left img{
		display: block;
		margin: 1px 10px 1px 0;
		width: 72px;
		height: 72px;
		border: 1px solid #eee;
		border-radius: 2px;
	}
	#svip-redpacket .content .table .redpacket-item .top .left .main{
		display: -webkit-flex;
		display: flex;
		-webkit-flex-direction: column;
		flex-direction: column;
		-webkit-justify-content: space-between;
		justify-content: space-between;
		width: 62%;
	}
	#svip-redpacket .content .table .redpacket-item .top .left .main .name{
		display: -webkit-flex;
		display: flex;
		-webkit-align-items: center;
		align-items: center;
		line-height: 18px;
		width: 100%;
	}
	#svip-redpacket .content .table .redpacket-item .top .left .main .name h3{
		overflow: hidden;
		color: #333;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-weight: 700;
		font-size: 14px;
	}
	#svip-redpacket .content .table .redpacket-item .top .left .main .price{
		display: -webkit-flex;
		display: flex;
		-webkit-align-items: baseline;
		align-items: baseline;
		width: 100%;
	}
	#svip-redpacket .content .table .redpacket-item .top .left .main .price i{
		padding-bottom: 1px;
		color: #fc3a2c;
		font-weight: 500;
		font-style: normal;
		font-size: 16px;
	}
	#svip-redpacket .content .table .redpacket-item .top .left .main .price span{
		color: #fc3a2c;
		font-weight: 500;
		font-size: 36px;
	}
	#svip-redpacket .content .table .redpacket-item .top .left .main .price div{
		color: #666;
		font-size: 12px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	#svip-redpacket .content .table .redpacket-item .top .right{
		display: -webkit-flex;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		justify-content: center;
		width: 22.7%;
	}
	#svip-redpacket .content .table .redpacket-item .top .right .button{
		display: flex;
		padding: 5px 15px;
		border-radius: 85px;
		background-image: linear-gradient(90deg,#faeaa7,#e0c470);
		font-size: 12px;
	}
	#svip-redpacket .content .table .redpacket-item .bottom{
		display: -webkit-flex;
		display: flex;
		-webkit-align-items: center;
		align-items: center;
		margin: 0 12px;
		padding: 0 2px;
		line-height: 28px;
		border-top: 1px dashed #eee;
		color: #666;
		white-space: nowrap;
		font-size: 12px;
	}
	#svip-redpacket .content .table .redpacket-item .bottom .bottom-city{
		color: #ff5339;
	}
	#svip-redpacket .content .table .redpacket-item .bottom .van-icon-right{
		color: #ff5339;
		padding-top: 2px;
	}
	#svip-redpacket .content .table .wrapper-item{
		position: relative;
		margin-bottom: 8px;
		border-radius: 3px;
		background: #fff;
	}
	#svip-redpacket .content .table .wrapper-item .limit-today{
		position: absolute;
		right: -1px;
		top: -1px;
		text-align: center;
		border-radius: 2px;
		background-color: #f76e4d;
		color: #fff;
		font-size: 12px;
		padding: 1px 2px;
	}
	#svip-redpacket .content .table .wrapper-item .item-header{
		display: -webkit-flex;
		display: flex;
		-webkit-justify-content: space-between;
		justify-content: space-between;
		padding: 12px 12px 8px;
		width: 100%;
	}
	#svip-redpacket .content .table .wrapper-item .item-header .item-left{
		display: -webkit-flex;
		display: flex;
		width: 75%;
	}
	#svip-redpacket .content .table .wrapper-item .item-header .item-left img{
		display: block;
		margin:1px 10px 1px 0;
		width: 72px;
		height: 72px;
		border: 1px solid #eee;
		border-radius: 2px;
	}
	#svip-redpacket .content .table .wrapper-item .item-header .item-left .item-main{
		display: -webkit-flex;
		display: flex;
		-webkit-flex-direction: column;
		flex-direction: column;
		-webkit-justify-content: space-between;
		justify-content: space-between;
		width: 62%;
	}
	#svip-redpacket .content .table .wrapper-item .item-header .item-left .item-main .shop-name{
		display: -webkit-flex;
		display: flex;
		-webkit-align-items: center;
		align-items: center;
		line-height: 18px;
		width: 100%;
	}
	#svip-redpacket .content .table .wrapper-item .item-header .item-left .item-main .shop-name h3{
		overflow: hidden;
		color: #333;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-weight: 700;
		font-size: 14px;
	}
	#svip-redpacket .content .table .wrapper-item .item-header .item-left .item-main .meta{
		display: -webkit-flex;
		display: flex;
		margin-top: 2.5px;
		color: #999;
		font-size: 12px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		width: 100%;
	}
	#svip-redpacket .content .table .wrapper-item .item-header .item-left .item-main .shop-name .van-icon-right{
		color: #666;
	}
	#svip-redpacket .content .table .wrapper-item .item-header .item-left .item-main .price{
		display: -webkit-flex;
		display: flex;
		-webkit-align-items: baseline;
		align-items: baseline;
		width: 100%;
	}
	#svip-redpacket .content .table .wrapper-item .item-header .item-left .item-main .price i{
		padding-bottom: 1px;
		color: #fc3a2c;
		font-weight: 500;
		font-style: normal;
		font-size: 16px;
	}
	#svip-redpacket .content .table .wrapper-item .item-header .item-left .item-main .price span{
		color: #fc3a2c;
		font-weight: 500;
		font-size: 36px;
	}
	#svip-redpacket .content .table .wrapper-item .item-header .item-left .item-main .price div{
		color: #666;
		font-size: 12px;
	}
	#svip-redpacket .content .table .wrapper-item .item-header .item-right{
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		justify-content: center;
		width: 22.7%;
	}
	#svip-redpacket .content .table .wrapper-item .item-header .item-right .item-button{
		display: flex;
		padding: 5px 15px;
		border-radius: 85px;
		background-image: linear-gradient(90deg,#faeaa7,#e0c470);
		font-size: 12px;
	}
	#svip-redpacket .content .table .wrapper-item .item-footer{
		position: relative;
		margin: 0 12px;
		padding: 5px 2px;
		color: #666;
		font-size: 12px;
	    border-top: 1px dashed #eee;
	}
	#svip-redpacket .content .table .wrapper-item .item-footer li{
		display: -webkit-flex;
		display: flex;
		-webkit-align-items: center;
		align-items: center;
		line-height: 18px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	#svip-redpacket .content .table .wrapper-item .item-footer li h4{
		display: -webkit-flex;
		display: flex;
		-webkit-align-items: center;
		align-items: center;
		-webkit-justify-content: center;
		justify-content: center;
		margin-right: 4px;
		padding: 0 5px;
		line-height: 16px;
		border-radius: 1px;
		background: #ffe7e0;
		color: #fc3a2c;
	}
	#svip-redpacket .content .table .wrapper-item .item-footer li span{
		overflow: hidden;
		text-overflow: ellipsis;
	}
	/*奖励金兑换样式*/
	#svip-redpacket .content .table .header-bounty{
		display: -webkit-flex;
		display: flex;
		-webkit-align-items: center;
		align-items: center;
		-webkit-justify-content: space-between;
		justify-content: space-between;
		line-height: 40px;
		width: 100%;
	}
	#svip-redpacket .content .table .header-bounty .left-header-bounty{
		display: -webkit-flex;
		display: flex;
		-webkit-align-items: center;
		align-items: center;
		color: #262626;
		font-size: 14px;
	}
	#svip-redpacket .content .table .header-bounty .left-header-bounty span{
		color: #262626;
		font-size: 14px;
	}
	#svip-redpacket .content .table .header-bounty .left-header-bounty i{
		margin:0 7px;
		color: #fe3523;
		font-style: normal;
	}
	#svip-redpacket .content .table .header-bounty .right-header-bounty{
		display: -webkit-flex;
		display: flex;
		-webkit-align-items: center;
		align-items: center;
		color: #9b803f;
		font-size: 12px;
	}
	#svip-redpacket .content .table .header-bounty .right-header-bounty span{
		color: #9b803f;
		font-size: 12px;
	}
	#svip-redpacket .content .table .redpacket-item .top .right .status{
		margin-bottom: 8px;
		color: #535353;
		font-size: 12px;
	}
	#svip-redpacket .content .table .redpacket-item .top .right .status i{
		color: #fe3523;
		font-style: normal;
	}
	#svip-redpacket .content .table .redpacket-item .top .right .button.active{
		background: transparent;
		border: 1px dashed currentColor;
		color: #e2c773;
		padding: 9.2% 18.5%;
	}
	#svip-redpacket .content .table .redpacket-item .item-footer{
		position: relative;
		margin: 0 12px;
		padding: 5px 2px;
		color: #666;
		font-size: 12px;
	    border-top: 1px dashed #eee;
	}
	#svip-redpacket .content .table .redpacket-item .item-footer li{
		display: -webkit-flex;
		display: flex;
		-webkit-align-items: center;
		align-items: center;
		line-height: 18px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	#svip-redpacket .content .table .redpacket-item .item-footer li h4{
		display: -webkit-flex;
		display: flex;
		-webkit-align-items: center;
		align-items: center;
		-webkit-justify-content: center;
		justify-content: center;
		margin-right: 4px;
		padding: 0 5px;
		line-height: 16px;
		border-radius: 1px;
		background: #ffe7e0;
		color: #fc3a2c;
	}
	#svip-redpacket .content .table .redpacket-item .item-footer li span{
		overflow: hidden;
		text-overflow: ellipsis;
	}
	#svip-redpacket .content .table .wrapper-item .item-header .item-right .status{
		margin-bottom: 8px;
		color: #535353;
		font-size: 12px;
	}
	#svip-redpacket .content .table .wrapper-item .item-header .item-right .status i{
		color: #fe3523;
		font-style: normal;
	}
	/*领取红包弹出层样式*/
	#svip-redpacket .redpacket-pop{
		width: 100%;
		padding: 15px 10px;
		background-color: #f5f5f5;
	}
	#svip-redpacket .redpacket-pop .redpacket-pop-title{
		margin-bottom: 15px;
		color: #333;
		text-align: center;
		font-weight: 700;
		font-size: 17px;
	}
	#svip-redpacket .redpacket-pop .redpacket-info{
		padding: 0 10px;
		border: 1px solid #f5d9d5;
		border-radius: 2px;
		background: #fff;
	}
	#svip-redpacket .redpacket-pop .redpacket-info .redpacket-top{
		padding: 20px 0;
	}
	#svip-redpacket .redpacket-pop .redpacket-info .redpacket-top .price{
		align-items: baseline;
		justify-content: center;
		padding: 0 25px;
		color: #ff2d4b;
	}
	#svip-redpacket .redpacket-pop .redpacket-info .redpacket-top .price i{
		font-weight: 500;
		font-style: normal;
		font-size: 16px;
		margin-right: -5px;
	}
	#svip-redpacket .redpacket-pop .redpacket-info .redpacket-top .price span{
		font-weight: 600;
		font-size: 32px;
	}
	#svip-redpacket .redpacket-pop .redpacket-info .redpacket-top .redpacket-left{
		width: 65%;
	}
	#svip-redpacket .redpacket-pop .redpacket-info .redpacket-bottom{
		padding: 5px 0;
		border-top: 1px dashed #f5d9d5;
	}
	#svip-redpacket .redpacket-pop .redpacket-info .redpacket-bottom .redpacket-tips{
		margin-right: 5px;
		padding: 2px 5px;
		border-radius: 1px;
		background-color: #ffe7e0;
		color: #ff5339;
		font-size: 12px;
		white-space: nowrap;
	}
	#svip-redpacket .redpacket-pop .hot-goods .goods-item:last-child{
		margin-right: 0;
	}
	#svip-redpacket .redpacket-pop .hot-goods .goods-item{
		width: 33%;
		background-color: #fff;
		margin-right: 10px;
	}
	#svip-redpacket .redpacket-pop .hot-goods .goods-item img{
		width: 100%;
		height: 115px;
		border: none;
	}
	#svip-redpacket .redpacket-pop .hot-goods .goods-item .goods-title{
		padding: 10px 10px 5px;
		font-size: 13px;
		font-weight: 600;
	}
	#svip-redpacket .redpacket-pop .hot-goods .goods-item .goods-price{
		display: flex;
		align-items: baseline;
		color: #ff3618;
		padding: 0 10px 10px;
	}
	#svip-redpacket .redpacket-pop .hot-goods .goods-item .goods-price i{
		font-style: normal;
		font-size: 12px;
		font-weight: 600;
	}
	#svip-redpacket .redpacket-pop .hot-goods .goods-item .goods-price span{
		font-size: 16px;
		font-weight: 600;
	}
	#svip-redpacket .redpacket-pop .bounty{
		text-align: center;
		font-size: 13px;
		color: #999;
		margin-top: 15px;
	}
</style>


// WEBPACK FOOTER //
// src/pages/svip/redpacketCoupon.vue