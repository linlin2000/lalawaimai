<template>
	<div id="diy">
		<div class="fiexd-searchbar" :style="{background: diydata.diy.fixedsearch.style.fixedbackground == '#ffffff' ? '#ff2d4b' : diydata.diy.fixedsearch.style.fixedbackground}" v-if="showFixedSearchBar && diydata.diy.is_has_location">
			<router-link :to="util.getUrl({path: diydata.diy.fixedsearch.params.link})" >
				<i class="icon icon-search"></i>
				<template v-if="diydata.diy.fixedsearch.params.linkto == 1">请输入信息内容</template>
				<template v-else-if="diydata.diy.fixedsearch.params.linkto == 2">请输入商户名称</template>
				<template v-else>请输入商户或商品名称</template>
			</router-link>
		</div>
		<template v-for="(diyitem, diyindex) in diydata.diy.data.items" v-if="!preLoading">
			<!-- 固定搜索框 -->
			<div class="diy-fixedsearch flex-lr" v-if="diyitem.id == 'fixedsearch'" :style="{background: diyitem.style.fixedbackground}">
				<router-link class="loc flex" :class="diyitem.style.locstyle" :to="util.getUrl({path: '/pages/home/location'})" :style="{background: diyitem.style.locbackground, color: diyitem.style.loccolor}">
					<div class='icon icon-location'></div>
					<div class="location-info ellipsis">{{locationInfo.address || '定位中'}}</div>
					<div class='icon icon-xiangyou1'></div>
				</router-link>
				<router-link tag="div" :to="util.getUrl({path: diyitem.params.link})" class="searchBar" :class="diyitem.style.searchstyle" :style="{background: diyitem.style.searchbackground, color: diyitem.style.searchcolor}">
					<img src='static/img/icon_search.png'>
					<span>{{diyitem.params.text}}</span>
				</router-link>
			</div>
			<!-- 活动组 -->
			<van-row class="diy-activity" v-else-if="diyitem.id == 'activity'" :style="{background: diyitem.style.background, margin: diyitem.style.marginTop + 'px ' + '0px ' + diyitem.style.marginBottom + 'px ' + '0px'}">
				<template v-for="(item, index) in diyitem.data">
					<van-col span="12" class="van-hairline--bottom" :class="{'van-hairline--right': index % 2 == 0}">
						<div tag="div" v-if="index % 2 == 0" class="activity-item flex-lr" @click="util.jsUrl(item.linkurl)">
							<div class="col-6 text-right">
								<p class="heding ellipsis font-18" :style="{color: item.color}">{{item.text}}</p>
								<p class="sub-heding font-13 ellipsis" :style="{color: item.placeholderColor}">{{item.placeholder}}</p>
							</div>
							<div class="col-4 text-center">
								<img :src="item.imgurl" alt="">
							</div>
						</div>
						<div tag="div" v-else class="activity-item flex-lr" @click="util.jsUrl(item.linkurl)">
							<div class="col-4 text-center">
								<img :src="item.imgurl" alt="">
							</div>
							<div class="col-6">
								<p class="heding ellipsis font-18" :style="{color: item.color}">{{item.text}}</p>
								<p class="sub-heding font-13 ellipsis" :style="{color: item.placeholderColor}">{{item.placeholder}}</p>
							</div>
						</div>
					</van-col>
				</template>
			</van-row>
			<!-- 搜索框 -->
			<div class="diy-searchbar" :style="{background: diyitem.style.background, padding: diyitem.style.paddingtop + 'px ' + diyitem.style.paddingleft + 'px'}" v-else-if="diyitem.id == 'searchbar'">
				<router-link tag="div" :to="util.getUrl({path: '/pages/home/search'})" class="inner" :class="diyitem.style.searchstyle" :style="{background: diyitem.style.inputbackground}">
					<div class="search-icon">
						<div class="icon icon-search" :style="{color: diyitem.style.iconcolor}"></div>
					</div>
					<div class="search-input" :style="{'text-align': diyitem.style.textalign, color: diyitem.style.color}">
						<div>{{diyitem.params.placeholder}}</div>
					</div>
				</router-link>
			</div>
			<!-- 公告 -->
			<div class="diy-notice" v-else-if="diyitem.id == 'notice'" :style="{'background-color': diyitem.style.background, padding: diyitem.style.paddingtop + 'px ' + diyitem.style.paddingleft + 'px'}">
				<div class="diy-notice-container border-1px-t">
					<div class="image border-1px-r">
						<img :src="diyitem.params.imgurl" alt="">
					</div>
					<div class="icon">
						<div class="icon icon-notification" :style="{'color': diyitem.style.iconcolor}"></div>
					</div>
					<div class="notice-text">
						<van-swipe  :autoplay="2000" :show-indicators="false" vertical :style="{color: diyitem.style.textcolor}">
							<van-swipe-item v-for="(item, noticekey) in diyitem.data" :key="noticekey">
								<template v-if="item.linkurl">
									<div @click="util.jsUrl(item.linkurl)">
										{{item.title}}
									</div>
								</template>
								<template v-else>
									<router-link tag="div" :to="util.getUrl({path: '/pages/home/notice', query: {id: item.id}})" class="swiper-slide">
										{{item.title}}
									</router-link>
								</template>
							</van-swipe-item>
						</van-swipe>
					</div>
					<div class="icon icon-arrow-right"></div>
				</div>
			</div>
			<!-- 图片轮播 -->
			<div class="diy-picture" v-else-if="diyitem.id == 'picture'" :style="{padding: diyitem.style.paddingtop + 'px ' + diyitem.style.paddingleft + 'px', background: diyitem.style.background}">
				<van-swipe :autoplay="5000" :indicator-color="diyitem.style.dotbackground ? diyitem.style.dotbackground : '#ff2d4b'">
					<van-swipe-item v-for="(image, index) in diyitem.data" :key="index">
						<div @click="util.jsUrl(image.linkurl)">
							<img :src="image.imgurl" alt="">
						</div>
					</van-swipe-item>
				</van-swipe>
			</div>
			<!--图片橱窗-->
			<template v-else-if="diyitem.id == 'picturew'">
				<template v-if="diyitem.params.row == 1">
					<div class="diy-cube lazyload-container" :style="{background: diyitem.style.background, padding: diyitem.data_num == 1 ? ( diyitem.style.paddingtop + 'px ' + diyitem.style.paddingleft + 'px') : 0}">
						<div @click="util.jsUrl(diyitem.data[0].linkurl)" v-if="diyitem.data_num==1">
							<img :src="diyitem.data[0].imgurl" class="lazyload lazyload-store">
						</div>
						<div class="diy-cube-container" v-else-if="diyitem.data_num > 1">
							<div class="diy-cube-left" :style="{padding: diyitem.style.paddingtop + 'px ' + diyitem.style.paddingleft + 'px', 'padding-right': 0}">
								<div @click="util.jsUrl(diyitem.data[0].linkurl)">
									<img :src="diyitem.data[0].imgurl" class="lazyload lazyload-store">
								</div>
							</div>
							<div class="diy-cube-right" :style="{padding: (diyitem.data_num == 2 ? (diyitem.style.paddingtop +'10px '+ diyitem.style.paddingleft + 'px') : 0), 'padding-top': diyitem.style.paddingtop + 'px', 'padding-bottom': diyitem.style.paddingtop + 'px'}">
								<div @click="util.jsUrl(diyitem.data[1].linkurl)" v-if="diyitem.data_num == 2">
									<img :src="diyitem.data[1].imgurl" class="lazyload lazyload-store">
								</div>
								<template v-else-if="diyitem.data_num > 2">
									<div class="diy-cube-right1" :style="{padding: diyitem.style.paddingtop + 'px ' + diyitem.style.paddingleft + 'px', 'padding-bottom': diyitem.style.paddingleft/2 + 'px', 'padding-top': 0 }">
										<div @click="util.jsUrl(diyitem.data[1].linkurl)">
											<img :src="diyitem.data[1].imgurl" class="lazyload lazyload-store">
										</div>
									</div>
									<div class="diy-cube-right2" :style="{padding: diyitem.data_num == 3 ? (diyitem.style.paddingtop+'px '+diyitem.style.paddingleft+'px') : 0, 'padding-bottom': 0, 'padding-top': diyitem.style.paddingleft/2 + 'px'}">
										<div @click="util.jsUrl(diyitem.data[2].linkurl)" v-if="diyitem.data_num==3">
											<img :src="diyitem.data[2].imgurl" class="lazyload lazyload-store">
										</div>
										<template v-else-if="diyitem.data_num > 3">
											<div class="left" :style="{padding: '0px ' + diyitem.style.paddingleft + 'px', 'padding-right': 0}">
												<div @click="util.jsUrl(diyitem.data[2].linkurl)">
													<img :src="diyitem.data[2].imgurl" class="lazyload lazyload-store">
												</div>
											</div>
											<div class="right" :style="{padding: '0px ' + diyitem.style.paddingleft + 'px'}">
												<div @click="util.jsUrl(diyitem.data[3].linkurl)">
													<img :src="diyitem.data[3].imgurl">
												</div>
											</div>
										</template>
									</div>
								</template>
							</div>
						</div>
					</div>
				</template>
				<template v-else-if="diyitem.params.row > 1 && diyitem.params.row < 5">
					<template v-if="diyitem.params.showtype == 0 || diyitem.data_num <= diyitem.params.pagenum">
						<div class="diy-picturew lazyload-container" :class="'row-' + diyitem.params.row" :style="{padding: diyitem.style.paddingtop + 'px ' + diyitem.style.paddingleft + 'px', background: diyitem.style.background}">
							<div class="item" :style="{padding: diyitem.style.paddingtop + 'px ' + diyitem.style.paddingleft + 'px'}" v-for="(item,index) in diyitem.data" :key="index">
								<div @click="util.jsUrl(item.linkurl)">
									<img :src="item.imgurl">
								</div>
							</div>
						</div>
					</template>
					<template v-else>
						<div class="swiper" :class="'swiper-' + diyindex">
							<div class="swiper-container diy-picturew swiper-container-horizontal" :class="'row-' + diyitem.params.row" :style="{padding: diyitem.style.paddingtop + 'px ' + diyitem.style.paddingleft + 'px', background: diyitem.style.background}">
								<van-swipe :autoplay="5000" :show-indicators="diyitem.style.showdot == 1" :indicator-color="diyitem.style.dotbackground ? diyitem.style.dotbackground : '#ff2d4b'">
									<van-swipe-item v-for="(tempitem, key) in diyitem.data" :key="key">
										<div class="item" :style="{padding: diyitem.style.paddingtop + 'px ' + diyitem.style.paddingleft + 'px'}" v-for="(item, index) in tempitem" :key="index">
											<div @click="util.jsUrl(item.linkurl)">
												<img :src="item.imgurl">
											</div>
										</div>
									</van-swipe-item>
								</van-swipe>
							</div>
						</div>
					</template>
				</template>
				<template v-else-if="diyitem.params.row == 5">
					<div class="diy-picturew" :class="'row-' + diyitem.params.row" :style="{background: diyitem.style.background}">
						<div class="diy-picturew-left" @click="util.jsUrl(diyitem.data[0].linkurl)" v-if="diyitem.data_num >= 1">
							<img :src="diyitem.data[0].imgurl" class="lazyload lazyload-store">
						</div>
						<div class="diy-picturew-right" v-if="diyitem.data_num >= 2">
							<div class="diy-picturew-right-top">
								<div class="left" @click="util.jsUrl(diyitem.data[1].linkurl)">
									<img :src="diyitem.data[1].imgurl" class="lazyload lazyload-store">
								</div>
								<div class="right" @click="util.jsUrl(diyitem.data[2].linkurl)" v-if="diyitem.data_num >= 3">
									<img :src="diyitem.data[2].imgurl" class="lazyload lazyload-store">
								</div>
							</div>
							<div class="diy-picturew-right-bottom" v-if="diyitem.data_num >= 4">
								<div class="left" @click="util.jsUrl(diyitem.data[3].linkurl)">
									<img :src="diyitem.data[3].imgurl" class="lazyload lazyload-store">
								</div>
								<div class="right" @click="util.jsUrl(diyitem.data[4].linkurl)" v-if="diyitem.data_num >= 5">
									<img :src="diyitem.data[4].imgurl" class="lazyload lazyload-store">
								</div>
							</div>
						</div>
					</div>
				</template>
				<template v-else-if="diyitem.params.row == 6">
					<div class="diy-picturew" :class="'row-' + diyitem.params.row" :style="{background: diyitem.style.background}">
						<div class="diy-picturew-top" v-if="diyitem.data_num >= 1">
							<div class="left" @click="util.jsUrl(diyitem.data[0].linkurl)">
								<img :src="diyitem.data[0].imgurl" class="lazyload lazyload-store">
							</div>
							<div class="right" @click="util.jsUrl(diyitem.data[1].linkurl)" v-if="diyitem.data_num >= 2">
								<img :src="diyitem.data[1].imgurl" class="lazyload lazyload-store">
							</div>
						</div>
						<div class="diy-picturew-bottom" v-if="diyitem.data_num >= 3">
							<div class="one-picturew" @click="util.jsUrl(diyitem.data[2].linkurl)">
								<img :src="diyitem.data[2].imgurl" class="lazyload lazyload-store">
							</div>
							<div class="one-picturew" @click="util.jsUrl(diyitem.data[3].linkurl)" v-if="diyitem.data_num >= 4">
								<img :src="diyitem.data[3].imgurl" class="lazyload lazyload-store">
							</div>
							<div class="one-picturew" @click="util.jsUrl(diyitem.data[4].linkurl)" v-if="diyitem.data_num >= 5">
								<img :src="diyitem.data[4].imgurl" class="lazyload lazyload-store">
							</div>
							<div class="one-picturew" @click="util.jsUrl(diyitem.data[5].linkurl)" v-if="diyitem.data_num >= 6">
								<img :src="diyitem.data[5].imgurl" class="lazyload lazyload-store">
							</div>
						</div>
					</div>
				</template>
			</template>
			<!-- 导航栏 -->
			<template v-else-if="diyitem.id == 'navs'">
				<div class="diy-navs" v-if="diyitem.params.showtype==0 || (diyitem.data_num <= diyitem.params.pagenum)" :style="{'margin-top': diyitem.style.margintop + 'px'}">
					<div class="diy-navs-container" :class="'col-'+diyitem.params.rownum + ' ' + diyitem.style.navstyle" >
						<div class="diy-nav-col" v-for="(item, index) in diyitem.data" :key="index">
							<div @click="util.jsUrl(item.linkurl)">
								<div class="nav-icon">
									<img :src="item.imgurl">
								</div>
								<div class="nav-text" :style="{color: item.color}">{{item.text}}</div>
							</div>
						</div>
					</div>
				</div>
				<div class="diy-navs" :style="{'margin-top': diyitem.style.margintop + 'px'}" v-else>
					<van-swipe :show-indicators="diyitem.params.showdot == 1" :indicator-color="diyitem.style.dotbackground ? diyitem.style.dotbackground : '#ff2d4b'">
						<van-swipe-item v-for="(tempitem,key) in diyitem.data" :key="key">
							<div class="diy-navs-container" :class="'col-'+diyitem.params.rownum + ' ' + diyitem.style.navstyle">
								<div class="diy-nav-col" v-for="(item,index) in tempitem" :key="index" @click="util.jsUrl(item.linkurl)">
									<div class="nav-icon">
										<img :src="item.imgurl">
									</div>
									<div class="nav-text" :style="{color: item.color}">{{item.text}}</div>
								</div>
							</div>
						</van-swipe-item>
					</van-swipe>
				</div>
			</template>
			<!-- 为您优选 -->
			<template v-else-if="diyitem.id == 'selective' && diyitem.data">
				<div class="diy-selective" :style="{'margin-top': diyitem.style.margintop + 'px'}" v-if="diyitem.params.showtype == 0 || diyitem.data_num <= diyitem.params.pagenum">
					<div class="selective-tab" :style="{color: diyitem.style.titlecolor}">
						{{diyitem.params.title}}
						<router-link class="more" :to="util.getUrl({path: '/pages/channel/brand'})">
							更多
							<div class="icon icon-arrow-right"></div>
						</router-link>
					</div>
					<div class="selective-info row">
						<router-link class="col-33 selective-item" :to="util.getUrl({path: selectItem.url})" v-for="(selectItem, index) in diyitem.data" :key="index">
							<img v-lazy="{src: selectItem.logo, loading: diydata.config.lazyload_store}">
							<div class="selective-title" :style="{color: diyitem.style.storecolor}">{{selectItem.title}}</div>
						</router-link>
					</div>
				</div>
				<div class="diy-selective" :style="{'margin-top': diyitem.style.margintop + 'px'}" v-else>
					<div class="selective-tab" :style="{color: diyitem.style.titlecolor}">
						为您优选
						<router-link class="more" :to="util.getUrl({path: '/pages/channel/brand'})">
							更多
							<div class="icon icon-arrow-right"></div>
						</router-link>
					</div>
					<div class="selective-info row">
						<van-swipe :autoplay="5000" :show-indicators="diyitem.style.showdot == 1" :indicator-color="diyitem.style.dotbackground ? diyitem.style.dotbackground : '#ff2d4b'">
							<van-swipe-item v-for="(tempitem,key) in diyitem.data" :key="key">
								<router-link class="col-33 selective-item" :to="util.getUrl({path: item.url})" v-for="(item, index) in tempitem" :key="index">
									<img v-lazy="{src: item.logo, loading: diydata.config.lazyload_store}">
									<div class="selective-title" :style="{color: diyitem.style.storecolor}">{{item.title}}</div>
								</router-link>
							</van-swipe-item>
						</van-swipe>
					</div>
				</div>
			</template>
			<!-- 天天特价 -->
			<div class="diy-bargain-activity" v-else-if="diyitem.id == 'bargain' && diyitem.data_num > 0" :style="{'margin-top': diyitem.style.margintop + 'px'}">
				<div class="activity-header" :style="{'color': diyitem.style.titlecolor}">
					{{diyitem.params.title}}
					<router-link class="more" :to="util.getUrl({path: '/pages/bargain/index'})">
						更多
						<div class="icon icon-arrow-right"></div>
					</router-link>
				</div>
				<div class="goods-list row" v-if="diyitem.params.showtype == 0 || (diyitem.params.showtype == 1 && diyitem.data_num <= diyitem.params.pagenum)">
					<div class="goods-item col-25" v-for="(bargainGoods, index) in diyitem.data" :key="index">
						<router-link :to="util.getUrl({path: '/pages/store/goodsDetail', query:{sid:bargainGoods.sid, id:bargainGoods.goods_id}})">
							<div class="goods-image">
								<div class="label" v-if="bargainGoods.discount > 0 && bargainGoods.discount < 10">{{bargainGoods.discount}}折</div>
								<img v-lazy="{src: bargainGoods.thumb, loading: diydata.config.lazyload_goods}">
							</div>
							<div class="goods-title" :style="{'color': diyitem.style.goodsnamecolor}">{{bargainGoods.title}}</div>
							<div class="price">
								<div class="">￥</div>
								<div class="now-price">{{bargainGoods.discount_price}}</div>
								<div class="original-price">￥{{bargainGoods.price}}</div>
							</div>
						</router-link>
					</div>
				</div>
				<div class="goods-list row" v-else-if="diyitem.params.showtype == 1">
					<van-swipe :autoplay="5000" :show-indicators="diyitem.style.showdot == 1" :indicator-color="diyitem.style.dotbackground ? diyitem.style.dotbackground : '#ff2d4b'">
						<van-swipe-item v-for="(chuckItem, key) in diyitem.data" :key="key">
							<div class="goods-item col-25" v-for="(bargainGoods, index) in chuckItem" :key="index">
								<router-link :to="util.getUrl({path: '/pages/store/goodsDetail', query:{sid:bargainGoods.sid, id:bargainGoods.goods_id}})">
									<div class="goods-image">
										<div class="label">{{bargainGoods.discount}}折</div>
										<img v-lazy="{src: bargainGoods.thumb, loading: diydata.config.lazyload_goods}">
									</div>
									<div class="goods-title" :style="{'color': diyitem.style.goodsnamecolor}">{{bargainGoods.title}}</div>
									<div class="price">
										<div class="">￥</div>
										<div class="now-price">{{bargainGoods.discount_price}}</div>
										<div class="original-price">￥{{bargainGoods.price}}</div>
									</div>
								</router-link>
							</div>
						</van-swipe-item>
					</van-swipe>
				</div>
				<div class="bargain-swiper padding-10-t" v-else-if="diyitem.params.showtype == 2">
					<van-swipe :width="220" :show-indicators="false" :loop="false">
						<van-swipe-item class="padding-15-r" v-for="(bargainGoods, index) in diyitem.data" :key="index">
							<div class="goods-item">
								<div class="img-wrap">
									<img class="img-100" v-lazy="{src: bargainGoods.thumb, loading: diydata.config.lazyload_goods}" alt="">
								</div>
								<div class="w-100 padding-10-lr ellipsis margin-10-t font-500">{{bargainGoods.title}}</div>
								<div class="flex c-gray padding-10-lr margin-10-t">
									<i class="icon icon-shop"></i>
									<span class="store-title">{{bargainGoods.store_title}}</span>
								</div>
								<div class="flex-lr margin-10-t padding-10-lr padding-10-b">
									<div class="price-wrap">
										<span class="c-danger">¥</span>
										<span class="c-danger font-20">{{bargainGoods.discount_price}}</span>
										<span class="c-gray line-through margin-5-l">¥{{bargainGoods.price}}</span>
									</div>
									<router-link tag="div" class="buy-btn" :to="util.getUrl({path: '/pages/store/goodsDetail', query:{sid:bargainGoods.sid, id:bargainGoods.goods_id}})">立即抢购</router-link>
								</div>
							</div>
						</van-swipe-item>
					</van-swipe>
				</div>
			</div>
			<!-- 商品组 -->
			<template v-else-if="diyitem.id == 'waimai_goods'">
			<!--单列商品组-->
				<div class="diy-waimai-food-list-onerow-box" v-if="diyitem.style.liststyle == 1" :style="{'background-color': diyitem.style.background, 'padding': diyitem.style.paddingtop + 'px ' + diyitem.style.paddingleft + 'px'}">
					<div class="item-list">
						<template v-for="(goodsitem, index) in diyitem.data">
							<div class="goods-item van-hairline--top" :class="{'van-hairline--bottom': diyitem.style.marginbottom > '0'}" :style="{'margin-bottom': diyitem.style.marginbottom + 'px'}">
								<div class="row item-wrapper">
									<div class="col-40 goods-img">
										<img v-lazy="{src: goodsitem.thumb, loading: diydata.config.lazyload_goods}">
										<div class="discount" v-if="diyitem.params.showicon == 1 && goodsitem.svip_status == 1">会员 {{goodsitem.discount}}折</div>
										<div class="discount" v-else-if="diyitem.params.showicon == 1 && (goodsitem.discount > 0 && goodsitem.discount < 10)">{{goodsitem.discount}}折</div>
									</div>
									<div class="col-60">
										<div class="goods-name">{{goodsitem.title}}</div>
										<div class="sale-num">已售:{{goodsitem.sailed}} 好评率:{{goodsitem.comment_good_percent}}</div>
										<div class="store-name">
											<div class="icon icon-shop"></div> {{goodsitem.store_title}}
										</div>
										<div class="price-buybtn">
											<div class="price-wrap">
												<div class="in-b now-price">￥{{goodsitem.price}}</div>
												<div class="in-b old-price" v-if="diyitem.params.showoldprice == 1" :style="{'color': diyitem.style.oldpricecolor}">￥{{goodsitem.old_price}}</div>
											</div>
											<router-link class="in-b buy-btn" :style="{'background-color': diyitem.style.buybtncolor}" :to="util.getUrl({path: '/pages/store/goodsDetail', query:{sid:goodsitem.sid, id:goodsitem.goods_id}})">{{diyitem.params.buybtntext}}</router-link>
										</div>
									</div>
								</div>
								<div class="poi-part" v-if="diyitem.params.storeshow == 2 && goodsitem.store">
									<div class="poi-img-wrapper">
										<img v-lazy="{src: goodsitem.store.logo, loading: diydata.config.lazyload_goods}">
									</div>
									<div class="poi-message">
										<div class="line1">
											<span class="poi-name">{{goodsitem.store.title}}</span>
											<span class="avg-delivery-time">{{goodsitem.store.delivery_time}}分钟</span>
										</div>
										<!-- <div class="line2">
											<span class="price-min">起送价￥{{goodsitem.store.send_price}}</span>
											<span class="divide-span">|</span>
											<span class="shipping-fee">配送费￥{{goodsitem.store.delivery_price}}</span>
										</div> -->
									</div>
								</div>
							</div>
						</template>
					</div>
				</div>
				<!--双列商品组	-->
				<div class="diy-waimai-goods-list-box" v-else :style="{'background-color': diyitem.style.background, 'padding': diyitem.style.paddingtop + 'px ' + diyitem.style.paddingleft + 'px'}">
					<div class="box-list">
						<template v-for="(goodsitem, index) in diyitem.data" >
							<div class="box-item">
								<div class="main-content-box">
									<div class="goods-image">
										<img v-lazy="{src: goodsitem.thumb, loading: diydata.config.lazyload_goods}">
										<div class="discount" v-if="diyitem.params.showicon == 1 && goodsitem.svip_status == 1">会员 {{goodsitem.discount}}折</div>
										<div class="discount" v-else-if="diyitem.params.showicon == 1 && (goodsitem.discount > 0 && goodsitem.discount < 10)">{{goodsitem.discount}}折</div>
									</div>
									<div class="goods-name">{{goodsitem.title}}</div>
									<div class="discount-soldnum">
										<div class="in-b sold-num">已售{{goodsitem.sailed}}</div>
										<div class="in-b praise">好评率 {{goodsitem.comment_good_percent ? goodsitem.comment_good_percent : '暂无'}}</div>
									</div>
									<div class="store-name">
										<div class="icon icon-shop"></div>{{goodsitem.store_title}}
									</div>
									<div class="price-buybtn">
										<div class="in-b price">
											<div class="now-price">￥{{goodsitem.price}}</div>
											<div class="old-price" v-if="diyitem.params.showoldprice == 1" :style="{'color': diyitem.style.oldpricecolor}">￥{{goodsitem.old_price}}</div>
										</div>
										<router-link class="in-b buy-btn" :to="util.getUrl({path: '/pages/store/goodsDetail', query:{sid:goodsitem.sid, id:goodsitem.goods_id}})" :style="{'background-color': diyitem.style.buybtncolor}">{{diyitem.params.buybtntext}}</router-link>
									</div>
								</div>
							</div>
						</template>
						<div style="clear:both"></div>
					</div>
				</div>
			</template>
			<!-- 商户组 -->
			<div class="diy-waimai-store-box" v-else-if="diyitem.id == 'waimai_stores'" :style="{'background-color': diyitem.style.background, 'padding': diyitem.style.paddingtop + 'px ' + diyitem.style.paddingleft + 'px'}">
				<div class="waimai-store-item-list">
					<template v-for="(store, index) in diyitem.data">
						<div class="waimai-store-item bordger-1px-b" :class="{disabled: store.is_rest == 1}">
							<div class="mian-content-box">
								<div class="content-left border-1px">
									<router-link class="item-image" :to="util.getUrl({path: store.url})">
										<div class="item-rest" v-if="store.is_rest==1">休息中</div>
										<img v-lazy="{src: store.logo, loading: diydata.config.lazyload_store}">
									</router-link>
								</div>
								<div class="content-right">
									<router-link :to="util.getUrl({path: store.url})">
										<div class="item-name-wrap">
											<div class="item-name" :style="{'color': diyitem.style.titlecolor}">{{store.title}}</div>
										</div>
										<div class="delivery-tip" v-if="store.rest_reserve_cn">{{store.rest_reserve_cn}}</div>
										<div class="item-score-time">
											<div class="item-score-sale">
												<div class="item-star-box">
													<van-rate v-model="store.score" :size="12" :disabled-color="diyitem.style.scorecolor" disabled />
												</div>
												<div class="item-sale">月售 {{store.sailed}}</div>
											</div>
											<div class="time-distance">
												<div class="avg_delivery_time">{{store.delivery_time}}分钟</div>
											</div>
										</div>
										<div class="item-min-delivery">
											<div class="item-min-delivery-left">
												<!-- <div>起送价￥{{store.send_price}}</div>
												<div class="line">|</div>
												<div>配送费￥{{store.delivery_price}}</div> -->
											</div>
											<div class="item-min-delivery-right" :style="{'background-color': diyitem.style.deliverytitlebgcolor, 'color': diyitem.style.deliverytitlecolor}">{{store.delivery_title}}</div>
										</div>
									</router-link>
									<div class="discount-box" @click="onToggleDiscount(index, diyindex)" v-if="store.activity && (store.activity.num > 0 || store.activity.labels_num > 0)">
										<div class="toggle">
											<div class="icon " :class="{'icon-fold': store.activity.is_show_all, 'icon-unfold': !store.activity.is_show_all}" v-if="(diyitem.params.discountstyle == 1 && store.activity.num > 2) || (diyitem.params.discountstyle == 2 && store.activity.labels_num > 4)"></div>
										</div>
										<template v-if="diyitem.params.discountstyle == 1" >
											<template v-for="(activityItem, index) in store.activity.items">
												<div class="single-line" v-if="index < 2 || (store.activity.is_show_all && index >= 2)">
													<img class="discount-icon" :src="'static/img/' + activityItem.type + '_b.png'">
													<div class="discount-text">{{activityItem.title}}</div>
												</div>
											</template>
										</template>
										<template v-else-if="diyitem.params.discountstyle == 2">
											<div class="label-wrap" :class="{autoHeight: store.activity.is_show_all}">
												<span :class="activityLabel.class" v-for="(activityLabel, index) in store.activity.labels" v-if="index < 4 || (store.activity.is_show_all && index >= 4)">{{activityLabel.title}}</span>
											</div>
										</template>
									</div>
									<div class="hot-box" v-if="store.hot_goods_num > 0 && diyitem.params.showhotgoods == 1">
										<template v-for="(item, index) in store.hot_goods">
											<router-link :to="util.getUrl({path:'/pages/store/goodsDetail', query:{sid:store.id, id: item.id}})">
												<div class="hot-box-item">
													<div class="hot-t border-1px">
														<img v-lazy="{src: item.thumb, loading: diydata.config.lazyload_goods}">
														<div class="discount" v-if="item.svip_status == 1">会员 {{item.discount}}折</div>
														<div class="discount" v-else-if="item.discount > 0 && item.discount < 10">{{item.discount}}折</div>
													</div>
													<div class="hot-b">
														<div class="shop-name">{{item.title}}</div>
														<div class="shop-price">
															<div class="now-price">¥{{item.price}}</div>
															<div class="old-price" v-if="item.old_price > 0">¥{{item.old_price}}</div>
														</div>
													</div>
												</div>
											</router-link>
										</template>
									</div>
								</div>
							</div>
						</div>
					</template>
				</div>
			</div>
			<!-- 导航栏1 -->
			<div class="diy-graphic" v-else-if="diyitem.id == 'graphic'" :style="{'background': diyitem.style.background}">
				<div class="diy-graphic-container clearfix">
					<div @click="util.jsUrl(item.linkurl)" class="diy-graphic-list" v-for="(item, index) in diyitem.data" :style="{'background': diyitem.style.cardbackground}" :key="index">
						<div class="main-title" style="{'color': diyitem.style.titlecolor}">{{item.title}}</div>
						<div class="subhead" style="{'color': diyitem.style.subheadcolor}">{{item.subhead}}</div>
						<div class="img">
							<img :src="item.imgurl" alt="">
						</div>
					</div>
				</div>
			</div>
			<!-- vant列表导航 -->
			<van-cell-group v-else-if="diyitem.id == 'listmenu'">
				<van-cell :title="item.text" :value="item.remark" v-for="(item, index) in diyitem.data" @click="util.jsUrl(item.link)" :style="{background: diyitem.style.background, color: diyitem.style.color}" :key="index" is-link>
					<div slot="icon" name="search" class="icon" :class="item.icon" :style="{color: diyitem.style.iconcolor}"></div>
				</van-cell>
			</van-cell-group>
			<!-- 旧版列表导航 -->
			<!-- <div class="diy-listmenu border-1px-tb" v-else-if="diyitem.id == 'listmenu'" :style="{background: diyitem.style.background, color: diyitem.style.color, padding: diyitem.style.paddingtop + 'px ' + diyitem.style.paddingleft + 'px'}">
				<router-link class="wui-cell wui-cell-access" to="util.jsUrl({path: 'item.link'})" v-for="(item, index) in diyitem.data" :key="index">
					<div class="wui-cell-bd">
						<div class="icon icon-dianpu" ></div>
						{{item.text}}
					</div>
					<div class="wui-cell-ft">{{item.remark}}</div>
				</router-link>
			</div> -->
			<!-- 购物车 -->
			<template v-else-if="diyitem.id == 'cart'">
				<div class="cartop" v-if="diyitem.params.showcart == 1">
					<router-link :to="util.getUrl({path: '/pages/order/cart'})">
						<div class="num" v-if="diydata.cart_sum > 0">{{diydata.cart_sum}}</div>
						<div class='icon icon-cartfill'></div>
					</router-link>
				</div>
			</template>
			<!-- 超级红包dialog -->
			<template v-else-if="diyitem.id == 'redpacket' && diyitem.params.showredpacket == 1 && diydata.superRedpacketData.errno == 0">
				<template v-if="diydata.superRedpacketData.message.type != 'coupon'">
					<div class="dialog dialog-redpacket" :class="{'dialog-show': diydata.superRedpacketData.is_show && diydata.superRedpacketData.message.page && diydata.superRedpacketData.message.redpackets}" >
						<div class="dialog-mask"></div>
						<div class="dialog-container">
							<div class="banner" :style="{'background-color': diydata.superRedpacketData.message.page.text.backgroundColor}">
								<img :src="diydata.superRedpacketData.message.page.image">
							</div>
							<div class="container" :style="{'background-color': diydata.superRedpacketData.message.page.text.backgroundColor}">
								<div class="redpacket" v-for="(item, index) in diydata.superRedpacketData.message.redpackets" :key="index">
									<div class="redpacket-info clearfix" :style="{'color': diydata.superRedpacketData.message.page.text.color}">
										<div class="col-75 text-left">
											<div class="redpacket-title">{{item.title}}</div>
										</div>
										<div class="col-25 price text-right">￥<div>{{item.discount}}</div></div>
									</div>
									<div class="circle-container">
										<div class="circle circle-left"></div>
										<div class="circle circle-right"></div>
									</div>
									<div class="redpacket-limit clearfix flex-lr">
										<div class="use-days-limit">{{item.use_days_limit_text}}</div>
										<div class="use-condition">满{{item.condition}}可用</div>
									</div>
								</div>
								<div class="go-home">
									<div @click="onCloseRedpacket" :style="{'background-color': diydata.superRedpacketData.message.page.button.backgroundColor, 'color': diydata.superRedpacketData.message.page.button.color}">进入首页</div>
								</div>
								<div class="icon icon-close" @click="onCloseRedpacket"></div>
							</div>
						</div>
					</div>
				</template>
				<template v-else>
					<!--代金券弹出层-->
					<div class="dialog dialog-redpacket dialog-coupon" :class="{'dialog-show': diydata.superRedpacketData.is_show && diydata.superRedpacketData.message.type == 'coupon' && diydata.superRedpacketData.message.page && diydata.superRedpacketData.message.redpackets}":style="{'background-color': diydata.superRedpacketData.message.page.style.backgroundColor}">
						<div class="dialog-mask"></div>
						<div class="dialog-container">
							<div class="banner">
								<img :src="diydata.superRedpacketData.message.page.params.image">
							</div>
							<div class="container">
								<div class="coupon-list">
									<router-link  tag='div' class="coupon-item" v-for="(item, index) in diydata.superRedpacketData.message.redpackets" :key="index" :to="util.getUrl({path: '/pages/store/goods',query:{sid: item.sid}})">
										<div class="item-inner flex-lr">
											<div class="store-info flex-lr">
												<img :src="item.store_logo" alt="">
												<div class="info">
													<div class="store-title ellipsis" :style="{color: diydata.superRedpacketData.message.page.style.storeTitleColor}">{{item.store_title}}</div>
													<div class="useful-day" :style="{color: diydata.superRedpacketData.message.page.style.usefulDayColor}">有效期{{item.use_days_limit}}天</div>
												</div>
											</div>
											<div class="coupon-price flex-lr">
												<div class="info">
													<div class="number" :style="{color: diydata.superRedpacketData.message.page.style.moneyColor}">¥ <span>{{item.discount}}</span></div>
													<div class="limit" :style="{color: diydata.superRedpacketData.message.page.style.useLimitColor}">满{{item.condition}}元可用</div>
												</div>
												<div class="to-use" :style="{'background-color': diydata.superRedpacketData.message.page.style.toUseBackgroundColor, color: diydata.superRedpacketData.message.page.style.toUseColor}">
													<div>去</div>
													<div>使</div>
													<div>用</div>
												</div>
											</div>
										</div>
										<div class="shu">
											<div class="circle top-circle"></div>
											<div class="line"></div>
											<div class="circle bottom-circle"></div>
										</div>
									</router-link>
								</div>
								<div class="go-home" @click="onCloseRedpacket">
									<div :style="{'background-color': diydata.superRedpacketData.message.page.style.buttonBackgroundColor, color: diydata.superRedpacketData.message.page.style.buttonColor}">进入首页</div>
								</div>
								<div class="icon icon-close" @click="onCloseRedpacket"></div>
							</div>
						</div>
					</div>
				</template>
			</template>
			<!-- 标题栏 -->
			<div class="diy-title" v-else-if="diyitem.id == 'title'" :style="{background: diyitem.style.background, color: diyitem.style.color, 'text-align': diyitem.style.textalign, 'font-size': diyitem.style.fontsize + 'px', padding: diyitem.style.paddingtop + 'px ' + diyitem.style.paddingleft + 'px'}">
				<div @click="util.jsUrl(diyitem.params.linkurl)">
					{{diyitem.params.title}}
				</div>
			</div>
			<!--图片标题	-->
			<div class="diy-img-card" v-else-if="diyitem.id == 'img_card'" :style="{padding: diyitem.style.paddingtop+'px ' + diyitem.style.paddingleft + 'px', background: diyitem.style.background}">
				<img :src="diyitem.params.imgurl" alt="">
			</div>
			<!--单图组	-->
			<div class="diy-banner" v-else-if="diyitem.id == 'banner'" >
				<div v-for="(item, index) in diyitem.data" @click="util.jsUrl(item.linkurl)" :style="{padding: diyitem.style.paddingtop + 'px ' + diyitem.style.paddingleft + 'px', background: diyitem.style.background}" :key="index">
					<img :src="item.imgurl">
				</div>
			</div>
			<!-- 按钮组 -->
			<div class="diy-buttons" v-else-if="diyitem.id == 'buttons'" :style="{'margin-top': diyitem.style.margintop + 'px', background: diyitem.style.backgroundcolor}">
				<div class="diy-buttons-container" :class="'col-' + diyitem.params.rownum">
				<template  v-for="(item, index) in diyitem.data" >
					<div class="diy-button-col" :style="{background: item.backgroundcolor, color: item.color}" @click="util.jsUrl(item.linkurl)">{{item.text}}</div>
				</template>
				</div>
			</div>
			<!-- 版权 -->
			<template v-else-if="diyitem.id == 'copyright'">
				<div class="diy-copyright" :style="{background: diyitem.style.background}">
					<div class='style1' v-if="diyitem.style.style == 1">
						<img :src="diyitem.params.imgurl" v-if="diyitem.style.showimg == 1">
						<div :style="{color: diyitem.style.color}">{{diyitem.params.content}}</div>
					</div>
					<div class='style2' v-else>
						<img :src="diyitem.params.imgurl" v-if="diyitem.style.showimg == 1">
						{{diyitem.params.content}}
					</div>
				</div>
			</template>
			<!-- 辅助线 -->
			<div class="diy-line" :style="{background: diyitem.style.background, padding: diyitem.style.padding + 'px 0'}" v-else-if="diyitem.id == 'line'">
				<div class="line" :style="{'border-top': diyitem.style.height + 'px' + ' ' + diyitem.style.linestyle + ' ' + diyitem.style.bordercolor}" v-if="diyitem.style.bordercolor"></div>
				<div class="line" :style="{'border-top': diyitem.style.height + 'px' + ' ' + diyitem.style.linestyle + ' ' + diyitem.style.border}" v-else></div>
			</div>
			<!-- 辅助空白 -->
			<div class="diy-blank" v-else-if="diyitem.id == 'blank'" :style="{height: diyitem.style.height + 'px', background: diyitem.style.background}"></div>
			<!-- 富文本 -->
			<div class="diy-richtext" v-else-if="diyitem.id == 'richtext'" :style="{background: diyitem.style.background, padding: diyitem.style.paddingtop +'px ' + diyitem.style.paddingleft + 'px'}">
				<div class="text-container" v-html="diyitem.params.content">
				</div>
			</div>
			<!-- 会员中心组件 -->
			<template v-else-if="diyitem.id == 'memberHeader'">
				<div class="diy-memberHeader" v-if="diyitem.params.headerstyle == 'color'">
					<div class="member-headinfo" :style="{background: diyitem.style.background}">
						<div class="headinfo-balance">
							<div class="headinfo-balance-price" :style="{color: diyitem.style.color}">余额</div>
							<div class="headinfo-price" :style="{color: diyitem.style.highlightcolor}">{{diyitem.member.credit2}}</div>
							<div @click="util.jsUrl(diyitem.params.leftbtn.linkurl)" class="headinfo-filling-price" :style="{color: diyitem.style.color, borderColor: diyitem.style.color}">
								{{diyitem.params.leftbtn.text}}
							</div>
						</div>
						<div class="headinfo-user">
							<div class="user-face" :class="{party: diyitem.params.avatarstyle == 'radius'}">
								<img :src="diyitem.member.avatar" alt="">
							</div>
							<div class="user-name" :style="{color: diyitem.style.color}">{{diyitem.member.nickname}}</div>
							<div class="user-level" :style="{color: diyitem.style.color}" v-if="diyitem.member.groupname"> [{{diyitem.member.groupname}}] </div>
						</div>
						<div class="headinfo-balance">
							<div class="headinfo-balance-price" :style="{color: diyitem.style.color}">酒币</div>
							<div class="headinfo-price">{{diyitem.member.credit1}}</div>
							<div class="headinfo-filling-price" @click="util.jsUrl(diyitem.params.rightbtn.linkurl)" :style="{color: diyitem.style.color, borderColor: diyitem.style.color}">{{diyitem.params.rightbtn.text}}</div>
						</div>
						<div class="setting" :style="{color: diyitem.style.color}" @click="util.jsUrl('/pages/member/profile');">
							<van-icon name='settings' class="icon" :style="{color: diyitem.style.color}"></van-icon>
						</div>
					</div>
				</div>
				<div class="diy-memberHeader" v-else>
					<div class="member-headinfo" :style="{background:'url('+diyitem.params.backgroundimgurl+') no-repeat', backgroundSize: '100% 100%'}">
						<div class="headinfo-balance">
							<div class="headinfo-balance-price" :style="{color: diyitem.style.color}">余额</div>
							<div class="headinfo-price" :style="{color: diyitem.style.highlightcolor}">{{diyitem.member.credit2}}</div>
							<div @click="util.jsUrl(diyitem.params.leftbtn.linkurl)"class="headinfo-filling-price" :style="{color: diyitem.style.color, borderColor: diyitem.style.color}">
								{{diyitem.params.leftbtn.text}}
							</div>
						</div>
						<div class="headinfo-user">
							<div class="user-face party" :class="{party: diyitem.params.avatarstyle == 'radius'}">
								<img :src="diyitem.member.avatar" alt="">
							</div>
							<div class="user-name" :style="{color: diyitem.style.color}">{{diyitem.member.nickname}}</div>
							<div class="user-level" :style="{color: diyitem.style.color}" v-if="diyitem.member.groupname"> [{{diyitem.member.groupname}}] </div>
						</div>
						<div class="headinfo-balance">
							<div class="headinfo-balance-price" :style="{color: diyitem.style.color}">酒币</div>
							<div class="headinfo-price">{{diyitem.member.credit1}}</div>
							<div @click="util.jsUrl(diyitem.params.rightbtn.linkurl)" class="headinfo-filling-price" :style="{color: diyitem.style.color, borderColor: diyitem.style.color}">{{diyitem.params.rightbtn.text}}</div>
						</div>
						<div class="setting" :style="{color: diyitem.style.color}" @click="util.jsUrl('/pages/member/profile');">
							<van-icon name='settings' class="icon" :style="{color: diyitem.style.color}"></van-icon>
						</div>
					</div>
				</div>
			</template>
			<template v-else-if="diyitem.id == 'memberBindMobile'" >
				<router-link :to="util.getUrl({path: '/pages/member/bind'})" class="diy-mobile-bind" :style="{'margin-top': diyitem.style.margintop+'px'}" v-if="diyitem.has_mobile != 1">
					<ul :style="{background: diyitem.style.background}">
						<li class="item-content">
							<div class="item-media">
								<van-icon name='phone1'></van-icon>
							</div>
							<div class="item-inner">
								<div class="item-title" :style="{color: diyitem.style.titlecolor}">绑定手机号</div>
							</div>
							<van-icon name='right' class="right-icon"></van-icon>
						</li>
						<div class="notice" :style="{color:diyitem.style.placeholdercolor}">
							{{diyitem.params.placeholdertext}}
						</div>
					</ul>
				</router-link>
			</template>
<!-- 			<div class="diy-member-swiper" v-if="diyitem.id == ''">
				<van-swipe :autoplay="3000">
					<van-swipe-item v-for="(image, index) in images" :key="index">
						<img :src="image" alt="">
					</van-swipe-item>
				</van-swipe>
			</div> -->
			<template v-else-if="diyitem.id == 'blockNav'">
				<div class="diy-blockNav" v-if="diyitem.params.navstyle == 'icon'" :style="{ 'margin-top': diyitem.style.margintop+'px', background: diyitem.style.background}">
					<div class="blockNav-title border-1px-b" v-if="diyitem.params.has_title == 1" :style="{color: diyitem.style.titlecolor}">{{diyitem.params.title}}</div>
					<div class="col-4">
						<div @click="util.jsUrl(item.linkurl)" class="diy-icon-col" v-for="(item, index) in diyitem.data" :key="index">
							<div class="icon-img">
								<div class="icon" :class="item.icon" :style="{color: item.iconcolor}"></div>
								<span class="nav-mark" :style="{color: item.markcolor, background: item.markbackground}" v-if="item.marktext">{{item.marktext}}</span>
							</div>
							<div class="text-icon" :style="{color: item.textcolor}">{{item.text}}</div>
							<div class="icon-tips" :style="{color: item.placeholdercolor}" v-if="diyitem.params.has_placeholder == 1">{{item.placeholder}}</div>
						</div>
					</div>
				</div>
				<div class="diy-blockNav" :style="{'margin-top': diyitem.style.margintop+'px', background: diyitem.style.background}"  v-else>
					<div class="blockNav-title border-1px-b" v-if="diyitem.params.has_title == 1" :style="{color: diyitem.style.titlecolor}">{{diyitem.params.title}}</div>
					<div class="col-4">
						<div @click="util.jsUrl(item.linkurl)" class="diy-icon-col" v-for="(item, index) in diyitem.data" :key="index">
							<div class="icon-img">
								<img :src="item.imgurl" alt="">
								<span class="nav-mark" :style="{color: item.markcolor, background: item.markbackground}" v-if="item.marktext">{{item.marktext}}</span>
							</div>
							<div class="text-icon" :style="{color: item.textcolor}">{{item.text}}</div>
							<div class="icon-tips" :style="{color: item.placeholdercolor}" v-if="diyitem.params.has_placeholder == 1">{{item.placeholder}}</div>
						</div>
					</div>
				</div>
			</template>
			<!-- 商户列表 -->
			<div class="diy-store-list" v-else-if="diyitem.id == 'waimai_allstores'" >
				<!--筛选弹出层-->
				<van-popup class="popup-search" v-model="diydata.popup && diydata.popup.storeSearch" position="top">
					<div class='diy-store-button-tab border-1px-b'>
						<div class="col-25" :class="{'active': (diydata.storeExtra.condition.order &&diydata.storeExtra.condition.order != 'sailed' && diydata.storeExtra.condition.order != 'distance')}" @click="onChangeStoreExtra('multiple')">{{diydata.storeExtra.filter_title}}</div>
						<div class='col-25' :class="{'active': diydata.storeExtra.condition.order == 'distance'}" @click="onStoreOrderby('order', 'distance')">离我最近</div>
						<div class='col-25' :class="{'active': diydata.storeExtra.condition.dis == 'svipRedpacket'}" @click="onStoreOrderby('order', 'svipRedpacket')" v-if="diydata.diy.is_has_svip">
							<i class="icon icon-choiceness font-16 c-danger"></i>会员领红包
						</div>
						<div class='col-25' :class="{'active': diydata.storeExtra.condition.order == 'sailed'}" @click="onStoreOrderby('order', 'sailed')" v-else>销量最高</div>
						<div class='col-25' @click="onChangeStoreExtra('filter')">
							筛选
							<template v-if="diydata.storeExtra.condition.dis && diydata.storeExtra.condition.mode">
								<span>2</span>
							</template>
							<template v-else-if="(diydata.storeExtra.condition.dis && !diydata.storeExtra.condition.mode) || (diydata.storeExtra.condition.mode && !diydata.storeExtra.condition.dis)">
								<span>1</span>
							</template>
						</div>
					</div>
					<template v-if="diydata.storeExtra.filter">
						<div class="search-scroll">
							<div class="new-search-list">
								<div class="new-search-title">配送服务</div>
								<div class="new-search-group">
									<div class="new-search-item">
										<div class="info" :class="{active: diydata.storeExtra.condition.mode == 2}" @click="onStoreOrderby('mode', 2)">
											<i class="icon icon-waimai"></i>
											{{diydata.config.delivery_title}}
										</div>
									</div>
									<div class="new-search-item">
										<div class="info" :class="{active: diydata.storeExtra.condition.mode == 1}" @click="onStoreOrderby('mode', 1)">
											<i class="icon icon-waimai"></i>
											商家自送
										</div>
									</div>
								</div>
							</div>
							<div class="new-search-list">
								<div class="new-search-title">优惠活动 (单选)</div>
								<div class="new-search-group">
									<div class="new-search-item" v-for="(item,index) in diydata.diy.stores_list.discounts" @click="onStoreOrderby('discounts', item.key)" :key="index">
										<div class="info" :class="{active: diydata.storeExtra.condition.dis == item.key}">
											<img :src="'static/img/' + item.key + '_b.png'" alt="">
											{{item.title}}
										</div>
									</div>
								</div>
							</div>
						</div>
						<div class="search-btn van-hairline--top">
							<div class="search-btn-left" @click="onStoreOrderby('clear')">清除筛选</div>
							<div class="search-btn-right" @click="onStoreOrderby('finish')">完成</div>
						</div>
					</template>
					<template v-if="diydata.storeExtra.multiple">
						<van-cell-group>
							<van-cell v-for="(item,index) in diydata.diy.stores_list.orderbys" @click="onStoreOrderby('order', item.key, item.title)" :key="index">
								<div slot="title" class="active-list-item flex">
									<div class="icon" :class="{'icon-waimai': item.icon == 'waimai', 'icon-location': item.icon == 'location', 'icon-hot_light': item.icon == 'hot_light', 'icon-favor1': item.icon == 'favor1', 'icon-moneybag': item.icon == 'moneybag', 'c-danger': diydata.storeExtra.condition.order == item.key}"></div>
									<span :class="{'c-danger': diydata.storeExtra.condition.order == item.key}">{{item.title}}</span>
								</div>
								<div slot="right-icon" class="icon" :class="{'c-danger': diydata.storeExtra.condition.order == item.key, 'icon-check': diydata.storeExtra.condition.order == item.key}"></div>
							</van-cell>
						</van-cell-group>
					</template>
				</van-popup>
				<!-- 筛选条件 门店列表-->
				<div class='diy-store-button-tab border-1px-b'>
					<div class="col-25 active" :class="{'active': (diydata.storeExtra.condition.order && diydata.storeExtra.condition.order != 'sailed' && diydata.storeExtra.condition.order != 'distance')}" @click="onChangeStoreExtra('multiple')">{{diydata.storeExtra.filter_title}}<div class='icon icon-unfold'></div></div>
					<div class='col-25' :class="{'active': diydata.storeExtra.condition.order == 'distance'}" @click="onStoreOrderby('order', 'distance')">离我最近</div>
					<div class='col-25' :class="{'active': diydata.storeExtra.condition.dis == 'svipRedpacket'}" @click="onStoreOrderby('order', 'svipRedpacket')" v-if="diydata.diy.is_has_svip == 1">
						<i class="icon icon-choiceness font-16 c-danger"></i>会员领红包
					</div>
					<div class='col-25' :class="{'active': diydata.storeExtra.condition.order == 'sailed'}" @click="onStoreOrderby('order', 'sailed')" v-else>销量最高</div>
					<!-- <div class='col-25' @click="onChangeStoreExtra('filter')">
						筛选 <i class="icon icon-unfold"></i>
						<template v-if="diydata.storeExtra.condition.dis && diydata.storeExtra.condition.mode">
							<span>2</span>
						</template>
						<template v-else-if="(diydata.storeExtra.condition.dis && !diydata.storeExtra.condition.mode) || (diydata.storeExtra.condition.mode && !diydata.storeExtra.condition.dis)">
							<span>1</span>
						</template>
					</div> -->
				</div>
				<div class="diy-waimai-store-box">
					<template v-if="!getLocationFail">
						<template v-if="!diydata.stores.empty">
							<van-list v-model="diydata.stores.loading" :finished="diydata.stores.finished" @load="onGetStore" :offset="100" :immediate-check="false">
								<div class="waimai-store-item-list">
									<div class="waimai-store-item border-1px-b" v-for="(storeItem, storeIndex) in diydata.stores.data" :key="storeIndex" :class="{disabled: storeItem.is_rest == 1}">
										<div class="mian-content-box">
											<div class="content-left">
												<router-link class="item-image" :to="util.getUrl({path:storeItem.url})">
													<div :style="{color: diydata.diy.fixedsearch.style.fixedbackground == '#ffffff' ? '#ff2d4b' : diydata.diy.fixedsearch.style.fixedbackground}" class="item-num" v-if="storeItem.cart_num > 0">{{storeItem.cart_num}}</div>
													<div class="item-rest" v-if="storeItem.is_rest == 1">休息中</div>
													<img v-lazy="{src: storeItem.logo, loading: diydata.config.lazyload_store}">
													<div class="store-label" v-if="storeItem.label > 0">
														<div class="label" :style="{'background-color': storeItem.label_color}">{{storeItem.label_cn}}</div>
													</div>
												</router-link>
											</div>
											<div class="content-right">
												<router-link :to="util.getUrl({path:storeItem.url})">
													<div class="item-name-wrap">
														<div class="item-name" :style="{'color': diydata.diy.stores_list.diyitems.style.titlecolor}">{{storeItem.title}}</div>
													</div>
													<div class="delivery-tip" v-if="storeItem.rest_reserve_cn">{{storeItem.rest_reserve_cn}}</div>
													<div class="item-score-time">
														<div class="item-score-sale">
															<div class="item-star-box">
                                <!--评分-->
																<van-rate  v-model="storeItem.score" :size="12" :disabled-color="sysbg" disabled/>
															</div>
															<div class="item-sale">月售 {{storeItem.sailed}}</div>
														</div>
														<div class="time-distance">
															<div class="avg_delivery_time">{{storeItem.delivery_time}}分钟</div>
															<div class="line">|</div>
															<div class="avg_distance">{{storeItem.distance}}km</div>
														</div>
													</div>
													<div class="item-min-delivery">
														<div class="item-min-delivery-left">
															<!-- <div>起送价￥{{storeItem.send_price}}</div>
															<div class="line">|</div>
															<div>配送费￥{{storeItem.delivery_price}}</div> -->
														</div>
														<div class="item-min-delivery-right-wrap">
															<div class="zhunshibao" >准时宝</div>
															<div class="item-min-delivery-right" :style="{'background-color': diydata.diy.stores_list.diyitems.style.deliverytitlebgcolor, 'color': diyitem.style.deliverytitlecolor}" v-if="storeItem.delivery_mode == 2">
																{{storeItem.delivery_title}}
															</div>
														</div>
													</div>
												</router-link>
												<div class="discount-box" @click="onToggleDiscount(storeIndex, diyindex)" v-if="diydata.diy.stores_list.diyitems.params.showdiscount==1 && storeItem.activity && (storeItem.activity.num > 0 || storeItem.activity.labels_num > 0)">
													<template v-if="diydata.diy.stores_list.diyitems.params.discountstyle == 1">
														<div class="toggle">
															<div class="icon " :class="{'icon-fold': storeItem.activity.is_show_all, 'icon-unfold': !storeItem.activity.is_show_all}" v-if="storeItem.activity.num > 2"></div>
														</div>
														<template v-for="(activityItem, index) in storeItem.activity.items" v-if="index < 2 || (storeItem.activity.is_show_all && index >= 2)">
															<div class="single-line">
																<img class="discount-icon" :src="'static/img/' + activityItem.type + '_b.png'">
																<div class="discount-text">{{activityItem.title}}</div>
															</div>
														</template>
													</template>
													<template v-else-if="diydata.diy.stores_list.diyitems.params.discountstyle == 2">
														<div class="toggle">
															<div class="icon " :class="{'icon-fold': storeItem.activity.is_show_all, 'icon-unfold': !storeItem.activity.is_show_all}" v-if="storeItem.activity.labels_num > 4"></div>
														</div>
														<div class="label-wrap" :class="{autoHeight: storeItem.activity.is_show_all}">
															<span :class="activityLabel.class" v-for="(activityLabel, index) in storeItem.activity.labels" v-if="index < 4 || (storeItem.activity.is_show_all && index >= 4)">{{activityLabel.title}}</span>
														</div>
													</template>
												</div>
												<!--热卖商品 -->
												<div class="hot-box" v-if="storeItem.hot_goods_num > 0 && (diydata.diy.stores_list.diyitems.params.showhotgoods == 1 || (diydata.diy.stores_list.diyitems.params.showhotgoods == 2 && diydata.diy.stores_list.diyitems.params.hotgoodsnum > storeIndex))" >
													<template v-for="item of storeItem.hot_goods">
														<router-link :to="util.getUrl({path:'/pages/store/goodsDetail', query:{sid: storeItem.id, id: item.id}})">
															<div class="hot-box-item">
																<div class="hot-t border-1px">
																	<img v-lazy="{src: item.thumb, loading: diydata.config.lazyload_goods}">
																	<div class="discount" v-if="item.svip_status == 1">会员 {{item.discount}}折</div>
																	<div class="discount" v-else-if="item.discount > 0 && item.discount < 10">{{item.discount}}折</div>
																</div>
																<div class="hot-b">
																	<div class="shop-name">{{item.title}}</div>
																	<div class="shop-price">
																		<div class="now-price">¥{{item.price}}</div>
																		<div class="old-price" v-if="item.old_price > 0">¥{{item.old_price}}</div>
																	</div>
																</div>
															</div>
														</router-link>
													</template>
												</div>
											</div>
										</div>
									</div>
								</div>
							</van-list>
							<div class="loaded" v-if="diydata.stores.loaded">
								<div class="loaded-tips">我是有底线的</div>
							</div>
						</template>
						<template v-else>
							<div class="geolocationfail">
								<img src="static/img/store_no_con.png" alt="">
								<p>附近没有发现门店,我们正在努力覆盖中</p>
								<router-link :to="util.getUrl({path: '/pages/home/location'})" class="btn-location">切换地址</router-link>
							</div>
						</template>
					</template>
					<template v-else>
						<div class="geolocationfail">
							<img src="static/img/store_no_con.png" alt="">
							<p>获取定位失败!您可以选择手动搜索地址</p>
							<router-link :to="util.getUrl({path: '/pages/home/location'})" class="btn-location">手动搜索地址</router-link>
						</div>
					</template>
				</div>
			</div>
			<!-- 弹幕组 -->
			<template v-else-if="diyitem.id == 'danmu'">
				<transition name="danmu-fade" mode="out-in">
					<div class="order-danmu" :class="{'style2': diyitem.params.styleType == 2, 'opacity-0': !danmu.show}" :style="{opacity: diyitem.style.opacity,top: diyitem.style.top + 'px', left: diyitem.style.left + 'px', background: diyitem.style.background, color: diyitem.style.color}">
						<div class="flex">
							<img class="thumb" :src="danmu.item.avatar" alt="">
							<span class="info">新订单来自 {{danmu.item.nickname}}</span>
							<span class="time">{{danmu.item.time}}</span>
						</div>
					</div>
				</transition>
			</template>
			<!--启动图-->
			<div class="dialog dialog-guide " :class="{'dialog-show': diydata.guideData.is_show}" v-else-if="diyitem.id == 'guide'">
				<div class="dialog-mask" :style="{'background-color': diyitem.style.backgroundcolor, opacity: 0.7}" @click="onCloseGuide"></div>
				<div class="dialog-container">
					<div class="guide">
						<van-swipe :autoplay="3000">
							<van-swipe-item v-for="(item, index) in diyitem.data" :key="index">
								<div @click="util.jsUrl(item.pagePath)">
									<img :src="item.imgUrl"/>
								</div>
							</van-swipe-item>
						</van-swipe>
					</div>
					<div class="icon icon-close" @click="onCloseGuide"></div>
				</div>
			</div>
			<!--生活圈组件-->
			<div class="diy-gohome-activity" v-else-if="diyitem.id == 'gohomeActivity'" :style="{'margin-top': diyitem.style.margintop + 'px', 'padding-top': (diyitem.params.headline_show == 1 ? '10px' : '0px;')}">
				<template v-if="!getLocationFail">
					<template v-if="diyitem.params.headline_show == 1">
						<div class="activity-header" :style="{'color': diyitem.style.headlinecolor}">
							{{diyitem.params.headline}}
							<div class="more" @click="util.jsUrl(diyitem.params.more_link)" :style="{color: diyitem.style.morecolor}">
								{{diyitem.params.more}}
								<div class="icon icon-arrow-right"></div>
							</div>
						</div>
					</template>
					<template v-if="diyitem.params.type == 'kanjia'">
						<div class="diy-gohome-kanjia">
							<template v-if="diyitem.style.liststyle == 4">
								<div class="list-row-box" :style="{'background': diyitem.style.background}">
									<div class="activity-item bg-default padding-10 van-hairline--bottom" v-for="(item, index) in diyitem.data" :key="item.id" :style="{'margin-bottom': diyitem.style.marginbottom + 'px'}">
										<div class="flex-lr">
											<div class="thumb">
												<img class="img-100" :src="item.thumb" alt="">
											</div>
											<div class="info">
												<div class="font-14 w-100">
													<p :style="{'color': diyitem.style.titlecolor}">{{item.title}}</p>
												</div>
												<div class="flex-lr-bottom w-100">
													<div class="price-bar">
														<div class="flex">
															<span class="font-500 font-15 margin-5-r" :style="{'color': diyitem.style.pricecolor}">¥{{item.price}}</span>
															<div class="c-gray line-through font-12" v-if="diyitem.params.showoldprice == 1" :style="{'color': diyitem.style.oldpricecolor}">¥{{item.old_price}}</div>
															<div class="discount">{{item.discount}}折</div>
														</div>
														<div class="bar" :style="{background: diyitem.style.barbackground}">
															<div class="bar-inner" :style="{width: item.sailed_percent + '%'}" v-if="!diyitem.style.barinnerbackground"></div>
															<div class="bar-inner" :style="{width: item.sailed_percent + '%', background: diyitem.style.barinnerbackground}" v-else></div>
															<div class="bar-text" :style="{color: diyitem.style.bartextcolor}">已售{{item.falesailed_total}}份</div>
														</div>
													</div>
													<router-link tag="div" :to="util.getUrl({path: '/gohome/pages/kanjia/detail', query: {id: item.id}})" class="btn btn-detail" :style="{color: diyitem.style.buybtncolor}" v-if="!diyitem.style.buybtnbackground">{{diyitem.params.buybtntext_kanjia}}</router-link>
													<router-link tag="div" :to="util.getUrl({path: '/gohome/pages/kanjia/detail', query: {id: item.id}})" class="btn btn-detail" :style="{color: diyitem.style.buybtncolor, background: diyitem.style.buybtnbackground}" v-else>{{diyitem.params.buybtntext_kanjia}}</router-link>
												</div>
											</div>
										</div>
									</div>
								</div>
							</template>
							<template v-else-if="diyitem.style.liststyle == 1">
								<div class="list-one-row-box" >
									<div class="activity-item van-hairline--bottom" v-for="(item, index) in diyitem.data" :key="item.id">
										<div class="thumb">
											<img class="img-100" :src="item.thumb" alt="">
										</div>
										<div class="title" :style="{'color': diyitem.style.titlecolor}">【邀请好友帮忙砍价】{{item.title}}</div>
										<div class="flex-lr">
											<div class="flex-lr">
												<div class="flex">
													<div class="font-16 font-bold" :style="{'color': diyitem.style.pricecolor}">¥{{item.price}}</div>
													<div class="c-gray font-12 line-through margin-5-l" v-if="diyitem.params.showoldprice == 1" :style="{'color': diyitem.style.oldpricecolor}">¥{{item.old_price}}</div>
												</div>
												<div class="buy-history flex">
													<div class="avatar-list">
														<img :src="img" alt="" v-for="(img, index) in item.peopleimg" >
													</div>
													<div class="font-12 c-gray margin-5-l" v-if="item.peoplenum > 0">{{item.peoplenum}}人参与</div>
												</div>
											</div>
											<div class="btn btn-end" v-if="item.status == 3">已结束</div>
											<router-link tag="div" :to="util.getUrl({path: '/gohome/pages/kanjia/detail', query: {id: item.id}})" class="btn btn-detail" :style="{color: diyitem.style.buybtncolor}" v-if="!diyitem.style.buybtnbackground">{{diyitem.params.buybtntext_kanjia}}</router-link>
											<router-link tag="div" :to="util.getUrl({path: '/gohome/pages/kanjia/detail', query: {id: item.id}})" class="btn btn-detail" :style="{color: diyitem.style.buybtncolor, background: diyitem.style.buybtnbackground}" v-else>{{diyitem.params.buybtntext_kanjia}}</router-link>
										</div>
									</div>
								</div>
							</template>
							<template v-else-if="diyitem.style.liststyle == 2">
								<div class="list-two-row-box">
									<div class="activity-list">
										<div class="activity-item" v-for="(item, index) in diyitem.data" :key="item.id">
											<div class="item-inner">
												<div class="thumb">
													<img class="img-100" :src="item.thumb" alt="">
												</div>
												<div class="goods-title" :style="{'color': diyitem.style.titlecolor}">{{item.title}}</div>
												<div class="flex">
													<span class="font-500 font-15 margin-5-r" :style="{'color': diyitem.style.pricecolor}">¥{{item.price}}</span>
													<div class="c-gray line-through font-12" v-if="diyitem.params.showoldprice == 1" :style="{'color': diyitem.style.oldpricecolor}">¥{{item.old_price}}</div>
													<div class="discount">{{item.discount}}折</div>
												</div>
												<div class="flex-lr margin-10-t">
													<div class="bar" :style="{background: diyitem.style.barbackground}">
														<div class="bar-inner" :style="{width: item.sailed_percent + '%'}" v-if="!diyitem.style.barinnerbackground"></div>
														<div class="bar-inner" :style="{width: item.sailed_percent + '%', background: diyitem.style.barinnerbackground}" v-else></div>
														<div class="bar-text" :style="{color: diyitem.style.bartextcolor}">已售{{item.falesailed_total}}份</div>
													</div>
													<router-link tag="div" :to="util.getUrl({path: '/gohome/pages/kanjia/detail', query: {id: item.id}})" class="btn btn-detail" :style="{color: diyitem.style.buybtncolor}" v-if="!diyitem.style.buybtnbackground">{{diyitem.params.buybtntext_kanjia}}</router-link>
													<router-link tag="div" :to="util.getUrl({path: '/gohome/pages/kanjia/detail', query: {id: item.id}})" class="btn btn-detail" :style="{color: diyitem.style.buybtncolor, background: diyitem.style.buybtnbackground}" v-else>{{diyitem.params.buybtntext_kanjia}}</router-link>
												</div>
											</div>
										</div>
									</div>
								</div>
							</template>
							<template v-else-if="diyitem.style.liststyle == 3">
								<div class="list-three-row-box" :style="{'background-color': diyitem.style.background}">
									<div class="seckill-list">
										<router-link tag="div" :to="util.getUrl({path: '/gohome/pages/kanjia/detail', query: {id: item.id}})" class="seckill-item" v-for="(item, index) in diyitem.data" :key="item.id">
											<div class="item-inner">
												<div class="thumb">
													<img class="img-100" :src="item.thumb" alt="">
												</div>
												<div class="goods-title" :style="{color: diyitem.style.titlecolor}">{{item.title}}</div>
												<div class="flex">
													<span class="c-danger font-500 font-15" :style="{color: diyitem.style.pricecolor}">¥{{item.price}}</span>
													<div class="c-gray line-through font-12 hide" :style="{color: diyitem.style.oldpricecolor}">¥{{item.old_price}}</div>
													<div class="discount">{{item.discount}}折</div>
												</div>
											</div>
										</router-link>
									</div>
								</div>
							</template>
						</div>
					</template>
					<template v-else-if="diyitem.params.type == 'pintuan'">
						<div class="diy-gohome-pintuan" >
							<template v-if="diyitem.style.liststyle == 4">
								<div class="list-row-box" :style="{'background': diyitem.style.background}">
									<div class="activity-item bg-default padding-10 van-hairline--bottom" v-for="(item, index) in diyitem.data" :key="item.id" :style="{'margin-bottom': diyitem.style.marginbottom + 'px'}">
										<div class="flex-lr">
											<div class="thumb">
												<img class="img-100" :src="item.thumb" alt="">
												<div class="mark">
													{{item.peoplenum}}人团
												</div>
											</div>
											<div class="info">
												<div class="font-14 w-100">
													<p :style="{'color': diyitem.style.titlecolor}">{{item.title}}</p>
												</div>
												<div class="flex-lr-bottom w-100">
													<div class="price-bar">
														<div class="flex">
															<span class="font-500 font-15 margin-5-r" :style="{'color': diyitem.style.pricecolor}">¥{{item.price}}</span>
															<div class="c-gray line-through font-12" v-if="diyitem.params.showoldprice == 1" :style="{'color': diyitem.style.oldpricecolor}">¥{{item.old_price}}</div>
															<div class="discount">{{item.discount}}折</div>
														</div>
														<div class="bar" :style="{background: diyitem.style.barbackground}">
															<div class="bar-inner" :style="{width: item.sailed_percent + '%'}" v-if="!diyitem.style.barinnerbackground"></div>
															<div class="bar-inner" :style="{width: item.sailed_percent + '%', background: diyitem.style.barinnerbackground}" v-else></div>
															<div class="bar-text" :style="{color: diyitem.style.bartextcolor}">已售{{item.falesailed_total}}份</div>
														</div>
													</div>
													<router-link tag="div" :to="util.getUrl({path: '/gohome/pages/pintuan/detail', query: {id: item.id}})" class="btn btn-detail" :style="{color: diyitem.style.buybtncolor}" v-if="!diyitem.style.buybtnbackground">{{diyitem.params.buybtntext_pintuan}}</router-link>
													<router-link tag="div" :to="util.getUrl({path: '/gohome/pages/pintuan/detail', query: {id: item.id}})" class="btn btn-detail" :style="{color: diyitem.style.buybtncolor, background: diyitem.style.buybtnbackground}" v-else>{{diyitem.params.buybtntext_pintuan}}</router-link>
												</div>
											</div>
										</div>
									</div>
								</div>
							</template>
							<template v-else-if="diyitem.style.liststyle == 1">
								<div class="list-one-row-box">
									<div class="activity-item van-hairline--bottom" v-for="(item, index) in diyitem.data" :key="item.id">
										<div class="thumb">
											<img class="img-100" :src="item.thumb" alt="">
											<div class="mark">
												{{item.peoplenum}}人团
											</div>
										</div>
										<div class="title" :style="{'color': diyitem.style.titlecolor}">【邀请好友一起拼团】{{item.title}}</div>
										<div class="flex-lr">
											<div class="flex-lr">
												<div class="flex">
													<div class="font-16 font-bold" :style="{'color': diyitem.style.pricecolor}">¥{{item.price}}</div>
													<div class="c-gray font-12 line-through margin-5-l" v-if="diyitem.params.showoldprice == 1" :style="{'color': diyitem.style.oldpricecolor}">¥{{item.old_price}}</div>
												</div>
												<div class="bar" :style="{background: diyitem.style.barbackground}">
													<div class="bar-inner" :style="{width: item.sailed_percent + '%'}" v-if="!diyitem.style.barinnerbackground"></div>
													<div class="bar-inner" :style="{width: item.sailed_percent + '%', background: diyitem.style.barinnerbackground}" v-else></div>
													<div class="bar-text" :style="{color: diyitem.style.bartextcolor}">已团{{item.falesailed_total}}份</div>
												</div>
											</div>
											<router-link tag="div" :to="util.getUrl({path: '/gohome/pages/pintuan/detail', query: {id: item.id}})" class="btn btn-detail" :style="{color: diyitem.style.buybtncolor}" v-if="!diyitem.style.buybtnbackground">{{diyitem.params.buybtntext_pintuan}}</router-link>
											<router-link tag="div" :to="util.getUrl({path: '/gohome/pages/pintuan/detail', query: {id: item.id}})" class="btn btn-detail" :style="{color: diyitem.style.buybtncolor, background: diyitem.style.buybtnbackground}" v-else>{{diyitem.params.buybtntext_pintuan}}</router-link>
										</div>
									</div>
								</div>
							</template>
							<template v-else-if="diyitem.style.liststyle == 2">
								<div class="list-two-row-box" >
									<div class="activity-list">
										<div class="activity-item" v-for="(item, index) in diyitem.data" :key="item.id">
											<div class="item-inner">
												<div class="thumb">
													<img class="img-100" :src="item.thumb" alt="">
													<div class="mark">
														{{item.peoplenum}}人团
													</div>
												</div>
												<div class="goods-title" :style="{'color': diyitem.style.titlecolor}">{{item.title}}</div>
												<div class="flex">
													<span class="font-500 font-15 margin-5-r" :style="{'color': diyitem.style.pricecolor}">¥{{item.price}}</span>
													<div class="c-gray line-through font-12" v-if="diyitem.params.showoldprice == 1" :style="{'color': diyitem.style.oldpricecolor}">¥{{item.old_price}}</div>
													<div class="discount">{{item.discount}}折</div>
												</div>
												<div class="flex-lr margin-10-t">
													<div class="bar" :style="{background: diyitem.style.barbackground}">
														<div class="bar-inner" :style="{width: item.sailed_percent + '%'}" v-if="!diyitem.style.barinnerbackground"></div>
														<div class="bar-inner" :style="{width: item.sailed_percent + '%', background: diyitem.style.barinnerbackground}" v-else></div>
														<div class="bar-text" :style="{color: diyitem.style.bartextcolor}">已售{{item.falesailed_total}}份</div>
													</div>
													<router-link tag="div" :to="util.getUrl({path: '/gohome/pages/pintuan/detail', query: {id: item.id}})" class="btn btn-detail" :style="{color: diyitem.style.buybtncolor}" v-if="!diyitem.style.buybtnbackground">{{diyitem.params.buybtntext_pintuan}}</router-link>
													<router-link tag="div" :to="util.getUrl({path: '/gohome/pages/pintuan/detail', query: {id: item.id}})" class="btn btn-detail" :style="{color: diyitem.style.buybtncolor, background: diyitem.style.buybtnbackground}" v-else>{{diyitem.params.buybtntext_pintuan}}</router-link>
												</div>
											</div>
										</div>
									</div>
								</div>
							</template>
							<template v-else-if="diyitem.style.liststyle == 3">
								<div class="list-three-row-box" :style="{'background-color': diyitem.style.background}">
									<div class="seckill-list">
										<router-link tag="div" :to="util.getUrl({path: '/gohome/pages/pintuan/detail', query: {id: item.id}})" class="seckill-item" v-for="(item, index) in diyitem.data" :key="item.id">
											<div class="item-inner">
												<div class="thumb">
													<img class="img-100" :src="item.thumb" alt="">
													<div class="mark">
														{{item.peoplenum}}人团
													</div>
												</div>
												<div class="goods-title" :style="{color: diyitem.style.titlecolor}">{{item.title}}</div>
												<div class="flex">
													<span class="font-500 font-15" :style="{color: diyitem.style.pricecolor}">¥{{item.price}}</span>
													<div class="c-gray line-through font-12 hide" :style="{color: diyitem.style.oldpricecolor}">¥{{item.old_price}}</div>
													<div class="discount">{{item.discount}}折</div>
												</div>
											</div>
										</router-link>
									</div>
								</div>
							</template>
						</div>
					</template>
					<template v-else-if="diyitem.params.type == 'seckill'">
						<div class="diy-gohome-seckill">
							<template v-if="diyitem.style.liststyle == 4">
								<div class="list-row-box" :style="{'background': diyitem.style.background}">
									<div class="activity-item bg-default padding-10 van-hairline--bottom" v-for="(item, index) in diyitem.data" :key="item.id" :style="{'margin-bottom': diyitem.style.marginbottom + 'px'}">
										<div class="flex-lr">
											<div class="thumb">
												<img class="img-100" :src="item.thumb" alt="">
											</div>
											<div class="info">
												<div class="font-14 w-100">
													<p :style="{'color': diyitem.style.titlecolor}">{{item.title}}</p>
												</div>
												<div class="flex-lr-bottom w-100">
													<div class="price-bar">
														<div class="flex">
															<span class="font-500 font-15 margin-5-r" :style="{'color': diyitem.style.pricecolor}">¥{{item.price}}</span>
															<div class="c-gray line-through font-12" v-if="diyitem.params.showoldprice == 1" :style="{'color': diyitem.style.oldpricecolor}">¥{{item.old_price}}</div>
															<div class="discount">{{item.discount}}折</div>
														</div>
														<div class="bar" :style="{background: diyitem.style.barbackground}">
															<div class="bar-inner" :style="{width: item.sailed_percent + '%'}" v-if="!diyitem.style.barinnerbackground"></div>
															<div class="bar-inner" :style="{width: item.sailed_percent + '%', background: diyitem.style.barinnerbackground}" v-else></div>
															<div class="bar-text" :style="{color: diyitem.style.bartextcolor}">已抢{{item.falesailed_total}}份</div>
														</div>
													</div>
													<router-link tag="div" :to="util.getUrl({path: '/gohome/pages/seckill/detail', query: {id: item.id}})" class="btn btn-detail" :style="{color: diyitem.style.buybtncolor}" v-if="!diyitem.style.buybtnbackground">{{diyitem.params.buybtntext_seckill}}</router-link>
													<router-link tag="div" :to="util.getUrl({path: '/gohome/pages/seckill/detail', query: {id: item.id}})" class="btn btn-detail" :style="{color: diyitem.style.buybtncolor, background: diyitem.style.buybtnbackground}" v-else>{{diyitem.params.buybtntext_seckill}}</router-link>
												</div>
											</div>
										</div>
									</div>
								</div>
							</template>
							<template v-else-if="diyitem.style.liststyle == 1">
								<div class="list-one-row-box" >
									<div class="activity-item van-hairline--bottom" v-for="(item, index) in diyitem.data" :key="item.id">
										<div class="thumb">
											<img class="img-100" :src="item.thumb" alt="">
										</div>
										<div class="title" :style="{'color': diyitem.style.titlecolor}">{{item.title}}</div>
										<div class="flex-lr">
											<div class="flex-lr">
												<div class="flex">
													<div class="font-16 font-bold" :style="{'color': diyitem.style.pricecolor}">¥{{item.price}}</div>
													<div class="c-gray font-12 line-through margin-5-l" v-if="diyitem.params.showoldprice == 1" :style="{'color': diyitem.style.oldpricecolor}">¥{{item.old_price}}</div>
												</div>
												<div class="bar" :style="{background: diyitem.style.barbackground}">
													<div class="bar-inner" :style="{width: item.sailed_percent + '%'}" v-if="!diyitem.style.barinnerbackground"></div>
													<div class="bar-inner" :style="{width: item.sailed_percent + '%', background: diyitem.style.barinnerbackground}" v-else></div>
													<div class="bar-text" :style="{color: diyitem.style.bartextcolor}">已抢{{item.falesailed_total}}份</div>
												</div>
											</div>
											<router-link tag="div" :to="util.getUrl({path: '/gohome/pages/seckill/detail', query: {id: item.id}})" class="btn btn-detail" :style="{color: diyitem.style.buybtncolor}" v-if="!diyitem.style.buybtnbackground">{{diyitem.params.buybtntext_seckill}}</router-link>
											<router-link tag="div" :to="util.getUrl({path: '/gohome/pages/seckill/detail', query: {id: item.id}})" class="btn btn-detail" :style="{color: diyitem.style.buybtncolor, background: diyitem.style.buybtnbackground}" v-else>{{diyitem.params.buybtntext_seckill}}</router-link>
										</div>
									</div>
								</div>
							</template>
							<template v-else-if="diyitem.style.liststyle == 2">
								<div class="list-two-row-box" >
									<div class="activity-list">
										<div class="activity-item" v-for="(item, index) in diyitem.data" :key="item.id">
											<div class="item-inner">
												<div class="thumb">
													<img class="img-100" :src="item.thumb" alt="">
												</div>
												<div class="goods-title" :style="{'color': diyitem.style.titlecolor}">{{item.title}}</div>
												<div class="flex">
													<span class="font-500 font-15 margin-5-r" :style="{'color': diyitem.style.pricecolor}">¥{{item.price}}</span>
													<div class="c-gray line-through font-12" v-if="diyitem.params.showoldprice == 1" :style="{'color': diyitem.style.oldpricecolor}">¥{{item.old_price}}</div>
													<div class="discount">{{item.discount}}折</div>
												</div>
												<div class="flex-lr margin-10-t">
													<div class="bar" :style="{background: diyitem.style.barbackground}">
														<div class="bar-inner" :style="{width: item.sailed_percent + '%'}" v-if="!diyitem.style.barinnerbackground"></div>
														<div class="bar-inner" :style="{width: item.sailed_percent + '%', background: diyitem.style.barinnerbackground}" v-else></div>
														<div class="bar-text" :style="{color: diyitem.style.bartextcolor}">已售{{item.falesailed_total}}份</div>
													</div>
													<router-link tag="div" :to="util.getUrl({path: '/gohome/pages/seckill/detail', query: {id: item.id}})" class="btn btn-detail" :style="{color: diyitem.style.buybtncolor}" v-if="!diyitem.style.buybtnbackground">{{diyitem.params.buybtntext_seckill}}</router-link>
													<router-link tag="div" :to="util.getUrl({path: '/gohome/pages/seckill/detail', query: {id: item.id}})" class="btn btn-detail" :style="{color: diyitem.style.buybtncolor, background: diyitem.style.buybtnbackground}" v-else>{{diyitem.params.buybtntext_seckill}}</router-link>
												</div>
											</div>
										</div>
									</div>
								</div>
							</template>
							<template v-else-if="diyitem.style.liststyle == 3">
								<div class="list-three-row-box" :style="{'background-color': diyitem.style.background}">
									<div class="seckill-list">
										<router-link tag="div" :to="util.getUrl({path: '/gohome/pages/seckill/detail', query: {id: item.id}})"  class="seckill-item"  v-for="(item, index) in diyitem.data" :key="item.id">
											<div class="item-inner">
												<div class="thumb">
													<img class="img-100" :src="item.thumb" alt="">
												</div>
												<div class="goods-title" :style="{color: diyitem.style.titlecolor}">{{item.title}}</div>
												<div class="flex">
													<span class="font-500 font-15" :style="{color: diyitem.style.pricecolor}">¥{{item.price}}</span>
													<div class="c-gray line-through font-12 hide" :style="{color: diyitem.style.oldpricecolor}">¥{{item.old_price}}</div>
													<div class="discount">{{item.discount}}折</div>
												</div>
											</div>
										</router-link>
									</div>
								</div>
							</template>
						</div>
					</template>
				</template>
				<template v-else>
					<div class="geolocationfail">
						<img src="static/img/store_no_con.png" alt="">
						<p>获取定位失败!您可以选择手动搜索地址</p>
						<router-link :to="util.getUrl({path: '/pages/home/location'})" class="btn-location">手动搜索地址</router-link>
					</div>
				</template>
			</div>
			<!--同城信息组件-->
			<template v-else-if="diyitem.id == 'tongcheng'">
				<template v-if="!getLocationFail">
					<div class="diy-tongcheng-tiezi" :style="{'margin-top': diyitem.style.margintop + 'px'}">
						<template v-if="diyitem.params.headline_show == 1">
							<div class="tiezi-header" :style="{'color': diyitem.style.headlinecolor}">
								{{diyitem.params.headline}}
								<div class="more" @click="util.jsUrl(diyitem.params.more_link)" :style="{color: diyitem.style.morecolor}">
									{{diyitem.params.more}}
									<div class="icon icon-arrow-right"></div>
								</div>
							</div>
						</template>
						<van-list v-model="diydata.tongcheng.loading" :finished="diydata.tongcheng.finished" @load="onGetInformation" :offset="100" :immediate-check="false" v-if="!diydata.tongcheng.empty" class="diy-tongcheng-tiezi-list">
							<template v-for="(informationItem, informationIndex) in diydata.tongcheng.data">
								<div class="diy-tongcheng-tiezi-item " :class="{'van-hairline--bottom': informationIndex < diydata.tongcheng.data.length - 1}">
									<div class="diy-tongcheng-tiezi-userinfo ">
										<div class="diy-tongcheng-userinfo-left">
											<div class="avatar">
												<img :src="informationItem.ft_avatar" alt="">
											</div>
										</div>
										<div class="diy-tongcheng-userinfo-right">
											<div>
												<div class="tiezi-title">
													<span class="tag-top" v-if="informationItem.is_stick == 1">置顶</span>
													<span class="tag-cate">{{informationItem.category.title}}</span>
													<span class="nickname">{{informationItem.nickname}}</span>
												</div>
												<div class="tags" v-if="informationItem.keyword">
													<template v-for="(tag, index) in informationItem.keyword">
														<div class="tag-item">{{tag}}</div>
													</template>
												</div>
											</div>
											<div class="icon icon-phone2" v-if="informationItem.mobile" @click="util.jsTel(informationItem.mobile)"></div>
										</div>
									</div>
									<div class="diy-tongcheng-tieziinfo">
										<div class="tiezi-text" :class="{showsome: !informationItem.showall}" ref="text" v-html="informationItem.content_vue"></div>
										<div class="all-text" @click="onToggleInformation(informationIndex)" v-if="informationItem.content_length > 44">
											<span>{{informationItem.showall ? '收起' : '查看全文'}}</span>
											<i class="icon" :class="{'icon-unfold': !informationItem.showall, 'icon-fold': informationItem.showall}"></i>
										</div>
										<div class="tiezi-time">
											<div>{{informationItem.addtime_cn}}发布</div>
											<router-link tag="div" class="tiezi-detail" :to="util.getUrl({path: '/gohome/pages/tongcheng/detail', query: {id: informationItem.id}})">
												<span>查看详情</span>
												<i class="icon icon-right"></i>
											</router-link>
										</div>
										<ul class="thumbs" v-if="informationItem.thumbs">
											<li class="thumb-item" v-for="(inforThumbItem, inforThumbIndex) in informationItem.thumbs" :key="inforThumbIndex" @click="util.jsPreviewImage(informationItem.thumbs, inforThumbIndex)" v-if="inforThumbIndex < 3">
												<img :src="inforThumbItem" alt="">
											</li>
											<li class="thumb-item" v-if="informationItem.thumbs.length > 3">
												<img :src="informationItem.thumbs[3]" alt="">
												<div class="thumb-num">+{{informationItem.thumbs.length}}</div>
											</li>
										</ul>
										<router-link tag="div" class="tiezi-info" :to="util.getUrl({path: '/gohome/pages/tongcheng/detail', query: {id: informationItem.id}})">
											<div class="info">
												<i class="icon icon-attention font-15"></i>
												<span>{{informationItem.looknum}}</span>
											</div>
											<div class="info">
												<i class="icon icon-appreciate_light font-14"></i>
												<span>{{informationItem.likenum}}</span>
											</div>
											<div class="info">
												<i class="icon icon-comment font-14"></i>
												<span></span>
											</div>
										</router-link>
									</div>
								</div>
							</template>
						</van-list>
						<div class="no-data-simple" v-else>
							<span class="icon icon-cry"></span>
							<span>还没有信息，快去发布吧</span>
						</div>
					</div>
				</template>
				<template v-else>
					<div class="geolocationfail">
						<img src="static/img/store_no_con.png" alt="">
						<p>获取定位失败!您可以选择手动搜索地址</p>
						<router-link :to="util.getUrl({path: '/pages/home/location'})" class="btn-location">手动搜索地址</router-link>
					</div>
				</template>
			</template>
			<!--同城统计组件-->
			<template v-else-if="diyitem.id == 'tongchengStatistics'">
				<div class="diy-tongcheng-statistics van-hairline--bottom" :style="{'margin-top': diyitem.style.margintop + 'px', 'background-color': diyitem.style.backgroundcolor}">
					<div class="img-wrap">
						<img :src="diyitem.params.imgurl" alt="">
					</div>
					<ul class="info" :style="{color: diyitem.style.textcolor}">
						<li class="margin-10-r">浏览：{{diyitem.data.falselooknum}}</li>
						<li class="margin-10-r">发布：{{diyitem.data.falsefabunum}}</li>
					</ul>
				</div>
			</template>
			<!--好店入驻组件-->
			<template v-else-if="diyitem.id == 'haodianSettle'">
				<div class="diy-haodian-settle" :style="{'margin-top': diyitem.style.margintop + 'px', 'background-color': diyitem.style.backgroundcolor}">
					<div class="new-info">
						<div class="img-settle" :style="{background: `url(${diyitem.params.imgurl}) no-repeat center center`,backgroundSize: '100% 100%'}"></div>
						<div class="news-swipe">
							<van-swipe :autoplay="3000" :show-indicators="false" vertical v-if="diyitem.data.length > 0">
								<van-swipe-item class="news-swipe-item" v-for="(dataitem, dataindex) in diyitem.data" :key="dataindex">
									<div class="font-13 ellipsis w-100" :style="{color: diyitem.style.newscolor}" v-for="storeitem in dataitem" :key="storeitem.id">恭喜【<span :style="{color: diyitem.style.titlecolor}" >{{storeitem.title}}</span>】入驻</div>
								</van-swipe-item>
							</van-swipe>
							<ul class="font-14 no-settle-info" v-else>
								<li>欢迎入驻好店</li>
								<li class="margin-5-t">点击右侧按钮赶紧加入吧</li>
							</ul>
						</div>
					</div>
					<router-link tag="div" :to="util.getUrl({path: '/gohome/pages/haodian/settle'})" class="btn-settle" :style="{color: diyitem.style.btncolor, background: diyitem.style.btnbackground}">{{diyitem.params.btntext}}</router-link>
				</div>
			</template>
			<!--好店列表组件-->
			<template v-else-if="diyitem.id == 'haodianList'">
				<van-popup v-model="diydata.popup && diydata.popup.haodianSearch" position="top">
					<div class="haodian-filter padding-15-tb padding-10-lr flex-lr bg-default font-14 van-hairline--bottom">
						<div class="filter-item" :class="{active: diydata.haodianExtra.orderby == 'distance'}" @click="onChangeHaodianExtra('distance')">附近</div>
						<div class="filter-item" :class="{active: diydata.haodianExtra.orderby == 'new'}" @click="onChangeHaodianExtra('new')">最新</div>
						<div class="filter-item" :class="{active: diydata.haodianExtra.orderby == 'score'}" @click="onChangeHaodianExtra('score')">评分</div>
						<div class="filter-item" @click="onChangeHaodianExtra('filter')">筛选</div>
					</div>
					<van-tree-select
						:items="diydata.haodianCategory"
						:main-active-index="diydata.haodianExtra.cIndexActive"
						:active-id="diydata.haodianExtra.haodian_child_id"
						@navclick="onClickHaodianParentCategory"
						@itemclick="onClickHaodianChildCategory"
						class="font-14"
					/>
					<ul class="flex van-hairline--top">
						<li class="flex-1 c-gray van-hairline--right text-center padding-15-tb" @click="onChangeHaodianExtra('filter')">取消</li>
						<li class="flex-1 c-danger text-center padding-15-tb" @click="onHaodianCategoryConfirm">确定</li>
					</ul>
				</van-popup>
				<template v-if="!getLocationFail">
					<div class="diy-haodian-list" :style="{marginTop: diyitem.style.margintop + 'px'}">
						<div class="haodian-filter padding-15-tb padding-10-lr flex-lr bg-default font-14 van-hairline--bottom">
							<div class="filter-item" :class="{active: diydata.haodianExtra.orderby == 'distance'}" @click="onChangeHaodianExtra('distance')">附近</div>
							<div class="filter-item" :class="{active: diydata.haodianExtra.orderby == 'new'}" @click="onChangeHaodianExtra('new')">最新</div>
							<div class="filter-item" :class="{active: diydata.haodianExtra.orderby == 'score'}" @click="onChangeHaodianExtra('score')">评分</div>
							<div class="flex filter-item" @click="onChangeHaodianExtra('filter')">
								筛选<i class="icon icon-unfold"></i>
								<span class="haodian-search-sign" v-if="diydata.showSearchSign"></span>
							</div>
						</div>
						<van-list v-model="diydata.haodian.loading" :finished="diydata.haodian.loaded" @load="onGetHaodianStore" :offset="100" :immediate-check="false" v-if="!diydata.haodian.empty">
								<div class="store-item " :class="{'van-hairline--top': haodianIndex > 0}" v-for="(haodianItem, haodianIndex) in diydata.haodian.data" :key="haodianIndex">
									<router-link tag="div" :to="util.getUrl({path: '/gohome/pages/haodian/detail', query: {sid: haodianItem.id}})" class="img-wrap">
										<img :src="haodianItem.logo" alt="">
									</router-link>
									<div class="store-main">
										<router-link tag="div" :to="util.getUrl({path: '/gohome/pages/haodian/detail', query: {sid: haodianItem.id}})">
											<div class="flex-lr">
												<div class="flex">
													<div class="store-title" :style="{color: diyitem.style.storetitlecolor}">{{haodianItem.title}}</div>
													<van-rate v-model="haodianItem.haodian_score" :size="12" :disabled-color="diyitem.style.starscolor" disabled />
													<span class="c-gray font-12 margin-5-l hide" :style="{color: diyitem.style.startextcolor}">{{haodianItem.haodian_score}}分</span>
												</div>
												<div :style="{color: diyitem.style.storedistancecolor}" class="store-distance ellipsis">{{haodianItem.distance}}km</div>
											</div>
											<div class="c-gray font-12 margin-10-t">营业时间: {{haodianItem.business_hours_cn}}</div>
											<ul class="store-tags" :style="{color: diyitem.style.storetagstextcolor}" v-if="haodianItem.haodian_tags && haodianItem.haodian_tags.length > 0">
												<li class="tag-item" v-for="(haodianTag, haodianTagIndex) in haodianItem.haodian_tags" :key="haodianTagIndex" :style="{background: diyitem.style.tagsbackgroundcolor}">{{haodianTag}}</li>
											</ul>
										</router-link>
										<div class="discount-box" v-if="diyitem.params.showdiscount == 1 && haodianItem.activity&&  haodianItem.activity.length > 0">
											<div class="single-line" v-for="(activityItem, activityIndex) in haodianItem.activity" :key="activityIndex">
												<img class="discount-icon" :src="activityItem.thumb_vue">
												<div class="discount-text">{{activityItem.text}}</div>
											</div>
										</div>
									</div>
								</div>
								<div class="loaded" v-if="diydata.haodian.loaded">
									<div class="loaded-tips">我是有底线的</div>
								</div>
						</van-list>
						<div class="geolocationfail" v-else>
							<img src="static/img/collect_no_bg.png" alt="">
							<p>暂无好店，您可以更换筛选条件试试</p>
						</div>
					</div>
				</template>
				<template v-else>
					<div class="geolocationfail">
						<img src="static/img/store_no_con.png" alt="">
						<p>获取定位失败!您可以选择手动搜索地址</p>
						<router-link :to="util.getUrl({path: '/pages/home/location'})" class="btn-location">手动搜索地址</router-link>
					</div>
				</template>
			</template>
			<!--商户自定义首页组件-->
			<template v-else-if="diyitem.id == 'operation'">
				<div class="diy-store-operation-1" v-if="diyitem.style.style == 1" :style="{'margin-top':diyitem.style.margintop + 'px'}">
					<div class="diy-store-operation-item" v-for="(item, index) in diyitem.data" :key="index" @click="util.jsUrl(item.linkurl)">
						<div class="img-container">
							<img :src="item.imgurl" :class="diyitem.style.navstyle" alt="">
						</div>
						<div class="title" :style="{color: item.color}">{{item.text}}</div>
					</div>
				</div>
				<div class="diy-store-operation" :style="{'margin-top':diyitem.style.margintop + 'px'}" v-else>
					<div class="diy-store-operation-item" v-for="(item, index) in diyitem.data" :key="index" @click="util.jsUrl(item.linkurl)">
						<div class="container">
							<div class="left">
								<div class="title":style="{color: item.color}">{{item.text}}</div>
								<div class="description":style="{color: item.dec_color}">{{item.decoration}}</div>
							</div>
							<div class="right">
								<img :class="diyitem.style.navstyle" :src="item.imgurl" alt="">
							</div>
						</div>
					</div>
				</div>
			</template>
			<div class="diy-store-info" v-else-if="diyitem.id=='info'" :style="{'margin-top': diyitem.style.margintop + 'px'}">
				<div class="title van-hairline--bottom">
					<van-icon name='shop' class="icon" :class="diyitem.params.icon" :style="{color: diyitem.style.iconcolor}"></van-icon>
					<div :style="{color: diyitem.style.titlecolor}">{{diyitem.params.titletext}}</div>
				</div>
				<div class="info van-hairline--bottom">
					<div class="left">
						<img :src="diyitem.data.logo" alt="">
						<div class="name-price">
							<div class="name" :style="{color: diyitem.style.namecolor}">{{diyitem.data.title}}</div>
							<div class="price">{{diyitem.data.consume_per_person}}元/人</div>
						</div>
					</div>
					<div class="right" :class="{disabled: diyitem.data.is_rest==1}" :style="{background: diyitem.style.statusbackground, color: diyitem.style.statuscolor}">
						<div class="status-title">店铺状态</div>
						<div class="line"></div>
						<div class="status">{{diyitem.data.is_rest==1 ? '休息中' : '营业中'}}</div>
					</div>
				</div>
				<div class="time van-hairline--bottom">
					<van-icon name='time' class="icon"></van-icon>
					<div>营业时间：{{diyitem.data.business_hours_cn}}</div>
				</div>
				<div class="location">
					<div class="left">
						<van-icon name='location' class="icon"></van-icon>
						<div class="address">{{diyitem.data.address}}</div>
					</div>
					<div class="right">
						<div class="contact van-hairline--right" @click="util.jsLocation({lat: diyitem.data.location_x, lng: diyitem.data.location_y, name: diyitem.data.title, address: diyitem.data.address})">
							<van-icon name='taxi' class="icon"></van-icon>
							<div class="contact-title">导航</div>
						</div>
						<div class="contact" @click="util.jsUrl('tel:' + diyitem.data.telephone)">
							<van-icon name='telephone' class="icon"></van-icon>
							<div class="contact-title">电话</div>
						</div>
					</div>
				</div>
			</div>
			<template v-else-if="diyitem.id=='tags'">
				<van-tabs v-model="diyitem.active" swipeable @click="onChangeTab" :style="{background: diyitem.style.background, 'margin-top': diyitem.style.margintop + 'px'}">
					<template v-for="item in diyitem.data">
						<van-tab :title="item.text" :style="{color: item.color}"></van-tab>
					</template>
				</van-tabs>
			</template>
			<div class="diy-store-coupon" v-else-if="diyitem.id == 'coupon'">
				<div class="coupon-list" v-if="diyitem.data.can_collect || (diyitem.data && diyitem.data.record && diyitem.data.record.length)">
					<div class="coupon-item" v-if="diyitem.data.can_collect">
						<div class="coupon-left" :style="{background: diyitem.style.leftbackground}">
							<div class="left">
								<div class="discount" :style="{color: diyitem.style.pricecolor}">
									￥
									<span>{{diyitem.data.price}}</span>
								</div>
								<div class="condition" :style="{color: diyitem.style.conditioncolor}">内含{{diyitem.data.num}}张券</div>
							</div>
							<div class="right">
								<div class="coupon-title" :style="{color: diyitem.style.titlecolor}">{{diyitem.data.title}}</div>
								<div class="coupon-scene" :style="{color: diyitem.style.scenecolor}">店内外卖通用</div>
								<div class="coupon-limit">
									<div :style="{color: diyitem.style.limitcolor}">
										限{{diyitem.data.endtime_cn}}前使用
									</div>
								</div>
							</div>
						</div>
						<div class="coupon-right" :style="{background: diyitem.style.rightbackground}">
							<div class="triangle-border-right">
								<div class="circular0"></div>
								<div class="circular1"></div>
								<div class="i"></div><div class="i"></div><div class="i"></div><div class="i"></div><div class="i"></div><div class="i"></div><div class="i"></div><div class="i"></div><div class="i"></div><div class="i"></div><div class="i"></div><div class="i"></div><div class="i"></div><div class="i"></div><div class="i"></div><div class="i"></div><div class="i"></div><div class="i"></div><div class="i"></div>
							</div>
							<div class="change-block">
								<div class="diy-circle">
									<div class="circle" :style="{'background-color': diyitem.data.collect_percent > 50 ? diyitem.style.circlecolor : '#fff'}">
										<div class="circle_left" :style="{transform: diyitem.data.collect_percent > 50 ? 'rotate(' + diyitem.data.collect_percent/100*360-360 + 'deg)' : 'rotate(' + 0 + 'deg)','background-color': diyitem.data.collect_percent > 50 ? '#fff' : diyitem.style.circlecolor,'z-index': 5}">
											<div class="clip_left"></div>
										</div>
										<div class="circle_right" :style="{transform: diyitem.data.collect_percent <= 50 ? 'rotate(' + diyitem.data.collect_percent/100*360 + 'deg)' : 'rotate(' + 0 + 'deg)', 'background-color': diyitem.data.collect_percent > 50 ? '#fff' : diyitem.style.circlecolor, 'z-index': 10}">
											<div class="clip_right"></div>
										</div>
										<div class="mask">
											已抢<span>{{diyitem.data.collect_percent}}</span>%
										</div>
									</div>
								</div>
								<router-link  tag='div' class="coupon-btn" :to="util.getUrl({path: '/pages/store/goods', query:{sid: diyitem.sid}})" :style="{background: diyitem.style.getbtnbackground, color: diyitem.style.getbtncolor, 'border-color': diyitem.style.btnbordercolor}" v-if="diyitem.is_grant == 1">{{diyitem.params.usebtntext}}</router-link>
								<div @click="getCoupon" class="coupon-btn" :style="{background: diyitem.style.getbtnbackground, color: diyitem.style.getbtncolor, 'border-color': diyitem.style.btnbordercolor}" v-else>{{diyitem.params.getbtntext}}</div>
							</div>
						</div>
					</div>
					<div class="coupon-item" v-if="diyitem.data && diyitem.data.record && diyitem.data.record.length > 0" v-for="recordItem in diyitem.data.record" :key="recordItem.id">
						<div class="coupon-left" :style="{background: diyitem.style.leftbackground}">
							<div class="left">
								<div class="discount" :style="{color: diyitem.style.pricecolor}">
									￥
									<span>{{recordItem.discount}}</span>
								</div>
								<div class="condition" :style="{color: diyitem.style.conditioncolor}">满{{recordItem.condition}}元可用</div>
							</div>
							<div class="right">
								<div class="coupon-title" :style="{color: diyitem.style.titlecolor}">{{recordItem.title}}</div>
								<div class="coupon-scene" :style="{color: diyitem.style.scenecolor}">店内外卖通用</div>
								<div class="coupon-limit">
									<div :style="{color: diyitem.style.limitcolor}">
										限{{recordItem.endtime_cn}}前使用
									</div>
								</div>
							</div>
						</div>
						<div class="coupon-right" :style="{background: diyitem.style.rightbackground}">
							<div class="triangle-border-right">
								<div class="circular0"></div>
								<div class="circular1"></div>
								<div class="i"></div><div class="i"></div><div class="i"></div><div class="i"></div><div class="i"></div><div class="i"></div><div class="i"></div><div class="i"></div><div class="i"></div><div class="i"></div><div class="i"></div><div class="i"></div><div class="i"></div><div class="i"></div><div class="i"></div><div class="i"></div><div class="i"></div><div class="i"></div><div class="i"></div>
							</div>
							<div class="change-block">
								<div class="had">
									<img src="http://cos.lalawaimai.com/we7_wmall/wxapp/gone.png" alt="">
								</div>
								<router-link  tag='div' class="coupon-btn" :to="util.getUrl({path: '/pages/store/goods', query:{sid: diyitem.sid}})" :style="{background: diyitem.style.getbtnbackground, color: diyitem.style.getbtncolor, 'border-color': diyitem.style.btnbordercolor}">{{diyitem.params.usebtntext}}</router-link>
							</div>
						</div>
					</div>
				</div>
				<div class="no-data-simple" v-else>
					<span class="icon icon-cry"></span>
					<span>暂无代金券信息!</span>
				</div>
			</div>
			<div class="diy-store-onsale" v-if="diyitem.id == 'onsale'" :style="{background: diyitem.style.background, 'margin-top':diyitem.style.margintop + 'px'}">
				<div class="title van-hairline--bottom">
					<van-icon name='goods_light' class="icon" :class="diyitem.params.icon" :style="{color: diyitem.style.iconcolor}"></van-icon>
					<div :style="{color: diyitem.style.titlecolor}">{{diyitem.params.titletext}}</div>
				</div>
				<template v-if="diyitem.data">
					<div class="goods-list van-hairline--bottom">
						<router-link tag="div" :to="util.getUrl({path: '/pages/store/goodsDetail', query:{sid: diyitem.sid, id: item.goods_id}})" class="goods-item" v-for="item in diyitem.data" :key="item.id">
							<div class="goods-img">
								<img :src="item.thumb" alt="">
							</div>
							<div class="goods-info">
								<div class="left">
									<div class="goods-title" :style="{color: diyitem.style.goodstitlecolor}">{{item.title}}</div>
									<div class="price">
											<span class="now" :style="{color: diyitem.style.pricecolor}">
												<span>￥{{item.price}}</span>
											</span>
										<span class="old" :style="{color: diyitem.style.oldpricecolor}">￥{{item.old_price}}</span>
									</div>
									<div class="discount" :style="{color: diyitem.style.discountcolor}" v-if="item.svip_status == 1">会员 {{item.discount}}折</div>
									<div class="discount" :style="{color: diyitem.style.discountcolor}" v-else-if="item.discount > 0 && item.discount < 10">{{item.discount}}折</div>
								</div>
								<div class="right">
									<div class="buy-btn" :style="{background: diyitem.style.buybtnbackground, color: diyitem.style.buybtncolor}">{{diyitem.params.buybtntext}}</div>
									<div class="sailed" :style="{color: diyitem.style.sailedcolor}">已售{{item.sailed}}份</div>
								</div>
							</div>
						</router-link>
					</div>
					<router-link tag="div" class="look-all" :to="util.getUrl({path: '/pages/store/goods', query:{sid: diyitem.sid}})" :style="{color: diyitem.style.lookallcolor}">查看全部</router-link>
				</template>
				<div class="no-data-simple" v-else>
					<span class="icon icon-cry"></span>
					<span>暂无在售信息!</span>
				</div>
			</div>
			<div class="diy-store-evaluate" v-else-if="diyitem.id == 'evaluate'" :style="{background: diyitem.style.background, 'margin-top':diyitem.style.margintop + 'px'}">
				<div class="title van-hairline--bottom">
					<van-icon name='comment' class="icon" :class="diyitem.params.icon" :style="{color: diyitem.style.iconcolor}"></van-icon>
					<div>{{diyitem.params.titletext}}</div>
				</div>
				<div class="evaluate-list" v-if="diyitem.data" >
					<div class="evaluate-item" v-for="(item, index) in diyitem.data" :key="index">
						<div class="evaluate-sub">
							<div class="evaluate-sub-left">
								<img :src="item.avatar" alt="">
							</div>
							<div class="evaluate-sub-right">
								<div class="evaluate-sub">
									<div class="evaluate-name" :style="{color: diyitem.style.telcolor}">{{item.mobile}}</div>
									<div class="evaluate-time" :style="{color: diyitem.style.timecolor}">{{item.addtime_cn}}</div>
								</div>
								<div class="evaluate-stars">
									<template v-for="scoreItem in item.score">
										<div class="appr-score appr-score-all" :class="'appr-score-' + scoreItem" ></div>
									</template>
									<div class="evaluate-ship-time" style="display: none">44分钟到达</div>
								</div>
								<div class="evaluate-comment" :style="{color: diyitem.style.contentcolor}">{{item.note}}</div>
								<div class='evaluate-comment-pics pic-multi' v-if="item.thumbs && item.thumbs.length > 1">
									<div v-for="thumb in item.thumbs">
										<div class='comment-pics' @click="util.jsPreviewImage(item.thumbs)">
											<img :src="thumb" alt="">
										</div>
									</div>
								</div>
								<div class='evaluate-comment-pics' v-else-if="item.thumbs && item.thumbs.length">
									<div class='comment-pics'>
										<img :src="item.thumbs" alt="">
									</div>
								</div>
								<div class='comment-bottom' v-if="item.goods_title && item.goods_title.length">
									<div class='comment-favor-icon'></div>
									<div class='comment-favor-text' :style="{color: diyitem.style.goodstitlecolor}">
										{{item.goods_title_str}}
									</div>
								</div>
								<div class="replay" v-if="item.reply":style="{background: diyitem.style.replaybackground, color: diyitem.style.replaycolor}"> 商家回复({{item.replytime_cn}}): {{item.reply}}</div>
							</div>
						</div>
					</div>
					<router-link tag="div" :to="util.getUrl({path: '/pages/store/comment', query:{sid: diyitem.sid}})" class="look-all van-hairline--top">查看全部评价</router-link>
				</div>
				<div class="no-data" v-else>
					<span class="icon icon-cry"></span>
					<span>暂无评价!</span>
				</div>
			</div>
			<!--好店组组件-->
			<div class="diy-haodian-group" v-else-if="diyitem.id == 'haodianGroup'" :style="{'margin-top': diyitem.style.margintop + 'px'}">
				<div class="group-header" :style="{'color': diyitem.style.titlecolor}">
					{{diyitem.params.title}}
					<router-link class="more" :to="util.getUrl({path: '/gohome/pages/haodian/index'})">
						更多
						<div class="icon icon-arrow-right"></div>
					</router-link>
				</div>
				<div class="store-list row" v-if="diyitem.params.showtype == 0 || diyitem.data_num <= diyitem.params.pagenum">
					<div class="store-item col-25" v-for="(haodianItem, haodianIndex) in diyitem.data" :key="haodianIndex">
						<router-link :to="util.getUrl({path: '/gohome/pages/haodian/detail', query:{sid:haodianItem.id}})">
							<div class="store-image">
								<img v-lazy="{src: haodianItem.logo, loading: diydata.config.lazyload_store}">
							</div>
							<div class="store-title" :style="{'color': diyitem.style.storetitlecolor}">{{haodianItem.title}}</div>
						</router-link>
					</div>
				</div>
				<div class="store-list row" v-else>
					<van-swipe :autoplay="5000" :show-indicators="diyitem.style.showdot == 1" :indicator-color="diyitem.style.dotbackground ? diyitem.style.dotbackground : '#ff2d4b'">
						<van-swipe-item v-for="(chuckItem, key) in diyitem.data" :key="key">
							<div class="store-item col-25" v-for="(haodianItem, haodianIndex) in chuckItem" :key="haodianIndex">
								<router-link :to="util.getUrl({path: '/gohome/pages/haodian/detail', query:{sid:haodianItem.id}})">
									<div class="store-image">
										<img v-lazy="{src: haodianItem.logo, loading: diydata.config.lazyload_store}">
									</div>
									<div class="store-title" :style="{'color': diyitem.style.storetitlecolor}">{{haodianItem.title}}</div>
								</router-link>
							</div>
						</van-swipe-item>
					</van-swipe>
				</div>
			</div>
			<div class="diy-svip-guide" v-else-if="diyitem.id == 'svipGuide'" :style="{'margin-top': diyitem.style.margintop + 'px', 'background': diyitem.style.outerbackgroundcolor}">
				<div class="svip-guide" @click="util.jsUrl(diyitem.params.link)" :style="{background: diyitem.style.innerbackgrountcolor, color: diyitem.style.textcolor, padding: diyitem.style.paddingtop + 'px' + ' ' + diyitem.style.paddingleft + 'px'}">
					<div class="svip-guide-left">
						<img src="static/img/svip-crown.png" alt="">
						<span class="svip-title">超级会员</span>
						<span>&bull;</span>
						<span class="svip-save">{{diyitem.params.text_left}}</span>
					</div>
					<div class="svip-guide-right" :style="{color: diyitem.style.textcolor}">
						{{diyitem.params.text_right}}
						<i class="icon icon-right"></i>
					</div>
				</div>
			</div>
			<template v-else-if="diyitem.id == 'selftake_stores'">
				<div class="diy-selftake-stores" :style="{'margin-top': diyitem.style.margintop + 'px', 'background': diyitem.style.background}">
					<div class="header-title" :style="{'color': diyitem.style.titlecolor}">
						{{diyitem.params.title}}
						<router-link class="more" :to="util.getUrl({path: '/pages/home/category', query: {delivery_type: 2}})">
							更多
							<div class="icon icon-arrow-right"></div>
						</router-link>
					</div>
					<ul class="store-list margin-10-t">
						<li class="store-item flex-lr" v-for="(selfStore, index) in diyitem.data" :key="index" @click="util.jsUrl(selfStore.url)">
							<div class="store-logo">
								<img class="img-100" :src="selfStore.logo" alt="">
							</div>
							<div class="store-info">
								<div class="store-title w-100 ellipsis font-14 font-bold" :style="{'color': diyitem.style.storetitlecolor}">{{selfStore.title}}</div>
								<div class="flex margin-10-tb">
									<div class="store-distance" :style="{'color': diyitem.style.distancecolor, 'background': diyitem.style.distancebackgroundcolor}">{{selfStore.distance}}km</div>
									<div class="delivery-fee" :style="{'color': diyitem.style.feecolor, 'background': diyitem.style.feebackgroundcolor}">省¥{{selfStore.delivery_price}}元配送费</div>
								</div>
								<ul class="store-activity flex" v-if="selfStore.activity">
									<li class="activity-item" v-for="(item, index) in selfStore.activity.items" :key="item">
										<img class="img-100" :src="'static/img/' + item.type + '_b.png'" alt="">
									</li>
								</ul>
							</div>
						</li>
					</ul>
				</div>
			</template>
			<!--品牌商户-->
			<div class="diy-waimai-store-brand" v-else-if="diyitem.id == 'brand_stores'" :style="{'margin-top': diyitem.style.margintop + 'px'}">
				<div class="waimai-store-brand-wrap" v-for="(item, index) in diyitem.data" :key="index">
					<div class="store-brand-bgimg">
						<div class="store-brand-title" :style="{'background-image':item.shopSign ? 'url(' + item.shopSign + ')':' '}"></div>
						<img class="store-brand-tag" src="http://cos.lalawaimai.com/we7_wmall/wxapp/diy-store-brand-tag.png" alt="">
						<div class="store-info" @click="util.jsUrl(item.url)">
							<div class="info">
								<div class="logo">
									<img :src="item.logo" alt="">
								</div>
								<div class="main-info">
									<div class="store-title" :style="{'color': diyitem.style.storetitlecolor}">{{item.title}}</div>
									<div class="coupon-list" v-if="item.activity.labels_num > 0">
										<div class="coupon-item" v-for="(label, labindex) in item.activity.labels" :key="labindex" :style="{'color': diyitem.style.activitycolor, 'background-color': diyitem.style.activitybackgroundcolor}" v-if="labindex < 3">{{label.title}}</div>
									</div>
								</div>
							</div>
							<div class="slogan" :style="{'color': diyitem.style.descriptioncolor}">{{item.content}}</div>
						</div>
						<div class="store-brand-list" v-if="item.hot_goods" :style="{'background': diyitem.style.background}">
							<div class="store-brand-item" v-for="(goods, hotindex) in item.hot_goods" :key="hotindex" @click="util.jsUrl( '/pages/store/goodsDetail?sid=' + item.store_id + '&id=' + goods.id)">
								<div class="store-brand-inner">
									<img :src="goods.thumb" alt="">
									<div class="goods-title" :style="{'color': diyitem.style.goodstitlecolor}">{{goods.title}}</div>
									<div class="price">
										<span class="new-price" :style="{'color': diyitem.style.pricecolor}"><span>¥</span>{{goods.price}}</span>
										<span class="old-price" :style="{'color': diyitem.style.oldpricecolor}" v-if="goods.old_price > 0">¥{{goods.old_price}}</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<!--客服组件，显示QQ/微信客服-->
			<div class="diy-service" v-else-if="diyitem.id == 'service' && diyitem.params && diyitem.params.servicefrom != 'meiqia'">
				<div class="diy-service-inner">
					<template v-if="diyitem.params.servicefrom == 'qq'">
						<div class="img-100" tag="div" @click="util.jsUrl(diyitem.params.qq_url)">
							<img class="img-100" :src="diyitem.params.iconImg" alt="">
						</div>
					</template>
					<template v-else-if="diyitem.params.servicefrom == 'weixin'">
						<div class="img-100" tag="div" @click="onToggleService">
							<img class="img-100" :src="diyitem.params.iconImg" alt="">
						</div>
					</template>
				</div>
				<van-popup class="service-qrcode" v-model="diydata.popup.serviceQrcode">
					<div class="qrcode">
						<img :src="diyitem.params.wxqrcode" alt="">
					</div>
					<p class="notice">长按识别二维码<br>添加客服微信</p>
					<div class="close-qrcode" @click="onToggleService">×</div>
				</van-popup>
			</div>

		</template>
		<transition name="loading">
			<iloading v-if="preLoading"></iloading>
		</transition>
		<div class="geolocationfail" v-if="0">
			<img src="static/img/store_no_con.png" alt="">
			<p>获取定位失败!您可以选择手动搜索地址</p>
			<router-link :to="util.getUrl({path: '/pages/home/location'})" class="btn-location">手动搜索地址</router-link>
		</div>
	</div>
</template>
<script>
	import {mapState} from 'vuex'
	export default {
		props: {
			getLocationFail: {
				type: Boolean || Number
			},
			preLoading: {
				type: Boolean || Number
			},
			diydata: {
				type: Object,
			},
			showFixedSearchBar: false
		},
		computed: {
			...mapState([
				'locationInfo'
			]),
		},
		data() {
			return {
				lazyload_goods: '',
				lazyload_store: '',
        sysbg: '',
				danmu: {
					show: false,
					index: 0,
					item: {
					}
				}
			}
		},
		components: {

		},

		methods: {
			onGetStore(force = false) {
				this.$emit('onGetStore', force);
			},
			onStoreOrderby(type, value, title) {
				this.$emit('onStoreOrderby', type, value, title);
			},
			onChangeStoreExtra(key) {
				this.$emit('onChangeStoreExtra', key);
			},
			onToggleDiscount(key, diyindex) {
				this.$emit('onToggleDiscount', key, diyindex);
			},
			onToggleInformation(index) {
				this.$emit('onToggleInformation', index);
			},
			onCloseRedpacket() {
				this.$emit('onCloseRedpacket');
			},
			onCloseGuide() {
				this.$emit('onCloseGuide');
			},
			onToggleDanmu() {
				var that = this;
				var danmu = that.diydata.diy.danmu;
				that.danmu.item = danmu[that.danmu.index];
				that.danmu.show = true;
				if(that.danmu.index == danmu.length - 1) {
					that.danmu.index = 0;
				} else {
					that.danmu.index++;
				}
				setTimeout(function(){
					that.danmu.show = false;
				}, 2500);
			},
			onGetInformation(force = false) {
				this.$emit('onGetInformation', force);
			},
			onGetHaodianStore(force = false) {
				this.$emit('onGetHaodianStore', force);
			},
			onChangeTab() {
				this.$emit('onChangeTab');
			},
			getCoupon() {
				this.$emit('getCoupon');
			},
			onChangeHaodianExtra(key) {
				this.$emit('onChangeHaodianExtra', key);
			},
			onClickHaodianParentCategory(index) {
				this.$emit('onClickHaodianParentCategory', index);
			},
			onClickHaodianChildCategory(data) {
				this.$emit('onClickHaodianChildCategory', data);
			},
			onHaodianCategoryConfirm() {
				this.$emit('onHaodianCategoryConfirm');
			},
			onToggleService() {
				this.$emit('onToggleService');
			}
		},
		activated() {
		},
		mounted() {
			var that = this;
      var theme = this.util.getStorage('theme');
      if(theme.header) {
      	this.sysbg = theme.header.background;
      }
			setTimeout(function() {
				if(that.diydata.diy.danmu) {
					that.onToggleDanmu();
					setInterval(function() {
						that.onToggleDanmu();
					}, 5000);
				}
			}, 5000);
		},
	}
</script>
<style scoped>
	@import "../../static/css/diy.css";
	::-webkit-scrollbar {/*滚动条整体样式*/
		width: 0px;   /*高宽分别对应横竖滚动条的尺寸*/
		height: 0px;
	}
	/*图片轮播*/
	#diy .diy-picture .van-swipe img{
		width: 100%;
		max-height: 150px;
	}

	#diy .popup-search{
		box-sizing: border-box;
		z-index: 10000!important;
		margin-left: -1px;
	}

	#diy .popup-search .scroll{
		width: 100%;
		max-height: 350px;
		overflow-y: auto;
		margin-bottom: -1px;
	}
	#diy .popup-search .active-list-item img{
		width: 17px;
		height: 17px;
		margin-right: 10px;
	}
	#diy .popup-search .active-list-item .icon{
		margin-right: 5px;
	}
	#diy .popup-search  .finish{
		text-align:center;
		background-color:#FFD160;
		font-size:14px;
		width:100px;
		height: 100%;
		line-height: 50px;
		color: #000;
	}
	/*新版筛选弹出层*/
	#diy .popup-search .search-scroll{
		width: 100%;
		max-height: 350px;
		overflow-y: auto;
		background-color: #fff;
		padding: 0 12.5px;
	}
	#diy .popup-search .search-scroll .new-search-list{
		margin: 10px 0;
	}
	#diy .popup-search .search-scroll .new-search-list .new-search-title{
		color: #666;
		font-size: 13px;
		margin-left: 2.5px;
		margin-bottom: 10px;
	}
	#diy .popup-search .search-scroll .new-search-list .new-search-group{
		display: flex;
		flex-wrap: wrap;
		position: relative;
		width: 100%;
	}
	#diy .popup-search .search-scroll .new-search-list .new-search-group .new-search-item{
		width: 33.33%;
	}
	#diy .popup-search .search-scroll .new-search-list .new-search-group .new-search-item .info{
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 14px;
		color: #333;
		padding: 8px 5px;
		background: #fafafa;
		margin: 0 2.5px 5px;
	}
	#diy .popup-search .search-scroll .new-search-list .new-search-group .new-search-item .info.active{
		font-weight: 700;
		color: #3190e8;
		background-color: #edf5ff;
	}
	#diy .popup-search .search-scroll .new-search-list .new-search-group .new-search-item .info .icon-waimai{
		font-size: 17px;
		margin-right: 5px;
		color: #FFD160;
	}
	#diy .popup-search .search-scroll .new-search-list .new-search-group .new-search-item .info img{
		width: 17px;
		height: 17px;
		margin-right: 10px;
	}
	#diy .popup-search .search-btn{
		position: relative;
		display: flex;
		flex-flow: row nowrap;
		align-items: center;
		justify-content: space-between;
		height: 43px;
	}
	#diy .popup-search .search-btn .search-btn-left{
		font-size: 16px;
		text-align: center;
		flex: 1;
		background-color: #fff;
		color: #ddd;
		height: 43px;
		line-height: 43px;
	}
	#diy .popup-search .search-btn .search-btn-right{
		font-size: 16px;
		text-align: center;
		flex: 1;
		background-color: #ff2d4b;
		color: #fff;
		height: 43px;
		line-height: 43px;
	}

	#diy .geolocationfail{
		margin: 20px 0 40px 0;
		width: 100%;
		height: 200px;
		text-align: center;
		color: #768491;
		font-size: 16px;
	}
	#diy .geolocationfail img{
		max-width: 25%;
		vertical-align: middle;
	}
	#diy .geolocationfail p{
		margin: 20px 0;
	}
	#diy .geolocationfail .btn-location{
		padding: 7px 16px;
		background: #ff2b4d;
		color: #fff;
		border-radius: 3px;
	}

	/* 公告 */
	#diy .diy-notice{
		background-color: #ffffff;
		height: auto;
		font-size: 12px;
		overflow: hidden;
	}
	#diy .diy-notice .diy-notice-container{
		background-color: #fff;
		padding: 10px 8px;
		overflow: hidden;
		display:flex;
		flex-flow: row nowrap;
		align-items: center;
		width:100%;
		box-sizing: border-box;
	}
	#diy .diy-notice .image {
		width: 15%;
		height: 16px;
		padding-right: 4px;
	}
	#diy .diy-notice .image img {
		height: 100%;
		width: 100%;
	}
	#diy .diy-notice .icon {
		height: 20px;
		padding-left: 4px;
		line-height: 22px;
		font-size: 16px;
	}
	#diy .diy-notice .icon.icon-notification{
		color: #fd5454;
	}
	#diy .diy-notice .notice-text {
		color: rgb(102, 102, 102);
		width: 75%;
		height: 20px;
		padding-left: 4px;
		font-size: 14px;
		line-height: 20px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	#diy .diy-notice .notice-text div {
		max-height:100%;
		height: 20px;
		max-width:100%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	/*页面滚动一定距离后出现的置顶搜索框*/
	#diy .fiexd-searchbar{
		width: 100%;
		padding: 10px;
		background-color: #ff2d4b;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 2000;
	}
	#diy .fiexd-searchbar a{
		display: block;
		width: 100%;
		height: 32px;
		background-color: #fff;
		border-radius: 3px;
		font-size: 13px;
		color: #656565;
		text-align: center;
		line-height: 32px;
	}
	#diy .fiexd-searchbar a .icon{
		font-size: 16px;
		color: #666;
	}
	.tag{
		font-size: 12px;
		padding: 1px 2px;
		margin-right: 5px;
		margin-bottom: 5px;
		display: inline-block;
	}
	.tag.tag-success{
		border: 1px solid #1ab394;
		color: #1ab394;
	}
	.tag.tag-danger{
		border: 1px solid #ff2a4b;
		color: #ff2a4b;
	}
	.tag.tag-svip{
		border: 1px solid #CFCDBC;
		color: #A18230;
	}

</style>


// WEBPACK FOOTER //
// src/components/diy.vue
