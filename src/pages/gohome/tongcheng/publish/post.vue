<template>
	<div id="publish-post">
		<public-header :title="category.title"></public-header>
		<failed-tips :failedTips="failedTips" v-if="black_member.status"></failed-tips>
		<div class="content">
			<div class="bg-default font-14">
				<p class="c-gray padding-15-lr padding-15-t">信息内容：</p>
				<van-field
					v-model="publish.content"
					type="textarea"
					placeholder="请输入信息内容"
					rows="5"
					class="font-15"
				/>
			</div>
			<div class="bg-default margin-10-t">
				<p class="c-gray padding-15-lr padding-15-t font-14">添加图片</p>
				<uploader class="uploader" @onGetUrl="onUploadThumb" @delete="onUploadThumb" :max="8" :value="publish.thumbs"></uploader>
			</div>
			<div class="bg-default margin-10-t">
				<p class="c-gray padding-15-lr padding-15-t font-14">选择标签</p>
				<ul class="tags">
					<template v-if="category.tags" v-for="(tag, index) in category.tags">
						<li class="tag-item" :class="{active: publish.keyword.indexOf(tag) >= 0}" @click="onToggleTag(tag)">{{tag}}</li> 
					</template>
				</ul>
			</div>
			<van-cell-group class="margin-10-t">
				<van-field
					v-model="publish.nickname"
					label="联系人"
					placeholder="请输入联系人姓名"
					input-align="right"
				/>
				<van-field
					v-model="publish.mobile"
					label="联系方式"
					placeholder="请输入联系方式"
					input-align="right"
				/>
				<van-cell title="位置" v-if="0">
					<div class="flex" slot="right-icon">
						<span>打开GPS, 自动识别</span>
						<van-icon name="arrow" class="c-gray margin-5-l"></van-icon>
					</div>
				</van-cell>
				<van-cell title="发布费用" v-if="category.price > 0 && information_id == 0">
					<div class="flex" slot="right-icon">
						<span>{{category.price}}元</span>
						<van-icon name="arrow" class="c-gray margin-5-l"></van-icon>
					</div>
				</van-cell>
			</van-cell-group>
			<template v-if="information_id == 0">
				<van-radio-group v-model="publish.days" @change="onToggleStick" class="margin-10-t" v-if="category.config && category.config.stick_price">
					<van-cell-group>
						<van-cell title="置顶设置" :value="publish.days > 0 ? '置顶' + publish.days + '天' : ''" @click="onToggleStick"/>
						<template v-if="stickShow">
							<template v-if="category.config && category.config.stick_price" v-for="stickItem in category.config.stick_price">
								<van-cell class="border-0px" :title="'置顶' + stickItem.day + '天'" clickable @click="onSelectStick(stickItem.day)">
									<van-radio :name="stickItem.day" />
								</van-cell>
							</template>
							<van-cell class="border-0px" title="不置顶" clickable @click="onSelectStick(0)">
								<van-radio :name="0" />
							</van-cell>
						</template>
					</van-cell-group>
				</van-radio-group>
			</template>
			<div class="padding-15" @click="onSubmit()">
				<van-button size="normal" block class="bg-danger font-16" v-if="information_id > 0">{{calculate.final_fee > 0 ? '确认修改(￥' + calculate.final_fee + ')' : '确认修改'}}</van-button>
				<van-button size="normal" block class="bg-danger font-16" v-else>{{calculate.final_fee > 0 ? '确认发布(￥' + calculate.final_fee + ')' : '确认发布'}}</van-button>
			</div>
		</div>
		<iloading v-if="showPreLoading"></iloading>
	</div>
</template>

<script>
	import PublicHeader from '@/components/header'
	import uploader from '@/components/uploader'
	import failedTips from '@/components/failedTips'
	import {getData, setData} from "@/controller/funcCommon"
	export default {
		components: {
			PublicHeader,
			uploader,
			failedTips
		},
		data() {
			return {
				showPreLoading: true,
				category: {},
				stickShow: true,
				publish: {
					content: '',
					parentid: 0,
					childid: 0,
					sid: 0,
					is_stick: 0,
					days: 0,
					nickname: '',
					mobile: '',
					keyword: [],
					thumbs: []
				},
				calculate: {
					final_fee: 0
				},
				black_member: {
					status: false,
				},
				failedTips: {
					type: 'message',
					tips: '',
					btnText: '关闭',
					link: '/gohome/pages/tongcheng/index'
				},
			}
		},
		methods: {
			onToggleTag(tag) {
				var index = this.publish.keyword.indexOf(tag);
				if(index != -1) {
					this.publish.keyword.splice(index, 1);
					this.publish = Object.assign({}, this.publish);
					return;
				}
				this.publish.keyword.push(tag);
				this.publish = Object.assign({}, this.publish);
			},
			onToggleStick() {
				return;
				if(this.calculate && this.calculate.stick_is_available != 1) {
					this.util.$toast('置顶位已售完,暂时不可购买', '', 1000);
					return false;
				}
				this.stickShow = !this.stickShow;
			},
			onSelectStick(day) {
				if(this.calculate && this.calculate.stick_is_available != 1) {
					this.util.$toast('置顶位已售完,暂时不可购买', '', 1000);
					return false;
				}
				if(this.publish.days == day) {
					//this.onToggleStick();
					return;
				}
				this.publish.days = day;
				this.onLoad();
			},
			onUploadThumb(value) {
				this.publish.thumbs = value;
			},
			onLoad() {
				var that = this;
				getData({
					vue: that,
					url: 'tongcheng/publish/post',
					data: {
						parentid: that.parentid,
						childid: that.childid,
						publish: JSON.stringify(that.publish),
						information_id: that.information_id
					},
					success: function(res) {
						that.category = res.category;
						that.publish.nickname = res.member.realname;
						that.publish.mobile = res.member.mobile;
						that.calculate = res.calculate;
						if(that.information_id > 0) {
							that.publish = Object.assign(that.publish, res.publish);
						}
					},
					fail: function(res) {
						if(res.errno == -1000) {
							var black_member = res.message.black_member;
							that.black_member = black_member;
							that.failedTips.tips = black_member.tip;
							return;
						} else {
							that.util.$toast(res.message, that.util.getUrl({path: '/gohome/pages/tongcheng/index'}), 1000);
						}
					}
				});
			},
			onSubmit() {
				var that = this;
				if(!that.publish.content) {
					that.util.$toast('请输入内容');
					return;
				}
				setData({
					vue: that,
					url: 'tongcheng/publish/post',
					data: {
						parentid: that.parentid,
						childid: that.childid,
						information_id: that.information_id,
						publish: JSON.stringify(that.publish),
					},
					success: function(res) {
						if(res.need_pay == 1) {
							that.util.$toast('请支付', that.util.getUrl({path: '/pages/public/pay', query: {order_id: res.id, order_type: 'tongcheng'}}), 1500, 'replace');
						} else {
							that.util.$toast(res.message, that.util.getUrl({path: '/gohome/pages/tongcheng/detail', query: {id: res.information_id}}), 1000);
						}
					}
				});
			}
		},
		created() {
			if(this.$route.query) {
				this.parentid = this.$route.query.parentid;
				this.childid = 0;
				if(this.$route.query.childid > 0) {
					this.childid = this.$route.query.childid;
				}
				this.information_id = 0;
				if(this.$route.query.information_id > 0) {
					this.information_id = this.$route.query.information_id;
				}
			}
		},
		mounted() {
			this.onLoad();
		}
	}
</script>

<style>
	#publish-post .uploader{
		padding: 15px 15px 5px!important;
	}
	#publish-post .tags{
		display: flex;
		flex-flow: row wrap;
		align-items: center;
		justify-content: flex-start;
		padding: 12px;
	}
	#publish-post .tags .tag-item{
		font-size: 12px;
		border: 1px solid #ccc;
		padding: 2px 5px;
		border-radius: 3px;
		margin: 3px;
	}
	#publish-post .tags .tag-item.active{
		color: #ff2d4b;
		border-color: #ff2d4b;
	}
	#publish-post .van-icon-check{
		color: #fff;
		border: 1px solid #ccc;
		border-radius: 50px;
		margin-bottom: 1px;
		width: 20px;
		height: 20px;
		font-size: 14px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	#publish-post .van-icon-checked{
		width: 20px;
		height: 20px;
		background-color: #ff2d4b;
		color: #fff;
		border-radius: 50px;
		font-size: 14px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>


// WEBPACK FOOTER //
// src/pages/gohome/tongcheng/publish/post.vue