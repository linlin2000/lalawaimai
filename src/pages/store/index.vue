<template>
  <div id="store-info">
    <public-header :title="store.title"
                   v-if="!isWeixin"></public-header>
    <store-header :store="store"></store-header>
    <!-- 标签 -->
    <div class="store-tabs flex-lr van-hairline--bottom">
      <router-link class="tab-item "
                   :to="util.getUrl({path: '/tangshi/pages/table/goods?sid=' + store.id})"
                   tag="div">商品</router-link>
      <!-- <router-link v-if="table == 0" class="tab-item " :to="util.getUrl({path: '/tangshi/pages/reserve/index', query: {sid: store.id}})" tag="div">预定</router-link> -->
      <router-link class="tab-item"
                   :to="util.getUrl({path: '/pages/store/comment?sid=' + store.id})"
                   tag="div">评价</router-link>
      <div class="tab-item active">商家</div>
    </div>
    <div class="store-detail"
         :style="{height: commentHeight +'px'}">
      <div class="detail-region">
        <div class="no-gutter"
             v-if="store.service_titles">
          <!-- <router-link :to="util.getUrl({path: '/pages/store/goods', query: {sid: store.id}})" class='col-20'>
						<div class="van-icon van-icon-takeout"></div>
						<div>{{store.service_titles.takeout}}</div>
					</router-link> -->
          <div class='col-20'
               @click="util.jsUrl('wx:scanCode')"
               v-if="store.is_meal == 1">
            <div class="van-icon van-icon-meal"></div>
            <div>{{store.service_titles.tangshi}}</div>
          </div>
          <router-link class='col-20'
                       :to="util.getUrl({path: '/tangshi/pages/reserve/index', query: {sid: store.id}})"
                       v-if="store.is_reserve == 1">
            <div class="van-icon van-icon-reserve"></div>
            <div>{{store.service_titles.reserve}}</div>
          </router-link>
          <router-link class='col-20'
                       :to="util.getUrl({path: '/tangshi/pages/assign/assign', query: {sid: store.id}})"
                       v-if="store.is_assign == 1">
            <div class="van-icon van-icon-assign"></div>
            <div>{{store.service_titles.assign}}</div>
          </router-link>
          <router-link class='col-20'
                       :to="util.getUrl({path: '/pages/store/paybill', query: {sid: store.id}})"
                       v-if="store.is_paybill == 1">
            <div class="van-icon van-icon-signboard"></div>
            <div>{{store.service_titles.paybill}}</div>
          </router-link>
        </div>
      </div>
      <van-cell-group class="margin-10-t border-0px"
                      v-if="store.thumbs && store.thumbs.length > 0">
        <van-cell>
          <div class="flex"
               slot="title">
            <i class="icon icon-store font-18 margin-5-r"></i>
            <span>门店实景</span>
          </div>
        </van-cell>
        <van-cell class="padding-10-lr">
          <div class="store-thumbs">
            <div class="thumb-item "
                 v-for="(item, index) in store.thumbs"
                 :key="index"
                 @click="util.jsPreviewImage(item.image)">
              <img class="img-100"
                   :src="item.image"
                   alt="">
            </div>
          </div>
        </van-cell>
      </van-cell-group>
      <div class='detail-region'>
        <div class='detail-content'>
          <div class='detail-phone flex-lr'>
            <div class="flex"
                 @click="util.jsLocation({lat: store.location_x, lng: store.location_y});">
              <div class='van-icon van-icon-location font-20'></div>
              <div class='rest-text'>{{store.address}}</div>
            </div>
            <div class='call-phone flex border-1px-l'>
              <a class='rest-ico c-default'
                 :href="'tel:' + store.telephone">
                <div class='van-icon van-icon-phone font-24'></div>
              </a>
            </div>
          </div>
          <template v-if="store.qualification">
            <div class='pic border-1px-t'
                 v-if="(store.qualification.business && store.qualification.business.thumb) || (store.qualification.service && store.qualification.service.thumb) || (store.qualification.more1 && store.qualification.more1.thumb) || (store.qualification.more2 && store.qualification.more2.thumb)">
              <div class="pic-container">
                <!-- 营业资质 -->
                <div class='pic-box'
                     v-if="store.qualification.business.thumb"
                     @click="util.jsPreviewImage(store.qualification.business.thumb)">
                  <img :src='store.qualification.business.thumb'>
                </div>
                <div class='pic-box'
                     v-if="store.qualification.service.thumb"
                     @click="util.jsPreviewImage(store.qualification.service.thumb)">
                  <img v-if="store.qualification.service.thumb"
                       :src='store.qualification.service.thumb'>
                </div>
                <div class='pic-box'
                     v-if="store.qualification.more1.thumb"
                     @click="util.jsPreviewImage(store.qualification.more1.thumb)">
                  <img v-if="store.qualification.more1.thumb"
                       :src='store.qualification.more1.thumb'>
                </div>
                <div class='pic-box'
                     v-if="store.qualification.more2.thumb"
                     @click="util.jsPreviewImage(store.qualification.more2.thumb)">
                  <img v-if="store.qualification.more2.thumb"
                       :src='store.qualification.more2.thumb'>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
      <div class='detail-region custom-url-wrap'
           v-if="store.custom_url">
        <van-cell-group class="border-0px">
          <template v-for="item in store.custom_url">
            <van-cell :title="item.title"
                      icon="all"
                      is-link
                      :center="true"
                      @click="util.jsUrl(item.wxapp_link)">
              <van-icon slot="right-icon"
                        name="right" />
            </van-cell>
          </template>
        </van-cell-group>
      </div>
      <div class='detail-region'>
        <van-cell-group class="border-0px">
          <van-cell icon="newshot">
            <div class='rest-text'
                 slot="title">
              配送服务：
              <div class='allocation-icon'
                   v-if="store.delivery_mode == 2">{{store.delivery_title}}</div>
              <span class='inline'
                    v-else-if="store.delivery_mode == 1">由 商家 </span>
              提供配送服务
            </div>
          </van-cell>
          <van-cell :title="'商家电话：' + store.telephone"
                    icon="phone"
                    is-link
                    @click="util.jsUrl('tel:' + store.telephone)" />
          <!-- <van-cell :title="'投诉电话：' + store.complain_mobile" icon="phone" is-link @click="util.jsUrl('tel:' + store.complain_mobile)"/> -->
          <van-cell :title="'营业时间：' + store.business_hours_cn"
                    icon="time" />
          <template v-if="store.sns">
            <van-cell v-if="store.sns.qq"
                      :title="store.sns.qq"
                      icon="qq"
                      is-link
                      @click="util.jsUrl('http://wpa.qq.com/msgrd?v=3&uin=' + store.sns.qq + '&site=qq&menu=yes')" />
            <van-cell v-if="store.sns.weixin"
                      :title="store.sns.weixin"
                      icon="weixin" />
          </template>
        </van-cell-group>
      </div>
      <div class='detail-region'
           v-if="activity.num > 0">
        <van-cell-group v-if="0">
          <van-cell :title="store.telephone"
                    icon="notification" />
          <van-cell icon="roundcheck">
            <div class='rest-text flex'
                 slot="title">
              <span>商家服务</span>
              <div class='service'>
                <div class="list flex">
                  <div class="img">
                    <img src="static/img/pay_b.png">
                  </div>支持在线支付
                </div>
                <div class="list"
                     v-if="store.invoice_status == 1">
                  <div class="img">
                    <img src="static/img/invoice_b.png">
                  </div>支持使用代金券抵付现金
                </div>
              </div>
            </div>
          </van-cell>
        </van-cell-group>
        <div class='discount-box'>
          <div class='discount-item flex'
               v-for="item in activity.items">
            <div class='left'>
              <div class='icon-b'>
                <img :src="'static/img/' + item.type + '_b.png'">
              </div>
            </div>
            <div class='right'>{{item.title}}</div>
          </div>
        </div>
      </div>
      <router-link tag="div"
                   :to="util.getUrl({path: 'pages/store/report', query: {sid: store.id}})"
                   class="report">举报商家</router-link>
    </div>
    <transition name="loading">
      <iloading v-if="preLoading"></iloading>
    </transition>
  </div>
</template>

<script>
import PublicFooter from '@/components/footer'
import PublicHeader from '@/components/header'
import Load from '@/components/load'
import StoreHeader from '@/components/storeHeader'
export default {
  name: 'StoreGoods',
  data () {
    return {
      store: {},
      activity: {},
      commentHeight: 0,
      table: 0,
      preLoading: true
    }
  },
  components: {
    PublicHeader,
    PublicFooter,
    Load,
    StoreHeader
  },
  methods: {
    onLoad () {
      this.table = this.util.getStorage("table_id");
      this.util.request({
        url: 'wmall/store/index',
        data: {
          sid: this.$route.query.sid,
        }
      }).then((res) => {
        let result = res.data.message.message;
        this.store = result.store;
        this.activity = result.activity;
        this.util.setWXTitle(this.store.title)
        this.preLoading = false;
      })
    },
  },
  mounted () {
    this.onLoad();
    let bodyHeight = document.documentElement.clientHeight;
    let headerHeight = document.getElementsByClassName('header')[0].clientHeight;
    let tabsHeight = document.getElementsByClassName('store-tabs')[0].clientHeight;
    this.commentHeight = bodyHeight - headerHeight - tabsHeight;
    if (document.getElementById('public-header')) {
      let publicHeader = document.getElementById('public-header').clientHeight;
      this.commentHeight = this.commentHeight - publicHeader;
    }
  }
}
</script>

<style>
@import "../../../static/css/diy.css";
#store-info .store-detail::-webkit-scrollbar {
  width: 0px;
  height: 0px;
}
#store-info #public-header ~ #store-header {
  margin-top: 46px;
}
#store-info .van-cell__left-icon {
  font-size: 20px;
}
#store-info .store-tabs {
  width: 100%;
  height: 45px;
  line-height: 45px;
  background-color: #fff;
  color: #333;
}
#store-info .store-tabs .tab-item {
  width: 40%;
  height: 100%;
  text-align: center;
  font-size: 14px;
  position: relative;
}
#store-info .store-tabs .tab-item.active {
  color: #f44;
}
#store-info .store-tabs .tab-item.active:after {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 0;
  border-bottom: 2px solid #f44;
}
/* 分隔线 */
#store-info .fg-line {
  display: inline-block;
  margin: 5px 5px 0 5px;
  width: 0;
  height: 9px;
  font-size: 0;
  border-right: 1px solid #ccc;
}
/*商家信息*/
#store-info .store-detail {
  box-sizing: border-box;
  overflow-y: auto;
  overflow-x: hidden;
  background-color: #f4f4f4;
}
#store-info .detail-region {
  margin-top: 10px;
  color: #2f2f2f;
  background-color: #fff;
  font-size: 14px;
}
#store-info .detail-region .no-gutter {
  padding: 10px 0;
}
#store-info .detail-region .col-20 {
  width: 20%;
  display: inline-block;
  text-align: center;
  box-sizing: border-box;
  margin-right: -5px;
  color: #333;
}
#store-info .custom-url-wrap .van-icon-all {
  font-size: 15px;
}
#store-info .custom-url-wrap .van-icon-right {
  color: #999;
}
#store-info .detail-region .col-20 .van-icon {
  font-size: 26px;
  margin: 8px 0;
}
#store-info .detail-region.custom-url-wrap .wui-cell::after {
  border-top: 0;
}
#store-info .detail-content {
  padding-left: 15px;
}
#store-info .detail-content div:last-child {
  border-bottom: 0;
}
#store-info .detail-content .wui-cell.last .icon-notification {
  position: absolute;
  top: 50%;
  left: 0px;
  transform: translate(0, -50%);
}
#store-info .detail-content .wui-cell.last .notice-content {
  margin-left: 27px;
  display: inline-block;
}
#store-info .detail-phone {
  position: relative;
}
#store-info .detail-phone {
  padding: 6px 0;
}
#store-info .rest-ico {
  float: left;
  display: inline-block;
  width: 24px;
  height: 24px;
  line-height: 24px;
  text-align: center;
}
#store-info .call-phone {
  padding: 0 15px;
  height: 38px;
  line-height: 38px;
}
#store-info .call-phone .icon {
  font-size: 20px;
}
#store-info .detail-mobile .rest-text,
.detail-service .rest-text,
.detail-time .rest-text,
.detail-qq .rest-text,
.detail-weixin .rest-text {
  margin-left: 27px;
}
#store-info .detail-service,
.detail-qq,
#store-info .detail-time,
.detail-mobile {
}
#store-info .rest-text .service .list {
  position: relative;
}
#store-info .rest-text .service .list .img {
  display: inline-block;
  width: 20px;
  height: 20px;
  margin: 0 10px;
}
#store-info .rest-text .service .list .img img {
  width: 100%;
  height: 100%;
}
#store-info .rest-text .allocation-icon {
  margin-right: 5px;
  display: inline-block;
  position: relative;
  background-color: #ff2d4b;
  height: 15px;
  line-height: 15px;
  padding: 0 6px;
  font-size: 10px;
  color: #fff;
  font-weight: normal;
  vertical-align: middle;
  border-radius: 5px 0 5px 0;
}
#store-info .detail-content .pic {
  padding: 10px 15px 10px 0;
  width: 100%;
}
#store-info .detail-content .pic .pic-container {
  width: 100%;
  height: 50px;
  overflow-x: scroll;
  white-space: nowrap;
  overflow-y: hidden;
}
#store-info .pic-box {
  display: inline-block;
  height: 100%;
  width: 22%;
  margin-right: 2%;
}
#store-info .pic-box img {
  width: 100%;
  height: 100%;
}
#store-info .discount-item {
  padding: 10px 15px;
}
#store-info .discount-item .left .icon-b {
  width: 18px;
  height: 18px;
}
#store-info .discount-item .left .icon-b img {
  width: 100%;
  height: 100%;
}
#store-info .discount-item .left .tags::before {
  padding: 2px 4px;
}
#store-info .discount-item .right {
  margin-left: 10px;
}
/*店铺休息中推荐*/
#store-info .recommend-popup {
  width: 100%;
  height: 380px;
  overflow: hidden;
  z-index: 100000 !important;
}
#store-info .guide-head {
  width: 93%;
  background: #fff;
  padding: 15px 15px;
  text-align: center;
  color: #333;
  height: 100px;
  box-sizing: border-box;
  margin: 0 auto;
}
#store-info .guide-head .store-rest {
  font-size: 20px;
  font-weight: 600;
  line-height: 20px;
  overflow: hidden;
  padding-left: 22px;
  text-align: center;
}
#store-info .guide-head .store-rest .store-close {
  float: right;
}
#store-info .guide-head .store-rest .store-close .van-icon-unfold {
  float: right;
  width: 100%;
  height: 100%;
  text-align: center;
  font-size: 16px;
  line-height: 16px;
  color: #727272;
}
#store-info .guide-head .store-start {
  font-size: 16px;
  color: #727272;
  display: block;
}
#store-info .guide-head .store-recommended {
  font-size: 16px;
  color: #ccc;
  display: block;
  margin-top: 7px;
}
#store-info .diy-store-list {
  width: 100%;
  height: 270px;
  box-sizing: border-box;
  overflow-y: auto;
}
#store-info .report {
  margin: 10px 0;
  padding: 10px 0;
  background-color: #fff;
  font-size: 16px;
  text-align: center;
  color: #ff2d4b;
  line-height: 1.5;
}
#store-info .store-thumbs {
  width: 100%;
  height: 60px;
  overflow-y: hidden;
  overflow-x: scroll;
  white-space: nowrap;
}
#store-info .store-thumbs .thumb-item {
  width: 25%;
  height: 100%;
  padding: 0 5px;
  font-size: 0px;
  display: inline-block;
}
</style>



// WEBPACK FOOTER //
// src/pages/store/index.vue