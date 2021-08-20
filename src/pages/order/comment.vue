<template>
	<div id="order-comment">
		<public-header title="添加评论" bgcolor="#ff2d4b" textcolor="#fff"></public-header>
		<div class="content">
			<div class="content-block-title">配送评价</div>
			<van-cell-group>
				<van-cell>
					<div class="flex" slot="title">
						<span class="van-cell-text">配送服务</span>
						<van-rate class="flex" v-model="delivery_service" :size="20" :count="5" color="#ff2d4b" void-color="#FF6C81"/>
					</div>
				</van-cell>
			</van-cell-group>
			<div class="content-block-title">商品评价</div>
			<van-cell-group>
				<van-cell>
					<div class="flex" slot="title">
						<span class="van-cell-text">商品质量</span>
						<van-rate class="flex" v-model="goods_quality" :size="20" :count="5" color="#ff2d4b" void-color="#FF6C81"/>
					</div>
				</van-cell>
				<van-cell :title="item.goods_title" v-for="(item, index) in goods" :key="index">
					<div slot="right-icon" class="favor-oppose">
						<label @click="favorOppose(index, 'favor')">
							<input type="radio" class="radio" value="1" :checked="item.activity == 1">
							<span class="favor"></span>
						</label>
						<label @click="favorOppose(index, 'oppose')">
							<input type="radio" class="radio" value="2" :checked="item.activity == 2">
							<span class="oppose"></span>
						</label>
					</div>
				</van-cell>
			</van-cell-group>
			<div class="content-block-title">写点什么</div>
			<van-cell-group>
				<van-field v-model="note" type="textarea" placeholder="至少输入10个字，您的建议很重要，来点评一下吧" />
			</van-cell-group>
			<div class="content-block-title">有图有真相</div>
			<uploader @onGetUrl="onGetImgsUrl" :max="6"></uploader>
			<div class="save-btn">
				<van-button size="large" @click="onSubmit()">提交评论</van-button>
			</div>
		</div>
		<public-footer></public-footer>
	</div>
</template>

<script>
	import PublicHeader from '@/components/header'
	import PublicFooter from '@/components/footer'
	import Uploader from '@/components/uploader'
	export default {
		components: {
			PublicHeader,
			PublicFooter,
			Uploader
		},
		data() {
			return {
				id: Number,
				delivery_service: 0,
				goods_quality: 0,
				note: '',
				goods: [],
				thumbs: [],
				newGoods: []
			}
		},
		methods: {
			onLoad() {
				if(this.$route.query.id) {
					this.id = this.$route.query.id;
				} else {
					this.$toast('订单不存在或已删除！')
				}
				this.util.request({
					url: 'wmall/order/comment/index',
					data: {
						id: this.id
					}
				}).then((res) => {
					let result = res.data.message;
					if(result.errno) {
						this.$toast(result.message)
						return;
					}
					if(result.message.goods) {
						this.goods = [...this.goods, ...result.message.goods]
					}
				
					this.goods.forEach((item, index) => {
						let goodsItem = {
							id: item.id,
							goods_id: item.goods_id,
							activity: item.activity,
						}
						this.newGoods.push(goodsItem);
					})
				})
			},

			favorOppose(index, type) {
				var index = index;
				var type = type;
				if(type == 'favor') {
					this.goods[index].activity = 1;
					this.newGoods[index].activity = 1;
				} else {
					this.goods[index].activity = 2;
					this.newGoods[index].activity = 2;
				}
			},
			onGetImgsUrl(value) {
				this.thumbs = value;
			},
			onSubmit() {
				if(!this.delivery_service) {
					this.$toast('请您评价配送服务');
					return false;
				}
				if(!this.goods_quality) {
					this.$toast('请您评价商品质量');
					return false;
				}
				var params = {
					id: this.id,
					note: this.note,
					goods_quality: this.goods_quality,
					deliverScore: this.delivery_service,
					thumbs: this.thumbs,
					goods: this.newGoods,
				}
				this.util.request({
					url: 'wmall/order/comment/post',
					method: 'post',
					data: params
				}).then((res) => {
					let result = res.data.message;
					if(result.errno) {
						this.util.$toast(result.message)
						return false;
					} else {
						this.util.$toast(result.message, this.util.getUrl({path: '/pages/order/detail', query: {id: this.id}}));
					}
				})

			}
		},
		mounted() {
			this.onLoad()
		}
	}
</script>

<style>
	@import "../../../static/css/test.css";
	#order-comment .content{
		position: absolute;
		top: 46px;
		left: 0;
		right: 0;
		bottom: 50px;
		overflow-y: auto;
		-webkit-box-sizing: border-box;
		-moz-box-sizing: border-box;
		box-sizing: border-box;
	}
	#order-comment .content::-webkit-scrollbar{
		display: none;
	}
	#order-comment .content .content-block-title{
		position: relative;
		overflow: hidden;
		font-size: 14px;
		line-height: 1;
		color: #6d6d72;
		text-overflow: ellipsis;
		text-transform: uppercase;
		white-space: nowrap;
		margin: 10px 15px;
	}
	#order-comment .content .van-cell-group .van-cell-text{
		padding-right: 10px;
		font-size: 15px;
	}
	#order-comment .content .favor-oppose span {
		display: inline-block;
		width: 45px;
		height: 28px;
		margin-bottom: -7px;
	}
	#order-comment .content .favor-oppose input[type=radio] {
		display: none;
	}
	#order-comment .content .favor-oppose .favor {
		background: url(../../../static/img/favor_grey.png) no-repeat;
		background-size: cover;
	}
	#order-comment .content .favor-oppose input[type=radio]:checked + .favor {
		background: url(../../../static/img/favor.png) no-repeat;
		background-size: cover;
	}
	#order-comment .content .favor-oppose .oppose {
		background: url(../../../static/img/oppose_grey.png) no-repeat;
		background-size: cover;
	}
	#order-comment .content .favor-oppose input[type=radio]:checked + .oppose {
		background: url(../../../static/img/oppose.png) no-repeat;
		background-size: cover;
	}
	#order-comment .content .img-container{
		background-color: #fff;
		padding: 10px;
		padding-bottom: 0;
	}
	#order-comment .content .img-container .van-col{
		position: relative;
		height: 60px;
		margin-bottom: 10px;
	}
	#order-comment .content .img-container .van-col img {
		width: 100%;
		height: 100%;
		border-radius: 3px;
	}
	#order-comment .content .img-container .van-col .icon{
		position: absolute;
		width: 20px;
		height: 20px;
		border-radius: 50%;
		background: rgba(0,0,0,.6);
		right: -5px;
		top: -10px;
		z-index: 10000;
		color: #fff;
		text-align: center;
		font-size: 14px;
		line-height: 20px;
	}
	#order-comment .content .img-container .van-col .van-uploader{
		width: 100%;
		height: 100%;
	}
	#order-comment .content .save-btn{
		margin: 10px;
	}
	#order-comment .content .save-btn .van-button{
		background-color: #ff2d4b;
		color: #fff;
		border-radius: 5px;
	}
</style>



// WEBPACK FOOTER //
// src/pages/order/comment.vue