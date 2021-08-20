<template>
  <div>
    <div class="mask"></div>
    <div class="pop_monkey">
        <h3 class="title">{{task_speed}}任务进度<p>完成{{task_speed}}任务可升级为{{task_speed}}会员享	</p></h3>
        <a href="javascript:;" @click="closea()"  class="a_close"></a>
        <ul class="monkey_progress">
          <li v-for ="item in order_pop">
            <ul class="progress_temp">
              <li><h3>
              <span v-if="item.type==1">您已完成月消费次数</span>
              <span v-if="item.type==2">您已完成月消费金额</span>
              <span v-if="item.type==3">您已完成资料</span>
              <span v-if="item.type==4">您已完成月到店</span>

              <b>{{item.is_com}}</b>
                <span v-if="item.type==1"> 次</span>
                <span v-if="item.type==2"> 元</span>
                <span v-if="item.type==3"> 个</span>
                <span v-if="item.type==4"> 次</span>
              </h3><p>

              <span v-if="item.type==1">再消费</span>
              <span v-if="item.type==2">再消费金额</span>
              <span v-if="item.type==3">再完成资料</span>
              <span v-if="item.type==4">再月到店</span>
              {{item.cha}}

              <span v-if="item.type==1"> 次</span>
              <span v-if="item.type==2"> 元</span>
              <span v-if="item.type==3"> 个</span>
              <span v-if="item.type==4"> 次</span>

              即可完成该任务
              </p></li>
              <li>
                <span class="progress">
                  <span class="setW" :style="{ width: item.pro+ '%' }"></span>
                </span>
              </li>
            </ul>
          </li>
        </ul>
        <button type="button" class="btn_monkey" @click = "taskcenter()">查看详情</button>
      </div>
  </div>
</template>

<script>
  export default{
    props:['task_speed','order_pop'],

    methods:{
      taskcenter(){
        this.$emit('taskcenter');
      },
      closea(){
        this.$emit('closea',false);
      }
    },
    beforeCreate: function() {
          document.getElementsByTagName("html")[0].className="bg";
      }

  }
</script>


<style >
  .bg{
    font-size:100%;
  }
  .mask{
    z-index:100;
  }
  .pop_monkey{
    z-index:101;
    top:10rem;
  }

</style>
