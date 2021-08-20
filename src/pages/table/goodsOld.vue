<template>
	
</template>

<script>
	export default {
		data() {
			return {}
		},
		mounted() {
			var that = this;
			let query = that.util.parseQuery(that.$route.query);
			that.$router.replace(that.util.getUrl({path: '/tangshi/pages/table/goods', query: query}));
		}
	}
</script>

<style scoped>

</style>


// WEBPACK FOOTER //
// src/pages/table/goodsOld.vue