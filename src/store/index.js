import Vue from 'vue'
import Vuex from 'vuex'

import system from './modules/system.js'
import getters from './getters.js'
Vue.use(Vuex)

const store = new Vuex.Store({
    modules: {
        system,
    },
    getters
})

export default store