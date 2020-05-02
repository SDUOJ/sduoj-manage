import axios from "axios";
import Vue from "vue";

Vue.prototype.$http = axios;
// axios.defaults.baseURL = "//api.oj.xrvitd.com:8080/api";
axios.defaults.baseURL =
  "https://mockapi.eolinker.com/URYRdGK6f6afa5576ac65e68c78c7e587f9a5c85de59a90";
axios.defaults.withCredentials = true; // 开启 cookie

export function post(url, data) {
  return new Promise((resolve, reject) => {
    axios
      .post(url, data)
      .then(res => {
        // 如何返回值不是 0 的话，那么返回错误信息
        console.log(res.data);
        if (res.data.code !== 0) {
          if (typeof res.data.message == "undefined") {
            Vue.prototype.$error(res.data);
            reject(res.data);
          } else {
            Vue.prototype.$error(res.data.message);
            reject(res.data.message);
          }
        } else {
          resolve(res.data.data);
        }
      })
      .catch(err => {
        reject(err);
      });
  });
}
