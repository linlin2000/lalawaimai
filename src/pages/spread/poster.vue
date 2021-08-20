<template>
	<div id="spread-poster">
		<div class="content">
			<div class="img">
				<img :src="respon" alt="">
			</div>
			<div class="tips-group bg-default margin-15-lr">
				<div class="padding-15-lr">
					<div class="padding-15-tb van-hairline--bottom c-gray">如何赚钱</div>
				</div>
				<ul class="padding-15-lr padding-10-tb">
					<li class>
						1.长按图片下载海报到相册,转发此海报给微信好友或分享到朋友圈;
					</li>
					<li>
						2.好友扫描您分享海报上的二维码,并且下单
					</li>
					<li>
						<template v-if="settle.balance_condition == 1">3.确认收货之后,您就可以获得佣金</template>
						<template v-else>3.好友下单后,确认收货并评价之后,您就可以获得佣金</template>
					</li>
				</ul>
				<div class="padding-15-lr">
					<div class="padding-15-tb van-hairline--bottom c-gray">说明</div>
				</div>
				<ul class="padding-15-lr padding-10-tb margin-15-b">
					<li>
						分享后会带有独特的推荐码,您的好友访问之后,
						<template v-if="relate.become_child_limit == 1">
							如果好友没有被其他人推广，并且首次成功下单,
						</template>
						<template v-else-if="relate.become_child_limit == 2">
							首次成功下单
						</template>
						<template v-else-if="relate.become_child_limit == 3">
							如果好友没有被其他人推广，并且成功下单,
						</template>
						<template v-else-if="relate.become_child_limit == 4">
							成功下单,
						</template>
						<template v-if="relate.valid_period == 'once'">
							您将在{{settle.balance_condition == 1 ? '好友确认收货' : '好友确认收货并进行评价'}}后结算佣金，佣金仅限本次推广有效。
						</template>
						<template v-else-if="relate.valid_period == 'alltime'">
							您将在{{settle.balance_condition == 1 ? '好友确认收货' : '好友确认收货并进行评价'}}后结算佣金，他将成为您的下线直至其推广上线发生变化。
						</template>
					</li>
				</ul>
			</div>
		</div>
		<transition name="loading">
			<iloading v-if="preLoading"></iloading>
		</transition>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				preLoading: true,
				relate: {},
				settle: {},
				respon: ''
			}
		},
		methods: {
			onLoad() {
				this.util.request({
					url: 'spread/poster/vue_index',
				}).then((res) => {
					this.preLoading = false;
					let result = res.data.message;
					if(result.errno) {
						this.util.$toast(result.message);
						return false;
					}
					this.relate = result.message.group_relate;
					this.settle = result.message.settle;
					this.respon = result.message.respon;
				})
			},
		},
		mounted() {
			this.onLoad();
		}
	}
</script>

<style>
	#spread-poster .content{
		position: fixed;
		top: 0;
		right: 0;
		left: 0;
		width: 100%;
		background: #EA3E31;
		overflow-x: hidden;
		overflow-y: scroll;
	}
	#spread-poster .content::-webkit-scrollbar {
		display: none;
	}
	#spread-poster .content .img{
		height: 667px;
		display: block;
	}
	#spread-poster .content .img img{
		display: inline-block;
		width: 100%;
		height: 100%;
		pointer-events: auto;
	}
	#spread-poster .tips-group{
		border-radius: 5px;
		font-size: 14px;
	}
	#spread-poster .tips-group ul{
		line-height: 1.5;
	}
</style>



// WEBPACK FOOTER //
// src/pages/spread/poster.vue