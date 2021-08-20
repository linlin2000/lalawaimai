<template>
</template>

<script>
	import {maJia} from '@/config/maJia'
	export default {
		data() {
			return {
			}
		},
		methods: {
			onLoad() {
				var that = this;
				var forwardUrl = this.util.getStorage('forwardUrl');
				maJia().then(function() {
					mag.ready(function(){
						mag.toLogin(function(rs){
							location.href = that.util.getSiteUrl("wmall/auth/majia", {
								token: rs.token,
								forward: encodeURIComponent(forwardUrl)
							}, true);
						});
					});
				});
			},
		},
		mounted() {
			this.onLoad();
		}
	}
</script>


// WEBPACK FOOTER //
// src/pages/auth/majia.vue