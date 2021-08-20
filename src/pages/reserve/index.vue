<template>
	<div id="reserve-index">
		<public-header title="预定时间"></public-header>
		<div class="content">
			<div class="order-con">
				<section v-for="categoryItem in categorys" :key="categoryItem.id" @click="onSelectTime(categoryItem.id,categoryItem.cid)">
					<span>座号：{{categoryItem.title}}</span>
					<p>类型：{{categoryItem.category.title}}</p>
					<p>可提供人数：{{categoryItem.guest_num}}</p>
				</section>
			</div>
		</div>
		<iloading v-if="showPreLoading"></iloading>
			<van-popup v-model="status.couponShow" position="bottom" :closeOnClickOverlay="false" >
			<div class="popup-coupon">
				<div class="popup-title van-hairline--bottom">预定选项</div>
				<div class="popup-container">
					<load type="loaded" :text="'可用代金券(1张)'" bgcolor="#f5f5f5"></load>
					<div class="coupon-list">
						<div class="content-padded">
							<div class="coupon-item">
								<div class="item-content">
									<div class="item-inner">
										<div class="item-title">请输入人数：</div>
										<div class="item-input">
											<van-cell-group>
												<van-field v-model="renshu" placeholder="请输入人数" />
											</van-cell-group>
										</div>
									</div>
									<div class="item-inner">
										<div class="item-title">请输入预约时间：</div>
										<div class="item-input">
											<van-cell-group>
												<van-field  @click="showdates" v-model="currentDate" placeholder="请输入人数" />
											</van-cell-group>
										</div>
									</div>
									<div class="item-inner" v-if="showdate">
										<van-datetime-picker
										v-model="xuanzeDate"
										type="datetime"
										:min-date="minDate"
										@change="starttestDate"
										@cancel="startTimeCancelDate"
               							@confirm="startTimeConfirm"
										/>

									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="popup-cancle van-hairline--top" style="background-color:red; color:black;" @click="yuding()">查询预定</div>
			</div>
		</van-popup>
	</div>
</template>

<script>
	import {mapState, mapMutations} from 'vuex'
	import PublicHeader from '@/components/header'
	import moment from "moment"
	export default {
		components: {
			PublicHeader,
		},
		data() {
			return {
				extra: {
					dayIndex: 0,
					day: '',
					time: '',
					cid: '',
				},
				showdate:false,
				renshu:1,
				categorys: {},
				reserves: {},
				days: [],
				year: '',
				tables_info: {},
			 	minHour: 10,
				maxHour: 20,
				minDate: new Date(),
				xuanzeDate:"",
				currentDate: new Date(),
				showPreLoading: true,
				status: {
					noDiscountShow: false,
					couponShow: true,
					tableShow: false
				},
			}
		},
		computed: {
			
		},
		methods: {
			...mapMutations([
				'setState'
			]),
			onLoad() {
					this.showPreLoading = false;
					this.showCurrent();
			},
			//查询预订
			yuding(){
				this.util.request({
					url: 'wmall/store/reserve/index',
					data: {
						sid: this.sid,
						number:this.renshu,
						shijian:this.currentDate
					}
				}).then((res) => {
					this.showPreLoading = false;
					let result = res.data.message;
					if(result.errno) {
						this.$toast(result.message)
						return false;
					}
					this.categorys = result.message
					
					this.showCurrent();
				})
				this.status.couponShow = false;
			},
			showdates(){
				this.showdate = true;
			},
			onSelectDay(index, value) {
				this.extra.dayIndex = index;
				this.extra.day = this.year + '-' + value;
				this.setState({type:'reserveExtra', key:'day', val:this.extra.day});
			},
			showCurrent() {
				var date = new Date();
				this.currentDate = moment(date).format('YYYY-MM-DD HH:mm:ss')
			},
			startTimeCancelDate(data){
				this.showdate = false;
			},
			starttestDate(data){
			   
			},
			startTimeConfirm(data){
				this.currentDate = moment(data).format('YYYY-MM-DD HH:mm:ss')
				this.showdate = false;
			},
			startTimePop(){

			},
			onSelectTime(id,cid) {
				this.extra.time = this.currentDate;
				this.extra.cid = cid;
				this.setState({type:'reserveExtra', key:'cid',val:cid});
				this.extra.renshu = this.renshu;
				this.setState({type:'reserveExtra', key:'renshu',val:this.renshu});
				this.extra.id = id;
				this.setState({type:'reserveExtra', key:'id',val:id});
				this.setState({type:'reserveExtra', key:'time',val:this.currentDate});
				this.$router.push(this.util.getUrl({path: '/tangshi/pages/reserve/create?sid=' + this.sid}));
			},
		},
		mounted() {
			this.onLoad()
		},
		created() {
			this.query = this.$route.query;
			if(this.query) {
				this.sid = this.query.sid;
			}
		}
	}
</script>

<style>
	#reserve-index .van-nav-bar{
		background-color: #ff2d4b!important;
		color: #fff!important;
	}
	#reserve-index .van-hairline--bottom .van-icon-left{
		color: #fff!important;
	}
	#reserve-index .content .order-time ul{
		height: 44px;
		display: table;
		width: 100%;
		background: #eee;
	}
	#reserve-index .content .order-time ul li.active{
		color: #fff;
		background: #ff2d4b;
	}
	#reserve-index .content .order-time ul li{
		height: 44px;
		text-align: center;
		padding: 2px;
		display: table-cell;
	}
	#reserve-index .content .order-time ul li p{
		margin: 0;
		font-size: 14px;
		line-height: 1.4;
	}
	#reserve-index .content .order-time ul li span{
		font-size: 12px;
		display: block;
		line-height: 1.4;
	}
	#reserve-index .content .order-con{
		background: #fff;
		padding: 18px 10px 1px;
	}
	#reserve-index .content .order-con span{
		display: block;
		font-size: 17px;
		font-weight: bold;
		line-height: 1.2;
		border-left: 3px solid #ff2d4b;
		padding-left: 6px;
	}
	#reserve-index .content .order-con p{
		font-size: 12px;
		color: #999;
		margin: 10px 0;
		line-height: 18px;
	}
	#reserve-index .content .order-con ul{
		overflow: hidden;
		border-bottom: 10px solid #eeeeee;
		margin-bottom: 18px;
	}
	#reserve-index .content .order-con ul li.border-gray{
		border: 1px solid #959595;
	}
	#reserve-index .content .order-con ul li.border-gray div{
		color: #959595;
	}
	#reserve-index .content .order-con ul li{
		float: left;
		width: 100px;
		height: 28px;
		line-height: 28px;
		margin-right: 15px;
		margin-bottom: 10px;
		border:  1px solid #ff2d4b;
		border-radius: 4px;
		text-align: center;
		font-size: 14px;
	}
	#reserve-index .content .order-con ul li div{
		color: #ff2d4b;
	}
	/*代金券弹出层*/
	#reserve-index .popup-coupon{
		width: 100%;
		height: 400px;
		overflow: hidden;
	}
	#reserve-index .popup-coupon .popup-cancle{
		width: 100%;
		height:50px;
		text-align:center;
		line-height:50px;
		font-size:16px;
		color:#FFD161;
	}
	#reserve-index .popup-coupon .popup-title{
		width: 100%;
		height: 50px;
		text-align: center;
		font-size: 16px;
		line-height: 50px;
	}
	#reserve-index .popup-coupon .popup-container{
		width: 100%;
		height: 300px;
		overflow-y: auto;
		background: #f5f5f5;
	}
	#reserve-index .popup-coupon .popup-container::-webkit-scrollbar{
		width: 0px;
		height: 0px;
	}
	#reserve-index .coupon-list{
		padding: 0px 10px 10px;
	}
	#reserve-index .coupon-list .content-padded{
		margin: 10px;
	}
	#reserve-index .coupon-list .content-padded .coupon-item{
		background: #fff;
		margin-top: 12px;
		overflow: hidden;
		padding: 16px;
		position: relative;
	}
	#reserve-index .coupon-item .clearfix{
		overflow: hidden;
	}
	#reserve-index .coupon-item .clearfix .circle{
		display: block;
		width: 16px;
		height: 16px;
		background: #f5f5f5;
		position: absolute;
		border-radius: 16px;
		top: 50%;
		margin-top: -8px;
		z-index: 20;
	}
	#reserve-index .coupon-item .clearfix .circle-left{
		left: -8px;
	}
	#reserve-index .coupon-item .clearfix .circle-right{
		right: -8px;
	}
	#reserve-index .coupon-item .clearfix .overdue{
		display: block;
		position: absolute;
		width: 70px;
		height: 70px;
		top: 10px;
		right: 10px;
		z-index: 100;
		background: url(../../../static/img/ws.png);
		background-size: 100%;
	}
	#reserve-index .coupon-item .clearfix .use{
		display: block;
		position: absolute;
		width: 70px;
		height: 70px;
		top: 10px;
		right: 10px;
		z-index: 100;
		background: url(../../../static/img/wu.png);
		background-size: 100%;
	}
	#reserve-index .coupon-item .left{
		width: 70%;
		float: left;
	}
	#reserve-index .coupon-item .left .store-logo{
		display: inline-block;
		float: left;
		width: 32%;
	}
	#reserve-index .coupon-item .left .store-logo img{
		display: inline-block;
		width: 56px;
		height: 56px;
		margin-top: 4px;
	}
	#reserve-index .coupon-item .left .coupon-detail{
		display: inline-block;
		float: left;
		width: 60%;
	}
	#reserve-index .coupon-item .left .coupon-detail .coupon-title{
		font-weight: bold;
		width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		color: #ff2d4b;
		margin-top: 3px;
	}
	#reserve-index .coupon-item .left .coupon-detail .use-time{
		font-size: 12px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		color: #808080;
		margin-top: 16px;
	}
	#reserve-index .coupon-item .right{
		width: 29%;
		border-left: 1px dashed #ccc;
		text-align: center;
		float: right;
	}
	#reserve-index .coupon-item .right .price{
		color: #ff2d4b;
		font-size: 24px;
	}
	#reserve-index .coupon-item .right .price span{
		font-size: 14px;
		margin-right: 2px;
	}
	#reserve-index .coupon-item .right .condition{
		margin-top: 8px;
		font-size: 12px;
		display: -webkit-box;
		overflow: hidden;
		text-overflow: ellipsis;
		word-wrap: break-word;
		white-space: normal !important;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		padding: 2px;
		color: #808080;
	}
	#reserve-index .coupon-item .selected-status{
		position: absolute;
		right: 0;
		bottom: 0;
		width: 31px;
		height: 24px;
	}
	#reserve-index .coupon-item .selected-status img{
		width: 100%;
		height: 100%;
	}
</style>


// WEBPACK FOOTER //
// src/pages/reserve/index.vue