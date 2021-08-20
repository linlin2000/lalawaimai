<template>
  <div id="goods-store">
    <follow :follow="follow"
            v-if="follow && follow.status == 1"></follow>
    <public-header :title="store.title"
                   v-if="!isWeixin"></public-header>
    <!-- <store-header :store="store"></store-header> -->

    <div class="swipeSmall"
         v-if="swipeShow">
      <div class="swipeText"
           @click="swipeShow = !swipeShow">切换大小图模式</div>
      <van-swipe class="home-swipe"
                 :autoplay="3000"
                 indicator-color="white">
        <van-swipe-item>
          <img v-lazy="'https://img01.yzcdn.cn/vant/apple-2.jpg'" />
        </van-swipe-item>
        <van-swipe-item>
          <img v-lazy="'https://img01.yzcdn.cn/vant/apple-1.jpg'" />
        </van-swipe-item>
      </van-swipe>
    </div>
    <!-- 标签 -->
    <div class="store-tabs flex-lr van-hairline--bottom">
      <div class="tab-item active"
           :style="{color:sysstyle}">商品</div>
      <router-link :style="{color:sysstyle}"
                   class="tab-item"
                   :to="util.getUrl({path: '/pages/store/comment?custtype=tangshi&sid=' + store.id})"
                   tag="div">评价</router-link>
      <router-link :style="{color:sysstyle}"
                   class="tab-item"
                   :to="util.getUrl({path: '/pages/store/index?sid=' + store.id})"
                   tag="div">商家</router-link>
      <!-- <router-link :style="{color:sysstyle}"
                   class="tab-item"
                   :to="util.getUrl({path: '/pages/store/pindan', query: {sid: store.id, pindan_id: pindan_id}})"
                   v-if="store.pindan_status == 1 && pindan_id == 0">
        <div class="pindan-item">邀请拼单</div>
      </router-link> -->
      <van-search v-model="value"
                  shape="round"
                  background="#fff"
                  placeholder="想吃点什么" />
    </div>
    <div class="swipeBig"
         v-if="!swipeShow">
      <div class="swipeText"
           @click="swipeShow = !swipeShow">切换大小图模式</div>
      <van-swipe class="home-swipe"
                 :autoplay="3000"
                 indicator-color="white">
        <van-swipe-item>
          <img v-lazy="'https://img01.yzcdn.cn/vant/apple-2.jpg'" />
        </van-swipe-item>
        <van-swipe-item>
          <img v-lazy="'https://img01.yzcdn.cn/vant/apple-1.jpg'" />
        </van-swipe-item>
      </van-swipe>
    </div>
    <div class="goods-container">
      <van-row class="goods-some"
               v-if="template_page == 1">
        <van-col span="5"
                 :style="{height: vanColHeight +'px'}">
          <van-badge-group :active-key="categorySelectedIndex"
                           class="tabs-list">
            <router-link tag="div"
                         :to="util.getUrl({path: '/pages/store/search', query: {sid: store.id, pindan_id: pindan_id}})"
                         class="van-badge badge-search">
              <i class="icon icon-search"></i>
            </router-link>
            <template v-for="(item, index) in categoryAll">
              <van-badge class="border-0px van-hairline--top"
                         :title="item.title"
                         @click="onToggleCategory(item.id, index, '')"
                         v-if="item.total > 0"
                         :info="item.total" />
              <van-badge class="border-0px van-hairline--top"
                         :title="item.title"
                         @click="onToggleCategory(item.id, index, '')"
                         v-else />
            </template>
          </van-badge-group>
        </van-col>
        <van-col span="19"
                 :style="{height: vanColHeight +'px'}">
          <van-list v-model="goodsLoading"
                    :finished="goodsItem.loaded"
                    @load="onGetGoods"
                    :offset="50">
            <!-- 商家代金券 -->
            <div class='coupon-show-container'
                 v-if="coupon.id > 0 && couponStatus == 1">
              <div class='coupon-price'>
                ¥<div>{{coupon.price}}</div>
              </div>
              <div class='coupon-detail'>
                <div class='coupon-title'>商家代金券</div>
                <div class='coupon-desc'>内含{{coupon.num}}张券</div>
              </div>
              <div class='coupon-fetch'
                   @click="onCollectCoupon">去领取</div>
            </div>
            <!-- 门店海报 -->
            <div class="banner"
                 v-if="shopPage">
              <template v-for="(shopPageItem, shopPageKey) in shopPage">
                <div class="banner-item"
                     v-if="shopPageItem.wxapp_link"
                     @click="util.jsUrl(shopPageItem.wxapp_link)">
                  <img :src="shopPageItem.thumb">
                </div>
                <router-link class="banner-item"
                             v-else-if="shopPageItem.goodsLength == 1"
                             :to="util.getUrl({path: '/pages/store/goodsDetail', query:{sid: store.id, id: shopPageItem.goods[0], pindan_id: pindan_id}})">
                  <img :src="shopPageItem.thumb">
                </router-link>
                <router-link class="banner-item"
                             v-else-if="shopPageItem.goodsLength > 1"
                             :to="util.getUrl({path: '/pages/store/shopPage', query:{sid: store.id, shopPageKey: shopPageKey, pindan_id: pindan_id}})">
                  <img :src="shopPageItem.thumb">
                </router-link>
              </template>
            </div>
            <!-- 二级分类 -->
            <template v-if="categorySelected.child">
              <div class="tag2-list"
                   v-if="categorySelected.child.length > 0">
                <div class="tag2-item"
                     v-for="(item, index) in categorySelected.child"
                     :class="{selected: index == childSelectedIndex}"
                     @click="onToggleCategory(item.id, index, 'child')"
                     :key="index">
                  {{item.title}}
                  <div :class="{dot: item.total}"
                       v-if="item.total > 0"></div>
                </div>
              </div>
            </template>
            <div class="title border-1px-t">
              <div class="title-text ellipsis">
                <div class='title-line'
                     style="{'border-color': '#6BBA50'}"></div>
                {{categorySelected.child && categorySelected.child.length > 0 ? categorySelected.child[childSelectedIndex].title : categorySelected.title}}
                <div class="limit-tip"
                     v-if="categorySelected.min_fee > 0">最低消费{{categorySelected.min_fee}}元</div>
              </div>
              <div class="title-rank">
                <div class="sales "
                     :class="{'selected': (goodsItem.orderby.type == 'sailed')}"
                     @click="onOrderby('sailed', 'desc')">销量</div>
                <div class="shu">|</div>
                <div class="prionToggleCategoryce-container"
                     @click="onOrderby('price', (goodsItem.orderby.value == 'desc' ? 'asc' : 'desc'))">
                  <div class="price">价格</div>
                  <div class="triangle">
                    <div class="triangle-top"
                         :class="{selected: (goodsItem.orderby.type == 'price' && goodsItem.orderby.value == 'asc')}"></div>
                    <div class="triangle-bottom "
                         :class="{selected: (goodsItem.orderby.type == 'price' && goodsItem.orderby.value == 'desc')}"></div>
                  </div>
                </div>
              </div>
            </div>
            <!-- 单列模板 -->
            <template v-if="template == 2">
              <div class="goods clearfix "
                   v-if="goodsItem.data.length > 0"
                   v-for="(item, index) in goodsItem.data"
                   :key="item.id">
                <div class="goods-inner border-1px-b">
                  <router-link class="image-box"
                               :to="util.getUrl({path: '/pages/store/goodsDetail', query: {id: item.id, sid: store.id, pindan_id: pindan_id}})">
                    <img class="pic"
                         v-lazy="{src: item.thumb, loading: lazyload_goods}">
                    <div class="label"
                         v-if="item.label">{{item.label}}</div>
                  </router-link>
                  <div class='shop-info clearfix'>
                    <div class="name ellipsis">{{item.title}}</div>
                    <div class="description">{{item.content}}</div>
                    <div class="sold">已售{{item.sailed}} 赞{{item.comment_good}}</div>
                    <div class="svip-price-tips"
                         v-if="item.svip_status == 1 && !item.discount_price">
                      <div class="svip-price">
                        <i class="icon icon-crownfill"></i>
                        <span>{{item.discount}}折</span>
                      </div>
                      <div class="svip-activity">超级会员专享</div>
                    </div>
                    <div class="price">
                      <div class="now-price">
                        <span class="price-icon font-14">￥</span>{{item.price}}<span class="font-14 font-bold">{{item.unitname_cn}}</span>
                      </div>
                      <div class='old-price'
                           v-if="item.old_price">
                        <div class="price-icon">￥</div>{{item.old_price}}
                      </div>
                    </div>
                    <div class='discount'
                         v-if="item.svip_status != 1 || item.discount_price > 0">
                      <template v-if="item.discount">
                        <van-icon name='tag'></van-icon>
                        x{{item.discount}}折 限{{item.max_buy_limit}}份 {{item.unitnum > 1 ? item.unitnum + '份起购' : ''}}
                      </template>
                      <template v-else-if="item.unitnum > 1">
                        <van-icon name='tag'></van-icon>{{item.unitnum}}份起购
                      </template>
                    </div>
                    <div class='discount'
                         v-else-if="item.unitnum > 1">
                      <van-icon name='tag'></van-icon>{{item.unitnum}}份起购
                    </div>
                  </div>
                  <goods-handle :dobblu="1"
                                :goods="item"
                                :optionId="0"
                                from="list"
                                @onParentSelectOption="onParentSelectOption"
                                @onParentPopupNotInSailTime="onParentPopupNotInSailTime">
                  </goods-handle>
                  <div style="clear:both"></div>
                </div>
              </div>
            </template>
            <!-- 双列模板 -->
            <template v-else>
              <div class="goods-list clearfix"
                   v-if="goodsItem.data && goodsItem.data.length > 0">
                <div class="col-50 goods-item"
                     v-for="(item, index) in goodsItem.data"
                     :key="item.id">
                  <div class="goods-info">
                    <router-link class="avatar"
                                 :to="util.getUrl({path: '/pages/store/goodsDetail', query: {id: item.id, sid: store.id, pindan_id: pindan_id}})">
                      <div class="discount"
                           v-if="(item.svip_status != 1 || item.discount_price > 0) && item.discount > 0">
                        <div>
                          <van-icon name="tag"></van-icon> xy{{item.discount}}折 限{{item.max_buy_limit}}份 {{item.unitnum > 1 ? item.unitnum + '份起' : ''}}
                        </div>
                      </div>
                      <div class="discount"
                           v-if="item.unitnum > 1 && !item.discount_price">
                        <div>
                          <van-icon name="tag"></van-icon> {{item.unitnum}}份起
                        </div>
                      </div>
                      <img v-lazy="{src: item.thumb, loading: lazyload_goods}">
                    </router-link>
                    <div class="goods-name">{{item.title}}</div>
                    <!--已售和超级会员价格只显示一个-->
                    <div class="svip-price-tips"
                         v-if="item.svip_status == 1 && !item.discount_price">
                      <div class="svip-price">
                        <span class="ellipsis">{{item.discount}}折</span>
                      </div>
                      <div class="svip-activity ellipsis">超级会员专享</div>
                    </div>
                    <div class="solid"
                         v-else>
                      已售{{item.sailed}} <div>赞{{item.comment_good}}</div>
                    </div>
                    <div class="price">¥
                      <div>{{item.price}}</div><span class="font-bold">{{item.unitname_cn}}</span>
                    </div>
                    <div class="old-price"
                         v-if="item.old_price">{{item.old_price}}</div>
                    <goods-handle :goods="item"
                                  :template="template"
                                  :optionId="0"
                                  from="list"
                                  @onParentSelectOption="onParentSelectOption"
                                  @onParentPopupNotInSailTime="onParentPopupNotInSailTime">
                    </goods-handle>
                  </div>
                </div>
                <div style="clear: both"></div>
              </div>
            </template>
            <load v-if="goodsItem.empty == 1"
                  type="loaded"
                  text="暂无商品"></load>
            <load v-else-if="goodsItem.loaded"
                  type="loaded"
                  text="已经到底了"></load>
            <!--<load v-if="goodsLoading" type="loading"></load>-->
          </van-list>
        </van-col>
      </van-row>
      <van-row class="goods-all"
               v-else>
        <van-col span="5"
                 :style="{height: vanColHeight +'px'}">
          <div ref="categoryWrapper"
               :style="{height: vanColHeight +'px'}">
            <van-badge-group :active-key="tabActive"
                             class="tabs-list">
              <!-- <router-link tag="div"
                           :to="util.getUrl({path: '/pages/store/search', query: {sid: store.id, pindan_id: pindan_id}})"
                           class="van-badge badge-search">
                <i class="icon icon-search"></i>
              </router-link> -->
              <template v-for="(item, index) in cateHasGoods">
                <li ref="categoryItem"
                    @click="selectCategory(index, $event)">
                  <van-badge class="border-0px van-hairline--top"
                             :title="item.title"
                             v-if="item.total > 0"
                             :info="item.total" />
                  <van-badge class="border-0px van-hairline--top"
                             :title="item.title"
                             v-else />
                </li>
              </template>
            </van-badge-group>
          </div>
        </van-col>
        <van-col span="19"
                 :style="{height: vanColHeight +'px'}">
          <div ref="goodsWrapper"
               :style="{height: vanColHeight +'px'}">
            <div>
              <!-- 商家代金券 -->
              <div class='coupon-show-container'
                   ref="couponWrapper"
                   v-if="coupon.id > 0 && couponStatus == 1">
                <div class='coupon-price'>
                  ¥<div>{{coupon.price}}</div>
                </div>
                <div class='coupon-detail'>
                  <div class='coupon-title'>商家代金券</div>
                  <div class='coupon-desc'>内含{{coupon.num}}张券</div>
                </div>
                <div class='coupon-fetch'
                     @click="onCollectCoupon">去领取</div>
              </div>
              <!-- 门店海报 -->
              <div class="banner"
                   ref="shopPageWrapper"
                   v-if="shopPage">
                <template v-for="(shopPageItem, shopPageKey) in shopPage">
                  <div class="banner-item"
                       v-if="shopPageItem.wxapp_link"
                       @click="util.jsUrl(shopPageItem.wxapp_link)">
                    <img :src="shopPageItem.thumb">
                  </div>
                  <router-link class="banner-item"
                               v-else-if="shopPageItem.goodsLength == 1"
                               :to="util.getUrl({path: '/pages/store/goodsDetail', query:{sid: store.id, id: shopPageItem.goods[0], pindan_id: pindan_id}})">
                    <img :src="shopPageItem.thumb">
                  </router-link>
                  <router-link class="banner-item"
                               v-else-if="shopPageItem.goodsLength > 1"
                               :to="util.getUrl({path: '/pages/store/shopPage', query:{sid: store.id, shopPageKey: shopPageKey, pindan_id: pindan_id}})">
                    <img :src="shopPageItem.thumb">
                  </router-link>
                </template>
              </div>
              <ul>
                <li v-for="(citem, cindex) in cateHasGoods"
                    :key="cindex"
                    ref="goodsList">
                  <div class="title border-1px-t">
                    <div class="title-text ellipsis">
                      <div class='title-line'
                           style="{'border-color': '#6BBA50'}"></div>
                      {{citem.title}}
                      <div class="limit-tip"
                           v-if="citem.category_min_fee > 0">最低消费{{citem.category_min_fee}}元</div>
                    </div>
                  </div>
                  <!-- 单列模板 外卖-->
                  <template v-if="template == 2">
                    <div class="goods clearfix"
                         v-if="citem.goods.length > 0"
                         v-for="(item, index) in citem.goods"
                         :key="index">
                      <div class="goods-inner "
                           :class="{'border-1px-b': index < citem.goods.length - 1}">
                        <router-link class="image-box"
                                     :to="util.getUrl({path: '/pages/store/goodsDetail', query: {id: item.id, sid: store.id, pindan_id: pindan_id}})">
                          <img class="pic"
                               v-lazy="{src: item.thumb, loading: lazyload_goods}">
                          <div class="label"
                               v-if="item.label">{{item.label}}</div>
                        </router-link>
                        <div class='shop-info clearfix'>
                          <div class="name ellipsis">{{item.title}}</div>
                          <div class="description">{{item.content}}</div>
                          <div class="sold">已售{{item.sailed}} 赞{{item.comment_good}}</div>
                          <div class="svip-price-tips"
                               v-if="item.svip_status == 1 && !item.bargain_id">
                            <div class="svip-price">
                              <i class="icon icon-crownfill"></i>
                              <span>{{item.discount}}折</span>
                            </div>
                            <div class="svip-activity">超级会员专享</div>
                          </div>
                          <div class="price">
                            <div class="now-price">
                              <span class="price-icon font-14">￥</span>{{item.price}}<span class="font-14 font-bold">{{item.unitname_cn}}</span>
                            </div>
                            <div class='old-price'
                                 v-if="item.old_price">
                              <div class="price-icon">￥</div>{{item.old_price}}
                            </div>
                          </div>
                          <div class='discount'
                               v-if="(item.svip_status != 1 || item.bargain_id > 0) && item.notvip==1">
                            <template v-if="item.discount">
                              <van-icon name='tag'></van-icon>
                              会员价：{{item.fans_show_vip_price}}元
                            </template>
                          </div>
                          <div class='discount'
                               v-if="(item.svip_status != 1 || item.bargain_id > 0) && item.notvip==0">
                            <template v-if="item.discount">
                              <van-icon name='tag'></van-icon>
                              会员价：{{item.price}}元
                            </template>
                          </div>

                        </div>
                        <goods-handle :goods="item"
                                      :isdouble="0"
                                      :optionId="0"
                                      from="list"
                                      templatePage="1"
                                      @onParentPlus="onParentPlus"
                                      @onParentSelectOption="onParentSelectOption"
                                      @onParentPopupNotInSailTime="onParentPopupNotInSailTime"
                                      @showMoveDot="showMoveDotFun">
                        </goods-handle>
                        <div style="clear:both"></div>
                      </div>
                    </div>
                  </template>
                  <!-- 双列模板双排外卖 -->
                  <template v-else>
                    <div class="goods-list clearfix"
                         v-if="citem.goods && citem.goods.length > 0">
                      <div class="col-50 goods-item"
                           v-for="(item, index) in citem.goods"
                           :key="item.id">
                        <div class="goods-info">
                          <router-link class="avatar"
                                       :to="util.getUrl({path: '/pages/store/goodsDetail', query: {id: item.id, sid: store.id, pindan_id: pindan_id}})">
                            <div class="discount"
                                 v-if="(item.svip_status != 1 || item.bargain_id > 0) && item.discount > 0 && item.notvip==0">
                              <div>
                                <van-icon name="tag"></van-icon>
                                会员价：{{item.price}}元
                                <!-- {{item.discount}}折  限{{item.max_buy_limit}}份 {{item.unitnum > 1 ? item.unitnum + '份起' : ''}} -->
                              </div>
                            </div>

                            <div class="discount"
                                 v-if="(item.svip_status != 1 || item.bargain_id > 0) && item.discount > 0 && item.notvip==1">
                              <div>
                                <van-icon name="tag"></van-icon>
                                会员价：{{item.fans_show_vip_price}}元
                              </div>
                            </div>

                            <div class="discount"
                                 v-if="item.unitnum > 1 && !item.bargain_id">
                              <div>
                                <van-icon name="tag"></van-icon> {{item.unitnum}}份起
                              </div>
                            </div>
                            <img v-lazy="{src: item.thumb, loading: lazyload_goods}">
                          </router-link>
                          <div class="goods-name">{{item.title}}</div>
                          <!--已售和超级会员折扣只显示一个-->
                          <div class="svip-price-tips"
                               v-if="item.svip_status == 1 && !item.bargain_id">
                            <div class="svip-price">
                              <span class="ellipsis">{{item.discount}}折</span>
                            </div>
                            <div class="svip-activity ellipsis">超级会员专享</div>
                          </div>
                          <div class="solid"
                               v-else>
                            已售{{item.sailed}} <div>赞{{item.comment_good}}</div>
                          </div>

                          <div class="price">¥
                            <div>{{item.price}}</div><span class="font-bold">{{item.unitname_cn}}</span>
                          </div>
                          <div class="old-price"
                               v-if="item.old_price">{{item.old_price}}</div>
                          <goods-handle :goods="item"
                                        :isdouble="1"
                                        :template="template"
                                        :optionId="0"
                                        from="list"
                                        templatePage="1"
                                        @onParentPlus="onParentPlus"
                                        @onParentSelectOption="onParentSelectOption"
                                        @onParentPopupNotInSailTime="onParentPopupNotInSailTime"
                                        @showMoveDot="showMoveDotFun">
                          </goods-handle>
                        </div>
                      </div>
                      <div style="clear: both"></div>
                    </div>
                  </template>
                </li>
              </ul>
            </div>
          </div>
        </van-col>
      </van-row>
    </div>
    <van-popup v-model="popupNotInSailTime"
               class="not-in-time-popup"
               v-if="popupNotInSailTime">
      <div class='popup-top'>
        <div class='popup-item'
             v-if="goodsActive.week_cn">
          <div class='popup-title'>每周可售日期</div>
          <div class='popup-text'>{{goodsActive.week_cn}}</div>
        </div>
        <div class='popup-item'
             v-if="goodsActive.time_cn">
          <div class='popup-title'>每天可售时间</div>
          <div class='popup-text'>
            {{goodsActive.time_cn}}
          </div>
        </div>
      </div>
      <div class='popup-bottom border-1px-t'
           @click="popupNotInSailTime = false">知道了</div>
    </van-popup>

    <van-popup v-model="ParentPopupSpecShow"
               class="options-popup"
               v-if="ParentPopupSpecShow">
      <div class="options-dialog">
        <div class="muti-close"
             @click="ParentPopupSpecShow = false"></div>
        <div class="muti-wrap">
          <div class="muti-food-title border-1px-b">
            {{goodsActive.title}}
          </div>
          <div class="muti-cont">
            <div class='muti-cont-inner'>
              <div class='muti-sec first'
                   v-if="goodsActive.is_options == 1">
                <div class='muti-sec-title'>规格</div>
                <div class='muti-choice'>
                  <template v-for="(item, index) in goodsActive.options">
                    <div :class="{selected: (goodsActive.activeOptions.optionSelected == item.id)}"
                         @click="onParentToggleOption(item.id, '', 'option')">{{item.name}}</div>
                  </template>
                </div>
              </div>
              <div class='muti-sec'
                   v-if="goodsActive.is_attrs == 1">
                <template v-for="(attrItem, attrIndex) in goodsActive.attrs">
                  <div class='muti-sec-title'>{{attrItem.name}}</div>
                  <div class='muti-choice'>
                    <template v-for="(label, labelIndex) in attrItem.label">
                      <div :class="{selected: (goodsActive.activeOptions.attrsSelected[attrIndex] == labelIndex)}"
                           @click="onParentToggleOption(attrIndex, labelIndex, 'attr')">{{label}}</div>
                    </template>
                  </div>
                </template>
              </div>
            </div>
          </div>
          <div class="muti-choose">
            <div class='muti-oprt'>
              <div class='muti-cart-oprt clearfix'>
                <div class='add-food'>
                  <van-icon name='plus'
                            @click="onParentPlus($event, goodsActive,  '', '', '1')"
                            style="background-color: #6BBA50;"></van-icon>
                </div>
                <template v-if="goodsSpecNum">
                  <div class='food-num'>{{goodsSpecNum}}</div>
                  <div class='remove-food'>
                    <div class='remove icon icon-minus'
                         @click="onParentMinus(goodsActive)"></div>
                  </div>
                </template>
              </div>
            </div>
            <div class='muti-info'>
              <div class='muti-price'>¥{{goodsActive.activeOption.price}}</div>
              <div class='muti-type'>({{goodsActive.activeOption.name}})</div>
            </div>
          </div>
        </div>
      </div>
    </van-popup>

    <!-- 购物车部分 -->
    <store-cart :sysstyle="sysstyle"
                :show="activetabs == 0"
                :store="store"
                :cart="cart"
                :pindan_id="pindan_id"
                @selectPinadan="selectPinadan">
    </store-cart>
    <!-- <usertips  :usertips="usertips" v-if="usertips.next_grade==1"></usertips> -->
    <transition name="loading">
      <iloading v-if="preLoading"></iloading>
    </transition>
    <!--小球-->
    <transition appear
                @after-appear='onParentAfterEnter'
                @before-appear="onParentBeforeEnter"
                v-for="(item,index) in showMoveDot"
                :key="index">
      <div class="parent_move_dot"
           v-if="item"></div>
    </transition>
    <!--公告弹出层-->
    <notice-popup v-if="store.tips && showNotice"
                  :tips="store.tips"></notice-popup>
    <!--普通用户购买超级会员商品弹出层-->
    <van-popup v-model="popupBuySvip"
               class="buy-svip">
      <div class='popup-svip-title'>客官，专享价限超级会员享受哦</div>
      <div class="svip-img">
        <div class="svip-vs-left">
          <i class="icon icon-crownfill"></i>
          <div class="font-12">会员专享价</div>
          <div class="svip-vs-price"><span class="font-14">¥</span>{{goodsActive.svip_price}}</div>
        </div>
        <div class="svip-vs-right">
          <div class="svip-putong-title">普通用户价格</div>
          <div class="svip-putong-price"><span class="font-14">¥</span>{{goodsActive.origin_price}}</div>
        </div>
      </div>
      <div class="buy-svip-text">即刻加入超级会员，尊享众多会员优惠</div>
      <button class="svip-price-btn font-16 margin-15-t">
        <div class="font-bold"
             @click="onParentPlus($event, goodsActive, '', '', '3')">会员专享价购买</div>
        <div class="font-12 padding-5-t">(订单结算时成为会员享优惠)</div>
      </button>
      <van-button size="normal"
                  class="price-btn font-16 margin-15-t"
                  @click="onParentPlus($event, goodsActive, '', '', '2')">原价购买</van-button>
    </van-popup>

  </div>

</template>

<script>
import { mapState, mapMutations } from 'vuex'
import PublicFooter from '@/components/footer'
import PublicHeader from '@/components/header'
import Load from '@/components/load'
import StoreCart from '@/components/storeCart'
import GoodsHandle from '@/components/goodsHandle'
import StoreHeader from '@/components/storeHeader'
import noticePopup from '@/components/noticePopup'
import follow from '@/components/follow'
import BScroll from 'better-scroll'

export default {
  name: 'StoreGoods',
  data () {
    return {
      value: '',
      swipeShow: false,
      goodsActive: {},
      popupNotInSailTime: false,
      ParentPopupSpecShow: false,
      preLoading: true,
      goodsLoading: true,
      store: {
        is_rest: 0,
        activity: {
          num: 0
        }
      },
      activetabs: 0,
      swiper_dots: false,
      tabswiperable: true,
      is_rest: 0,
      status: {
        options_show: false,
        not_in_time_show: false,
        cart_show: false,
      },
      vanColHeight: 0,
      commentHeight: 0,
      categorySelectedIndex: 0,
      categorySelectedId: 0,
      categoryAll: [],
      categorySelected: {
        child: [{}]
      },
      childSelectedIndex: 0,
      childSelectedId: 0,
      goodsAll: [],
      goodsItem: {
        orderby: {
          type: '',
          value: ''
        }
      },
      recommend_stores: {},
      coupon: [],
      shopPage: {},
      cart: {
        num: 0,
      },
      template: 2,
      couponStatus: 1,
      lazyload_goods: '',
      showMoveDot: [],
      windowHeight: 0,
      showNotice: true,

      cateHasGoods: [],
      template_page: 0,
      scrollY: 0,
      listHeight: [],
      tabActive: 0,
      popupBuySvip: false,
      follow: {},
      sysstyle: '#ff2d4b'
    }
  },
  components: {
    PublicHeader,
    PublicFooter,
    Load,
    StoreCart,
    GoodsHandle,
    StoreHeader,
    noticePopup,
    follow
  },
  methods: {
    ...mapMutations([
      'replaceStore', 'replaceCart', 'replaceState'
    ]),

    // cusertips(value){
    //   this.usertips = value;
    // },
    selectPinadan (pindan_id) {
      this.pindan_id = pindan_id;
      if (pindan_id > 0) {
        this.query.pindan_id = pindan_id;
        var url = this.util.getUrl({ path: '/pages/store/goods', query: { sid: this.sid, order_id: this.order_id, pindan_id: pindan_id } });
        this.$router.push(url);
      }
    },
    showMoveDotFun: function (showMoveDot, elLeft, elBottom) {
      this.showMoveDot.push(true);
      this.elLeft = elLeft;
      this.elBottom = elBottom;
    },

    onCollectCoupon () {
      this.util.request({
        url: 'wmall/channel/coupon/get',
        data: { sid: this.sid },
      }).then((result) => {
        var result = result.data.message;
        if (result.errno) {
          this.util.$toast('领取失败', '', 1000);
          return false;
        }
        this.couponStatus = 0;
        this.util.$toast(result.message, '', 1000);
      })
    },

    onParentSelectOption: function (goods) {
      this.goodsActive = goods;
      this.goods = goods;
      this.ParentPopupSpecShow = true;
      if (!this.goods['activeOptions']) {
        this.onParentGoodsOptionInit();
      }
    },

    onParentGoodsOptionInit: function () {
      this.goodsActive = this.goods;
      this.goodsActive['activeOptions'] = {
        option: 0,
        attrs: [],
        optionSelected: 0,
        attrsSelected: [],
        num: 0
      };
      if (this.goodsActive.is_options == 1) {
        this.goodsActive['activeOptions']['option'] = this.goodsActive.options[0]['id'];
        this.goodsActive['activeOptions']['optionSelected'] = this.goodsActive.options[0]['id'];
      }
      if (this.goodsActive.is_attrs == 1) {
        for (var i = 0; i < this.goodsActive.attrs.length; i++) {
          this.goodsActive['activeOptions']['attrs'].push(i + "s0");
          this.goodsActive['activeOptions']['attrsSelected'][i] = 0;
        }
      }
      this.onParentToggleActiveOption();
    },

    onParentToggleOption: function (optionId, optionValueID, type) {
      var goodsActive = this.goods;
      if (type == 'option') {
        goodsActive['activeOptions']['option'] = optionId;
        goodsActive['activeOptions']['optionSelected'] = optionId;
      } else {
        goodsActive['activeOptions']['attrs'][optionId] = optionId + 's' + optionValueID;
        goodsActive['activeOptions']['attrsSelected'][optionId] = optionValueID;
      }
      this.goodsActive = goodsActive;
      this.onParentToggleActiveOption();
    },

    onParentToggleActiveOption: function (option_key) {
      var goodsActive = this.goodsActive;
      if (!option_key) {
        goodsActive['activeOptionId'] = goodsActive['activeOptions']['option'];
        if (goodsActive['activeOptions']['attrs'].length > 0) {
          goodsActive['activeOptionId'] = goodsActive['activeOptionId'] + '_' + goodsActive['activeOptions']['attrs'].join('v')
        }
      } else {
        goodsActive['activeOptionId'] = option_key;
      }
      goodsActive['activeOption'] = goodsActive['options_data'][goodsActive['activeOptionId']];
      goodsActive['activeOption']['num'] = this.parentGetSpecNum();
      this.goodsActive = Object.assign({}, goodsActive)
    },

    parentGetSpecNum: function () {
      if (!this.icart || !this.icart['data1'] || !this.icart['data1'][this.goodsActive.id]) {
        return 0;
      }
      var optionId = this.goodsActive.activeOptionId;
      if (!this.icart['data1'][this.goodsActive.id][optionId]) {
        return 0;
      }
      return this.icart['data1'][this.goodsActive.id][optionId]['num'];
    },

    onParentPlus: function (event, goods, optionId, from, buysvip_status) {
      this.goodsActive = goods;
      var buysvip = 0;
      if (this.icart.pindan_id == 0) {
        if (this.icart.is_buysvip == 1) {
          buysvip = 1;
        } else {
          if (this.icart.svip_buy_show >= 1 && goods.svip_buy_show == 1) {
            if (buysvip_status == 1) {
              if (this.goodsActive.activeOption) {
                if (this.goodsActive.activeOption.origin_price > 0) {
                  this.goodsActive.origin_price = this.goodsActive.activeOption.origin_price;
                } else {
                  this.goodsActive.origin_price = this.goodsActive.activeOption.price;
                }
                if (this.goodsActive.activeOption.svip_price > 0) {
                  this.goodsActive.svip_price = this.goodsActive.activeOption.svip_price;
                } else {
                  this.goodsActive.svip_price = this.goodsActive.activeOption.price;
                }
              }
              this.popupBuySvip = true;
              return;
            } else if (buysvip_status == 2) {
              this.popupBuySvip = false;
            } else if (buysvip_status == 3) {
              this.popupBuySvip = false;
              buysvip = 1;
            }
          }
        }
      }
      var goods_id = goods.id || goods.goods_id;
      var option_id = goods.activeOptionId || optionId;
      var params = {
        sid: this.istore.id,
        goods_id: goods_id,
        option_id: option_id,
        num: 1,
        sign: '+',
        is_buysvip: buysvip
      };
      this.util.request({
        url: 'wmall/store/goods/cart',
        //showLoading: true,
        data: params,
      }).then((result) => {
        var result = result.data.message;
        if (result.errno) {
          this.$toast(result.message);
          return false;
        }
        if (result.message.msg) {
          this.$toast(result.message.msg);
        }

        //this.usertips = result.usertips;


        // 加入购物车动画
        let elLeft = event.target.getBoundingClientRect().left;
        let elBottom = event.target.getBoundingClientRect().bottom;
        if (from == 'cart') {
          elBottom = elBottom + 50;
        }
        this.elLeft = elLeft;
        this.elBottom = elBottom;
        this.showMoveDot.push(true);
        this.replaceCart(result.message.cart);
      })
    },

    onParentMinus: function (goods, optionId, from) {
      var buysvip = 0;
      if (this.icart.is_buysvip == 1) {
        buysvip = 1;
      }
      var goods_id = goods.id || goods.goods_id;
      var option_id = goods.activeOptionId || optionId;
      var params = {
        sid: this.istore.id,
        goods_id: goods_id,
        option_id: option_id,
        num: 1,
        sign: '-',
        is_buysvip: buysvip
      };
      this.util.request({
        url: 'wmall/store/goods/cart',
        //showLoading: true,
        data: params,
      }).then((result) => {
        var result = result.data.message;
        if (result.errno) {
          this.$toast(result.message);
          return false;
        }
        this.replaceCart(result.message.cart);
      })
    },

    onParentPopupNotInSailTime: function (goods) {
      this.goodsActive = goods;
      this.popupNotInSailTime = true;
    },

    onToggleCategory (cid, index, from) {
      var childIndex = 0;
      if (from == 'child') {
        childIndex = index;
        this.childSelectedIndex = childIndex;
        this.categoryAll[this.categorySelectedIndex]['childSelectedIndex'] = childIndex;
        this.categorySelected = this.categoryAll[this.categorySelectedIndex];
      } else {
        if (this.categoryAll[index]['childSelectedIndex'] > 0) {
          childIndex = this.categoryAll[index].childSelectedIndex;
        }
        this.categorySelected = this.categoryAll[index];
        this.categorySelectedIndex = index;
        this.childSelectedIndex = childIndex;
        this.categoryAll[index]['childSelectedIndex'] = childIndex;
      }
      this.categorySelectedId = this.categorySelected.id;
      this.childSelectedId = 0;
      if (this.categorySelected.child && this.categorySelected.child.length > 0) {
        this.childSelectedId = this.categorySelected.child[childIndex]['id'];
      }
      this.onGetGoods();
    },

    onGetGoods () {
      if (this.goodsLoading) {
        //return false;
      }
      if (!this.goodsAll[this.categorySelectedIndex]) {
        this.goodsAll[this.categorySelectedIndex] = [];
      }
      this.goodsItem = this.goodsAll[this.categorySelectedIndex][this.childSelectedIndex];
      if (!this.goodsItem) {
        this.goodsItem = {
          page: 1,
          psize: 30,
          empty: 0,
          loaded: false,
          data: [],
          orderby: {
            type: '',
            value: ''
          }
        };
      } else {
        if (this.goodsItem.empty) {
          return false;
        }
        if (this.goodsItem.loaded) {
          return false;
        }
      }
      this.goodsLoading = true;
      this.util.request({
        url: 'wmall/store/goods/goods',
        data: {
          sid: this.sid,
          page: this.goodsItem.page,
          psize: this.goodsItem.psize,
          cid: this.categorySelectedId,
          child_id: this.childSelectedId,
          type: this.goodsItem.orderby.type,
          value: this.goodsItem.orderby.value
        },
      }).then((res) => {
        this.goodsLoading = false;
        var result = res.data.message.message;
        this.goodsItem.data = [...this.goodsItem.data, ...result.goods];
        this.goodsItem.page++;
        if (result.goods.length < this.goodsItem.psize) {
          this.goodsItem.loaded = true;
          if (!result.goods.length) {
            this.goodsItem.empty = 1;
          }
        }
        if (!this.goodsAll[this.categorySelectedIndex]) {
          this.goodsAll[this.categorySelectedIndex] = [];
        }
        this.goodsAll[this.categorySelectedIndex][this.childSelectedIndex] = this.goodsItem;
      })
    },

    onOrderby (type, value) {
      this.goodsItem = {
        page: 1,
        psize: 30,
        empty: 0,
        data: [],
        orderby: {
          type: type,
          value: value
        }
      };
      this.goodsAll[this.categorySelectedIndex][this.childSelectedIndex] = this.goodsItem;
      this.onGetGoods();
    },

    onLoad () {
      this.util.request({
        url: 'wmall/store/goods/index',
        data: {
          sid: this.sid,
          order_id: this.order_id
        }
      }).then((res) => {
        this.sysstyle = res.data.global.theme.header.background;

        this.goodsLoading = false;
        this.preLoading = false;
        let result = res.data.message;
        if (result.errno) {
          this.$toast(result.message);
          return false;
        }
        result = result.message;
        //提示语
        // if(result.usertips){
        //   this.usertips = result.usertips;
        // }

        this.template_page = result.template_page;
        if (this.template_page == 1) {
          this.goodsItem = {
            page: 2,
            psize: 30,
            empty: 0,
            data: result.goods,
            orderby: {
              type: '',
              value: ''
            }
          };
          if (this.goodsItem.data.length < this.goodsItem.psize) {
            this.goodsItem.loaded = true;
            if (!this.goodsItem.data.length) {
              this.goodsItem.empty = 1;
            }
          }
          this.categorySelectedId = result.cid;
          this.childSelectedId = result.child_id;
          this.goodsAll[this.categorySelectedIndex] = [];
          this.goodsAll[this.categorySelectedIndex][this.childSelectedIndex] = this.goodsItem;
          this.categorySelected = result.category[this.categorySelectedIndex] || {};
        } else {
          this.cateHasGoods = result.cate_has_goods;
        }
        this.store = result.store;
        if (this.store.tips) {
          var storeNotice = 'storeNotice' + this.store.id;
          var storeNoticeStorage = this.util.getStorage(storeNotice);
          if (!storeNoticeStorage || (storeNoticeStorage && !storeNoticeStorage.notice)) {
            this.util.setStorage(storeNotice, { 'notice': 1 }, 300)
          } else {
            this.showNotice = false;
          }
        }

        if (result.store.data && result.store.data.shopPage) {
          this.shopPage = result.store.data.shopPage;
        }
        this.coupon = result.coupon;
        this.categoryAll = result.category;


        this.is_rest = result.store.is_rest;
        this.recommend_stores = result.recommend_stores;

        this.template = result.template;
        this.lazyload_goods = result.lazyload_goods;
        this.follow = window.follow;
        this.util.setWXTitle(this.store.title)
        this.replaceStore(result.store);
        this.replaceCart(result.cart.message.cart);
        if (!this.template_page) {
          this.$nextTick(() => {
            this._initScroll();
            this._calculateHeight();
          })
        }
      })
    },

    onParentBeforeEnter (el) {
      el.style.bottom = this.windowHeight - this.elBottom + 'px';
      el.style.left = this.elLeft + 5 + 'px';
      el.style.opacity = 0;
    },

    onParentAfterEnter (el) {
      el.style.bottom = -20 + 'px';
      el.style.left = 20 + 'px';
      el.style.opacity = 1;
      setTimeout(() => {
        this.replaceState({ key: 'cart_animate', val: true });
      }, 400)
    },

    _initScroll () {
      this.categoryScroll = new BScroll(this.$refs.categoryWrapper, {
        click: true
      });
      this.goodsScroll = new BScroll(this.$refs.goodsWrapper, {
        click: true,
        probeType: 3
      });

      this.goodsScroll.on('scroll', (pos) => {
        // 判断滑动方向，避免下拉时分类高亮错误（如第一分类商品数量为1时，下拉使得第二分类高亮）
        if (pos.y <= 0) {
          this.scrollY = Math.abs(Math.round(pos.y));
        }
        var length = this.listHeight.length;
        for (var i = 0; i < length; i++) {
          var height1 = this.listHeight[i];
          var height2 = this.listHeight[i + 1];
          if (height2 && this.scrollY >= height1 && this.scrollY < height2) {
            if (i != this.tabActive) {
              this.tabActive = i;
              this._followScroll(i);
            }
          }
        }
      });
    },
    _calculateHeight () {
      let goodsList = this.$refs.goodsList;
      let height = 0;
      if (this.$refs.couponWrapper) {
        height += this.$refs.couponWrapper.clientHeight;
      }
      if (this.$refs.shopPageWrapper) {
        height += this.$refs.shopPageWrapper.clientHeight;
      }
      this.listHeight.push(0);
      for (let i = 0; i < goodsList.length; i++) {
        let item = goodsList[i];
        height += item.clientHeight;
        this.listHeight.push(height);
      }
    },
    _followScroll (index) {
      let categoryItem = this.$refs.categoryItem;
      let el = categoryItem[index];
      this.categoryScroll.scrollToElement(el, 300, 0, -100);
    },
    selectCategory (index, event) {
      // var cateli = document.querySelectorAll(".tabs-list li");
      // for(var i=0;i<cateli.length;i++){
      //     if(i==index){
      //       var selecta = cateli[index].querySelectorAll("a");
      //       selecta[0].style.borderColor = this.sysstyle;
      //       selecta[0].querySelectorAll("div div")
      //     }else{
      //       var othera = cateli[i].querySelectorAll("a");
      //       othera[0].style.borderColor = "#f8f8f8";
      //     }
      // }

      if (!event._constructed) {
        return;
      }
      let goodsList = this.$refs.goodsList;
      let el = goodsList[index];

      this.goodsScroll.scrollToElement(el, 500);
    }
  },
  watch: {
    icart () {
      var cartgoods = this.icart.data;
      if (this.template_page == 1) {
        var categoryAllTemp = this.categoryAll;
        if (cartgoods) {
          for (var c in categoryAllTemp) {
            categoryAllTemp[c]['total'] = 0;
            if (categoryAllTemp[c]['child'] && categoryAllTemp[c]['child'].length > 0) {
              for (var index in categoryAllTemp[c]['child']) {
                categoryAllTemp[c]['child'][index]['total'] = 0;
                var childtotal = 0;
                var total = 0;
                for (var i in cartgoods) {
                  for (var j in cartgoods[i]) {
                    if (cartgoods[i][j]['cid'] == categoryAllTemp[c]['id']) {
                      total += cartgoods[i][j]['num'];
                      categoryAllTemp[c]['total'] = total;
                      if (cartgoods[i][j]['child_id'] == categoryAllTemp[c]['child'][index]['id']) {
                        childtotal += cartgoods[i][j]['num'];
                        categoryAllTemp[c]['child'][index]['total'] = childtotal;
                      }
                    }
                  }
                }
              }
            } else {
              var total = 0;
              for (var i in cartgoods) {
                for (var j in cartgoods[i]) {
                  if (cartgoods[i][j]['cid'] == categoryAllTemp[c]['id']) {
                    total += cartgoods[i][j]['num'];
                    categoryAllTemp[c]['total'] = total;
                  }
                }
              }
            }
          }
        } else {
          for (var c in categoryAllTemp) {
            categoryAllTemp[c]['total'] = 0;
            if (categoryAllTemp[c]['child']) {
              for (var index in categoryAllTemp[c]['child']) {
                categoryAllTemp[c]['child'][index]['total'] = 0;
              }
            }
          }
        }
        this.categoryAll = categoryAllTemp;
      } else {
        var cateHasGoods = this.cateHasGoods;
        if (cartgoods) {
          for (var x in cateHasGoods) {
            cateHasGoods[x]['total'] = 0;
            var total = 0;
            for (var i in cartgoods) {
              for (var j in cartgoods[i]) {
                if (cartgoods[i][j]['cid'] == cateHasGoods[x]['id']) {
                  total += cartgoods[i][j]['num'];
                  cateHasGoods[x]['total'] = total;
                }
              }
            }
          }
        } else {
          for (var x in cateHasGoods) {
            cateHasGoods[x]['total'] = 0;
          }
        }
        this.cateHasGoods = cateHasGoods;
      }
    },
    '$route' (to, from) {
      this.onLoad();
    }
  },
  created () {
    this.query = this.$route.query;
    if (this.query) {
      this.sid = this.query.sid;
      this.order_id = this.query.order_id;
      this.pindan_id = 0;
      if (this.query.pindan_id > 0) {
        this.pindan_id = this.query.pindan_id;
      }
    }
  },
  computed: {
    ...mapState([
      'istore', 'icart',
    ]),

    goodsSpecNum: function () {
      if (!this.icart || !this.icart['data1'] || !this.icart['data1'][this.goodsActive.id]) {
        return 0;
      }
      var optionId = this.goodsActive.activeOptionId;
      if (!this.icart['data1'][this.goodsActive.id][optionId]) {
        return 0;
      }
      return this.icart['data1'][this.goodsActive.id][optionId]['num'];
    },

  },
  mounted () {
    this.onLoad();
    this.$nextTick(() => {
      let bodyHeight = document.documentElement.clientHeight;
      // let headerHeight = document.getElementsByClassName('header')[0].clientHeight;
      // let tabsHeight = document.getElementsByClassName('store-tabs')[0].clientHeight;

      this.vanColHeight = bodyHeight - 50;
      if (document.getElementById('public-header')) {
        let publicHeader = document.getElementById('public-header').clientHeight;
        this.vanColHeight = this.vanColHeight - publicHeader;
      }

      // if(document.getElementById('usertips')){
      //   this.vanColHeight = this.vanColHeight - 38;
      // }


      this.windowHeight = window.innerHeight;
    })
  }
}
</script>

<style>
@import "../../../static/css/diy.css";
.swipeSmall,
.swipeBig {
  position: relative;
}
.swipeBig .home-swipe {
  height: 220px;
}
.swipeSmall .home-swipe {
  height: 120px;
}
.swipeText {
  position: absolute;
  top: 22px;
  right: 12px;
  z-index: 99;
  background-color: #fff;
  padding: 6px 15px;
  border-radius: 2px;
}

.home-swipe .van-swipe-item {
  height: 100%;
  width: 100%;
  text-align: center;
  background-color: #39a9ed;
}
.home-swipe .van-swipe-item img {
  height: 100%;
}
#goods-store #public-header ~ #store-header {
  margin-top: 46px;
}
#goods-store #follow ~ #store-header {
  margin-top: 56px;
}
#goods-store #follow ~ #public-header ~ #store-header {
  margin-top: 102px;
}
/*小球*/
#goods-store .parent_move_dot {
  position: fixed;
  z-index: 9000;
  bottom: 43px;
  left: 37px;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background: linear-gradient(to right, #ff930f, #ff5e4e);
  color: #fff;
  transition: bottom 0.4s cubic-bezier(0.3, -0.25, 0.7, -0.15), left 0.4s linear;
}
/*非可售时间*/
#goods-store .not-in-time-popup {
  max-width: 100%;
  width: 75%;
  background-color: #fff;
  border-radius: 4px;
  font-size: 14px;
}
#goods-store .not-in-time-popup .popup-top {
  width: 100%;
  padding: 26px 28px 0 28px;
  box-sizing: border-box;
}
#goods-store .not-in-time-popup .popup-top .popup-item {
  margin-bottom: 10px;
}
#goods-store .not-in-time-popup .popup-top .popup-title {
  color: #000;
  font-size: 15px;
  font-weight: bold;
  margin-bottom: 5px;
}
#goods-store .not-in-time-popup .popup-top .popup-text {
  line-height: 2;
}
#goods-store .not-in-time-popup .popup-bottom {
  width: 100%;
  height: 52px;
  line-height: 52px;
  color: #ff2d4b;
  text-align: center;
  box-sizing: border-box;
}
/*选规格*/
#goods-store .options-popup {
  max-width: 90%;
  width: 90%;
}
#goods-store .options-dialog {
  background-color: #fff;
  width: 100%;
}
#goods-store .options-dialog .muti-close {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 24px;
  height: 24px;
  text-align: center;
}
#goods-store .options-dialog .muti-close::before,
.options-dialog .muti-close::after {
  position: absolute;
  top: 10px;
  right: 1px;
  width: 20px;
  height: 1px;
  background: #666;
  content: "";
}
#goods-store .options-dialog .muti-close::before {
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  -moz-transform: rotate(45deg);
  transform: rotate(45deg);
}
#goods-store .options-dialog .muti-close::after {
  -webkit-transform: rotate(135deg);
  -ms-transform: rotate(135deg);
  -moz-transform: rotate(135deg);
  transform: rotate(135deg);
}
#goods-store .options-dialog .muti-food-title {
  line-height: 44px;
  margin: 0 35px;
  font-size: 16px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
  border-radius: 8px 8px 0 0;
}
#goods-store .options-dialog .muti-cont {
  max-height: 250px;
  overflow-y: scroll;
  overflow-x: hidden;
  -webkit-box-flex: 1;
  font-size: 14px;
  padding-bottom: 10px;
}
#goods-store .options-dialog .muti-cont .muti-sec .muti-sec-title {
  line-height: 20px;
  margin: 10px 0 0 15px;
}
#goods-store .options-dialog .muti-cont .muti-sec .muti-choice {
  margin: 0 5px;
  overflow: hidden;
}
#goods-store .options-dialog .muti-cont .muti-sec .muti-choice div {
  display: inline-block;
  float: left;
  margin: 10px 5px 0;
  min-width: 75px;
  padding: 0 10px;
  height: 28px;
  line-height: 26px;
  border: 1px solid #c4c4c4;
  box-sizing: border-box;
  border-radius: 14px;
  text-align: center;
  overflow: hidden;
}
#goods-store .options-dialog .muti-cont .muti-sec .muti-choice div.selected {
  border-color: #ff2d4b;
  color: #ff2d4b;
}
#goods-store .options-dialog .muti-choose {
  height: 56px;
  background-color: #f4f4f4;
  overflow: hidden;
  border-radius: 0 0 8px 8px;
}
#goods-store .options-dialog .muti-choose .muti-oprt {
  float: right;
  display: inline-block;
}
#goods-store .options-dialog .muti-choose .muti-oprt .muti-cart-btn {
  width: 78px;
  height: 32px;
  line-height: 32px;
  padding-left: 32px;
  margin: 12px 12px 0 0;
  background-size: 16px auto;
  font-size: 13px;
  border-radius: 16px;
  background: #ff2d4b
    url(//xs01.meituan.net/waimai_i/img/muti_icart.dafdd4d1.png) no-repeat 10px
    8px;
  text-align: left;
  -webkit-background-size: 16px auto;
}
#goods-store .options-dialog .muti-choose .muti-cart-oprt {
  margin-top: 16px;
}
#goods-store .options-dialog .muti-choose .muti-cart-oprt .add-food,
.options-dialog .muti-choose .muti-cart-oprt .remove-food {
  float: right;
  height: 35px;
  width: 35px;
  display: inline-block;
}
#goods-store .options-dialog .muti-choose .muti-cart-oprt .add-food {
  text-align: left;
}
#goods-store .options-dialog .muti-choose .muti-cart-oprt .remove-food {
  text-align: right;
}
#goods-store .options-dialog .muti-choose .muti-cart-oprt .add-food .van-icon {
  width: 30px;
  height: 30px;
  text-align: center;
  line-height: 30px;
  color: #fff;
  font-weight: bold;
  border-radius: 100%;
  position: relative;
  font-size: 16px;
  background: -webkit-gradient(
    linear,
    left top,
    right top,
    from(#ff930f),
    to(#ff5e4e)
  );
  background: linear-gradient(to right, #ff930f, #ff5e4e);
}
#goods-store .options-dialog .muti-choose .muti-cart-oprt .remove-food div {
  width: 30px;
  height: 30px;
  text-align: center;
  line-height: 30px;
  color: #fff;
  font-weight: bold;
  border-radius: 100%;
  position: relative;
  font-size: 16px;
  color: #ff2d4b;
  background-color: #fff;
  border: 1px solid #ff2d4b;
}
#goods-store .options-dialog .muti-choose .muti-cart-oprt div {
  height: 27px;
  line-height: 27px;
  min-width: 21px;
  text-align: center;
  float: right;
}
#goods-store .options-dialog .muti-choose .muti-info {
  margin-left: 15px;
  line-height: 56px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
#goods-store .options-dialog .muti-choose .muti-info .muti-price {
  font-size: 24px;
  color: #fb4e44;
  vertical-align: middle;
  display: inline-block;
}
#goods-store .options-dialog .muti-choose .muti-info .muti-type {
  margin-left: 5px;
  font-size: 12px;
  color: #2f2f2f;
  display: inline-block;
  vertical-align: middle;
}
#goods-store .goods-some .van-col {
  overflow-y: auto;
  background: #fff;
}
#goods-store .goods-all .van-col {
  overflow-y: hidden;
  background: #fff;
}
#goods-store .van-col::-webkit-scrollbar {
  display: none;
}
#goods-store .van-cell__left-icon {
  font-size: 20px;
}
#goods-store .store-tabs {
  width: 100%;
  height: 45px;
  line-height: 45px;
  background-color: #fff;
  color: #333;
  justify-content: flex-start !important;
}
.van-search {
  width: 40%;
  font-size: 14px;
}
.van-field__control {
  font-size: 12px;
}
.van-icon-search {
  font-size: 12px !important;
}
#goods-store .store-tabs .tab-item {
  width: 20%;
  height: 100%;
  text-align: center;
  font-size: 14px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #000 !important;
}
#goods-store .store-tabs .tab-item.active {
  color: #000 !important;
}
#goods-store .store-tabs .tab-item.active:after {
  content: "";
  position: absolute;
  left: 25%;
  bottom: 6px;
  width: 50%;
  height: 0;
  border-bottom: 2px solid #f4bc5d;
}
#goods-store .store-tabs .tab-item .pindan-item {
  width: 70%;
  line-height: 16px;
  font-size: 10px;
  border-radius: 10px;
  color: #f4bc5d;
  border: 1px solid #f4bc5d;
}
/* 分隔线 */
#goods-store .fg-line {
  display: inline-block;
  margin: 5px 5px 0 5px;
  width: 0;
  height: 9px;
  font-size: 0;
  border-right: 1px solid #ccc;
}
#goods-store .goods-container {
  padding-bottom: 50px;
}
/*商品主体*/
#goods-store .goods-container .tabs-list {
  width: 100%;
  text-align: center;
}
#goods-store .goods-container .tabs-list .van-badge {
  padding: 15px 6px;
  line-height: 1.5;
}
#goods-store .goods-container .tabs-list .badge-search {
  border-left: 0px;
  line-height: 1;
}
#goods-store .goods-container .tabs-list .badge-search .icon {
  font-size: 26px;
}
/*门店优惠券*/
#goods-store .coupon-show-container {
  margin: 10px;
  height: 75px;
  background: url(//xs01.meituan.net/waimai_i/img/coupon_bg.41b40907.png)
    no-repeat;
  background-size: 100% 75px;
}
#goods-store .coupon-show-container .coupon-price {
  float: left;
  line-height: 75px;
  margin-left: 16px;
  color: #ffd161;
  font-size: 17px;
  text-align: center;
  white-space: nowrap;
}
#goods-store .coupon-show-container .coupon-price div {
  display: inline-block;
  font-size: 30px;
}
#goods-store .coupon-show-container .coupon-detail {
  float: left;
  margin: 15px 0 0 4%;
}
#goods-store .coupon-show-container .coupon-detail .coupon-title {
  line-height: 23px;
  font-size: 16px;
  color: #333;
}
#goods-store .coupon-show-container .coupon-detail .coupon-desc {
  line-height: 16px;
  font-size: 12px;
  color: #999;
}
#goods-store .coupon-show-container .coupon-fetch {
  float: right;
  width: 25%;
  line-height: 75px;
  color: #ffd161;
  font-size: 14px;
  text-align: center;
}
/*门店海报*/
#goods-store .banner {
  width: 100%;
  box-sizing: border-box;
  margin: 10px 0px;
  padding: 0px 10px;
}
#goods-store .banner .banner-item {
  display: inline-block;
  width: 100%;
  height: 80px;
  margin-bottom: 10px;
}
#goods-store .banner .banner-item:last-child {
  margin-bottom: 0px;
}
#goods-store .banner .banner-item img {
  width: 100%;
  height: 100%;
  border-radius: 4px;
  margin-bottom: -1px;
}
/* 二级分类样式 */
#goods-store .tag2-list {
  width: 100%;
  padding-left: 10px;
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  margin-top: 10px;
}
#goods-store .tag2-list .tag2-item {
  position: relative;
  display: inline-block;
  width: 29%;
  height: 35px;
  padding: 0px 5px;
  box-sizing: border-box;
  background: #f3f3f3;
  text-align: center;
  line-height: 35px;
  font-size: 14px;
  margin-right: 10px;
  margin-bottom: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  border-radius: 2px;
}
#goods-store .tag2-list .tag2-item.selected {
  background: #fff;
  border: 1px solid #ff2d4b;
  color: #ff2d4b;
  top: 0;
  left: 0;
}
#goods-store .tag2-list .dot {
  width: 7px;
  height: 7px;
  position: absolute;
  top: 7px;
  right: 7px;
  border-radius: 50%;
  background-color: #ff2d4b;
}
/*分类名称*/
#goods-store .title {
  color: #333;
  font-size: 14px;
  padding: 5px 8px;
  line-height: 18px;
  background: #f9f9f9;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: space-between;
}
#goods-store .title .title-text {
  max-width: 70%;
}
#goods-store .title .title-line {
  display: inline-block;
  margin: 0 3px;
  width: 0;
  height: 10px;
  border-right: 2px solid #ff2d4b;
}
#goods-store .title .limit-tip {
  font-size: 10px;
  display: inline-block;
  color: #ef1e15;
}
#goods-store .title .title-rank {
  display: flex;
  font-size: 12px;
  height: 100%;
}
#goods-store .title .title-rank .selected {
  font-weight: bold;
}
#goods-store .title .title-rank .shu {
  font-size: 6px;
  padding: 0px 8px;
  color: #999;
}
#goods-store .title .title-rank .prionToggleCategoryce-container {
  display: flex;
}
#goods-store .title .title-rank .prionToggleCategoryce-container .triangle {
  height: 100%;
  padding-top: 3px;
  padding-left: 3px;
}
#goods-store
  .title
  .title-rank
  .prionToggleCategoryce-container
  .triangle
  .triangle-top {
  width: 0;
  height: 0;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-bottom: 5px solid #ccc;
  margin-bottom: 2px;
}
#goods-store
  .title
  .title-rank
  .prionToggleCategoryce-container
  .triangle
  .triangle-top.selected {
  border-bottom: 5px solid #000;
}
#goods-store
  .title
  .title-rank
  .prionToggleCategoryce-container
  .triangle
  .triangle-bottom {
  width: 0;
  height: 0;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 5px solid #ccc;
}
#goods-store
  .title
  .title-rank
  .prionToggleCategoryce-container
  .triangle
  .triangle-bottom.selected {
  border-top: 5px solid #000;
}

/*商品*/
#goods-store .goods-container .goods {
  position: relative;
  padding: 0 10px;
  font-size: 18px;
  line-height: 20px;
}
#goods-store .goods-container .goods-inner {
  padding: 10px 0;
}

#goods-store .goods-container .goods .image-box {
  float: left;
  width: 56px;
  height: 56px;
  display: inline-block;
  margin-right: 10px;
  position: relative;
}
#goods-store .goods-container .goods .image-box .pic {
  width: 100%;
  height: 100%;
}
#goods-store .goods-container .goods .image-box .label {
  position: absolute;
  left: 0;
  top: 0;
  font-size: 12px;
  color: #fff;
  background-color: #ff2d4b;
  height: 14px;
  line-height: 14px;
  padding: 0 2px;
}
#goods-store .goods-container .goods .shop-info {
  float: left;
  max-width: 72%;
  min-height: 55px;
}
#goods-store .goods-container .goods .shop-info .name {
  color: #3d4145;
  font-size: 16px;
  line-height: 20px;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 500;
}
#goods-store .goods-container .sold {
  color: #8c8c8c;
  font-size: 12px;
  line-height: 1.5;
}
#goods-store .goods-container .svip-price-tips {
  display: flex;
  align-items: center;
  line-height: 1;
}
#goods-store .goods-container .svip-price-tips .svip-price {
  display: flex;
  align-items: center;
  background-color: #302d22;
  padding: 1px 5px;
  border-top-left-radius: 2px;
  border-bottom-left-radius: 2px;
  color: #fff2bd;
  font-size: 11px;
  border: 1px solid #302d22;
  border-right: none;
}
#goods-store .goods-container .goods-info .svip-price-tips {
  margin: 3px 0 5px;
}
#goods-store .goods-container .goods-info .svip-price-tips .svip-price {
  padding: 1px 0px;
}
#goods-store .goods-container .svip-price-tips .svip-price span {
  padding-left: 3px;
}
#goods-store .goods-container .svip-price-tips .svip-price .icon-crownfill {
  font-size: 11px;
}
#goods-store .goods-container .svip-price-tips .svip-activity {
  background-color: #fff2bd;
  color: #1c1a13;
  border: 1px solid #aca275;
  border-left: none;
  border-top-right-radius: 2px;
  border-bottom-right-radius: 2px;
  font-size: 11px;
  padding: 1px 0;
}
#goods-store .goods-container .goods .shop-info .description {
  color: #8c8c8c;
  font-size: 10px;
  line-height: 16px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
#goods-store .goods-container .goods .shop-info .price .now-price {
  color: #f45044;
  font-size: 20px;
  line-height: 20px;
  font-weight: bold;
  display: inline-block;
}
#goods-store .goods-container .goods .shop-info .price .now-price .price-icon {
  font-size: 14px;
  display: inline-block;
}
#goods-store .goods-container .goods .shop-info .price .old-price {
  display: inline-block;
  font-size: 12px;
  text-decoration: line-through;
  color: #8c8c8c;
  font-weight: normal;
}
#goods-store .goods-container .goods .shop-info .price .old-price .price-icon {
  font-size: 10px;
  display: inline-block;
}
#goods-store .goods-container .goods .shop-info .discount {
  font-size: 12px;
  color: #f45044;
}
#goods-store .goods-list {
  background: #fff;
  padding-bottom: 20px;
  margin: 15px;
}
#goods-store .goods-list .goods-item {
  /*		padding-top: 20px;
		padding-bottom: 10px;*/
  padding: 8px;
  float: left;
  border-right: 1px solid #e0e0e0;
  border-bottom: 1px solid #e0e0e0;
  box-sizing: border-box;
  width: 50%;
  display: inline-block;
}
#goods-store .goods-list .goods-item:first-child {
  padding-top: 0px;
}
#goods-store .goods-list .goods-item:nth-child(2) {
  padding-top: 0px;
}
#goods-store .goods-list .goods-item:nth-child(odd) {
  padding-left: 0px;
}
#goods-store .goods-list .goods-item:nth-child(even) {
  padding-right: 0px;
  border-right: 0;
}
#goods-store .goods-list .goods-item .goods-info {
  position: relative;
}
#goods-store .goods-list .goods-item .avatar {
  display: inline-block;
  width: 100%;
  height: 95px;
  position: relative;
}
#goods-store .goods-list .goods-item .avatar img {
  display: inline-block;
  width: 100%;
  height: 100%;
}
#goods-store .goods-list .goods-item .goods-name {
  font-size: 16px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-top: 5px;
}
#goods-store .goods-list .goods-item .description {
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #606060;
  height: 22px;
}
#goods-store .goods-list .goods-item .solid {
  line-height: 24px;
  font-size: 12px;
  color: #b8b8b8;
}
#goods-store .goods-list .goods-item .solid div {
  display: inline-block;
  margin-left: 5px;
}

#goods-store .goods-list .goods-item .price {
  color: #fa4f3f;
  font-size: 14px;
  margin-top: 5px;
  line-height: 20px;
  font-weight: bold;
  display: inline-block;
}

#goods-store .goods-list .goods-item .old-price {
  display: inline-block;
  font-size: 12px;
  text-decoration: line-through;
  color: #8c8c8c;
  font-weight: normal;
}
#goods-store .goods-list .goods-item .discount {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(
    to right,
    rgba(253, 111, 99, 1),
    rgba(253, 111, 99, 0.1)
  );
  color: #fff !important;
  padding-left: 10px;
  font-size: 12px;
  height: 22px;
  line-height: 22px;
}
/*店铺休息中推荐*/
#goods-store .recommend-popup {
  width: 100%;
  height: 380px;
  overflow: hidden;
  z-index: 100000 !important;
}
#goods-store .guide-head {
  width: 93%;
  background: #fff;
  padding: 15px 15px;
  text-align: center;
  color: #333;
  height: 100px;
  box-sizing: border-box;
  margin: 0 auto;
}
#goods-store .guide-head .store-rest {
  font-size: 20px;
  font-weight: 600;
  line-height: 20px;
  overflow: hidden;
  padding-left: 22px;
  text-align: center;
}
#goods-store .guide-head .store-rest .store-close {
  float: right;
}
#goods-store .guide-head .store-rest .store-close .van-icon-unfold {
  float: right;
  width: 100%;
  height: 100%;
  text-align: center;
  font-size: 16px;
  line-height: 16px;
  color: #727272;
}
#goods-store .guide-head .store-start {
  font-size: 16px;
  color: #727272;
  display: block;
}
#goods-store .guide-head .store-recommended {
  font-size: 16px;
  color: #ccc;
  display: block;
  margin-top: 7px;
}
#goods-store .diy-store-list {
  width: 100%;
  height: 270px;
  box-sizing: border-box;
  overflow-y: auto;
}
#goods-store .goods-list .foodop {
  right: 0px;
  bottom: 0px;
}
#goods-store .goods-list .foodop span {
  line-height: 1;
}
/*普通用户购买超级会员商品弹出层样式*/
#goods-store .buy-svip {
  padding: 20px 15px;
  background-color: #fff;
  font-size: 15px;
  line-height: 1;
}
#goods-store .buy-svip .popup-svip-title {
  display: flex;
  align-items: center;
  font-weight: 700;
  white-space: nowrap;
  padding-bottom: 15px;
  text-align: center;
}
#goods-store .buy-svip .popup-svip-title:before,
#goods-store .buy-svip .popup-svip-title:after {
  display: block;
  margin: 0 3.5px;
  width: 23px;
  height: 10px;
  background-image: url(../../../static/img/svip-title-head.png);
  background-position: 0 0;
  background-size: 100% auto;
  background-repeat: no-repeat;
  content: "";
}
#goods-store .buy-svip .popup-svip-title:after {
  transform: scaleX(-1);
}
#goods-store .buy-svip .svip-img {
  display: flex;
  width: 100%;
  height: 73px;
  background: url(../../../static/img/svip-vs-bg.png) no-repeat;
  background-size: 100% auto;
  margin-bottom: 15px;
}
#goods-store .buy-svip .svip-img .svip-vs-left {
  width: 50%;
  text-align: center;
  color: #ffe98b;
}
#goods-store .buy-svip .svip-img .svip-vs-left .icon {
  padding: 3px 0;
  font-size: 12px;
}
#goods-store .buy-svip .svip-img .svip-vs-left .svip-vs-price {
  font-size: 26px;
  padding: 5px 0;
}
#goods-store .buy-svip .svip-img .svip-vs-right {
  width: 50%;
  text-align: center;
  color: #656565;
}
#goods-store .buy-svip .svip-img .svip-vs-right .svip-putong-title {
  padding-top: 18px;
  font-size: 12px;
}
#goods-store .buy-svip .svip-img .svip-vs-right .svip-putong-price {
  font-size: 26px;
  padding: 5px 0;
}
#goods-store .buy-svip .buy-svip-text {
  font-size: 14px;
  color: #999;
  text-align: center;
}
#goods-store .buy-svip .svip-price-btn {
  display: block;
  width: 100%;
  height: 45px;
  text-align: center;
  background: linear-gradient(90deg, #faeaa7, #e0c470);
  border: none;
  border-radius: 3px;
  padding: 0;
  color: #7c4f0b;
}
#goods-store .buy-svip .price-btn {
  width: 100%;
  display: block;
  text-align: center;
  color: #7c7c7c;
  font-weight: 600;
}
#goods-store .buy-svip .van-button::before {
  border-color: transparent;
  background-color: transparent;
}
</style>
<style scoped>
.van-icon-plus:before {
  content: "\E60D";
}
</style>



// WEBPACK FOOTER //
// src/pages/store/goods.vue
