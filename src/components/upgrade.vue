<template>
  <div>
      <div class="mask" v-show="isup"></div>
      <div class="pop_monkey_head" v-show="isup">
      			<a href="javascript:;"  class="a_close"  @click="close_isup"></a>
      			<div class="pop_monkey_head_img">
      					<div id="raysDemoHolder" class="raysDemoHolder">
      					<a href="javascript:;" class="raysLogo raysLogo_three">{{uptitle}}</a>
      					<div id="rays"></div>
      				</div>
      				<p>你已升级为{{uptitle}}会员</p>
      			</div>

      			<button type="button" class="btn_monkey_head" @click="taskcenter()">查看权益</button>
      		</div>
  </div>
</template>


<script>

  export default{
    props:['order_pop_url','uptitle','isup','isclose_up'],

    methods:{
      taskcenter(){
        this.$emit('taskcenter');
      },
      close_isup(){
        this.$emit('close_isup',false);
      }
    },
    beforeCreate: function() {
          document.getElementsByTagName("html")[0].className="bgisup";
      }


  }


</script>

 <style>
   .bgisup{
font-size:70.5%;
   }
 </style>
<style scoped>

 .mask{
   z-index:100;
 }
 .pop_monkey_head{
   z-index:101;
   top:29%;
 }
 .btn_monkey_head{
   width:15rem;
   font-size: 1.65rem;
 }

 </style>
