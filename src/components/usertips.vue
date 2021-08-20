<!-- <template>
  <div id="usertips" class="usertips">
      <p  v-if="usertips.yijian>0" class="yijian">{{usertips.yijian_notice}}</p>
      <p class="lijikt">{{usertips.tipstxt}}
       &nbsp;<span class="kt" @click="czOrzg(usertips.kturl)"> 立即开通</span></p>
    </div>
</template>

<script>
  export default{
    name:'usertips',
    props:{
      usertips:Object
    },
    methods:{
      czOrzg(url){
        window.location.href=url;
      }
    }
  }
</script>

<style >
  .kt{
    font-size: 14px;
    font-weight: 700;
    //animation: leftIn 1s ease;
  }

  .lijikt{
    height:20px;
    line-height: 20px;;
  }

  .yijian{
    height:14px;
    line-height: 14px;
  }

  /* 购物车 */
  .usertips{
    background-color: #fff7d9;
    position: fixed;
    bottom:50px;
    width:100%;
    text-align: center;
    color:rgb(255, 45, 75);
    font-size:12px;
  }
</style>
 -->