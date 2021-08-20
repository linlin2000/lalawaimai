<template>
	<div id="memberProfile">
		<public-header title="会员资料"></public-header>
		<div class="content">
			<van-cell-group>
				<van-cell title="会员uid" :value="user.uid" />
				<van-cell title="手机号" :value="user.mobile ? user.mobile : '绑定手机号'" :to="util.getUrl({path: '/pages/member/bind?mobile='  + user.mobile})" is-link/>
				<van-cell title="用户名" :value="user.realname" is-link :to="util.getUrl({path: '/pages/member/profileUsername?username=' + user.realname})"/>
				<van-cell title="账号密码" value="修改" is-link :to="util.getUrl({path: '/pages/member/profilePassword'})"/>
			</van-cell-group>
			<div class="submit">
				<van-button v-if="!util.isWeixin()" type="danger" @click="onLogout" size="normal" block="block">退出登录</van-button>
			</div>
		</div>
	</div>
</template>

<script>
	import { Dialog } from 'vant';
	import PublicHeader from '@/components/header'
	export default {
		data() {
			return {
				block: true,
				user: {}
			}
		},
		components: {
			PublicHeader,
		},
		methods: {
			onLoad() {
				this.util.request({
					url: 'wmall/member/profile'
				}).then((res) => {
					let result = res.data.message;
					if(result.errno) {
						return;
					}
					this.user = result.message;
				})
			},
			onLogout() {
				Dialog.confirm({
					title: '温馨提示',
					message: '确定退出登录吗？'
				}).then(() => {
					this.util.removeStorage('itoken');
					this.util.delCookie('itoken');
					this.$router.replace(this.util.getUrl({path: '/pages/auth/login'}));
				})
			}
		},
		mounted() {
			this.onLoad();
		}
	}
</script>

<style>
	#memberProfile .content{
		padding-top: 10px;
	}
	#memberProfile .content .van-cell__value span{
		color:#666;
	}
	#memberProfile .content .submit{
		margin-top: 20px;
		padding: 0 15px;
	}
</style>



// WEBPACK FOOTER //
// src/pages/member/profile.vue