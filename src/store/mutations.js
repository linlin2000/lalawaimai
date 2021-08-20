import util from '@/config/util'

export default {
	setState(state, {type, key, val}) {
		if(!state[type]) {
			state[type] = {};
		}
		state[type][key] = val;
	},
	replaceState(state, {key, val}) {
		state[key] = val;
	},
	setOrderExtra(state, {key, val}) {
		state.orderExtra[key] = val;
	},
	replaceOrderExtra(state, val) {
		state.orderExtra = val;
	},
	replaceAddress(state, val) {
		state.editAddress = val;
	},
	replaceStore(state, val) {
		state.istore = val;
	},
	replaceCart(state, val) {
		state.icart = val;
	},
	setLocation(state, val) {
		state.locationInfo = val;
		util.setStorage('locationInfo', state.locationInfo, 900);
	},
	getLocation(state) {
		if(!state.locationInfo.location_x) {
			let locationInfo = util.getStorage('locationInfo');
			if(locationInfo && locationInfo.location_x) {
				state.locationInfo = locationInfo;
			}
		}
	},
}



// WEBPACK FOOTER //
// ./src/store/mutations.js