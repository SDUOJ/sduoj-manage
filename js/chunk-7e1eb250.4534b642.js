(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-7e1eb250"],{"089b":function(t,e,n){},1276:function(t,e,n){"use strict";var i=n("d784"),o=n("44e7"),s=n("825a"),r=n("1d80"),a=n("4840"),c=n("8aa5"),l=n("50c4"),u=n("14c3"),d=n("9263"),h=n("d039"),f=[].push,p=Math.min,g=4294967295,m=!h((function(){return!RegExp(g,"y")}));i("split",2,(function(t,e,n){var i;return i="c"=="abbc".split(/(b)*/)[1]||4!="test".split(/(?:)/,-1).length||2!="ab".split(/(?:ab)*/).length||4!=".".split(/(.?)(.?)/).length||".".split(/()()/).length>1||"".split(/.?/).length?function(t,n){var i=String(r(this)),s=void 0===n?g:n>>>0;if(0===s)return[];if(void 0===t)return[i];if(!o(t))return e.call(i,t,s);var a,c,l,u=[],h=(t.ignoreCase?"i":"")+(t.multiline?"m":"")+(t.unicode?"u":"")+(t.sticky?"y":""),p=0,m=new RegExp(t.source,h+"g");while(a=d.call(m,i)){if(c=m.lastIndex,c>p&&(u.push(i.slice(p,a.index)),a.length>1&&a.index<i.length&&f.apply(u,a.slice(1)),l=a[0].length,p=c,u.length>=s))break;m.lastIndex===a.index&&m.lastIndex++}return p===i.length?!l&&m.test("")||u.push(""):u.push(i.slice(p)),u.length>s?u.slice(0,s):u}:"0".split(void 0,0).length?function(t,n){return void 0===t&&0===n?[]:e.call(this,t,n)}:e,[function(e,n){var o=r(this),s=void 0==e?void 0:e[t];return void 0!==s?s.call(e,o,n):i.call(String(o),e,n)},function(t,o){var r=n(i,t,this,o,i!==e);if(r.done)return r.value;var d=s(t),h=String(this),f=a(d,RegExp),v=d.unicode,S=(d.ignoreCase?"i":"")+(d.multiline?"m":"")+(d.unicode?"u":"")+(m?"y":"g"),C=new f(m?d:"^(?:"+d.source+")",S),b=void 0===o?g:o>>>0;if(0===b)return[];if(0===h.length)return null===u(C,h)?[h]:[];var x=0,y=0,E=[];while(y<h.length){C.lastIndex=m?y:0;var I,w=u(C,m?h:h.slice(y));if(null===w||(I=p(l(C.lastIndex+(m?0:y)),h.length))===x)y=c(h,y,v);else{if(E.push(h.slice(x,y)),E.length===b)return E;for(var T=1;T<=w.length-1;T++)if(E.push(w[T]),E.length===b)return E;y=x=I}}return E.push(h.slice(x)),E}]}),!m)},"44e7":function(t,e,n){var i=n("861d"),o=n("c6b6"),s=n("b622"),r=s("match");t.exports=function(t){var e;return i(t)&&(void 0!==(e=t[r])?!!e:"RegExp"==o(t))}},"45b7":function(t,e,n){"use strict";n.r(e);var i=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticStyle:{background:"#eee",padding:"20px"}},[n("Row",t._l(t.utilSelectorConfig,(function(e,i){return n("Col",{key:e.introduction+i.toString(),attrs:{span:"10"}},[n("UtilMenuCard",{attrs:{"util-title":e.title,"util-introduction":e.introduction},on:{"change-dialog":function(n){return t.changeDialog(e.name)}}})],1)})),1),n("Modal",{ref:"comprehensiveDialog",staticClass:"tool-modal",attrs:{"class-name":"comprehensive",title:"Export the contest comprehensive report",styles:t.comprehensiveDialogStyles},on:{"on-ok":t.exportComprehensive},model:{value:t.comprehensive,callback:function(e){t.comprehensive=e},expression:"comprehensive"}},[n("Input",{staticStyle:{width:"30%"},attrs:{search:"","enter-button":"",placeholder:"Enter groupId ..."},on:{"on-search":t.getSearchContestList},model:{value:t.selectedGroupId,callback:function(e){t.selectedGroupId=e},expression:"selectedGroupId"}},[n("span",{attrs:{slot:"prepend"},slot:"prepend"},[t._v("Group Id")]),n("Button",{attrs:{slot:"append",icon:"ios-return-right"},slot:"append"})],1),n("Menu",{attrs:{mode:"horizontal","active-name":"1"},on:{"on-select":t.changeMenuState}},[n("MenuItem",{key:"1",attrs:{name:"1"}},[t._v("配置比赛")]),n("MenuItem",{key:"2",attrs:{name:"2"}},[t._v("配置学生")])],1),n("div",{directives:[{name:"show",rawName:"v-show",value:t.contestConfigShow,expression:"contestConfigShow"}],staticClass:"contestConfig"},[n("Table",{staticClass:"content-table",attrs:{columns:t.contestColumns,data:t.contests,loading:t.tableLoading},on:{"on-select":t.selectContest,"on-select-cancel":t.unselectContest},scopedSlots:t._u([{key:"title",fn:function(e){var i=e.row;return[n("span",[t._v(t._s(i.contestTitle))]),i.features.openness===t.CONTEST_OPENNESS.PRIVATE.title?n("Icon",{attrs:{color:t.CONTEST_OPENNESS.PRIVATE.lockColor,type:"md-lock",size:"19"}}):i.features.openness===t.CONTEST_OPENNESS.PROTECTED?n("Icon",{attrs:{color:t.CONTEST_OPENNESS.PROTECTED.lockColor,type:"md-lock",size:"19"}}):t._e(),0===i.isPublic?n("Tag",{staticStyle:{"margin-left":"5px"},attrs:{color:"volcano"}},[t._v("Private")]):t._e()]}},{key:"time",fn:function(e){var i=e.row;return[n("Time",{attrs:{time:t._f("parseInt")(i.gmtStart),type:"datetime"}})]}},{key:"duration",fn:function(e){var i=e.row;return[n("span",[t._v(t._s(t._f("getDuration")(i.gmtStart,i.gmtEnd)))])]}},{key:"action",fn:function(e){var i=e.row;return[n("span",{staticClass:"clickable",on:{click:function(e){return t.EditConfig(i)}}},[t._v("Edit Config")])]}},{key:"weight",fn:function(e){var i=e.row;return[n("Input",{staticStyle:{width:"100px"},model:{value:t.recordWeight[i.contestId],callback:function(e){t.$set(t.recordWeight,i.contestId,e)},expression:"recordWeight[row.contestId]"}})]}}])}),n("div",{staticClass:"footer-tools"},[n("Page",{staticClass:"float-right",attrs:{size:"small","show-elevator":"","show-sizer":"",total:t.total,current:t.PageNow,"page-size":t.PageSize,"page-size-opts":t.pageSizeOpts},on:{"update:current":function(e){t.PageNow=e},"on-change":t.getContestList,"on-page-size-change":t.tableSizeChange}})],1)],1),n("div",{directives:[{name:"show",rawName:"v-show",value:t.studentConfigShow,expression:"studentConfigShow"}],staticClass:"studentConfig"},[n("div",[n("Card",{staticClass:"tag-card"},[n("p",{staticClass:"prefix"},[t._v("全部学生:")]),t._l(t.allStudent,(function(e){return n("Tag",{key:e.userId,ref:e.username+" tag",refInFor:!0,attrs:{name:e.username,color:"primary",checkable:""},on:{"on-change":t.handleStudentSelectedChange}},[t._v(t._s(e.username))])}))],2),n("Divider"),n("Card",{staticClass:"tag-card"},[n("p",{staticClass:"prefix"},[t._v("已选择的学生:")]),t._l(t.selectedStudent,(function(e){return n("Tag",{key:e,attrs:{closable:"",type:"border",color:"primary"},on:{"on-close":function(n){return t.deleteSelectedTag(e)}}},[t._v(t._s(e))])}))],2)],1),n("Tooltip",{directives:[{name:"show",rawName:"v-show",value:!t.extraTextVisible,expression:"!extraTextVisible"}],attrs:{content:"手动增加"}},[n("Button",{staticStyle:{"margin-left":"10px"},attrs:{size:"default",icon:"ios-add",type:"primary"},on:{click:t.changeExtraVisible}})],1),n("Button",{directives:[{name:"show",rawName:"v-show",value:t.extraTextVisible,expression:"extraTextVisible"}],staticStyle:{"margin-left":"10px"},attrs:{size:"default",icon:"ios-remove",type:"primary"},on:{click:t.changeExtraVisible}}),n("Modal",{on:{"on-ok":t.addStudentHandin},model:{value:t.extraTextVisible,callback:function(e){t.extraTextVisible=e},expression:"extraTextVisible"}},[n("Form",[n("FormItem",{attrs:{label:"Participants"}},[n("span",{staticClass:"hint-text"},[t._v("Separate username by a TAB '\\t', SPACE ' ', NEW LINE '\\n' or COMMA ','")]),n("Input",{attrs:{type:"textarea",autosize:{minRows:3}},model:{value:t.handInParticipants,callback:function(e){t.handInParticipants=e},expression:"handInParticipants"}})],1)],1)],1)],1)],1),n("Modal",{attrs:{title:"ConfigDetail",width:"400px"},on:{"on-ok":t.pushComprehensiveConfig},model:{value:t.comprehensiveConfigDetailVisible,callback:function(e){t.comprehensiveConfigDetailVisible=e},expression:"comprehensiveConfigDetailVisible"}},[n("Form",{attrs:{"label-position":"left","label-width":100}},[n("FormItem",{attrs:{label:"超时时间"}},[n("Input",{attrs:{placeholder:"请填写整数(ms)"},model:{value:t.timeCost,callback:function(e){t.timeCost=e},expression:"timeCost"}})],1),n("FormItem",{attrs:{label:"超时权重"}},[n("Input",{attrs:{placeholder:"请填写小数(<=1)"},model:{value:t.outTimeWeight,callback:function(e){t.outTimeWeight=e},expression:"outTimeWeight"}}),n("Button",{staticClass:"add-config-btn",attrs:{type:"success"},on:{click:t.addTimeWeight}},[t._v("添加配置")])],1),n("Poptip",[t._v(" 添加详细配置, "),n("a",[t._v("example")]),n("Timeline",{attrs:{slot:"content"},slot:"content"},t._l(t.exampleWeight,(function(e){return n("TimelineItem",{key:e[0],attrs:{color:"green"}},[t._v("超出比赛结束时间 "+t._s(e[0])+"ms内 得分率: "+t._s(e[1]))])})),1)],1),n("p",{staticClass:"timeline-prefix"},[t._v("你的配置：")]),n("Timeline",t._l(t.timeWeightDetail,(function(e){return n("TimelineItem",{key:e[0],attrs:{color:"green"}},[n("p",{staticStyle:{height:"20px","line-height":"20px"}},[t._v("超出比赛结束时间 "+t._s(e[0])+"ms内 得分率: "+t._s(e[1])+" "),n("Button",{staticStyle:{float:"right","margin-top":"-5px","margin-right":"10px"},attrs:{shape:"circle",icon:"md-close",size:"small",type:"error"},on:{click:function(n){return t.deleteTimeConfig(e)}}})],1)])})),1)],1)],1)],1)},o=[],s=(n("99af"),n("4160"),n("a630"),n("c975"),n("a15b"),n("a434"),n("d3b7"),n("25f0"),n("6062"),n("3ca3"),n("159b"),n("ddb0"),function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",[n("Card",[n("p",{staticClass:"util-title",attrs:{slot:"title"},slot:"title"},[t._v(t._s(t.utilTitle))]),n("Button",{staticClass:"util-button",attrs:{slot:"extra",type:"success"},on:{click:t.DialogChange},slot:"extra"},[t._v("Take it")]),n("p",{staticClass:"util-introduction"},[t._v(t._s(t.utilIntroduction))])],1)],1)}),r=[],a={name:"UtilMenuCard",props:{utilTitle:String,utilIntroduction:String},methods:{DialogChange:function(){this.$emit("change-dialog")}}},c=a,l=(n("ccc8"),n("2877")),u=Object(l["a"])(c,s,r,!1,null,"5cc228a5",null),d=u.exports,h=n("c1df"),f=n.n(h),p=n("c9d9"),g=n("7c15"),m=n("33e8"),v=function(t,e,n){var i=[];return t.forEach((function(t){i.push(t[e])})),i.indexOf(n)},S={components:{UtilMenuCard:d},data:function(){return{utilSelectorConfig:[{name:"comprehensive",title:"Export the contest comprehensive report",introduction:"根据提供的组号，比赛号，学生等配置导出比赛数据"}],contestColumns:[{type:"selection",width:60,align:"center"},{key:"contestId",maxWidth:80},{title:"Title",slot:"title",minWidth:150},{title:"Start",key:"gmtStart",sortable:"custom",width:200,slot:"time"},{title:"Duration",sortable:"custom",slot:"duration"},{title:"\b",slot:"action"},{title:"Weight",slot:"weight"}],contests:[],contest:{features:{contestEnd:{},contestRunning:{}},groupId:"",problems:[]},selectedContests:[],contestConfig:{},tableLoading:!1,total:0,PageNow:1,PageSize:10,pageSizeOpts:[10,30,50],contestConfigShow:!0,studentConfigShow:!1,selectedGroupId:"",configSelectContest:"",timeCost:"",outTimeWeight:"",weight:"",exampleWeight:[["0",1],["100",.8],["1000",.6]],timeWeightDetail:[[0,1]],recordWeight:[],handInParticipants:"",selectedStudent:[],allStudent:"",comprehensive:!1,comprehensiveConfigDetailVisible:!1,extraTextVisible:!1,comprehensiveDialogStyles:{width:"70%"}}},methods:{changeDialog:function(t){this[t]=!this[t]},tableSizeChange:function(t){this.PageSize=t,this.getContestList()},getSearchContestList:function(){this.PageNow=1,this.getContestList(),this.getStudentList()},changeModalWidth:function(){this.contestConfigShow?this.comprehensiveDialogStyles.width="70%":this.comprehensiveDialogStyles.width="50%"},getContestList:function(){var t=this;this.tableLoading=!0,this.selectedContests=[],g["a"].getContestListByGroupId({pageNow:this.PageNow,pageSize:this.PageSize,groupId:this.selectedGroupId}).then((function(e){t.contests=e.rows,t.total=t.PageSize*e.totalPage})).catch((function(e){t.$Message.error(e.message)})).finally((function(){t.tableLoading=!1}))},getStudentList:function(){var t=this;this.selectedStudent=[],this.allStudent=[],g["a"].getStudentListByGroupId({groupId:this.selectedGroupId}).then((function(e){t.allStudent=e.members,t.allStudent.forEach((function(e){t.selectedStudent.push(e.username)}))})).catch((function(e){t.$Message.error(e.message)}))},selectContest:function(t,e){this.selectedContests.push(e.contestId)},unselectContest:function(t,e){this.selectedContests.splice(this.selectedContests.indexOf(e.contestId),1)},EditConfig:function(t){this.configSelectContest=t.contestId,this.weight="",this.timeCost="",this.outTimeWeight="",this.changeComprehensiveConfigDetailVisible()},changeComprehensiveConfigDetailVisible:function(){this.comprehensiveConfigDetailVisible=!0},pushComprehensiveConfig:function(){this.contestConfig[this.configSelectContest]={contestId:this.configSelectContest,weight:this.recordWeight[this.configSelectContest],timeoutScoreRatio:this.timeWeightDetail}},changeMenuState:function(t){this.contestConfigShow="1"===t,this.studentConfigShow=!this.contestConfigShow,this.changeModalWidth()},unselectStudent:function(t){this.selectedStudent.splice(this.selectedStudent.indexOf(t),1)},handleStudentSelectedChange:function(t,e){t?this.selectedStudent.push(e):this.unselectStudent(e)},addStudentHandin:function(){for(var t=Array.from(new Set(Object(m["a"])(this.handInParticipants,/[\s,]+/).concat(this.selectedStudent))),e=0;e<t.length;e++)-1!==v(this.allStudent,"username",t[e])&&(this.$refs[t[e]+" tag"][0].isChecked||this.$refs[t[e]+" tag"][0].check());this.selectedStudent=t},deleteSelectedTag:function(t){-1!==v(this.allStudent,"username",t)?this.$refs[t+" tag"][0].check():this.unselectStudent(t)},exportComprehensive:function(){var t=this,e=[];this.selectedContests.forEach((function(n){e.push(t.contestConfig[n])}));var n={usernameList:this.selectedStudent,contestList:e};g["a"].exportComprehensive(n).catch((function(e){t.$Message.error(e.message)}))},changeExtraVisible:function(){this.extraTextVisible=!this.extraTextVisible},addTimeWeight:function(){var t;for(t=0;t<this.timeWeightDetail.length;t++)if(this.timeWeightDetail[t][0]>=this.timeCost)break;t<this.timeWeightDetail.length&&this.timeWeightDetail[t][0]===this.timeCost?this.timeWeightDetail[t][1]=parseFloat(this.outTimeWeight):this.timeWeightDetail.splice(t,0,[this.timeCost,parseFloat(this.outTimeWeight)])},deleteTimeConfig:function(t){this.timeWeightDetail.splice(this.timeWeightDetail.indexOf(t),1)}},filters:{getDuration:function(t,e){var n=parseInt(e)-parseInt(t),i=f.a.duration(n,"milliseconds"),o=i.minutes()<10?"0"+i.minutes():i.minutes().toString(),s=i.seconds()<10?"0"+i.seconds():i.seconds().toString();return[Math.floor(i.asHours()),o,s].join(":")},parseInt:function(t){function e(e){return t.apply(this,arguments)}return e.toString=function(){return t.toString()},e}((function(t){return parseInt(t)}))},computed:{CONTEST_OPENNESS:function(){return p["b"]},CONTEST_MODE:function(){return p["a"]},CONTEST_PROBLEM_STATUS:function(){return p["c"]},moment:function(){return f.a}},watch:{}},C=S,b=(n("9983"),Object(l["a"])(C,i,o,!1,null,"21dada1e",null));e["default"]=b.exports},5899:function(t,e){t.exports="\t\n\v\f\r                　\u2028\u2029\ufeff"},"58a8":function(t,e,n){var i=n("1d80"),o=n("5899"),s="["+o+"]",r=RegExp("^"+s+s+"*"),a=RegExp(s+s+"*$"),c=function(t){return function(e){var n=String(i(e));return 1&t&&(n=n.replace(r,"")),2&t&&(n=n.replace(a,"")),n}};t.exports={start:c(1),end:c(2),trim:c(3)}},6062:function(t,e,n){"use strict";var i=n("6d61"),o=n("6566");t.exports=i("Set",(function(t){return function(){return t(this,arguments.length?arguments[0]:void 0)}}),o)},6566:function(t,e,n){"use strict";var i=n("9bf2").f,o=n("7c73"),s=n("e2cc"),r=n("0366"),a=n("19aa"),c=n("2266"),l=n("7dd0"),u=n("2626"),d=n("83ab"),h=n("f183").fastKey,f=n("69f3"),p=f.set,g=f.getterFor;t.exports={getConstructor:function(t,e,n,l){var u=t((function(t,i){a(t,u,e),p(t,{type:e,index:o(null),first:void 0,last:void 0,size:0}),d||(t.size=0),void 0!=i&&c(i,t[l],t,n)})),f=g(e),m=function(t,e,n){var i,o,s=f(t),r=v(t,e);return r?r.value=n:(s.last=r={index:o=h(e,!0),key:e,value:n,previous:i=s.last,next:void 0,removed:!1},s.first||(s.first=r),i&&(i.next=r),d?s.size++:t.size++,"F"!==o&&(s.index[o]=r)),t},v=function(t,e){var n,i=f(t),o=h(e);if("F"!==o)return i.index[o];for(n=i.first;n;n=n.next)if(n.key==e)return n};return s(u.prototype,{clear:function(){var t=this,e=f(t),n=e.index,i=e.first;while(i)i.removed=!0,i.previous&&(i.previous=i.previous.next=void 0),delete n[i.index],i=i.next;e.first=e.last=void 0,d?e.size=0:t.size=0},delete:function(t){var e=this,n=f(e),i=v(e,t);if(i){var o=i.next,s=i.previous;delete n.index[i.index],i.removed=!0,s&&(s.next=o),o&&(o.previous=s),n.first==i&&(n.first=o),n.last==i&&(n.last=s),d?n.size--:e.size--}return!!i},forEach:function(t){var e,n=f(this),i=r(t,arguments.length>1?arguments[1]:void 0,3);while(e=e?e.next:n.first){i(e.value,e.key,this);while(e&&e.removed)e=e.previous}},has:function(t){return!!v(this,t)}}),s(u.prototype,n?{get:function(t){var e=v(this,t);return e&&e.value},set:function(t,e){return m(this,0===t?0:t,e)}}:{add:function(t){return m(this,t=0===t?0:t,t)}}),d&&i(u.prototype,"size",{get:function(){return f(this).size}}),u},setStrong:function(t,e,n){var i=e+" Iterator",o=g(e),s=g(i);l(t,e,(function(t,e){p(this,{type:i,target:t,state:o(t),kind:e,last:void 0})}),(function(){var t=s(this),e=t.kind,n=t.last;while(n&&n.removed)n=n.previous;return t.target&&(t.last=n=n?n.next:t.state.first)?"keys"==e?{value:n.key,done:!1}:"values"==e?{value:n.value,done:!1}:{value:[n.key,n.value],done:!1}:(t.target=void 0,{value:void 0,done:!0})}),n?"entries":"values",!n,!0),u(e)}}},"6d61":function(t,e,n){"use strict";var i=n("23e7"),o=n("da84"),s=n("94ca"),r=n("6eeb"),a=n("f183"),c=n("2266"),l=n("19aa"),u=n("861d"),d=n("d039"),h=n("1c7e"),f=n("d44e"),p=n("7156");t.exports=function(t,e,n){var g=-1!==t.indexOf("Map"),m=-1!==t.indexOf("Weak"),v=g?"set":"add",S=o[t],C=S&&S.prototype,b=S,x={},y=function(t){var e=C[t];r(C,t,"add"==t?function(t){return e.call(this,0===t?0:t),this}:"delete"==t?function(t){return!(m&&!u(t))&&e.call(this,0===t?0:t)}:"get"==t?function(t){return m&&!u(t)?void 0:e.call(this,0===t?0:t)}:"has"==t?function(t){return!(m&&!u(t))&&e.call(this,0===t?0:t)}:function(t,n){return e.call(this,0===t?0:t,n),this})};if(s(t,"function"!=typeof S||!(m||C.forEach&&!d((function(){(new S).entries().next()})))))b=n.getConstructor(e,t,g,v),a.REQUIRED=!0;else if(s(t,!0)){var E=new b,I=E[v](m?{}:-0,1)!=E,w=d((function(){E.has(1)})),T=h((function(t){new S(t)})),D=!m&&d((function(){var t=new S,e=5;while(e--)t[v](e,e);return!t.has(-0)}));T||(b=e((function(e,n){l(e,b,t);var i=p(new S,e,b);return void 0!=n&&c(n,i[v],i,g),i})),b.prototype=C,C.constructor=b),(w||D)&&(y("delete"),y("has"),g&&y("get")),(D||I)&&y(v),m&&C.clear&&delete C.clear}return x[t]=b,i({global:!0,forced:b!=S},x),f(b,t),m||n.setStrong(b,t,g),b}},7156:function(t,e,n){var i=n("861d"),o=n("d2bb");t.exports=function(t,e,n){var s,r;return o&&"function"==typeof(s=e.constructor)&&s!==n&&i(r=s.prototype)&&r!==n.prototype&&o(t,r),t}},9983:function(t,e,n){"use strict";var i=n("089b"),o=n.n(i);o.a},"99af":function(t,e,n){"use strict";var i=n("23e7"),o=n("d039"),s=n("e8b5"),r=n("861d"),a=n("7b0b"),c=n("50c4"),l=n("8418"),u=n("65f0"),d=n("1dde"),h=n("b622"),f=n("2d00"),p=h("isConcatSpreadable"),g=9007199254740991,m="Maximum allowed index exceeded",v=f>=51||!o((function(){var t=[];return t[p]=!1,t.concat()[0]!==t})),S=d("concat"),C=function(t){if(!r(t))return!1;var e=t[p];return void 0!==e?!!e:s(t)},b=!v||!S;i({target:"Array",proto:!0,forced:b},{concat:function(t){var e,n,i,o,s,r=a(this),d=u(r,0),h=0;for(e=-1,i=arguments.length;e<i;e++)if(s=-1===e?r:arguments[e],C(s)){if(o=c(s.length),h+o>g)throw TypeError(m);for(n=0;n<o;n++,h++)n in s&&l(d,h,s[n])}else{if(h>=g)throw TypeError(m);l(d,h++,s)}return d.length=h,d}})},"9d66":function(t,e,n){},a434:function(t,e,n){"use strict";var i=n("23e7"),o=n("23cb"),s=n("a691"),r=n("50c4"),a=n("7b0b"),c=n("65f0"),l=n("8418"),u=n("1dde"),d=n("ae40"),h=u("splice"),f=d("splice",{ACCESSORS:!0,0:0,1:2}),p=Math.max,g=Math.min,m=9007199254740991,v="Maximum allowed length exceeded";i({target:"Array",proto:!0,forced:!h||!f},{splice:function(t,e){var n,i,u,d,h,f,S=a(this),C=r(S.length),b=o(t,C),x=arguments.length;if(0===x?n=i=0:1===x?(n=0,i=C-b):(n=x-2,i=g(p(s(e),0),C-b)),C+n-i>m)throw TypeError(v);for(u=c(S,i),d=0;d<i;d++)h=b+d,h in S&&l(u,d,S[h]);if(u.length=i,n<i){for(d=b;d<C-i;d++)h=d+i,f=d+n,h in S?S[f]=S[h]:delete S[f];for(d=C;d>C-i+n;d--)delete S[d-1]}else if(n>i)for(d=C-i;d>b;d--)h=d+i-1,f=d+n-1,h in S?S[f]=S[h]:delete S[f];for(d=0;d<n;d++)S[d+b]=arguments[d+2];return S.length=C-i+n,u}})},a630:function(t,e,n){var i=n("23e7"),o=n("4df4"),s=n("1c7e"),r=!s((function(t){Array.from(t)}));i({target:"Array",stat:!0,forced:r},{from:o})},bb2f:function(t,e,n){var i=n("d039");t.exports=!i((function(){return Object.isExtensible(Object.preventExtensions({}))}))},c9d9:function(t,e,n){"use strict";n.d(e,"b",(function(){return a})),n.d(e,"a",(function(){return c})),n.d(e,"h",(function(){return l})),n.d(e,"g",(function(){return u})),n.d(e,"l",(function(){return d})),n.d(e,"e",(function(){return h})),n.d(e,"d",(function(){return f})),n.d(e,"f",(function(){return p})),n.d(e,"c",(function(){return g})),n.d(e,"j",(function(){return m})),n.d(e,"i",(function(){return v})),n.d(e,"k",(function(){return S}));var i,o,s,r=n("ade3"),a={PUBLIC:{title:"public",hint:"Public: Anyone can participate in"},PROTECTED:{title:"protected",hint:"Protected: Problems are public but password is needed for submissions",lockColor:"orange"},PRIVATE:{title:"private",hint:"Private: Password is needed for both problems and submissions",lockColor:"#d9534f"}},c={ACM:"acm",OI:"oi",IOI:"ioi"},l={IO:0,SPJ:1,ADVANCED:2},u=(i={},Object(r["a"])(i,l.IO,{type:0,name:"IO",color:"blue",zipFile:!1}),Object(r["a"])(i,l.SPJ,{type:1,name:"SPJ",color:"gold",zipFile:!0}),Object(r["a"])(i,l.ADVANCED,{type:2,name:"Advanced",color:"purple",zipFile:!0}),i),d={user:{color:"default",isAdmin:!1},admin:{color:"gold",isAdmin:!0},superadmin:{color:"volcano",isAdmin:!0}},h={PUBLIC:0,PROTECTED:1,PRIVATE:2},f=(o={},Object(r["a"])(o,h.PUBLIC,{title:"Public",description:"Anybody can join in"}),Object(r["a"])(o,h.PROTECTED,{title:"Apply",description:"Need the administrator audit"}),Object(r["a"])(o,h.PRIVATE,{title:"Private",description:"Nobody can join in"}),o),p={NONE:0,APPLIED:1,JOINED:2,REJECTED:3},g={INIT:0,READY:1,FAILED:2},m={DEFAULT:"",DOS2UNIX:"dos2unix",UNIX2DOS:"unix2dos"},v=(s={},Object(r["a"])(s,m.DOS2UNIX,{name:m.DOS2UNIX,description:"Convert DOS(CR-LF) to UNIX(LF)"}),Object(r["a"])(s,m.UNIX2DOS,{name:m.UNIX2DOS,description:"Convert UNIX(LF) to DOS(CR-LF)"}),Object(r["a"])(s,m.DEFAULT,{name:m.DEFAULT,description:"Do not convert"}),s),S=[{name:"lcmp.cpp",description:"Lines, ignores whitespaces"},{name:"hcmp.cpp",description:"Single huge integer"},{name:"ncmp.cpp",description:"Single or more int64, ignores whitespaces"},{name:"nyesno.cpp",description:"Zero or more yes/no, case insensitive"},{name:"rcmp4.cpp",description:"Single or more double, max any error 1E-4"},{name:"rcmp6.cpp",description:"Single or more double, max any error 1E-6"},{name:"rcmp9.cpp",description:"Single or more double, max any error 1E-9"},{name:"wcmp.cpp",description:"Sequence of tokens"},{name:"yesno.cpp",description:"Single yes or no, case insensitive"}]},ccc8:function(t,e,n){"use strict";var i=n("9d66"),o=n.n(i);o.a},f183:function(t,e,n){var i=n("d012"),o=n("861d"),s=n("5135"),r=n("9bf2").f,a=n("90e3"),c=n("bb2f"),l=a("meta"),u=0,d=Object.isExtensible||function(){return!0},h=function(t){r(t,l,{value:{objectID:"O"+ ++u,weakData:{}}})},f=function(t,e){if(!o(t))return"symbol"==typeof t?t:("string"==typeof t?"S":"P")+t;if(!s(t,l)){if(!d(t))return"F";if(!e)return"E";h(t)}return t[l].objectID},p=function(t,e){if(!s(t,l)){if(!d(t))return!0;if(!e)return!1;h(t)}return t[l].weakData},g=function(t){return c&&m.REQUIRED&&d(t)&&!s(t,l)&&h(t),t},m=t.exports={REQUIRED:!1,fastKey:f,getWeakData:p,onFreeze:g};i[l]=!0}}]);
//# sourceMappingURL=chunk-7e1eb250.4534b642.js.map