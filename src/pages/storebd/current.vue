<template>
	<div id="storebd-current">
		<public-header title="佣金明细"></public-header>
		<div class="content">
			<van-tabs v-model="active" @click='onChangeStatus'>
				<van-tab v-for="(index,key) in 4" :title="title[index]" :key="key">
					<van-list v-model="records.loading" :finished="records.loaded" v-if="!records.empty" @load="onLoad" :offset="100" :immediate-check="false">
						<div class="current-list">
							<div class="list-block">
								<ul class="list">
									<li class="item-content" v-for="(item, recordIndex) in records.data" :key="recordIndex">
										<router-link to="">
											<div class="item-inner van-hairline--bottom">
												<div class="item-title">
													<div class="item-title-top" v-if="item.trade_type==1">佣金入账</div>
													<div class="item-title-top" v-else-if="item.trade_type==2">申请提现</div>
													<div class="item-title-top" v-else-if="item.trade_type==3">其他变动</div>
													<div class="item-title-bottom">{{item.addtime_cn}}</div>
												</div>
												<div class="item-after">
													<div class="item-title-top" :class="{'color-success': item.fee > 0, 'color-danger': item.fee < 0}">{{item.fee > 0 ? '+' + item.fee : item.fee}}</div>
													<div class="item-title-bottom">¥{{item.amount}}</div>
												</div>
												<van-icon name='right' class="item-inner-icon"></van-icon>
											</div>
										</router-link>
									</li>
								</ul>
							</div>
						</div>
					</van-list>
					<div class="current-list" v-else>
						<div class="no-data">
							<div class="bg"></div>
							<p>暂时没有佣金明细哦～</p>
						</div>
					</div>
				</van-tab>
			</van-tabs>
		</div>
		<transition name="loading">
			<iloading v-if="showPreLoading"></iloading>
		</transition>
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
  				trade_type: 0,
  				refresh: 0,
  				active: 0,
  				now_active: 0,
  				records: {
  					page: 1,
					psize: 10,
					loaded: false,
					loading: false,
					empty: false,
					data:[]
  				},
  				title: {
  					1:'全部',
  					2:'佣金入账',
  					3:'申请提现',
  					4:'其他变动',
  				},
  				showPreLoading: true
  			}
  		},
  		methods: {
			onLoad() {
				if(this.refresh == 1) {
					this.records = {
	  					page: 1,
						psize: 10,
						loaded: false,
						loading: false,
						empty: false,
						data:[]
	  				};
				}
				if(this.records.loaded) {
					return false;
				}
				this.records.loading = true;
				this.util.request({
					url: 'storebd/current',
					data: {
						page: this.records.page,
						psize: this.records.psize,
						trade_type : this.trade_type
					}
				}).then((res) => {
					this.showPreLoading = false;
					let result = res.data.message;
					this.records.data = [...this.records.data, ...result.message.current];
					if(result.message.current.length < this.records.psize) {
						this.records.loaded = true;
						if(!this.records.data.length) {
							this.records.empty = true;
						}
					}
					this.records.page++;
					this.records.loading = false;
					this.now_active = this.active;
					this.refresh = 0;
				})
			},
			onChangeStatus(index, title) {
				if(this.now_active != index) {
					this.refresh = 1;
				}
				this.trade_type = index;
				this.onLoad();
			},
		},
		mounted() {
			this.onLoad();
		}
	}
</script>

<style>
	#storebd-current .content{
		position: fixed;
		top: 46px;
		right: 0;
		left: 0;
		width: 100%;
		background: #f5f5f5;
		overflow-x: hidden;
        overflow-y: scroll;
	}
	#storebd-current .content::-webkit-scrollbar {
        display: none;
    }
    #storebd-current .content .van-tabs .van-tabs__wrap{
    	border-bottom: 1px solid #d0d0d0;
    }
    #storebd-current .content .van-tabs .van-tabs__content .current-list .list-block{
    	margin: 8px 0;
    	font-size: 17px;
    }
    #storebd-current .content .van-tabs .van-tabs__content .current-list .list-block .list{
	    position: relative;
	    padding: 0;
	    margin: 0;
	    list-style: none;
	    background-color: #fff;
    }
    #storebd-current .content .van-tabs .van-tabs__content .current-list .list-block .list .item-content{
		display: -webkit-box;
		display: -ms-flexbox;
		display: -webkit-flex;
		display: flex;
		min-height: 44px;
		-moz-box-sizing: border-box;
		box-sizing: border-box;
		padding-left: 15px;
		-webkit-box-pack: justify;
		-ms-flex-pack: justify;
		-webkit-justify-content: space-between;
		justify-content: space-between;
		-webkit-box-align: center;
		-ms-flex-align: center;
		-webkit-align-items: center;
		align-items: center;
    }

    #storebd-current .content .van-tabs .van-tabs__content .current-list .list-block .list .item-content a{
    	display: inline-block;
    	width: 100%;
    }
    #storebd-current .content .van-tabs .van-tabs__content .current-list .list-block .list .item-content a .item-inner{
	    position: relative;
	    display: -webkit-box;
	    display: -ms-flexbox;
	    display: -webkit-flex;
	    display: flex;
	    width: 100%;
	    min-height: 44px;
	    -moz-box-sizing: border-box;
	    box-sizing: border-box;
	    padding-top: 8px;
	    padding-right: 28px;
	    padding-bottom: 7px;
	    -webkit-box-flex: 1;
	    -ms-flex: 1;
	    -webkit-box-pack: justify;
	    -ms-flex-pack: justify;
	    -webkit-justify-content: space-between;
	    justify-content: space-between;
	    -webkit-box-align: center;
	    -ms-flex-align: center;
	    -webkit-align-items: center;
	    align-items: center;
    }
    #storebd-current .content .van-tabs .van-tabs__content .current-list .list-block .list .item-content a .item-inner .item-inner-icon{
    	position: absolute;
    	top: 22px;
    	right: 10px;
    	font-size: 16px;
    	color: #b2b2b2;
    }
    #storebd-current .content .van-tabs .van-tabs__content .current-list .list-block .list .item-content a .item-inner .item-title{
	    position: relative;
	    max-width: 100%;
	    overflow: hidden;
	    text-overflow: ellipsis;
	    white-space: nowrap;
	    flex-shrink: 1;
    }
    #storebd-current .content .van-tabs .van-tabs__content .current-list .list-block .list .item-content a .item-inner .item-title .item-title-top{
	    font-size: 14px;
	    color: #333;
	    line-height: 21px;
    }
    #storebd-current .content .van-tabs .van-tabs__content .current-list .list-block .list .item-content a .item-inner .item-title .item-title-bottom{
	    font-size: 14px;
	    color: #9A999A;
	    line-height: 21px;
    }
    #storebd-current .content .van-tabs .van-tabs__content .current-list .list-block .list .item-content a .item-inner .item-after{
	    display: inline-block;
	    max-width: 300px;
	    white-space: nowrap;
	    overflow: hidden;
	    text-overflow: ellipsis;
    }
    #storebd-current .content .van-tabs .van-tabs__content .current-list .list-block .list .item-content a .item-inner .item-after .item-title-top{
	    color: #f6383a;
	    font-size: 14px;
	    line-height: 21px;
    }
    #storebd-current .content .van-tabs .van-tabs__content .current-list .list-block .list .item-content a .item-inner .item-after .item-title-top.color-success{
    	color: #4cd964!important;
    }
    #storebd-current .content .van-tabs .van-tabs__content .current-list .list-block .list .item-content a .item-inner .item-after .item-title-bottom{
        color: #9A999A;
	    font-size: 14px;
	    line-height: 21px;
    }
    #storebd-current .content .van-tabs .van-tabs__content .current-list .no-data{
	    padding-top: 30%;
	    text-align: center;
    }
    #storebd-current .content .van-tabs .van-tabs__content .current-list .no-data .bg{
	    display: inline-block;
	    width: 160px;
	    height: 160px;
	    background: url(../../../static/img/no_order.png) no-repeat 0 0;
	    background-size: cover;
    }
    #storebd-current .content .van-tabs .van-tabs__content .current-list .no-data p{
		margin: 0;
	    color: #999;
	    font-size: 18px;
    }
</style>


// WEBPACK FOOTER //
// src/pages/storebd/current.vue