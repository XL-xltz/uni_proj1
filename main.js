import App from "./App";
// 网络请求
import {
  $http
} from "@escook/request-miniprogram";
uni.$http = $http;
// 配置请求根路径
$http.baseUrl = "https://www.uinav.com";
// 请求开始之前做一些事情
$http.beforeRequest = function(options) {
  uni.showLoading({
    title: "数据加载中...",
  });
};
// 全局函数
uni.$showMsg = function(title = "请求失败", duration = 1500, icon = "none") {
  uni.showToast({
    title,
    duration,
    icon,
  });
};
// ================= 请求封装 =================

// get 请求
uni.$gets = async function(api, query = {}) {
  const {
    data: res
  } = await uni.$http.get("/api/public/v1" + api, query);
  console.log(query)
  if (res.meta.status !== 200) return uni.$showMsg();
  return res;
};
// 请求完成之后做一些事情
$http.afterRequest = function() {
  uni.hideLoading();
};
// #ifndef VUE3
import Vue from "vue";
Vue.config.productionTip = false;
App.mpType = "app";
const app = new Vue({
  ...App,
});
app.$mount();
// #endif

// #ifdef VUE3
import {
  createSSRApp
} from "vue";
export function createApp() {
  const app = createSSRApp(App);
  return {
    app,
  };
}
// #endif
