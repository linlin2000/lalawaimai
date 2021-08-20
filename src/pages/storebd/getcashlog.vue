<template>
	<div id="getcash-application-index">
		<public-header title="提现明细"></public-header>
		<div class="content">
			<van-tabs v-model="active" swipeable @click='onChangeStatus'>
				<van-tab v-for="(index,key) in 4" :title="title[index]" :key="key">
					<van-list v-model="records.loading" :finished="records.loaded" v-if="!records.empty" @load="onLoad" :offset="100" :immediate-check="false">
						<div class="current-list">
							<div class="list-block">
								<ul class="list">
									<li class="item-content" v-for="(item, itemIndex) in records.data" :key="itemIndex">
										<router-link to="">
											<div class="item-inner van-hairline--bottom">
												<div class="item-title">
													<div class="code">编号: {{item.trade_no}}</div>
													<div class="commission">申请佣金:{{item.get_fee}}实际金额:{{item.final_fee}},个人所得税:{{item.take_fee}}元</div>
													<div class="time">申请时间:{{item.addtime_cn}}</div>
												</div>
												<div class="item-after">
													<div>+{{item.status == 3 ? item.get_fee : item.final_fee}}</div>
													<div v-if="item.status == 1">已成功</div>
													<div v-if="item.status == 2">申请中</div>
													<div v-if="item.status == 3">已撤销</div>
												</div>
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
							<p>暂时没有提现明细哦～</p>
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
  				status: 0,
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
  					1:'所有',
  					2:'申请中',
  					3:'提现成功',
  					4:'已撤销',
  				},
  				showPreLoading: true
  			}
  		},
  		computed: {

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
					url: 'storebd/getcash/index',
					data: {
						page: this.records.page,
						psize: this.records.psize,
						status : this.status
					}
				}).then((res) => {
					this.showPreLoading = false;
					let result = res.data.message;
					this.records.data = [...this.records.data, ...result.message.records];
					if(result.message.records.length < this.records.psize) {
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
				this.status = index;
				this.onLoad();
			},
		},
		mounted() {
			this.onLoad();
		}
	}
</script>

<style>
	#getcash-application-index .content{
		position: fixed;
		top: 46px;
		right: 0;
		left: 0;
		width: 100%;
		background: #f5f5f5;
		overflow-x: hidden;
        overflow-y: scroll;
	}
	#getcash-application-index .content::-webkit-scrollbar {
        display: none;
    }
    #getcash-application-index .content .van-tabs .van-tabs__wrap{
    	border-bottom: 1px solid #d0d0d0;
    }
    #getcash-application-index .content .van-tabs .van-tabs__content .current-list .list-block{
    	margin: 8px 0;
    	font-size: 17px;
    }
    #getcash-application-index .content .van-tabs .van-tabs__content .current-list .list-block .list{
	    position: relative;
	    padding: 0;
	    margin: 0;
	    list-style: none;
	    background-color: #fff;
    }
    #getcash-application-index .content .van-tabs .van-tabs__content .current-list .list-block .list .item-content{
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

    #getcash-application-index .content .van-tabs .van-tabs__content .current-list .list-block .list .item-content a{
    	display: inline-block;
    	width: 100%;
    }
    #getcash-application-index .content .van-tabs .van-tabs__content .current-list .list-block .list .item-content a .item-inner{
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
	    padding-right: 15px;
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
    #getcash-application-index .content .van-tabs .van-tabs__content .current-list .list-block .list .item-content a .item-inner .item-title{
	    position: relative;
	    max-width: 100%;
	    overflow: hidden;
	    text-overflow: ellipsis;
	    white-space: nowrap;
	    flex-shrink: 1;
    }
    #getcash-application-index .content .van-tabs .van-tabs__content .current-list .list-block .list .item-content a .item-inner .item-title .code{
	    color: #999;
	    font-size: 13px;
	    line-height: 19px;
    }
    #getcash-application-index .content .van-tabs .van-tabs__content .current-list .list-block .list .item-content a .item-inner .item-title .commission{
	    font-size: 12px;
	    line-height: 18px;
	    color: #3d4145;
    }
    #getcash-application-index .content .van-tabs .van-tabs__content .current-list .list-block .list .item-content a .item-inner .item-title .time{
	    font-size: 12px;
	    line-height: 18px;
	    color: #3d4145;
    }
    #getcash-application-index .content .van-tabs .van-tabs__content .current-list .list-block .list .item-content a .item-inner .item-after{
	    border-left: 1px solid #eee;
	    max-height: none;
	    text-align: right;
	    padding-left: 6px;
	    color: #999;
	    font-size: 12px;
	    overflow: hidden;
	    text-overflow: ellipsis;
	    white-space: nowrap;
	    margin-left: 0;
    }
    #getcash-application-index .content .van-tabs .van-tabs__content .current-list .list-block .list .item-content a .item-inner .item-after div{
    	line-height: 18px;
    }
    #getcash-application-index .content .van-tabs .van-tabs__content .current-list .no-data{
	    padding-top: 30%;
	    text-align: center;
    }
    #getcash-application-index .content .van-tabs .van-tabs__content .current-list .no-data .bg{
	    display: inline-block;
	    width: 160px;
	    height: 160px;
	    background: url(../../../static/img/no_order.png) no-repeat 0 0;
	    background-size: cover;
    }
    #getcash-application-index .content .van-tabs .van-tabs__content .current-list .no-data p{
		margin: 0;
	    color: #999;
	    font-size: 18px;
    }
</style>


// WEBPACK FOOTER //
// src/pages/storebd/getcashlog.vue