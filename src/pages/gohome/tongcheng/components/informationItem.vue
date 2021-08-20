<template>
	<div id="tiezi-item">
		<template v-for="(information, infoIndex) in informations">
		<div class="tiezi-item">
			<div class="userinfo flex-lr">
				<div class="left">
					<div class="avatar">
						<img class="img-100" :src="information.ft_avatar" alt="">
					</div>
				</div>
				<div class="right flex-lr">
					<ul>
						<li class="flex">
							<span class="tag-top" v-if="information.is_stick == 1">置顶</span>
							<span class="tag-cate">{{information.category.title}}</span>
							<span class="nickname ellipsis">{{information.nickname}}</span>
						</li>
						<li class="tags flex" v-if="information.keyword">
							<template v-for="(tag, index) in information.keyword">	
								<div class="tag-item">{{tag}}</div>
							</template>
						</li>
					</ul>
					<template v-if="from == 'mine'">
						<span class="font-14 c-danger" v-if="information.status == 1">{{information.status_all.text}}</span>
						<span class="font-14 c-danger" v-if="information.status == 2">{{information.status_all.text}}</span>
						<span class="font-14 c-primary" v-if="information.status == 3">{{information.status_all.text}}</span>
						<span class="font-14 c-gray" v-if="information.status == 4">{{information.status_all.text}}</span>
					</template>
					<template v-else>
						<div class="icon icon-phone2 c-danger font-20" v-if="information.mobile" @click="util.jsTel(information.mobile)"></div>
					</template>
				</div>
			</div>
			<div class="tiezi-info">
				<div class="text " :class="{showsome: !information.showall}" ref="text">{{information.content}}</div>
				<div class="flex c-gray "  @click="onToggleTextHeight(infoIndex)" v-if="information.content_length > 44">
					<span class="margin-5-r font-13">{{information.showall ? '收起' : '查看全文'}}</span>
					<i class="icon font-14" :class="{'icon-unfold': !information.showall, 'icon-fold': information.showall}"></i>
				</div>
				<ul class="flex-lr c-gray margin-10-t">
					<li class="font-12 ">{{information.addtime_cn}}发布</li>
					<router-link tag="li" class="flex" :to="util.getUrl({path: '/gohome/pages/tongcheng/detail', query: {id: information.id}})">
						<span class="font-12 ">查看详情</span>
						<van-icon name="arrow" class="font-14"></van-icon>
					</router-link>
				</ul>
				<ul class="thumbs" v-if="information.thumbs">
					<li class="thumb-item" v-for="(item, index) in information.thumbs" :key="'img' + index" @click="util.jsPreviewImage(information.thumbs, index)" v-if="index < 3">
						<img class="img-100 radius-3" :src="item" alt="">
					</li>
					<li class="thumb-item" v-if="information.thumbs.length > 3">
						<img class="img-100 radius-3" :src="information.thumbs[3]" alt="">
						<div class="thumb-num">+{{information.thumbs.length}}</div>
					</li>
				</ul>
				<router-link tag="ul" class="flex font-13 c-gray margin-10-t" :to="util.getUrl({path: '/gohome/pages/tongcheng/detail', query: {id: information.id}})">
					<li class="flex margin-10-r">
						<i class="icon icon-attention font-15"></i>
						<span>{{information.looknum}}</span>
					</li>
					<li class="flex margin-10-r">
						<i class="icon icon-appreciate_light font-14"></i>
						<span>{{information.likenum}}</span>
					</li>
					<li class="flex margin-10-r">
						<i class="icon icon-comment font-14"></i>
						<span></span>
					</li>
				</router-link>
			</div>
			<div class="btn-group" v-if="from == 'mine'">
				<router-link class="btn-item bg-danger" :to="util.getUrl({path: '/gohome/pages/tongcheng/publish/stick', query: {information_id: information.id, parentid: information.parentid, childid: information.childid}})">置顶</router-link>
				<router-link class="btn-item bg-warning" :to="util.getUrl({path: '/gohome/pages/tongcheng/publish/post', query: {information_id: information.id, parentid: information.parentid, childid: information.childid}})">编辑</router-link>
				<div class="btn-item" @click="util.jspost({url: 'tongcheng/index/del', data: {id: information.id, type: 'information'}, confirm: '确定删除吗'})">删除</div>
			</div>
		</div>
		</template>
	</div>
</template>

<script>
	export default {
		props: {
			informations: Array,
			information_index: Number,
			from: String
		},
		data() {
			return {

			}
		},
		methods: {
			onToggleTextHeight(index) {
				var that = this;
				that.informations[index].showall = !that.informations[index].showall;
			}
		},
		mounted() {
		}
	}
</script>

<style>
	#tiezi-item .tiezi-item{
		padding: 10px;
		background-color: #fff;
		font-size: 14px;
		margin-bottom: 10px;
	}
	#tiezi-item .tiezi-item .left{
		width: 40px;
	}
	#tiezi-item .tiezi-item .right{
		flex: 1;
		padding-left: 10px;
	}
	#tiezi-item .tiezi-item .avatar{
		width: 40px;
		height: 40px;
		font-size: 0px;
	}
	#tiezi-item .tiezi-item .avatar img{
		border-radius: 50px;
	}
	#tiezi-item .tiezi-item .tag-top{
		background-color: #ff2d4b;
		color: #fff;
		font-size: 10px;
		padding: 3px 5px;
		border-radius: 3px;
		margin-right: 5px;
	}
	#tiezi-item .tiezi-item .tag-cate{
		background-color: #FFE0E5;
		color: #ff2d4b;
		font-size: 10px;
		padding: 3px 10px;
		border-radius: 3px;
		margin-right: 5px;
	}
	#tiezi-item .tiezi-item .nickname{
		max-width: 100px;
	}
	#tiezi-item .tiezi-item .tags{
		display: flex;
		flex-flow: row wrap;
		align-items: center;
		justify-content: flex-start;
	}
	#tiezi-item .tiezi-item .tags .tag-item{
		font-size: 10px;
		color: #ff2d4b;
		border: 1px solid #ff2d4b;
		padding: 3px 5px;
		border-radius: 3px;
		margin: 5px 5px 0 0;
	}
	#tiezi-item .tiezi-item .tiezi-info{
		padding-left: 50px;
	}
	#tiezi-item .tiezi-item .tiezi-info .text{
		line-height: 1.5;
		margin: 7px 0;
	}
	#tiezi-item .tiezi-item .tiezi-info .text.showsome{
		max-height: 42px;
		overflow: hidden;
	}
	#tiezi-item .thumbs{
		width: 100%;
		margin: 5px -10px -5px -5px;
		display: flex;
		flex-flow: row wrap;
		align-items: center;
	}
	#tiezi-item .thumbs .thumb-item{
		width: 25%;
		height: 70px;
		padding: 5px;
		overflow: hidden;
		position: relative;
	}
	#tiezi-item .thumbs .thumb-item .thumb-num{
		position: absolute;
		top: 5px;
		left: 5px;
		bottom: 5px;
		right: 5px;
		background-color: rgba(0, 0, 0, 0.6);
		color: #fff;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 24px;
		border-radius: 3px;
	}
	#tiezi-item .tiezi-item .btn-group{
		display: flex;
		flex-flow: row wrap;
		align-items: center;
		justify-content: flex-end;
	}
	#tiezi-item .tiezi-item .btn-group .btn-item{
		padding: 10px;
		border: 1px solid #ccc;
		border-radius: 3px;
		margin: 10px 0 0 10px;
	}

</style>


// WEBPACK FOOTER //
// src/pages/gohome/tongcheng/components/informationItem.vue