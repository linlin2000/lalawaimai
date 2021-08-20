import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
// import actions from './action'
// import getters from './getters'

Vue.use(Vuex)

const state = {
	orderExtra: {},
	editAddress: {},
	istore: {},
	icart: {},
	locationInfo: {},
	erranderExtra: {
		partData: {},
		thumbs:{}
	},
	erranderSceneId: 0,
	cart_animate: {},
	pinTuanExtra: {}
}

export default new Vuex.Store({
	state,
	getters: {  // getters
        countAnother: function (state) {
            return state.anotherIncrement
        }
    },
	actions: {
        increment(context) {
            context.commit("INCREMENT");
        },
        decrement(context) {
            context.commit("DECREMENT");
        }
    },
	mutations,
})


// WEBPACK FOOTER //
// ./src/store/index.js