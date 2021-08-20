<template>
	<div id="load">
		<div class="loaded" v-if="type == 'loaded'">
			<div class="loaded-tips" >{{text}}</div>
		</div>
		<div class="loading" v-if="type == 'loading'">
			<van-loading type="spinner" color="black" size="16px"/>
			<div class="loading-tips">正在加载中...</div>
		</div>
	</div>
</template>

<script>
	export default {
		props:{
			type: String,
			text: String
		},
  		data() {
  			return {
          bgcolor:''
  			}
  		},
      mounted(){
       	var theme = this.util.getStorage('theme');
        this.bgcolor = theme.header.background;
      }
	}
</script>

<style>
	#load .loaded{
		position:relative;
		width:65%;
		margin:21px auto 0;
		line-height:11px;
		font-size:14px;
		text-align:center;
		vertical-align:center;
		border-top:1px solid #e5e5e5;
		color:#999;
	}
	#load .loaded .loaded-tips {
		position:relative;
		top:-11px;
		background:#fff;
		padding:0 6px;
	}
	#load .loaded-tips{
		display:inline-block;
		vertical-align:middle;
		height:20px;
		line-height:20px;
	}
	#load .loading{
		display: flex;
		flex-flow: row nowrap;
		align-item: center;
		justify-content: center;
		padding: 10px 0;
		color: #999;
		font-size: 14px;
	}
	#load .loading-tips{
		margin-left: 5px;
		margin-top: -3px;
	}
</style>



// WEBPACK FOOTER //
// src/components/load.vue
