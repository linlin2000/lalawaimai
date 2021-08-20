<template>
	<div id="ordergrant-index">
		<public-header title="详细记录" bgcolor="#ff2d4b"></public-header>
		<public-footer :preLoading="showPreLoading" :menufooter="menufooter"></public-footer>
		<div class="content">
			<div class="grant-list">
				<van-list v-model="loading" v-if="!empty" :finished="loaded" @load="onLoad" :offset="100" :immediate-check="false">
					<div class="grant-item van-hairline--bottom" v-for="item in records" v-if="!empty">
						<div class="item-inner">
							<div class="titles">{{item.mark}}</div>
							<div class="text"><span class="label" :class="{'label-warning': item.css == 'label-warning', 'label-success': item.css == 'label-success', 'label-info': item.css == 'label-info', 'label-primary': item.css == 'label-primary', 'label-danger': item.css == 'label-danger', 'label-default': item.css == 'label-default'}">{{item.text}}</span>{{item.addtime}}</div>
						</div>
						<div class="grant">+{{item.grant}}</div>
					</div>
				</van-list>
				<div class="common-no-con" v-if="empty">
					<img src= "static/img/order_no_con.png" alt="" />
					<p>您还没有奖励记录</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import PublicHeader from '@/components/header'
	import PublicFooter from '@/components/footer'
	export default {
		components: {
			PublicHeader,
			PublicFooter
		},
  		data() {
  			return {
  				showPreLoading:true,
  				records: [],
  				min: 0,
  				loaded: false,
  				loading: false,
  				empty: false,
  				menufooter: {}
  			}
  		},
  		methods: {
			onLoad() {
				if(this.loaded) {
					return false;
				}
				this.loading = true;
				this.util.request({
					url: 'ordergrant/record',
					data: {
						min: this.min,
						menufooter: 1
					},
				}).then((res) => {
					this.showPreLoading = false;
					let result = res.data.message;
					this.records = [...this.records, ...result.message];
					if(!this.records.length) {
						this.loaded = true;
						this.empty = true;
					}
					if(!result.min) {
						this.loaded = true;
					}
					this.loading = false;
					this.min = result.min;
					this.menufooter = window.menufooter;
				})
			},
		},
		mounted() {
			this.onLoad();
		}
	}
</script>

<style>
	#ordergrant-index .content{
		position: fixed;
		top: 46px;
		right: 0;
		left: 0;
		bottom: 50px;
		width: 100%;
		background: #f5f5f5;
		overflow-x: hidden;
        overflow-y: scroll;
	}
	#ordergrant-index .content::-webkit-scrollbar {
        display: none;
    }
	#ordergrant-index .content .grant-list{
		background-color: #fff;
	}
	#ordergrant-index .content .grant-list .grant-item{
		position: relative;
	    display: flex;
	    padding: 10px;
	    align-items: center;
	    overflow: hidden;
	}
	#ordergrant-index .content .grant-list .grant-item .item-inner{
	    width: 100%;
	    overflow: hidden;
	    box-sizing: border-box;
	    -webkit-box-flex: 1;
	    display: block;
	}
	#ordergrant-index .content .grant-list .grant-item .item-inner .titles{
	    font-size: 16px;
    	color: #666;
    	line-height: 26px;
	}
	#ordergrant-index .content .grant-list .grant-item .item-inner .text{
		font-size: 13px;
    	color: #666;
    	line-height: 21px;
	}
	#ordergrant-index .content .grant-list .grant-item .item-inner .text .label{
		display: inline-block;
	    padding: 0 4px;
	    margin: 0 2px;
	    font-size: 12px;
	    color: #fff;
	    background-color: #4cd964;
	    line-height: 19px;
	}
	#ordergrant-index .content .grant-list .grant-item .item-inner .text .label.label-success{
		background-color: #4cd964;
	}
	#ordergrant-index .content .grant-list .grant-item .item-inner .text .label.label-primary{
		background-color: #337ab7;
	}
	#ordergrant-index .content .grant-list .grant-item .item-inner .text .label.label-info{
		background-color: #04ab02;
	}
	#ordergrant-index .content .grant-list .grant-item .item-inner .text .label.label-warning{
		background-color: #ff9326;
	}
	#ordergrant-index .content .grant-list .grant-item .item-inner .text .label.label-danger{
		background-color: #f6383a;
	}
	#ordergrant-index .content .grant-list .grant-item .item-inner .text .label.label-default{
		background-color: #777;
	}
	#ordergrant-index .content .grant-list .grant-item .grant{
	    vertical-align: middle;
	    margin-right: 10px;
	    color: #ff2d4b;
	    font-size: 17px;
	}
	#ordergrant-index .content .grant-list .common-no-con{
	    position: absolute;
	    top: 32%;
	    left: 0;
	    width: 100%;
	    height: 200px;
	    text-align: center;
	    color: #768491;
	    font-size: 16px;
	}
	#ordergrant-index .content .grant-list .common-no-con img{
	    max-width: 25%;
	    vertical-align: middle;
	    border: none;
	}
	#ordergrant-index .content .grant-list .common-no-con p{
		margin:  20px 0;
		line-height: 26px;
		font-size: 17px;
	}
</style>


// WEBPACK FOOTER //
// src/pages/ordergrant/record.vue