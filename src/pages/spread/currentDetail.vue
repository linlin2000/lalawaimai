<template>
	<div id="spread-currentDetail">
		<public-header title="佣金明细详情"></public-header>
		<div class="content">
			<div class="current-detail">
				<div class="current-head van-hairline--bottom">
					<div class="price">金额</div>
					<div class="number">{{detail.fee}}</div>
				</div>
				<div class="current-body">
					<div class="current-item">
						<div class="left">类型</div>
						<div class="right">{{detail.trade_type_cn}}</div>
					</div>
					<div class="current-item">
						<div class="left">申请时间</div>
						<div class="right">{{detail.addtime}}</div>
					</div>
					<div class="current-item">
						<div class="left">详细信息</div>
						<div class="right">{{detail.remark}}</div>
					</div>
				</div>
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
				detail: {}
			}
		},
		methods: {
			onLoad() {
				this.util.request({
					url: 'spread/current/detail',
					data: {
						id: this.id
					}
				}).then((res) => {
					let result = res.data.message;
					if(result.errno) {
						this.util.$toast(result.message);
						return false;
					}
					this.detail = result.message.detail;
				})
			}
		},
		created() {
			if(this.$route.query.id) {
				this.id = this.$route.query.id;
			} else {
				this.util.$toast('参数错误')
				return false;
			}
		},
		mounted() {
			this.onLoad();
		}
	}
</script>

<style>
	#spread-currentDetail .content{
		position: fixed;
		top: 46px;
		right: 0;
		left: 0;
		width: 100%;
		background: #f5f5f5;
		overflow-x: hidden;
        overflow-y: scroll;
	}
	#spread-currentDetail .content::-webkit-scrollbar {
        display: none;
    }
	#spread-currentDetail .content .current-detail{
		position: relative;
		background-color: #fff;
	}
	#spread-currentDetail .content .current-detail .current-head{
		position: relative;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: center;
		padding: 10px 15px;
		line-height: 50px;
	}
	#spread-currentDetail .content .current-detail .current-head .price{
		min-width: 80px;
		font-size: 17px;
		color: #999;
		text-align: justify;
		text-align-last: justify;
	}
	#spread-currentDetail .content .current-detail .current-head .number{
		font-style: normal;
		font-size: 26px;
	}
	#spread-currentDetail .content .current-detail  .current-body{
		padding: 10px 15px;
		font-size: 14px;
		color: #999;
		line-height: 1.7;
	}
	#spread-currentDetail .content .current-detail  .current-body .current-item{
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: center;
	}
	#spread-currentDetail .content .current-detail  .current-body .current-item .left{
		min-width: 80px;
		color: #999;
		text-align: justify;
		text-align-last: justify;
	}
	#spread-currentDetail .content .current-detail  .current-body .current-item .right{
		max-width: 70%;
		font-size: 14px;
		color: #999;
		text-align: right;
	}
</style>


// WEBPACK FOOTER //
// src/pages/spread/currentDetail.vue