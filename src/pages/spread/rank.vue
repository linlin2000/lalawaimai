<template>
	<div id="spread-rank">
		<public-header title="佣金排行榜"></public-header>
		<public-footer :preLoading="showPreLoading" :menufooter="menufooter"></public-footer>
		<div class="content">
			<div class="banner">
				<div class="avatar">
					<img :src="member.avatar" alt="">
				</div>
				<div class="no-gutter">
					<div class="col-33">
						<div class="titles">累积佣金</div>
						<div class="days" v-if="rank.type == 0">{{final_fee}}元</div>
						<div class="days" v-else>{{count_final_fee}}元</div>
					</div>
					<div class="col-33">
						<div class="titles">{{member.nickname}}</div>
					</div>
					<div class="col-33">
						<div class="titles">佣金排名</div>
						<div class="days" v-if="rank.type == 2 || (rank.type != 2 && count > 301)">暂未上榜</div>
						<div class="days" v-else>第{{count}}名</div>
					</div>
				</div>
			</div>
			<div class="ranking-content">
				<div class="ranking-list">
					<div class="list-title">
						<div class="col">排名</div>
						<div class="col">昵称</div>
						<div class="col">累计佣金</div>
					</div>
					<van-list v-model="list.loading" :finished="list.loaded" v-if="!list.empty" @load="onLoad" :offset="100" :immediate-check="false">
						<div class="list-item-content">
							<div class="list-item" v-for="(item, index) in list.data" :key="index">
								<div class="col" v-if="index + 1 < 4">
									<img :src="'static/img/medal-' + (index + 1) + '.png'" alt=""/>
								</div>
								<div class="col" v-if="index + 1 > 3">
									{{index + 1}}
								</div>
								<div class="col clearfix">
									<div class="avatar">
										<img :src="item.avatar" alt="">
									</div>
									<div class="nickname">{{item.nickname}}</div>
								</div>
								<div class="col" v-if="rank.type == 2">¥{{item.commission}}</div>
								<div class="col" v-else>¥{{item.final_fee}}</div>
							</div>
						</div>
					</van-list>
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
			PublicFooter,
		},
  		data() {
  			return {
  				list: {
  					min: 0,
					loaded: false,
					loading: false,
					empty: false,
					data:[]
  				},
  				rank: {},
  				member: {},
  				count: 0,
  				count_final_fee: 0,
  				final_fee: 0,
  				showPreLoading: true,
  				menufooter: {}
  			}
  		},
  		methods: {
			onLoad() {
				if(this.list.loaded) {
					return false;
				}
				this.list.loading = true;
				this.util.request({
					url: 'spread/rank',
					data: {
						menufooter: 1,
						min: this.list.min,
					}
				}).then((res) => {
					let result = res.data.message.message;
					this.rank = result.rank;
					this.member = result.member;
					this.count = result.count;
					this.count_final_fee = result.count_final_fee;
					this.final_fee = result.final_fee;
					this.list.data = [...this.list.data, ...result.list];
					if(!this.list.data.length) {
						this.list.empty = true;
					}
					this.list.loading = false;
					this.list.min = res.data.message.min;
					if(!this.list.min) {
						this.list.loaded = true;
					}
					this.showPreLoading = false;
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
	#spread-rank .content{
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
	#spread-rank .content::-webkit-scrollbar {
        display: none;
    }
    #spread-rank .content .banner{
		padding: 4px 0;
	    text-align: center;
	    color: #fff;
	    background: url(../../../static/img/bg-mypage.png) no-repeat center center;
	    background-size: cover;
	    position: relative;
    }
    #spread-rank .content .banner .avatar img{
	    width: 55px;
	    height: 55px;
	    border-radius: 100%;
	    border: 2px solid #fff;
    }
    #spread-rank .content .banner .no-gutter{
    	overflow: hidden;
    }
    #spread-rank .content .banner .no-gutter .col-33{
	    width: 33.333333333333336%;
	    margin: 0;
	    float: left;
    }
    #spread-rank .content .banner .no-gutter .col-33 .titles{
    	font-size: 12px;
    	line-height: 18px;
    }
    #spread-rank .content .banner .no-gutter .col-33 .days{
    	font-size: 17px;
    	line-height: 25px;
    }
    #spread-rank .content .ranking-content{
		padding: 0 10px;
	    margin-top: 10px;
	    margin-bottom: 20px;
    }
    #spread-rank .content .ranking-content .ranking-list{   	
		background-color: #fff;
	    border-radius: 6px;
    }
    #spread-rank .content .ranking-content .ranking-list .list-title{
    	overflow: hidden;
    }
    #spread-rank .content .ranking-content .ranking-list .list-title .col:first-child{
	    float: left;
	    width: 20%;
	    text-align: center;
	    font-size: 14px;
	    line-height: 50px;
    }
    #spread-rank .content .ranking-content .ranking-list .list-title .col:nth-child(2){
		float: left;
		width: 57%;
		font-size: 14px;
		line-height: 50px;
		text-align: left;
		padding-left: 8px;
    }
    #spread-rank .content .ranking-content .ranking-list .list-title .col:last-child{
		float: left;
	    width: 20%;
	    text-align: center;
	    font-size: 14px;
	    line-height: 50px;
    }
    #spread-rank .content .ranking-content .ranking-list .list-item-content .list-item{
    	background-color: #F5F5F5;
	    margin-bottom: 10px;
        font-size: 14px;
    	line-height: 50px;
    	overflow: hidden;
    }
    #spread-rank .content .ranking-content .ranking-list .list-item-content .list-item .col:first-child{
		float: left;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		width: 20%;
		text-align: center;
    }
    #spread-rank .content .ranking-content .ranking-list .list-item-content .list-item .col:first-child img{
		width: 30px;
		height: 30px;
		display: inline-block;
		margin-top: 7px;
    }
    #spread-rank .content .ranking-content .ranking-list .list-item-content .list-item .col{
		float: left;
		width: 57%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
    }
    #spread-rank .content .ranking-content .ranking-list .list-item-content .list-item .col .avatar{
		float: left;
	    width: 40px;
	    height: 40px;
	    display: inline-block;
	    margin-top: 6px;
    }
    #spread-rank .content .ranking-content .ranking-list .list-item-content .list-item .col .avatar img{
		display: inline-block;
	    width: 100%;
	    height: 100%;
	    border-radius: 50%;
    }
    #spread-rank .content .ranking-content .ranking-list .list-item-content .list-item .col .nickname{
    	display: inline-block;
    	float: left;
    	max-width: 70%;
    	margin-left: 8px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
    }
    #spread-rank .content .ranking-content .ranking-list .list-item-content .list-item .col:last-child{
		float: left;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		width: 23%;
		color: #ff2d4b;
		text-align: center;
    }
</style>



// WEBPACK FOOTER //
// src/pages/spread/rank.vue