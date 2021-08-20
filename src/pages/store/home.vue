<template>
  <div id="store-home">
    <public-header :title="title"></public-header>
    <public-footer :preLoading="showPreLoading"
                   :menufooter="menufooter"
                   v-if="gconfig && gconfig.mall.version == 2"></public-footer>
    <div class="content">
      <diy :diydata="diydata"
           :active='active'
           :is_grant='is_grant'
           :preLoading="showPreLoading"
           @onChangeTab="onChangeTab"
           @getCoupon="getCoupon">
      </diy>
    </div>
  </div>
</template>

<script>
import PublicHeader from '@/components/header'
import PublicFooter from '@/components/footer'
import diy from '@/components/diy'
import { mapState, mapMutations } from 'vuex'
export default {
  data () {
    return {
      showPreLoading: true,
      is_grant: 0,
      title: '',
      active: 1,
      diydata: {
        diy: {
          data: {}
        }
      },
      gconfig: {
        mall: {}
      },
      menufooter: {
        params: {
          navstyle: 0,
        },
        css: {
          'iconColor': '#163636',
          'iconColorActive': '#ff2d4b',
          'textColor': '#929292',
          'textColorActive': '#ff2d4b',
        },
        data: {
          M0123456789101: {
            'link': 'pages/store/home?sid=' + this.util.getUrlParam(window.location.href, 'sid'),
            'icon': 'icon-home',
            'text': '首页',
          },
          M0123456789102: {
            'link': 'pages/order/index',
            'icon': 'icon-order',
            'text': '订单',
          },
          M0123456789103: {
            'link': 'pages/member/mine',
            'icon': 'icon-mine',
            'text': '我的',
          },
        }
      }
    }
  },
  components: {
    PublicHeader,
    PublicFooter,
    diy
  },
  methods: {
    ...mapMutations([
      'setLocation', 'getLocation'
    ]),

    onLoad () {
      this.util.request({
        url: 'wmall/store/home/index',
        data: {
          sid: this.sid || 3,
          gconfig: 1
        },
      }).then((res) => {
        this.showPreLoading = false;
        this.gconfig = window.gconfig;
        let result = res.data.message;
        if (result.errno) {
          this.$toast(result.message);
          return;
        }
        this.diydata.diy.data = result.message.homepage;
        this.title = this.diydata.diy.data.page.title || '门店首页';
        this.util.setWXTitle(this.title);
      })
    },
    onChangeTab (index, title) {
      //alert(index);
    },
    getCoupon () {
      this.util.request({
        url: 'wmall/channel/coupon/get',
        data: {
          sid: this.sid
        },
      }).then((res) => {
        let result = res.data.message;
        if (result.errno == 0) {
          this.util.$toast(result.message, '', 1000);
          this.is_grant = 1;
        } else {
          this.util.$toast('领取失败', '', 1000);
        }
      })
    }
  },
  created () {
    this.query = this.$route.query;
    if (this.query) {
      this.sid = this.query.sid;
    }
  },
  mounted () {
    this.onLoad();
  }
}
</script>

<style>
</style>


// WEBPACK FOOTER //
// src/pages/store/home.vue