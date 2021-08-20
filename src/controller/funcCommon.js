import { Dialog } from 'vant';
function getData (options) {
	options.vue.util.request({
		url: options.url,
		data: options.data
	}).then((res) => {
		if(options.vue.showPreLoading){
			options.vue.showPreLoading = false;
		}
		var result = res.data.message;
		if (result.errno) {
			if (options.fail && typeof options.fail === 'function') {
				options.fail(result);
				return false;
			} else {
				options.vue.util.$toast(result.message);
				return false;
			}
		}
		result = result.message;
		if(options.data && options.data.menufooter == 1) {
			options.vue.menufooter = window.menufooter;
		}
		if (options.autoAssign && options.variable) {
			if (result[options.variable]) {
				options.vue[options.variable] = options.vue.util.extend(options.vue[options.variable], result[options.variable]);
				//options.vue[options.variable] = Object.assign(options.vue[options.variable], result[options.variable]);
			}
		}
		if (options.success && typeof options.success === 'function') {
			options.success(result);
			return false;
		}
		return true;
	});
	return true;
}

function setData(options) {
	var handler = function() {
		options.vue.util.request({
			method: 'post',
			url: options.url,
			data: options.data
		}).then((res) => {
			var result = res.data.message;
			if (result.errno) {
				if (options.fail && typeof options.fail === 'function') {
					options.fail(result);
					return false;
				}
				options.vue.util.$toast(result.message);
				return false;
			}
			result = result.message;
			if (options.success && typeof options.success === 'function') {
				options.success(result);
				return false;
			}
			if (!options.redirect) {
				options.redirect = 'refresh';
			}
			if (!options.message) {
				options.message = '保存成功';
			}
			options.vue.util.$toast(options.message, options.redirect, 1000);
			return true;
		});
	};

	if(options.confirm) {
		Dialog.confirm({
			title: '温馨提示',
			message: options.confirm
		}).then(() => {
			handler();
		}).catch(() => {
			if(options.cancel && typeof options.cancel === 'function') {
				options.cancel();
				return false;
			}
		})
	} else {
		handler();
	}
}

function getRecords(options) {
	if(options.force) {
		 options.vue.records = {
			 page: 1,
			 psize: 15,
			 loading: true,
			 finished: false,
			 empty: false,
			 data:[]
		 };
	 }
	 if(options.vue.records.finished) {
		 return false;
	 }
	 let data = {
		 page: options.vue.records.page,
		 psize: options.vue.records.psize
	};
	if(options.data) {
		data = Object.assign(options.data, data);
	}
	if(options.vue.filter) {
		data.filter = JSON.stringify(options.vue.filter.items);
	}
	 options.vue.util.request({
		 url: options.url,
		 data: data
	 }).then((res) => {
		if(options.vue.showPreLoading){
			options.vue.showPreLoading = false;
		}
		var result = res.data.message;
		if(result.errno) {
			if(result.errno == 41200) {
				options.vue.showFailedTips = true;
				options.vue.failedTips = {
					type: 'location',
					tips: result.message,
					btnText: '切换地址',
					link: '/pages/home/location'
				};
				return false;
			}
			if (options.fail && typeof options.fail === 'function') {
				options.fail(result);
				return false;
			} else {
				options.vue.util.$toast(result.message);
				return false;
			}
		}
		if(options.data && options.data.menufooter == 1) {
			options.vue.menufooter = window.menufooter;
		}
		if(options.recordsName) {
			var records = result.message[options.recordsName];
		} else {
			var records = result.message.records;
		}
		options.vue.records.data = [...options.vue.records.data, ...records];
		if(!options.vue.records.data.length) {
			options.vue.records.empty = true;
		}
		if(records && records.length < options.vue.records.psize ) {
			options.vue.records.finished = true;
		}
		options.vue.records.page++;
		options.vue.records.loading = false;
		options.vue.isRefresh = false;
		if(result.message.filter) {
			options.vue.condition.items = result.message.filter;
		}
		if (options.success && typeof options.success === 'function') {
			options.success(result.message);
			return false;
		}
	 }).catch((res) => {
		 if(window.forceGetLocationStatus == 'fail') {
			 options.vue.showPreLoading = false;
			 options.vue.showFailedTips = true;
			 options.vue.failedTips = {
				 type: 'location',
				 tips: '获取定位失败!您可以选择手动搜索地址',
				 btnText: '手动搜索地址',
				 link: '/pages/home/location'
			 };
			 return false;
		 }
	 	if(options.catch && typeof options.catch === 'function') {
			options.catch(res);
			return false;
		}
	 });
	 return true;
}

export {
	getData,
	setData,
	getRecords,
};





// WEBPACK FOOTER //
// ./src/controller/funcCommon.js