(function(e){function t(t){for(var r,a,c=t[0],i=t[1],s=t[2],l=0,p=[];l<c.length;l++)a=c[l],Object.prototype.hasOwnProperty.call(o,a)&&o[a]&&p.push(o[a][0]),o[a]=0;for(r in i)Object.prototype.hasOwnProperty.call(i,r)&&(e[r]=i[r]);f&&f(t);while(p.length)p.shift()();return u.push.apply(u,s||[]),n()}function n(){for(var e,t=0;t<u.length;t++){for(var n=u[t],r=!0,a=1;a<n.length;a++){var c=n[a];0!==o[c]&&(r=!1)}r&&(u.splice(t--,1),e=i(i.s=n[0]))}return e}var r={},a={app:0},o={app:0},u=[];function c(e){return i.p+"js/"+({}[e]||e)+"."+{"chunk-113a4866":"a368fa74","chunk-5878c82b":"deab4d37","chunk-6abd03a5":"de12712c","chunk-09a93b6e":"8b337b7e","chunk-87617870":"a4e2d094","chunk-e338b116":"b076de4d","chunk-46d3d8c8":"5e5e908d","chunk-d47fc0b8":"7efd343b","chunk-3cecac36":"5868aea6"}[e]+".js"}function i(t){if(r[t])return r[t].exports;var n=r[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,i),n.l=!0,n.exports}i.e=function(e){var t=[],n={"chunk-5878c82b":1,"chunk-6abd03a5":1,"chunk-87617870":1,"chunk-e338b116":1,"chunk-46d3d8c8":1,"chunk-d47fc0b8":1};a[e]?t.push(a[e]):0!==a[e]&&n[e]&&t.push(a[e]=new Promise((function(t,n){for(var r="css/"+({}[e]||e)+"."+{"chunk-113a4866":"31d6cfe0","chunk-5878c82b":"d783fd89","chunk-6abd03a5":"77d10ac0","chunk-09a93b6e":"31d6cfe0","chunk-87617870":"cf8c0607","chunk-e338b116":"0d33e80d","chunk-46d3d8c8":"dff80736","chunk-d47fc0b8":"132a5e8b","chunk-3cecac36":"31d6cfe0"}[e]+".css",o=i.p+r,u=document.getElementsByTagName("link"),c=0;c<u.length;c++){var s=u[c],l=s.getAttribute("data-href")||s.getAttribute("href");if("stylesheet"===s.rel&&(l===r||l===o))return t()}var p=document.getElementsByTagName("style");for(c=0;c<p.length;c++){s=p[c],l=s.getAttribute("data-href");if(l===r||l===o)return t()}var f=document.createElement("link");f.rel="stylesheet",f.type="text/css",f.onload=t,f.onerror=function(t){var r=t&&t.target&&t.target.src||o,u=new Error("Loading CSS chunk "+e+" failed.\n("+r+")");u.code="CSS_CHUNK_LOAD_FAILED",u.request=r,delete a[e],f.parentNode.removeChild(f),n(u)},f.href=o;var d=document.getElementsByTagName("head")[0];d.appendChild(f)})).then((function(){a[e]=0})));var r=o[e];if(0!==r)if(r)t.push(r[2]);else{var u=new Promise((function(t,n){r=o[e]=[t,n]}));t.push(r[2]=u);var s,l=document.createElement("script");l.charset="utf-8",l.timeout=120,i.nc&&l.setAttribute("nonce",i.nc),l.src=c(e);var p=new Error;s=function(t){l.onerror=l.onload=null,clearTimeout(f);var n=o[e];if(0!==n){if(n){var r=t&&("load"===t.type?"missing":t.type),a=t&&t.target&&t.target.src;p.message="Loading chunk "+e+" failed.\n("+r+": "+a+")",p.name="ChunkLoadError",p.type=r,p.request=a,n[1](p)}o[e]=void 0}};var f=setTimeout((function(){s({type:"timeout",target:l})}),12e4);l.onerror=l.onload=s,document.head.appendChild(l)}return Promise.all(t)},i.m=e,i.c=r,i.d=function(e,t,n){i.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},i.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},i.t=function(e,t){if(1&t&&(e=i(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(i.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)i.d(n,r,function(t){return e[t]}.bind(null,r));return n},i.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return i.d(t,"a",t),t},i.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},i.p="/",i.oe=function(e){throw console.error(e),e};var s=window["webpackJsonp"]=window["webpackJsonp"]||[],l=s.push.bind(s);s.push=t,s=s.slice();for(var p=0;p<s.length;p++)t(s[p]);var f=l;u.push([0,"chunk-vendors"]),n()})({0:function(e,t,n){e.exports=n("56d7")},"0985":function(e,t,n){},4360:function(e,t,n){"use strict";var r=n("2b0e"),a=n("2f62"),o=0,u=8;function c(e){return b(i(h(e),e.length*u))}function i(e,t){e[t>>5]|=128<<t%32,e[14+(t+64>>>9<<4)]=t;for(var n=1732584193,r=-271733879,a=-1732584194,o=271733878,u=0;u<e.length;u+=16){var c=n,i=r,s=a,g=o;n=l(n,r,a,o,e[u+0],7,-680876936),o=l(o,n,r,a,e[u+1],12,-389564586),a=l(a,o,n,r,e[u+2],17,606105819),r=l(r,a,o,n,e[u+3],22,-1044525330),n=l(n,r,a,o,e[u+4],7,-176418897),o=l(o,n,r,a,e[u+5],12,1200080426),a=l(a,o,n,r,e[u+6],17,-1473231341),r=l(r,a,o,n,e[u+7],22,-45705983),n=l(n,r,a,o,e[u+8],7,1770035416),o=l(o,n,r,a,e[u+9],12,-1958414417),a=l(a,o,n,r,e[u+10],17,-42063),r=l(r,a,o,n,e[u+11],22,-1990404162),n=l(n,r,a,o,e[u+12],7,1804603682),o=l(o,n,r,a,e[u+13],12,-40341101),a=l(a,o,n,r,e[u+14],17,-1502002290),r=l(r,a,o,n,e[u+15],22,1236535329),n=p(n,r,a,o,e[u+1],5,-165796510),o=p(o,n,r,a,e[u+6],9,-1069501632),a=p(a,o,n,r,e[u+11],14,643717713),r=p(r,a,o,n,e[u+0],20,-373897302),n=p(n,r,a,o,e[u+5],5,-701558691),o=p(o,n,r,a,e[u+10],9,38016083),a=p(a,o,n,r,e[u+15],14,-660478335),r=p(r,a,o,n,e[u+4],20,-405537848),n=p(n,r,a,o,e[u+9],5,568446438),o=p(o,n,r,a,e[u+14],9,-1019803690),a=p(a,o,n,r,e[u+3],14,-187363961),r=p(r,a,o,n,e[u+8],20,1163531501),n=p(n,r,a,o,e[u+13],5,-1444681467),o=p(o,n,r,a,e[u+2],9,-51403784),a=p(a,o,n,r,e[u+7],14,1735328473),r=p(r,a,o,n,e[u+12],20,-1926607734),n=f(n,r,a,o,e[u+5],4,-378558),o=f(o,n,r,a,e[u+8],11,-2022574463),a=f(a,o,n,r,e[u+11],16,1839030562),r=f(r,a,o,n,e[u+14],23,-35309556),n=f(n,r,a,o,e[u+1],4,-1530992060),o=f(o,n,r,a,e[u+4],11,1272893353),a=f(a,o,n,r,e[u+7],16,-155497632),r=f(r,a,o,n,e[u+10],23,-1094730640),n=f(n,r,a,o,e[u+13],4,681279174),o=f(o,n,r,a,e[u+0],11,-358537222),a=f(a,o,n,r,e[u+3],16,-722521979),r=f(r,a,o,n,e[u+6],23,76029189),n=f(n,r,a,o,e[u+9],4,-640364487),o=f(o,n,r,a,e[u+12],11,-421815835),a=f(a,o,n,r,e[u+15],16,530742520),r=f(r,a,o,n,e[u+2],23,-995338651),n=d(n,r,a,o,e[u+0],6,-198630844),o=d(o,n,r,a,e[u+7],10,1126891415),a=d(a,o,n,r,e[u+14],15,-1416354905),r=d(r,a,o,n,e[u+5],21,-57434055),n=d(n,r,a,o,e[u+12],6,1700485571),o=d(o,n,r,a,e[u+3],10,-1894986606),a=d(a,o,n,r,e[u+10],15,-1051523),r=d(r,a,o,n,e[u+1],21,-2054922799),n=d(n,r,a,o,e[u+8],6,1873313359),o=d(o,n,r,a,e[u+15],10,-30611744),a=d(a,o,n,r,e[u+6],15,-1560198380),r=d(r,a,o,n,e[u+13],21,1309151649),n=d(n,r,a,o,e[u+4],6,-145523070),o=d(o,n,r,a,e[u+11],10,-1120210379),a=d(a,o,n,r,e[u+2],15,718787259),r=d(r,a,o,n,e[u+9],21,-343485551),n=m(n,c),r=m(r,i),a=m(a,s),o=m(o,g)}return[n,r,a,o]}function s(e,t,n,r,a,o){return m(g(m(m(t,e),m(r,o)),a),n)}function l(e,t,n,r,a,o,u){return s(t&n|~t&r,e,t,a,o,u)}function p(e,t,n,r,a,o,u){return s(t&r|n&~r,e,t,a,o,u)}function f(e,t,n,r,a,o,u){return s(t^n^r,e,t,a,o,u)}function d(e,t,n,r,a,o,u){return s(n^(t|~r),e,t,a,o,u)}function m(e,t){var n=(65535&e)+(65535&t),r=(e>>16)+(t>>16)+(n>>16);return r<<16|65535&n}function g(e,t){return e<<t|e>>>32-t}function h(e){for(var t=[],n=(1<<u)-1,r=0;r<e.length*u;r+=u)t[r>>5]|=(e.charCodeAt(r/u)&n)<<r%32;return t}function b(e){for(var t=o?"0123456789ABCDEF":"0123456789abcdef",n="",r=0;r<4*e.length;r++)n+=t.charAt(e[r>>2]>>r%4*8+4&15)+t.charAt(e[r>>2]>>r%4*8&15);return n}var y={profile:{}},v={profile:function(e){return e.profile||{}},username:function(e){return e.profile.username||""},avatar:function(e){return"https://www.gravatar.com/avatar/".concat(c(e.profile.email||""),"?s=200&d=mp&r=g")}},k={setProfile:function(e,t){e.profile=t},clearProfile:function(e){e.profile={}}},P={setProfile:function(e,t){var n=e.commit;n("setProfile",t)},clearProfile:function(e){var t=e.commit;t("clearProfile")}},w={namespaced:!0,state:y,getters:v,mutations:k,actions:P};r["default"].use(a["a"]);t["a"]=new a["a"].Store({state:{copyright:"",pathComponents:[]},mutations:{updateCopyright:function(e,t){e.copyright=t.copyright}},actions:{},modules:{user:w}})},"4b51":function(e,t,n){},"56d7":function(e,t,n){"use strict";n.r(t);n("e260"),n("e6cf"),n("cca6"),n("a79d");var r=n("2b0e"),a=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"layout"},[n("Layout",{style:{minHeight:"100vh"}},[n("Sider",{staticClass:"layoutSider",attrs:{"hide-trigger":"",collapsible:"","collapsed-width":78},model:{value:e.isCollapsed,callback:function(t){e.isCollapsed=t},expression:"isCollapsed"}},[n("NavBar")],1),n("Layout",[n("Header",{staticClass:"layoutHeader",style:{background:"#fff",boxShadow:"0 2px 3px 2px rgba(0,0,0,.1)"}},[n("div",{staticClass:"navbar-user"},[n("Avatar",{attrs:{src:e.avatar}}),n("Button",{attrs:{type:"text"},on:{click:e.toUserPage}},[e._v(" "+e._s(e.username)+" "),n("Icon",{attrs:{type:"ios-arrow-forward"}})],1)],1)]),n("Content",{staticClass:"layoutContent",style:{padding:"16px 16px 16px"}},[n("router-view"),e._m(0)],1)],1)],1)],1)},o=[function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"footer",domProps:{innerHTML:e._s(e.copyright)}})}],u=(n("96cf"),n("1da1")),c=n("5530"),i=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",[r("Row",[r("div",{staticClass:"logo",on:{click:function(t){return e.$router.push("/")}}},[r("img",{staticStyle:{width:"100px",height:"30px"},attrs:{src:n("cf05")}})])]),r("Menu",{attrs:{"active-name":e.$route.path.split("/")[1],theme:"dark",width:"auto"}},[r("MenuItem",{attrs:{name:"user",to:{name:"user"}}},[r("Icon",{attrs:{type:"ios-navigate"}}),e._v(" User ")],1),r("MenuItem",{attrs:{name:"problem",to:{name:"problem"}}},[r("Icon",{attrs:{type:"ios-navigate"}}),e._v(" Problem ")],1),r("MenuItem",{attrs:{name:"contest",to:{name:"contest"}}},[r("Icon",{attrs:{type:"ios-keypad"}}),e._v(" Contest ")],1),r("MenuItem",{attrs:{name:"template",to:{name:"template"}}},[r("Icon",{attrs:{type:"ios-paper"}}),e._v(" Judge Template ")],1)],1)],1)},s=[],l=n("7c15"),p=n("2f62"),f={computed:Object(c["a"])({},Object(p["b"])("user",["username"])),mounted:function(){l["a"].getProfile()}},d=f,m=(n("f67f"),n("2877")),g=Object(m["a"])(d,i,s,!1,null,"65ee3f0a",null),h=g.exports,b=n("e490"),y={data:function(){return{isCollapsed:!1}},methods:{toUserPage:function(){window.open(this.clientURL,"_blank")}},components:{NavBar:h},computed:Object(c["a"])(Object(c["a"])(Object(c["a"])({},Object(p["c"])(["copyright"])),Object(p["b"])("user",["username","avatar"])),{},{clientURL:function(){return b["a"].PROD?location.origin:Object({VUE_APP_OJ_SERVER:"",NODE_ENV:"production",BASE_URL:"/"}).VUE_APP_OJ_CLIENT}}),created:function(){var e=Object(u["a"])(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.t0=this.$store,e.next=3,l["a"].getCopyright();case 3:e.t1=e.sent,e.t2={copyright:e.t1},e.t0.commit.call(e.t0,"updateCopyright",e.t2);case 6:case"end":return e.stop()}}),e,this)})));function t(){return e.apply(this,arguments)}return t}()},v=y,k=(n("7c55"),Object(m["a"])(v,a,o,!1,null,null,null)),P=k.exports,w=n("8c4f"),C=(n("d3b7"),[{path:"/",redirect:"/user"},{path:"/user",name:"user",component:function(){return n.e("chunk-46d3d8c8").then(n.bind(null,"ad3d"))},meta:{title:"用户"}},{path:"/problem",name:"problem",component:function(){return Promise.all([n.e("chunk-113a4866"),n.e("chunk-6abd03a5"),n.e("chunk-87617870")]).then(n.bind(null,"59a1"))},meta:{title:"题库"}},{path:"/contest",name:"contest",component:function(){return Promise.all([n.e("chunk-113a4866"),n.e("chunk-6abd03a5"),n.e("chunk-e338b116")]).then(n.bind(null,"0f48"))}},{path:"/template",name:"template",component:function(){return Promise.all([n.e("chunk-113a4866"),n.e("chunk-5878c82b")]).then(n.bind(null,"519f"))}},{path:"/group",name:"group",component:function(){return Promise.all([n.e("chunk-113a4866"),n.e("chunk-6abd03a5"),n.e("chunk-09a93b6e")]).then(n.bind(null,"3f14"))}},{path:"*",component:function(){return n.e("chunk-d47fc0b8").then(n.bind(null,"2caa"))}}]),O=C;r["default"].use(w["a"]);var _=w["a"].prototype.push;w["a"].prototype.push=function(e){return _.call(this,e).catch((function(e){return e}))};var j=new w["a"]({routes:O}),L=j,U=n("4360"),T=(n("f5d3"),n("4b51"),n("f825")),x=n.n(T),E=n("3250"),D=n.n(E);r["default"].use(x.a,{locale:D.a}),r["default"].config.productionTip=!1,r["default"].prototype.$Message.config({duration:3,top:60}),new r["default"]({router:L,store:U["a"],render:function(e){return e(P)}}).$mount("#app")},"7c15":function(e,t,n){"use strict";n("c975"),n("d3b7"),n("25f0"),n("3ca3"),n("ddb0"),n("2b3d");var r=n("2b0e"),a=n("bc3a"),o=n.n(a),u=n("4360");function c(e,t,n){return t=t||{},n=n||{},new Promise((function(a,u){o.a.post(e,t,n).then((function(e){-1===e.headers["content-type"].indexOf("application/json")?a(e):0===e.data.code?a(e.data.data):(r["default"].prototype.$Message.error(e.data.message),u(e.data))}),(function(e){r["default"].prototype.$Loading.finish(),u(e.response.data)}))}))}function i(e,t,n){return t=t||{},n=n||{},new Promise((function(a,u){o.a.get(e,{params:t,options:n}).then((function(e){0===e.data.code?a(e.data.data):(r["default"].prototype.$Message.error(e.data.message),u(e.data))}),(function(e){r["default"].prototype.$Loading.finish(),u(e.response.data)}))}))}o.a.defaults.baseURL="".concat("","/api"),o.a.defaults.withCredentials=!0,t["a"]={getCopyright:function(){return i("/site/getCopyright")},getProfile:function(e,t){o.a.get("/user/getProfile").then((function(t){0===t.data.code?(u["a"].dispatch("user/setProfile",t.data.data),e&&e(t.data.data)):r["default"].prototype.$Message.error(t.data.message)}),(function(e){401===e.response.status&&(u["a"].dispatch("user/clearProfile"),t&&t(e.response.data))}))},getUserList:function(e){return i("/manage/user/list",e)},updateUserInfo:function(e){return c("/manage/user/update",e)},updateUserPasswd:function(e){return c("/manage/user/update",e)},addUsers:function(e){return c("/manage/user/addUsers",e)},deleteUsers:function(e){return c("/manage/user/delete",e)},getProblemList:function(e){return i("/manage/problem/list",e)},getProblem:function(e){return i("/manage/problem/query",e)},updateProblemInfo:function(e){return c("/manage/problem/update",e)},createProblem:function(e){return c("/manage/problem/create",e)},getProblemDescriptionList:function(e){return i("/manage/problem/queryDescriptionList",e)},getProblemDescription:function(e){return i("/manage/problem/queryDescription",e)},updateDescription:function(e){return c("/manage/problem/updateDescription",e)},createDescription:function(e){return c("/manage/problem/createDescription",e)},deleteDescription:function(e){return i("/manage/problem/deleteDescription",e)},uploadSingleCheckpoint:function(e){return c("/manage/checkpoint/upload",e)},uploadCheckpointFiles:function(e){return c("/manage/checkpoint/uploadFiles",e)},getCheckpointList:function(e){return i("/manage/checkpoint/list",{problemCode:e})},getCheckpointPreview:function(e){return i("/manage/checkpoint/query",{checkpointId:e})},updateProblemCheckpoints:function(e){return c("/manage/problem/update",e)},getContestList:function(e){return i("/manage/contest/page",e)},getContest:function(e){return i("/manage/contest/query",e)},updateContest:function(e){return c("/manage/contest/update",e)},createContest:function(e){return c("/manage/contest/create",e)},getOneTemplate:function(e){return i("/manage/judgetemplate/query",{id:e})},getTemplateList:function(e){return i("/manage/judgetemplate/page",e)},createTemplate:function(e){return c("/manage/judgetemplate/create",e)},updateTemplate:function(e){return c("/manage/judgetemplate/update",e)},queryTemplateTitle:function(e){return i("/manage/judgetemplate/listByTitle",{title:e})},singleUpload:function(e){return c("/filesys/upload",e)},multiUpload:function(e){return c("/filesys/uploadFiles",e)},checkMD5:function(e){return i("/filesys/queryByMd5",{md5:e})},zipDownload:function(e){return new Promise((function(t,n){c("filesys/zipDownload",e,{responseType:"blob"}).then((function(e){t(e);var n=new Blob([e.data],{type:e.headers["content-type"]}),r=document.createElement("a"),a=(new Date).getTime().toString();"download"in r?(r.download=a,r.href=URL.createObjectURL(n),r.click(),URL.revokeObjectURL(r.href)):navigator.msSaveBlob(n,a)}),(function(e){return n(e)}))}))},createGroup:function(e){return c("/manage/group/create",e)},updateGroup:function(e){return c("/manage/group/update",e)},getGroupDetail:function(e){return i("/manage/group/query",e)},getGroupList:function(e){return i("/manage/group/page",e)},updateUserStatus:function(e){return c("/manage/group/updateUserStatus",e)},addUsersToGroup:function(e){return c("/manage/group/addUser",e)},deleteGroup:function(e){return i("/manage/group/delete",e)},queryGroupTitle:function(e){return i("/manage/group/listByTitle",e)}}},"7c55":function(e,t,n){"use strict";var r=n("0985"),a=n.n(r);a.a},8481:function(e,t,n){},cf05:function(e,t,n){e.exports=n.p+"img/logo.df2afea8.png"},e490:function(e,t,n){"use strict";n.d(t,"a",(function(){return u}));var r=!0,a=!1,o=!1,u={PROD:r,DEV:a,TEST:o}},f5d3:function(e,t,n){},f67f:function(e,t,n){"use strict";var r=n("8481"),a=n.n(r);a.a}});
//# sourceMappingURL=app.70c567b9.js.map