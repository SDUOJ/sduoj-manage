(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-cd829c00"],{"089b":function(t,e,n){},1276:function(t,e,n){"use strict";var i=n("d784"),o=n("44e7"),r=n("825a"),s=n("1d80"),a=n("4840"),c=n("8aa5"),l=n("50c4"),u=n("14c3"),d=n("9263"),f=n("d039"),p=[].push,h=Math.min,g=4294967295,m=!f((function(){return!RegExp(g,"y")}));i("split",2,(function(t,e,n){var i;return i="c"=="abbc".split(/(b)*/)[1]||4!="test".split(/(?:)/,-1).length||2!="ab".split(/(?:ab)*/).length||4!=".".split(/(.?)(.?)/).length||".".split(/()()/).length>1||"".split(/.?/).length?function(t,n){var i=String(s(this)),r=void 0===n?g:n>>>0;if(0===r)return[];if(void 0===t)return[i];if(!o(t))return e.call(i,t,r);var a,c,l,u=[],f=(t.ignoreCase?"i":"")+(t.multiline?"m":"")+(t.unicode?"u":"")+(t.sticky?"y":""),h=0,m=new RegExp(t.source,f+"g");while(a=d.call(m,i)){if(c=m.lastIndex,c>h&&(u.push(i.slice(h,a.index)),a.length>1&&a.index<i.length&&p.apply(u,a.slice(1)),l=a[0].length,h=c,u.length>=r))break;m.lastIndex===a.index&&m.lastIndex++}return h===i.length?!l&&m.test("")||u.push(""):u.push(i.slice(h)),u.length>r?u.slice(0,r):u}:"0".split(void 0,0).length?function(t,n){return void 0===t&&0===n?[]:e.call(this,t,n)}:e,[function(e,n){var o=s(this),r=void 0==e?void 0:e[t];return void 0!==r?r.call(e,o,n):i.call(String(o),e,n)},function(t,o){var s=n(i,t,this,o,i!==e);if(s.done)return s.value;var d=r(t),f=String(this),p=a(d,RegExp),v=d.unicode,x=(d.ignoreCase?"i":"")+(d.multiline?"m":"")+(d.unicode?"u":"")+(m?"y":"g"),S=new p(m?d:"^(?:"+d.source+")",x),C=void 0===o?g:o>>>0;if(0===C)return[];if(0===f.length)return null===u(S,f)?[f]:[];var b=0,E=0,y=[];while(E<f.length){S.lastIndex=m?E:0;var I,w=u(S,m?f:f.slice(E));if(null===w||(I=h(l(S.lastIndex+(m?0:E)),f.length))===b)E=c(f,E,v);else{if(y.push(f.slice(b,E)),y.length===C)return y;for(var T=1;T<=w.length-1;T++)if(y.push(w[T]),y.length===C)return y;E=b=I}}return y.push(f.slice(b)),y}]}),!m)},"14c3":function(t,e,n){var i=n("c6b6"),o=n("9263");t.exports=function(t,e){var n=t.exec;if("function"===typeof n){var r=n.call(t,e);if("object"!==typeof r)throw TypeError("RegExp exec method returned something other than an Object or null");return r}if("RegExp"!==i(t))throw TypeError("RegExp#exec called on incompatible receiver");return o.call(t,e)}},"44e7":function(t,e,n){var i=n("861d"),o=n("c6b6"),r=n("b622"),s=r("match");t.exports=function(t){var e;return i(t)&&(void 0!==(e=t[s])?!!e:"RegExp"==o(t))}},"45b7":function(t,e,n){"use strict";n.r(e);var i=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticStyle:{background:"#eee",padding:"20px"}},[n("Row",t._l(t.utilSelectorConfig,(function(e,i){return n("Col",{key:e.introduction+i.toString(),attrs:{span:"10"}},[n("UtilMenuCard",{attrs:{"util-title":e.title,"util-introduction":e.introduction},on:{"change-dialog":function(n){return t.changeDialog(e.name)}}})],1)})),1),n("Modal",{ref:"comprehensiveDialog",staticClass:"tool-modal",attrs:{"class-name":"comprehensive",title:"Export the contest comprehensive report",styles:t.comprehensiveDialogStyles},on:{"on-ok":t.exportComprehensive},model:{value:t.comprehensive,callback:function(e){t.comprehensive=e},expression:"comprehensive"}},[n("Input",{staticStyle:{width:"30%"},attrs:{search:"","enter-button":"",placeholder:"Enter groupId ..."},on:{"on-search":t.getSearchContestList},model:{value:t.selectedGroupId,callback:function(e){t.selectedGroupId=e},expression:"selectedGroupId"}},[n("span",{attrs:{slot:"prepend"},slot:"prepend"},[t._v("Group Id")]),n("Button",{attrs:{slot:"append",icon:"ios-return-right"},slot:"append"})],1),n("Menu",{attrs:{mode:"horizontal","active-name":"1"},on:{"on-select":t.changeMenuState}},[n("MenuItem",{key:"1",attrs:{name:"1"}},[t._v("配置比赛")]),n("MenuItem",{key:"2",attrs:{name:"2"}},[t._v("配置学生")])],1),n("div",{directives:[{name:"show",rawName:"v-show",value:t.contestConfigShow,expression:"contestConfigShow"}],staticClass:"contestConfig"},[n("Table",{staticClass:"content-table",attrs:{columns:t.contestColumns,data:t.contests,loading:t.tableLoading},on:{"on-select":t.selectContest,"on-select-cancel":t.unselectContest},scopedSlots:t._u([{key:"title",fn:function(e){var i=e.row;return[n("span",[t._v(t._s(i.contestTitle))]),i.features.openness===t.CONTEST_OPENNESS.PRIVATE.title?n("Icon",{attrs:{color:t.CONTEST_OPENNESS.PRIVATE.lockColor,type:"md-lock",size:"19"}}):i.features.openness===t.CONTEST_OPENNESS.PROTECTED?n("Icon",{attrs:{color:t.CONTEST_OPENNESS.PROTECTED.lockColor,type:"md-lock",size:"19"}}):t._e(),0===i.isPublic?n("Tag",{staticStyle:{"margin-left":"5px"},attrs:{color:"volcano"}},[t._v("Private")]):t._e()]}},{key:"time",fn:function(e){var i=e.row;return[n("Time",{attrs:{time:t._f("parseInt")(i.gmtStart),type:"datetime"}})]}},{key:"duration",fn:function(e){var i=e.row;return[n("span",[t._v(t._s(t._f("getDuration")(i.gmtStart,i.gmtEnd)))])]}},{key:"action",fn:function(e){var i=e.row;return[n("span",{staticClass:"clickable",on:{click:function(e){return t.EditConfig(i)}}},[t._v("Edit Config")])]}},{key:"weight",fn:function(e){var i=e.row;return[n("Input",{staticStyle:{width:"100px"},model:{value:t.recordWeight[i.contestId],callback:function(e){t.$set(t.recordWeight,i.contestId,e)},expression:"recordWeight[row.contestId]"}})]}}])}),n("div",{staticClass:"footer-tools"},[n("Page",{staticClass:"float-right",attrs:{size:"small","show-elevator":"","show-sizer":"",total:t.total,current:t.PageNow,"page-size":t.PageSize,"page-size-opts":t.pageSizeOpts},on:{"update:current":function(e){t.PageNow=e},"on-change":t.getContestList,"on-page-size-change":t.tableSizeChange}})],1)],1),n("div",{directives:[{name:"show",rawName:"v-show",value:t.studentConfigShow,expression:"studentConfigShow"}],staticClass:"studentConfig"},[n("div",[n("Card",{staticClass:"tag-card"},[n("p",{staticClass:"prefix"},[t._v("全部学生:")]),t._l(t.allStudent,(function(e){return n("Tag",{key:e.userId,ref:e.username+" tag",refInFor:!0,attrs:{name:e.username,color:"primary",checkable:""},on:{"on-change":t.handleStudentSelectedChange}},[t._v(t._s(e.username))])}))],2),n("Divider"),n("Card",{staticClass:"tag-card"},[n("p",{staticClass:"prefix"},[t._v("已选择的学生:")]),t._l(t.selectedStudent,(function(e){return n("Tag",{key:e,attrs:{closable:"",type:"border",color:"primary"},on:{"on-close":function(n){return t.deleteSelectedTag(e)}}},[t._v(t._s(e))])}))],2)],1),n("Tooltip",{directives:[{name:"show",rawName:"v-show",value:!t.extraTextVisible,expression:"!extraTextVisible"}],attrs:{content:"手动增加"}},[n("Button",{staticStyle:{"margin-left":"10px"},attrs:{size:"default",icon:"ios-add",type:"primary"},on:{click:t.changeExtraVisible}})],1),n("Button",{directives:[{name:"show",rawName:"v-show",value:t.extraTextVisible,expression:"extraTextVisible"}],staticStyle:{"margin-left":"10px"},attrs:{size:"default",icon:"ios-remove",type:"primary"},on:{click:t.changeExtraVisible}}),n("Modal",{on:{"on-ok":t.addStudentHandin},model:{value:t.extraTextVisible,callback:function(e){t.extraTextVisible=e},expression:"extraTextVisible"}},[n("Form",[n("FormItem",{attrs:{label:"Participants"}},[n("span",{staticClass:"hint-text"},[t._v("Separate username by a TAB '\\t', SPACE ' ', NEW LINE '\\n' or COMMA ','")]),n("Input",{attrs:{type:"textarea",autosize:{minRows:3}},model:{value:t.handInParticipants,callback:function(e){t.handInParticipants=e},expression:"handInParticipants"}})],1)],1)],1)],1)],1),n("Modal",{attrs:{title:"ConfigDetail",width:"400px"},on:{"on-ok":t.pushComprehensiveConfig},model:{value:t.comprehensiveConfigDetailVisible,callback:function(e){t.comprehensiveConfigDetailVisible=e},expression:"comprehensiveConfigDetailVisible"}},[n("Form",{attrs:{"label-position":"left","label-width":100}},[n("FormItem",{attrs:{label:"超时时间"}},[n("Input",{attrs:{placeholder:"请填写整数(ms)"},model:{value:t.timeCost,callback:function(e){t.timeCost=e},expression:"timeCost"}})],1),n("FormItem",{attrs:{label:"超时权重"}},[n("Input",{attrs:{placeholder:"请填写小数(<=1)"},model:{value:t.outTimeWeight,callback:function(e){t.outTimeWeight=e},expression:"outTimeWeight"}}),n("Button",{staticClass:"add-config-btn",attrs:{type:"success"},on:{click:t.addTimeWeight}},[t._v("添加配置")])],1),n("Poptip",[t._v(" 添加详细配置, "),n("a",[t._v("example")]),n("Timeline",{attrs:{slot:"content"},slot:"content"},t._l(t.exampleWeight,(function(e){return n("TimelineItem",{key:e[0],attrs:{color:"green"}},[t._v("超出比赛结束时间 "+t._s(e[0])+"ms内 得分率: "+t._s(e[1]))])})),1)],1),n("p",{staticClass:"timeline-prefix"},[t._v("你的配置：")]),n("Timeline",t._l(t.timeWeightDetail,(function(e){return n("TimelineItem",{key:e[0],attrs:{color:"green"}},[n("p",{staticStyle:{height:"20px","line-height":"20px"}},[t._v("超出比赛结束时间 "+t._s(e[0])+"ms内 得分率: "+t._s(e[1])+" "),n("Button",{staticStyle:{float:"right","margin-top":"-5px","margin-right":"10px"},attrs:{shape:"circle",icon:"md-close",size:"small",type:"error"},on:{click:function(n){return t.deleteTimeConfig(e)}}})],1)])})),1)],1)],1)],1)},o=[],r=(n("99af"),n("4160"),n("a630"),n("c975"),n("a15b"),n("a434"),n("d3b7"),n("25f0"),n("6062"),n("3ca3"),n("159b"),n("ddb0"),function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",[n("Card",[n("p",{staticClass:"util-title",attrs:{slot:"title"},slot:"title"},[t._v(t._s(t.utilTitle))]),n("Button",{staticClass:"util-button",attrs:{slot:"extra",type:"success"},on:{click:t.DialogChange},slot:"extra"},[t._v("Take it")]),n("p",{staticClass:"util-introduction"},[t._v(t._s(t.utilIntroduction))])],1)],1)}),s=[],a={name:"UtilMenuCard",props:{utilTitle:String,utilIntroduction:String},methods:{DialogChange:function(){this.$emit("change-dialog")}}},c=a,l=(n("ccc8"),n("2877")),u=Object(l["a"])(c,r,s,!1,null,"5cc228a5",null),d=u.exports,f=n("c1df"),p=n.n(f),h=n("c9d9"),g=n("7c15"),m=n("33e8"),v=function(t,e,n){var i=[];return t.forEach((function(t){i.push(t[e])})),i.indexOf(n)},x={components:{UtilMenuCard:d},data:function(){return{utilSelectorConfig:[{name:"comprehensive",title:"Export the contest comprehensive report",introduction:"根据提供的组号，比赛号，学生等配置导出比赛数据"}],contestColumns:[{type:"selection",width:60,align:"center"},{key:"contestId",maxWidth:80},{title:"Title",slot:"title",minWidth:150},{title:"Start",key:"gmtStart",sortable:"custom",width:200,slot:"time"},{title:"Duration",sortable:"custom",slot:"duration"},{title:"\b",slot:"action"},{title:"Weight",slot:"weight"}],contests:[],contest:{features:{contestEnd:{},contestRunning:{}},groupId:"",problems:[]},selectedContests:[],contestConfig:{},tableLoading:!1,total:0,PageNow:1,PageSize:10,pageSizeOpts:[10,30,50],contestConfigShow:!0,studentConfigShow:!1,selectedGroupId:"",configSelectContest:"",timeCost:"",outTimeWeight:"",weight:"",exampleWeight:[["0",1],["100",.8],["1000",.6]],timeWeightDetail:[[0,1]],recordWeight:[],handInParticipants:"",selectedStudent:[],allStudent:"",comprehensive:!1,comprehensiveConfigDetailVisible:!1,extraTextVisible:!1,comprehensiveDialogStyles:{width:"70%"}}},methods:{changeDialog:function(t){this[t]=!this[t]},tableSizeChange:function(t){this.PageSize=t,this.getContestList()},getSearchContestList:function(){this.PageNow=1,this.getContestList(),this.getStudentList()},changeModalWidth:function(){this.contestConfigShow?this.comprehensiveDialogStyles.width="70%":this.comprehensiveDialogStyles.width="50%"},getContestList:function(){var t=this;this.tableLoading=!0,this.selectedContests=[],g["a"].getContestListByGroupId({pageNow:this.PageNow,pageSize:this.PageSize,groupId:this.selectedGroupId}).then((function(e){t.contests=e.rows,t.total=t.PageSize*e.totalPage})).catch((function(e){t.$Message.error(e.message)})).finally((function(){t.tableLoading=!1}))},getStudentList:function(){var t=this;this.selectedStudent=[],this.allStudent=[],g["a"].getStudentListByGroupId({groupId:this.selectedGroupId}).then((function(e){t.allStudent=e.members,t.allStudent.forEach((function(e){t.selectedStudent.push(e.username)}))})).catch((function(e){t.$Message.error(e.message)}))},selectContest:function(t,e){this.selectedContests.push(e.contestId)},unselectContest:function(t,e){this.selectedContests.splice(this.selectedContests.indexOf(e.contestId),1)},EditConfig:function(t){this.configSelectContest=t.contestId,this.weight="",this.timeCost="",this.outTimeWeight="",this.changeComprehensiveConfigDetailVisible()},changeComprehensiveConfigDetailVisible:function(){this.comprehensiveConfigDetailVisible=!0},pushComprehensiveConfig:function(){this.contestConfig[this.configSelectContest]={contestId:this.configSelectContest,weight:this.recordWeight[this.configSelectContest],timeoutScoreRatio:this.timeWeightDetail}},changeMenuState:function(t){this.contestConfigShow="1"===t,this.studentConfigShow=!this.contestConfigShow,this.changeModalWidth()},unselectStudent:function(t){this.selectedStudent.splice(this.selectedStudent.indexOf(t),1)},handleStudentSelectedChange:function(t,e){t?this.selectedStudent.push(e):this.unselectStudent(e)},addStudentHandin:function(){for(var t=Array.from(new Set(Object(m["a"])(this.handInParticipants,/[\s,]+/).concat(this.selectedStudent))),e=0;e<t.length;e++)-1!==v(this.allStudent,"username",t[e])&&(this.$refs[t[e]+" tag"][0].isChecked||this.$refs[t[e]+" tag"][0].check());this.selectedStudent=t},deleteSelectedTag:function(t){-1!==v(this.allStudent,"username",t)?this.$refs[t+" tag"][0].check():this.unselectStudent(t)},exportComprehensive:function(){var t=this,e=[];this.selectedContests.forEach((function(n){e.push(t.contestConfig[n])}));var n={usernameList:this.selectedStudent,contestList:e};g["a"].exportComprehensive(n).catch((function(e){t.$Message.error(e.message)}))},changeExtraVisible:function(){this.extraTextVisible=!this.extraTextVisible},addTimeWeight:function(){var t;for(t=0;t<this.timeWeightDetail.length;t++)if(this.timeWeightDetail[t][0]>=this.timeCost)break;t<this.timeWeightDetail.length&&this.timeWeightDetail[t][0]===this.timeCost?this.timeWeightDetail[t][1]=parseFloat(this.outTimeWeight):this.timeWeightDetail.splice(t,0,[this.timeCost,parseFloat(this.outTimeWeight)])},deleteTimeConfig:function(t){this.timeWeightDetail.splice(this.timeWeightDetail.indexOf(t),1)}},filters:{getDuration:function(t,e){var n=parseInt(e)-parseInt(t),i=p.a.duration(n,"milliseconds"),o=i.minutes()<10?"0"+i.minutes():i.minutes().toString(),r=i.seconds()<10?"0"+i.seconds():i.seconds().toString();return[Math.floor(i.asHours()),o,r].join(":")},parseInt:function(t){function e(e){return t.apply(this,arguments)}return e.toString=function(){return t.toString()},e}((function(t){return parseInt(t)}))},computed:{CONTEST_OPENNESS:function(){return h["b"]},CONTEST_MODE:function(){return h["a"]},CONTEST_PROBLEM_STATUS:function(){return h["c"]},moment:function(){return p.a}},watch:{}},S=x,C=(n("9983"),Object(l["a"])(S,i,o,!1,null,"21dada1e",null));e["default"]=C.exports},5899:function(t,e){t.exports="\t\n\v\f\r                　\u2028\u2029\ufeff"},"58a8":function(t,e,n){var i=n("1d80"),o=n("5899"),r="["+o+"]",s=RegExp("^"+r+r+"*"),a=RegExp(r+r+"*$"),c=function(t){return function(e){var n=String(i(e));return 1&t&&(n=n.replace(s,"")),2&t&&(n=n.replace(a,"")),n}};t.exports={start:c(1),end:c(2),trim:c(3)}},6062:function(t,e,n){"use strict";var i=n("6d61"),o=n("6566");t.exports=i("Set",(function(t){return function(){return t(this,arguments.length?arguments[0]:void 0)}}),o)},6566:function(t,e,n){"use strict";var i=n("9bf2").f,o=n("7c73"),r=n("e2cc"),s=n("0366"),a=n("19aa"),c=n("2266"),l=n("7dd0"),u=n("2626"),d=n("83ab"),f=n("f183").fastKey,p=n("69f3"),h=p.set,g=p.getterFor;t.exports={getConstructor:function(t,e,n,l){var u=t((function(t,i){a(t,u,e),h(t,{type:e,index:o(null),first:void 0,last:void 0,size:0}),d||(t.size=0),void 0!=i&&c(i,t[l],t,n)})),p=g(e),m=function(t,e,n){var i,o,r=p(t),s=v(t,e);return s?s.value=n:(r.last=s={index:o=f(e,!0),key:e,value:n,previous:i=r.last,next:void 0,removed:!1},r.first||(r.first=s),i&&(i.next=s),d?r.size++:t.size++,"F"!==o&&(r.index[o]=s)),t},v=function(t,e){var n,i=p(t),o=f(e);if("F"!==o)return i.index[o];for(n=i.first;n;n=n.next)if(n.key==e)return n};return r(u.prototype,{clear:function(){var t=this,e=p(t),n=e.index,i=e.first;while(i)i.removed=!0,i.previous&&(i.previous=i.previous.next=void 0),delete n[i.index],i=i.next;e.first=e.last=void 0,d?e.size=0:t.size=0},delete:function(t){var e=this,n=p(e),i=v(e,t);if(i){var o=i.next,r=i.previous;delete n.index[i.index],i.removed=!0,r&&(r.next=o),o&&(o.previous=r),n.first==i&&(n.first=o),n.last==i&&(n.last=r),d?n.size--:e.size--}return!!i},forEach:function(t){var e,n=p(this),i=s(t,arguments.length>1?arguments[1]:void 0,3);while(e=e?e.next:n.first){i(e.value,e.key,this);while(e&&e.removed)e=e.previous}},has:function(t){return!!v(this,t)}}),r(u.prototype,n?{get:function(t){var e=v(this,t);return e&&e.value},set:function(t,e){return m(this,0===t?0:t,e)}}:{add:function(t){return m(this,t=0===t?0:t,t)}}),d&&i(u.prototype,"size",{get:function(){return p(this).size}}),u},setStrong:function(t,e,n){var i=e+" Iterator",o=g(e),r=g(i);l(t,e,(function(t,e){h(this,{type:i,target:t,state:o(t),kind:e,last:void 0})}),(function(){var t=r(this),e=t.kind,n=t.last;while(n&&n.removed)n=n.previous;return t.target&&(t.last=n=n?n.next:t.state.first)?"keys"==e?{value:n.key,done:!1}:"values"==e?{value:n.value,done:!1}:{value:[n.key,n.value],done:!1}:(t.target=void 0,{value:void 0,done:!0})}),n?"entries":"values",!n,!0),u(e)}}},"6d61":function(t,e,n){"use strict";var i=n("23e7"),o=n("da84"),r=n("94ca"),s=n("6eeb"),a=n("f183"),c=n("2266"),l=n("19aa"),u=n("861d"),d=n("d039"),f=n("1c7e"),p=n("d44e"),h=n("7156");t.exports=function(t,e,n){var g=-1!==t.indexOf("Map"),m=-1!==t.indexOf("Weak"),v=g?"set":"add",x=o[t],S=x&&x.prototype,C=x,b={},E=function(t){var e=S[t];s(S,t,"add"==t?function(t){return e.call(this,0===t?0:t),this}:"delete"==t?function(t){return!(m&&!u(t))&&e.call(this,0===t?0:t)}:"get"==t?function(t){return m&&!u(t)?void 0:e.call(this,0===t?0:t)}:"has"==t?function(t){return!(m&&!u(t))&&e.call(this,0===t?0:t)}:function(t,n){return e.call(this,0===t?0:t,n),this})};if(r(t,"function"!=typeof x||!(m||S.forEach&&!d((function(){(new x).entries().next()})))))C=n.getConstructor(e,t,g,v),a.REQUIRED=!0;else if(r(t,!0)){var y=new C,I=y[v](m?{}:-0,1)!=y,w=d((function(){y.has(1)})),T=f((function(t){new x(t)})),D=!m&&d((function(){var t=new x,e=5;while(e--)t[v](e,e);return!t.has(-0)}));T||(C=e((function(e,n){l(e,C,t);var i=h(new x,e,C);return void 0!=n&&c(n,i[v],i,g),i})),C.prototype=S,S.constructor=C),(w||D)&&(E("delete"),E("has"),g&&E("get")),(D||I)&&E(v),m&&S.clear&&delete S.clear}return b[t]=C,i({global:!0,forced:C!=x},b),p(C,t),m||n.setStrong(C,t,g),C}},7156:function(t,e,n){var i=n("861d"),o=n("d2bb");t.exports=function(t,e,n){var r,s;return o&&"function"==typeof(r=e.constructor)&&r!==n&&i(s=r.prototype)&&s!==n.prototype&&o(t,s),t}},"8aa5":function(t,e,n){"use strict";var i=n("6547").charAt;t.exports=function(t,e,n){return e+(n?i(t,e).length:1)}},9263:function(t,e,n){"use strict";var i=n("ad6d"),o=n("9f7f"),r=RegExp.prototype.exec,s=String.prototype.replace,a=r,c=function(){var t=/a/,e=/b*/g;return r.call(t,"a"),r.call(e,"a"),0!==t.lastIndex||0!==e.lastIndex}(),l=o.UNSUPPORTED_Y||o.BROKEN_CARET,u=void 0!==/()??/.exec("")[1],d=c||u||l;d&&(a=function(t){var e,n,o,a,d=this,f=l&&d.sticky,p=i.call(d),h=d.source,g=0,m=t;return f&&(p=p.replace("y",""),-1===p.indexOf("g")&&(p+="g"),m=String(t).slice(d.lastIndex),d.lastIndex>0&&(!d.multiline||d.multiline&&"\n"!==t[d.lastIndex-1])&&(h="(?: "+h+")",m=" "+m,g++),n=new RegExp("^(?:"+h+")",p)),u&&(n=new RegExp("^"+h+"$(?!\\s)",p)),c&&(e=d.lastIndex),o=r.call(f?n:d,m),f?o?(o.input=o.input.slice(g),o[0]=o[0].slice(g),o.index=d.lastIndex,d.lastIndex+=o[0].length):d.lastIndex=0:c&&o&&(d.lastIndex=d.global?o.index+o[0].length:e),u&&o&&o.length>1&&s.call(o[0],n,(function(){for(a=1;a<arguments.length-2;a++)void 0===arguments[a]&&(o[a]=void 0)})),o}),t.exports=a},9983:function(t,e,n){"use strict";var i=n("089b"),o=n.n(i);o.a},"99af":function(t,e,n){"use strict";var i=n("23e7"),o=n("d039"),r=n("e8b5"),s=n("861d"),a=n("7b0b"),c=n("50c4"),l=n("8418"),u=n("65f0"),d=n("1dde"),f=n("b622"),p=n("2d00"),h=f("isConcatSpreadable"),g=9007199254740991,m="Maximum allowed index exceeded",v=p>=51||!o((function(){var t=[];return t[h]=!1,t.concat()[0]!==t})),x=d("concat"),S=function(t){if(!s(t))return!1;var e=t[h];return void 0!==e?!!e:r(t)},C=!v||!x;i({target:"Array",proto:!0,forced:C},{concat:function(t){var e,n,i,o,r,s=a(this),d=u(s,0),f=0;for(e=-1,i=arguments.length;e<i;e++)if(r=-1===e?s:arguments[e],S(r)){if(o=c(r.length),f+o>g)throw TypeError(m);for(n=0;n<o;n++,f++)n in r&&l(d,f,r[n])}else{if(f>=g)throw TypeError(m);l(d,f++,r)}return d.length=f,d}})},"9d66":function(t,e,n){},"9f7f":function(t,e,n){"use strict";var i=n("d039");function o(t,e){return RegExp(t,e)}e.UNSUPPORTED_Y=i((function(){var t=o("a","y");return t.lastIndex=2,null!=t.exec("abcd")})),e.BROKEN_CARET=i((function(){var t=o("^r","gy");return t.lastIndex=2,null!=t.exec("str")}))},a434:function(t,e,n){"use strict";var i=n("23e7"),o=n("23cb"),r=n("a691"),s=n("50c4"),a=n("7b0b"),c=n("65f0"),l=n("8418"),u=n("1dde"),d=n("ae40"),f=u("splice"),p=d("splice",{ACCESSORS:!0,0:0,1:2}),h=Math.max,g=Math.min,m=9007199254740991,v="Maximum allowed length exceeded";i({target:"Array",proto:!0,forced:!f||!p},{splice:function(t,e){var n,i,u,d,f,p,x=a(this),S=s(x.length),C=o(t,S),b=arguments.length;if(0===b?n=i=0:1===b?(n=0,i=S-C):(n=b-2,i=g(h(r(e),0),S-C)),S+n-i>m)throw TypeError(v);for(u=c(x,i),d=0;d<i;d++)f=C+d,f in x&&l(u,d,x[f]);if(u.length=i,n<i){for(d=C;d<S-i;d++)f=d+i,p=d+n,f in x?x[p]=x[f]:delete x[p];for(d=S;d>S-i+n;d--)delete x[d-1]}else if(n>i)for(d=S-i;d>C;d--)f=d+i-1,p=d+n-1,f in x?x[p]=x[f]:delete x[p];for(d=0;d<n;d++)x[d+C]=arguments[d+2];return x.length=S-i+n,u}})},a630:function(t,e,n){var i=n("23e7"),o=n("4df4"),r=n("1c7e"),s=!r((function(t){Array.from(t)}));i({target:"Array",stat:!0,forced:s},{from:o})},ac1f:function(t,e,n){"use strict";var i=n("23e7"),o=n("9263");i({target:"RegExp",proto:!0,forced:/./.exec!==o},{exec:o})},bb2f:function(t,e,n){var i=n("d039");t.exports=!i((function(){return Object.isExtensible(Object.preventExtensions({}))}))},c9d9:function(t,e,n){"use strict";n.d(e,"b",(function(){return a})),n.d(e,"a",(function(){return c})),n.d(e,"h",(function(){return l})),n.d(e,"g",(function(){return u})),n.d(e,"l",(function(){return d})),n.d(e,"e",(function(){return f})),n.d(e,"d",(function(){return p})),n.d(e,"f",(function(){return h})),n.d(e,"c",(function(){return g})),n.d(e,"j",(function(){return m})),n.d(e,"i",(function(){return v})),n.d(e,"k",(function(){return x}));var i,o,r,s=n("ade3"),a={PUBLIC:{title:"public",hint:"Public: Anyone can participate in"},PROTECTED:{title:"protected",hint:"Protected: Problems are public but password is needed for submissions",lockColor:"orange"},PRIVATE:{title:"private",hint:"Private: Password is needed for both problems and submissions",lockColor:"#d9534f"}},c={ACM:"acm",OI:"oi",IOI:"ioi"},l={IO:0,SPJ:1,ADVANCED:2},u=(i={},Object(s["a"])(i,l.IO,{type:0,name:"IO",color:"blue",zipFile:!1}),Object(s["a"])(i,l.SPJ,{type:1,name:"SPJ",color:"gold",zipFile:!0}),Object(s["a"])(i,l.ADVANCED,{type:2,name:"Advanced",color:"purple",zipFile:!0}),i),d={user:{color:"default",isAdmin:!1},admin:{color:"gold",isAdmin:!0},superadmin:{color:"volcano",isAdmin:!0}},f={PUBLIC:0,PROTECTED:1,PRIVATE:2},p=(o={},Object(s["a"])(o,f.PUBLIC,{title:"Public",description:"Anybody can join in"}),Object(s["a"])(o,f.PROTECTED,{title:"Apply",description:"Need the administrator audit"}),Object(s["a"])(o,f.PRIVATE,{title:"Private",description:"Nobody can join in"}),o),h={NONE:0,APPLIED:1,JOINED:2,REJECTED:3},g={INIT:0,READY:1,FAILED:2},m={DEFAULT:"",DOS2UNIX:"dos2unix",UNIX2DOS:"unix2dos"},v=(r={},Object(s["a"])(r,m.DOS2UNIX,{name:m.DOS2UNIX,description:"Convert DOS(CR-LF) to UNIX(LF)"}),Object(s["a"])(r,m.UNIX2DOS,{name:m.UNIX2DOS,description:"Convert UNIX(LF) to DOS(CR-LF)"}),Object(s["a"])(r,m.DEFAULT,{name:m.DEFAULT,description:"Do not convert"}),r),x=[{name:"lcmp.cpp",description:"Lines, ignores whitespaces"},{name:"hcmp.cpp",description:"Single huge integer"},{name:"ncmp.cpp",description:"Single or more int64, ignores whitespaces"},{name:"nyesno.cpp",description:"Zero or more yes/no, case insensitive"},{name:"rcmp4.cpp",description:"Single or more double, max any error 1E-4"},{name:"rcmp6.cpp",description:"Single or more double, max any error 1E-6"},{name:"rcmp9.cpp",description:"Single or more double, max any error 1E-9"},{name:"wcmp.cpp",description:"Sequence of tokens"},{name:"yesno.cpp",description:"Single yes or no, case insensitive"}]},ccc8:function(t,e,n){"use strict";var i=n("9d66"),o=n.n(i);o.a},d784:function(t,e,n){"use strict";n("ac1f");var i=n("6eeb"),o=n("d039"),r=n("b622"),s=n("9263"),a=n("9112"),c=r("species"),l=!o((function(){var t=/./;return t.exec=function(){var t=[];return t.groups={a:"7"},t},"7"!=="".replace(t,"$<a>")})),u=function(){return"$0"==="a".replace(/./,"$0")}(),d=r("replace"),f=function(){return!!/./[d]&&""===/./[d]("a","$0")}(),p=!o((function(){var t=/(?:)/,e=t.exec;t.exec=function(){return e.apply(this,arguments)};var n="ab".split(t);return 2!==n.length||"a"!==n[0]||"b"!==n[1]}));t.exports=function(t,e,n,d){var h=r(t),g=!o((function(){var e={};return e[h]=function(){return 7},7!=""[t](e)})),m=g&&!o((function(){var e=!1,n=/a/;return"split"===t&&(n={},n.constructor={},n.constructor[c]=function(){return n},n.flags="",n[h]=/./[h]),n.exec=function(){return e=!0,null},n[h](""),!e}));if(!g||!m||"replace"===t&&(!l||!u||f)||"split"===t&&!p){var v=/./[h],x=n(h,""[t],(function(t,e,n,i,o){return e.exec===s?g&&!o?{done:!0,value:v.call(e,n,i)}:{done:!0,value:t.call(n,e,i)}:{done:!1}}),{REPLACE_KEEPS_$0:u,REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE:f}),S=x[0],C=x[1];i(String.prototype,t,S),i(RegExp.prototype,h,2==e?function(t,e){return C.call(t,this,e)}:function(t){return C.call(t,this)})}d&&a(RegExp.prototype[h],"sham",!0)}},f183:function(t,e,n){var i=n("d012"),o=n("861d"),r=n("5135"),s=n("9bf2").f,a=n("90e3"),c=n("bb2f"),l=a("meta"),u=0,d=Object.isExtensible||function(){return!0},f=function(t){s(t,l,{value:{objectID:"O"+ ++u,weakData:{}}})},p=function(t,e){if(!o(t))return"symbol"==typeof t?t:("string"==typeof t?"S":"P")+t;if(!r(t,l)){if(!d(t))return"F";if(!e)return"E";f(t)}return t[l].objectID},h=function(t,e){if(!r(t,l)){if(!d(t))return!0;if(!e)return!1;f(t)}return t[l].weakData},g=function(t){return c&&m.REQUIRED&&d(t)&&!r(t,l)&&f(t),t},m=t.exports={REQUIRED:!1,fastKey:p,getWeakData:h,onFreeze:g};i[l]=!0}}]);
//# sourceMappingURL=chunk-cd829c00.93b77238.js.map