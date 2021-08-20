import {getData, setData} from "@/controller/funcCommon"

function onToggleFavor(options) {
	setData({
		vue: options.vue,
		url: 'gohome/favorite/favorite',
		data: {
			goods_id: options.goods_id,
			type: options.type,
		},
		success: (res) => {
			options.vue.util.$toast(res);
			options.vue[options.target].is_favor = !options.vue[options.target].is_favor;
		}
	})
};

function onShowDanmu(options) {
	var that = options.vue;
	that.danmu.item = that.danmus[that.danmu.index];
	that.danmu.show = true;
	if(that.danmu.index == that.danmus.length - 1) {
		that.danmu.index = 0;
	} else {
		that.danmu.index++;
	}
	setTimeout(function(){
		that.danmu.show = false;
	}, 2500);
};

function onGetComment(options){
	var that = options.vue
	getData({
		vue: that,
		url: 'gohome/common/comment',
		data: {
			id: options.id,
			type: options.type,
			page: that.comment.page,
			psize: that.comment.psize
		},
		success: (res) => {
			if(res.comment.length < that.comment.psize){
				that.$toast('已加载全部评论');
			}
			that.comment.data = [...that.comment.data, ...res.comment];
			that.comment.page++;
		}
	})
};


export {
	onToggleFavor,
	onShowDanmu,
	onGetComment
}



// WEBPACK FOOTER //
// ./src/pages/gohome/controller/gohome.js