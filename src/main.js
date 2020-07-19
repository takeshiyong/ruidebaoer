import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'; // 状态管理器
import axios from 'axios';  // axios
import ElementUI from 'element-ui'; // vue ui
import 'element-ui/lib/theme-chalk/index.css'; // element-ui.css
import '../static/css/index.css'; // css
import animate from 'animate.css';// 引入动画
import './assets/icons/iconfont.css'; // icons引入
import ZkTable from 'vue-table-with-tree-grid'

import { common } from '@/utils/common' // 引入工具

Vue.use(ZkTable);
Vue.use(ElementUI, { size: 'small' });
Vue.prototype.$axios = axios;
Vue.prototype._ = require('lodash'); // 定义lodash全局量
Vue.prototype.fmt = common; // 定义工具类全局量
Vue.prototype.$feilapi=process.env.FILE_API//全局引入文件服务域名
// 按钮权限
Vue.prototype.showBtn = function(btnName) {
    var count = common.getStore('btnUrl').indexOf(btnName)
    if(count == -1){
        return false;
    }else{
        return true;
    }
}

// 路由权限


new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
