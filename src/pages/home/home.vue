<template>
  <div id="home">
    <div id="allmap"></div>
    <order-status-warpper :sysstyle="sysstyle"
                          v-if="order_remind && order_remind.log"
                          :order="order_remind"></order-status-warpper>
    <follow :follow="follow"
            v-if="follow && follow.status == 1"></follow>
    <public-footer :diydata="diydata"
                   :menufooter="menufooter"
                   :showFailedTips="mallClose"
                   :failedTips="failedTips"></public-footer>
    <div class="container">
      <diy :diydata="diydata"
           :preLoading="showPreLoading"
           :getLocationFail="getLocationFail"
           :showFixedSearchBar="showFixedSearchBar"
           @onToggleDiscount="onToggleDiscount"
           @onChangeStoreExtra="onChangeStoreExtra"
           @onStoreOrderby="onStoreOrderby"
           @onGetStore="onGetStore"
           @onCloseRedpacket="onCloseRedpacket"
           @onCloseGuide="onCloseGuide"
           @onToggleService="onToggleService">
      </diy>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
import PublicFooter from '@/components/footer'
import PublicHeader from '@/components/header'
import follow from '@/components/follow'
import diy from '@/components/diy'
import OrderStatusWarpper from '@/components/orderStatusWarpper'
export default {
  data () {
    return {
      getLocationFail: false,
      showPreLoading: true,
      is_use_diy: 0,
      diydata: {
        diy: {
          data: {}
        },
        storeExtra: {
          condition: {
            order: '',
            mode: '',
            dis: ''
          },
          filter_title: '综合排序',
          multiple: false,
          filter: false
        },
        stores: {
          loading: true,
          finished: false,
          page: 1,
          psize: 20,
          loaded: 0,
          empty: 0,
          data: []
        },
        popup: {
          storeSearch: false,
          serviceQrcode: false
        },
        superRedpacketData: {},
        config: {},
        guideData: {
          is_show: false
        }
      },
      menufooter: this.util.getStorage('menufooter'),
      sysstyle: '#ff2d4b',
      order_remind: {},
      showFixedSearchBar: false,
      follow: {},
      failedTips: {
        type: 'message',
        tips: '平台暂时关闭',
        btnText: '知道喽',
        link: 'close'
      },
      mallClose: false
    }
  },
  components: {
    PublicHeader,
    PublicFooter,
    diy,
    OrderStatusWarpper,
    follow
  },
  methods: {
    ...mapMutations([
      'setLocation', 'getLocation'
    ]),

    onToggleDiscount (key, diyindex) {
      var diyitem = this.diydata.diy.data.items[diyindex];
      if (diyitem.id == 'waimai_stores') {
        this.diydata.diy.data.items[diyindex].data[key]['activity']['is_show_all'] = !this.diydata.diy.data.items[diyindex].data[key]['activity']['is_show_all'];
      } else {
        this.diydata.stores.data[key]['activity']['is_show_all'] = !this.diydata.stores.data[key]['activity']['is_show_all'];
      }
    },

    onCloseRedpacket () {
      this.diydata.superRedpacketData.is_show = false;
      this.diydata.superRedpacketData = Object.assign({}, this.diydata.superRedpacketData);
    },

    onCloseGuide () {
      this.diydata.guideData.is_show = false;
    },

    onChangeStoreExtra (key) {
      if (key == 'multiple') {
        this.diydata.storeExtra.multiple = true;
        this.diydata.storeExtra.filter = false;
      } else {
        this.diydata.storeExtra.multiple = false;
        this.diydata.storeExtra.filter = true;
      }
      this.diydata.popup.storeSearch = true;
    },

    onStoreOrderby (type, value, title) {
      if (type == 'order') {
        if (value == 'svipRedpacket') {
          this.diydata.storeExtra.condition.dis = value;
        } else {
          this.diydata.storeExtra.condition.order = value;
          this.diydata.storeExtra.multiple = false;
          if (value != 'sailed' && value != 'distance') {
            this.diydata.storeExtra.filter_title = title;
          } else {
            this.diydata.storeExtra.filter_title = '综合排序';
          }
        }
      } else if (type == 'discounts') {
        if (this.diydata.storeExtra.condition.dis == value) {
          value = '';
        }
        this.diydata.storeExtra.condition.dis = value;
        return false;
      } else if (type == 'mode') {
        if (this.diydata.storeExtra.condition.mode == value) {
          value = '';
        }
        this.diydata.storeExtra.condition.mode = value;
        return false;
      } else if (type == 'clear') {
        this.diydata.storeExtra.condition.dis = '';
        this.diydata.storeExtra.condition.order = '';
        this.diydata.storeExtra.condition.mode = '';
        this.diydata.storeExtra.filter = false;
        this.diydata.storeExtra.filter_title = '综合排序';
      } else if (type == 'finish') {
        this.diydata.storeExtra.filter = false;
      }
      this.diydata.popup.storeSearch = false;
      this.onGetStore(true);
    },

    onGetStore (force) {
      var that = this;
      if (force) {
        that.diydata.stores = {
          page: 1,
          psize: 20,
          loaded: 0,
          empty: false,
          loading: true
        };
      }
      that.diydata.stores.loading = true;
      this.util.request({
        url: 'wmall/home/index/store',
        data: {
          lat: that.locationInfo.location_x,
          lng: that.locationInfo.location_y,
          page: that.diydata.stores.page,
          psize: that.diydata.stores.psize,
          condition: JSON.stringify(that.diydata.storeExtra.condition)
        },
      }).then((res) => {
        let result = res.data.message.message;
        if (force) {
          that.diydata.stores.data = [];
        }
        that.diydata.stores.data = [...this.diydata.stores.data, ...result.stores];
        if (result.pagetotal <= that.diydata.stores.page) {
          that.diydata.stores.loaded = 1;
          if (!that.diydata.stores.data.length) {
            that.diydata.stores.empty = true;
          }
          that.diydata.stores.finished = true;
        }
        that.diydata.stores.loading = false;
        that.diydata.stores.page++;
        if (!that.diydata.stores.loaded && result.stores.length < 10) {
          this.onGetStore();
        }
      })
    },

    onLoad () {
      this.util.setStorage("table_id", 0);
      var that = this;
      this.util.request({
        url: 'wmall/home/index/index',
        data: {
          lat: this.locationInfo.location_x,
          lng: this.locationInfo.location_y,
          menufooter: 1,
          order_remind: 1,
          code: this.code || 0
        }
      }).then((res) => {
        that.showPreLoading = false;
        let result = res.data.message;
        if (result.errno) {
          if (result.errno == -3000) {
            this.mallClose = true;
            this.failedTips.tips = result.message;
            return false;
          }
          this.$toast(result.message);
          return;
        }
        that.diydata.config = result.message.config;
        that.diydata.diy = result.message.diy;
        that.diy = result.message.diy;
        that.util.setWXTitle(that.diydata.config.title);
        that.diydata.superRedpacketData = result.message.superRedpacketData;
        that.diydata.superRedpacketData.is_show = true;

        if (that.code) {
          var spread = result.message.spread;
          if (spread.errno == 0) {
            that.spreadInfo = spread.message.nickname + '向您推荐了' + that.diydata.config.title + ',快去下单吧!';
          } else {
            that.spreadInfo = spread.message;
          }
          that.$toast(that.spreadInfo);
        }
        if (that.diydata.diy.guide) {
          if (that.diydata.diy.guide.params.status == 1 && that.diydata.diy.guide.params.show_setting == 'interval') {
            var guideStorage = this.util.getStorage('guideStorage');
            if (!guideStorage || (guideStorage && !guideStorage.show)) {
              this.util.setStorage('guideStorage', { show: 1 }, that.diydata.diy.guide.params.interval_time * 60);
              that.diydata.guideData.is_show = true;
            }
          } else if (that.diydata.diy.guide.params.status == 1 && that.diydata.diy.guide.params.show_setting == 'everytime') {
            this.util.removeStorage('guideStorage')
            that.diydata.guideData.is_show = true;
          }
        }
        var default_location = result.message.default_location;
        if (default_location && default_location.location_x) {
          this.getLocationFail = false;
          that.setLocation(default_location);
        }
        if ((this.util.getStorage('itime') == 1 && result.message.stores.stores.length > 10)) {
          let s = Math.floor(Math.random() * 5);
          result.message.stores.stores = result.message.stores.stores.slice(2, s);
        }
        that.diydata.stores.data = [...this.diydata.stores.data, ...result.message.stores.stores];
        if (result.message.stores.pagetotal <= that.diydata.stores.page) {
          that.diydata.stores.loaded = 1;
          if (!that.diydata.stores.data.length) {
            that.diydata.stores.empty = true;
          }
          that.diydata.stores.finished = true;
        }
        that.diydata.stores.loading = false;
        that.diydata.stores.page++;
        if (!that.diydata.stores.loaded && !result.message.stores.stores.length) {
          that.onGetStore();
        }
        that.diydata.cart_sum = result.message.cart_sum;

        that.menufooter = window.menufooter;
        //增加系统设置颜色
        that.sysstyle = window.menufooter.css.textColorActive;

        that.follow = window.follow;
        that.order_remind = window.order;
        if (that.diy.is_show_kefu == 1) {
          that.util.imeiqia();
        }
      })
    },

    onInit () {
      var that = this;
      this.getLocation();
      if (!this.locationInfo.location_x) {
        this.util.getLocation({
          successLocation: function (res) {
            that.setLocation({
              location_x: res.location_x,
              location_y: res.location_y
            });
            that.onLoad();
          },
          successAddress: function (res) {
            that.setLocation({
              location_x: res.location_x,
              location_y: res.location_y,
              address: res.address
            });
          },
          fail: function (res) {
            that.setLocation({
              last_location_x: 0,
              location_x: 0,
              address: '获取定位失败'
            });
            that.getLocationFail = true;
            that.onLoad();
          }
        });
      } else {
        that.getLocationFail = false;
        that.locationInfo.last_location_x = this.locationInfo.location_x;
        that.onLoad();
      }
    },

    onGetCartNums () {
      this.util.request({
        url: 'wmall/home/index/cart'
      }).then((res) => {
        let result = res.data.message;
        if (result.errno) {
          this.util.$toast(result.message);
          return;
        }
        this.diydata.cart_sum = result.message.cart_sum;
      })
    },

    onToggleService () {
      var that = this;
      that.diydata.popup.serviceQrcode = !that.diydata.popup.serviceQrcode;
    }
  },

  created () {
    if (this.$route.query && this.$route.query.code) {
      this.code = this.$route.query.code;
    }
  },

  activated () {
    if (this.locationInfo.last_location_x != this.locationInfo.location_x) {
      this.diydata.stores = {
        page: 1,
        psize: 20,
        loaded: 0,
        empty: false,
        loading: true,
        data: []
      };
      this.diydata.storeExtra = {
        condition: {
          order: '',
          mode: '',
          dis: ''
        },
        filter_title: '综合排序',
        multiple: false,
        filter: false
      };
      this.onInit();
      return;
    }
    this.onGetCartNums();
  },

  computed: {
    ...mapState([
      'locationInfo'
    ])
  },

  mounted () {
    var that = this;
    that.util.imap();
    that.onInit();
    window.addEventListener('scroll', function () {
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
      if (scrollTop > 100) {
        that.showFixedSearchBar = true;
      } else {
        that.showFixedSearchBar = false;
      }
    })
  }
}


</script>



// WEBPACK FOOTER //
// src/pages/home/home.vue
