<template>
</template>

<script>
	export default {
		data() {
			return {
			}
		},
		methods: {
		},
		mounted() {
			var that = this;
			function QFH5ready() {
				QFH5.getUserInfo(function(state, data){
					if(state == 1){
						var params = data;
						params.forward = that.util.getStorage('forwardUrl');
						that.util.request({
							method: 'post',
							url: 'wmall/auth/qianfan',
							data: params
						}).then((res) => {
							let result = res.data.message;
							if(result.errno != 0) {
								that.util.$toast(result.message);
								QFH5.jumpLogin(function(state,data){});
								return false;
							} else {
								location.href = result.message.url;
							}
						})
					} else {
						QFH5.jumpLogin(function(state,data){});
					}
				});
			}
			QFH5ready();
		}
	}
</script>


// WEBPACK FOOTER //
// src/pages/auth/qianfan.vue