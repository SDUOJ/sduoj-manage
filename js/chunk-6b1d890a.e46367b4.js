(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-6b1d890a"],{"0f48":function(t,e,o){"use strict";o.r(e);var n=function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("div",[o("Card",{attrs:{"dis-hover":!0}},[o("p",{attrs:{slot:"title"},slot:"title"},[t._v("Contest")]),o("Table",{staticClass:"content-table",attrs:{columns:t.contestColumns,data:t.contests,loading:t.tableLoading},on:{"on-selection-change":t.onSelect,"on-sort-change":t.onSort},scopedSlots:t._u([{key:"title",fn:function(e){var n=e.row;return[o("span",[t._v(t._s(n.contestTitle))]),n.features.openness===t.CONTEST_OPENNESS.PRIVATE.title?o("Icon",{attrs:{color:t.CONTEST_OPENNESS.PRIVATE.lockColor,type:"md-lock",size:"19"}}):n.features.openness===t.CONTEST_OPENNESS.PROTECTED?o("Icon",{attrs:{color:t.CONTEST_OPENNESS.PROTECTED.lockColor,type:"md-lock",size:"19"}}):t._e(),0===n.isPublic?o("Tag",{staticStyle:{"margin-left":"5px"},attrs:{color:"volcano"}},[t._v("Private")]):t._e()]}},{key:"time",fn:function(e){var n=e.row;return[o("Time",{attrs:{time:t._f("parseInt")(n.gmtStart),type:"datetime"}})]}},{key:"duration",fn:function(e){var n=e.row;return[o("span",[t._v(t._s(t._f("getDuration")(n.gmtStart,n.gmtEnd)))])]}},{key:"mode",fn:function(e){var n=e.row;return[o("span",[t._v(t._s(n.features.mode.toUpperCase()))])]}},{key:"group",fn:function(e){var n=e.row;return[n.managerGroupDTO?o("span",[t._v(t._s(n.managerGroupDTO.groupId+" ("+n.managerGroupDTO.title+")"))]):t._e()]}},{key:"action",fn:function(e){var n=e.row;return[o("a",{attrs:{href:"#"},on:{click:function(e){return e.preventDefault(),t.onEditContest(n.contestId,!1)}}},[t._v("Edit")]),o("Divider",{attrs:{type:"vertical"}}),o("a",{attrs:{href:"#"},on:{click:function(e){return e.preventDefault(),t.onEditContest(n.contestId,!0)}}},[t._v("Fork")])]}}])})],1),o("div",{staticClass:"footer-tools"},[o("Button",{staticClass:"footer-btn float-left",attrs:{type:"default",size:"small"},on:{click:t.onAddContest}},[t._v("Add")]),o("Page",{staticClass:"float-right",attrs:{size:"small","show-elevator":"","show-sizer":"",total:t.total,current:t.pageNow,"page-size":t.pageSize,"page-size-opts":t.pageSizeOpts},on:{"update:current":function(e){t.pageNow=e},"on-change":t.onPageChange,"on-page-size-change":t.onPageSizeChange}})],1),o("Modal",{attrs:{width:"80%","mask-closable":!1,loading:t.contestModalLoading,title:t.isAddContest?"Add Contest":"Edit Contest (Contest ID: "+t.contest.contestId+")"},on:{"on-ok":t.updateContest},model:{value:t.contestModal,callback:function(e){t.contestModal=e},expression:"contestModal"}},[o("Form",{attrs:{model:t.contest}},[o("Tabs",{attrs:{animated:!1},model:{value:t.tabName,callback:function(e){t.tabName=e},expression:"tabName"}},[o("TabPane",{attrs:{label:t.tabLabels.basic,name:"basic"}},[o("FormItem",{attrs:{label:"Title",prop:"contestTitle",required:""}},[o("Input",{model:{value:t.contest.contestTitle,callback:function(e){t.$set(t.contest,"contestTitle",e)},expression:"contest.contestTitle"}})],1),o("FormItem",{attrs:{label:"Mode",required:""}},[o("RadioGroup",{model:{value:t.contest.features.mode,callback:function(e){t.$set(t.contest.features,"mode",e)},expression:"contest.features.mode"}},t._l(t.CONTEST_MODE,(function(e){return o("Radio",{key:e,attrs:{label:e}},[t._v(t._s(e.toUpperCase()))])})),1)],1),o("FormItem",{attrs:{label:"Public",required:""}},[o("i-switch",{attrs:{"true-value":1,"false-value":0},model:{value:t.contest.isPublic,callback:function(e){t.$set(t.contest,"isPublic",e)},expression:"contest.isPublic"}})],1),o("FormItem",{attrs:{label:"Openness",required:""}},[o("Select",{attrs:{placeholder:t.contest.features.openness},model:{value:t.contest.features.openness,callback:function(e){t.$set(t.contest.features,"openness",e)},expression:"contest.features.openness"}},t._l(t.CONTEST_OPENNESS,(function(e){return o("Option",{key:e.title,attrs:{value:e.title}},[t._v(t._s(e.hint))])})),1)],1),t.contest.features.openness!==t.CONTEST_OPENNESS.PUBLIC.title?o("FormItem",{attrs:{label:"Password",required:""}},[o("Input",{model:{value:t.contest.password,callback:function(e){t.$set(t.contest,"password",e)},expression:"contest.password"}})],1):t._e(),o("Row",[o("Col",{attrs:{span:"10"}},[o("FormItem",{attrs:{label:"Start",required:""}},[o("DatePicker",{staticStyle:{width:"200px"},attrs:{transfer:"",type:"datetime",format:"yyyy-MM-dd HH:mm:ss",value:t.contest.gmtStart,disabled:!t.isAddContest&&t.moment()>t.contest.gmtStart},on:{"on-change":t.changeGmtStart}})],1)],1),o("Col",{attrs:{span:"14"}},[o("FormItem",{attrs:{label:"Duration",required:""}},[o("InputNumber",{attrs:{min:1},model:{value:t.gmtLength,callback:function(e){t.gmtLength=e},expression:"gmtLength"}})],1)],1)],1),o("FormItem",{attrs:{label:"End",required:""}},[o("DatePicker",{staticStyle:{width:"200px"},attrs:{transfer:"",type:"datetime",format:"yyyy-MM-dd HH:mm:ss",value:t.contest.gmtEnd},on:{"on-change":t.changeGmtEnd}})],1),o("FormItem",{attrs:{label:"Source",prop:"source"}},[o("Input",{model:{value:t.contest.source,callback:function(e){t.$set(t.contest,"source",e)},expression:"contest.source"}})],1),o("FormItem",{attrs:{label:"Announcement"}},[o("MarkdownEditor",{ref:"md"})],1)],1),o("TabPane",{attrs:{label:t.tabLabels.manage,name:"manage"}},[o("FormItem",{attrs:{label:"Frozen",required:""}},[o("InputNumber",{attrs:{min:0},model:{value:t.contest.features.frozenTime,callback:function(e){t.$set(t.contest.features,"frozenTime",e)},expression:"contest.features.frozenTime"}})],1),o("FormItem",{attrs:{label:"While Running"}},[o("Checkbox",{attrs:{"true-value":1,"false-value":0},model:{value:t.contest.features.contestRunning.displayPeerSubmission,callback:function(e){t.$set(t.contest.features.contestRunning,"displayPeerSubmission",e)},expression:"contest.features.contestRunning.displayPeerSubmission"}},[t._v("Show Peer Submission")]),o("Checkbox",{attrs:{"true-value":1,"false-value":0},model:{value:t.contest.features.contestRunning.displayRank,callback:function(e){t.$set(t.contest.features.contestRunning,"displayRank",e)},expression:"contest.features.contestRunning.displayRank"}},[t._v("Show Rank")]),o("Checkbox",{attrs:{"true-value":1,"false-value":0},model:{value:t.contest.features.contestRunning.displayJudgeScore,callback:function(e){t.$set(t.contest.features.contestRunning,"displayJudgeScore",e)},expression:"contest.features.contestRunning.displayJudgeScore"}},[t._v("Show Judge Score")]),o("Checkbox",{attrs:{"true-value":1,"false-value":0},model:{value:t.contest.features.contestRunning.displayCheckpointResult,callback:function(e){t.$set(t.contest.features.contestRunning,"displayCheckpointResult",e)},expression:"contest.features.contestRunning.displayCheckpointResult"}},[t._v("Show Checkpoint Results")]),o("Checkbox",{attrs:{"true-value":1,"false-value":0},model:{value:t.contest.features.contestRunning.allowToSubmit,callback:function(e){t.$set(t.contest.features.contestRunning,"allowToSubmit",e)},expression:"contest.features.contestRunning.allowToSubmit"}},[t._v("Allow to Submit")])],1),o("FormItem",{attrs:{label:"After Finished"}},[o("Checkbox",{attrs:{"true-value":1,"false-value":0},model:{value:t.contest.features.contestEnd.displayPeerSubmission,callback:function(e){t.$set(t.contest.features.contestEnd,"displayPeerSubmission",e)},expression:"contest.features.contestEnd.displayPeerSubmission"}},[t._v("Show Peer Submission")]),o("Checkbox",{attrs:{"true-value":1,"false-value":0},model:{value:t.contest.features.contestEnd.displayRank,callback:function(e){t.$set(t.contest.features.contestEnd,"displayRank",e)},expression:"contest.features.contestEnd.displayRank"}},[t._v("Show Rank")]),o("Checkbox",{attrs:{"true-value":1,"false-value":0},model:{value:t.contest.features.contestEnd.displayJudgeScore,callback:function(e){t.$set(t.contest.features.contestEnd,"displayJudgeScore",e)},expression:"contest.features.contestEnd.displayJudgeScore"}},[t._v("Show Judge Score")]),o("Checkbox",{attrs:{"true-value":1,"false-value":0},model:{value:t.contest.features.contestEnd.displayCheckpointResult,callback:function(e){t.$set(t.contest.features.contestEnd,"displayCheckpointResult",e)},expression:"contest.features.contestEnd.displayCheckpointResult"}},[t._v("Show Checkpoint Results")]),o("Checkbox",{attrs:{"true-value":1,"false-value":0},model:{value:t.contest.features.contestEnd.allowToSubmit,callback:function(e){t.$set(t.contest.features.contestEnd,"allowToSubmit",e)},expression:"contest.features.contestEnd.allowToSubmit"}},[t._v("Allow to Submit")])],1),o("FormItem",{attrs:{label:"Participants"}},[o("span",{staticClass:"hint-text"},[t._v("Separate username by a TAB '\\t', SPACE ' ', NEW LINE '\\n' or COMMA ','")]),o("Input",{attrs:{type:"textarea",autosize:{minRows:3}},model:{value:t.contest.participants,callback:function(e){t.$set(t.contest,"participants",e)},expression:"contest.participants"}})],1),o("FormItem",{attrs:{label:"Unofficial Participants",prop:"unofficialParticipants"}},[o("span",{staticClass:"hint-text"},[t._v("Separate username by a TAB '\\t', SPACE ' ', NEW LINE '\\n' or COMMA ','")]),o("Input",{attrs:{type:"textarea",autosize:{minRows:3}},model:{value:t.contest.unofficialParticipants,callback:function(e){t.$set(t.contest,"unofficialParticipants",e)},expression:"contest.unofficialParticipants"}})],1),t.contestModal?o("FormItem",{attrs:{label:"Manager Group"}},[o("Select",{staticStyle:{width:"200px"},attrs:{transfer:"",clearable:"",filterable:"",loading:t.managerGroupQueryLoading,"remote-method":t.queryManagerGroups,label:t.contest.managerGroupDTO?t.contest.managerGroupDTO.groupId+": "+t.contest.managerGroupDTO.title:""},model:{value:t.contest.groupId,callback:function(e){t.$set(t.contest,"groupId",e)},expression:"contest.groupId"}},t._l(t.managerGroupSet,(function(t){return o("Option",{key:t.groupId,attrs:{value:t.groupId,label:t.groupId+": "+t.title}})})),1)],1):t._e(),t.contestModal?o("FormItem",{attrs:{label:"Participating Groups"}},[o("span",{staticClass:"hint-text"},[t._v("Members of these groups can participate contest without password")]),o("Select",{attrs:{transfer:"",multiple:"",filterable:"",loading:t.participatingGroupQueryLoading,"remote-method":t.queryParticipatingGroups,"default-label":(t.contest.participatingGroupDTOList||[]).map((function(t){return t.groupId+": "+t.title}))},on:{"on-set-default-options":t.setParticipatingGroupSet},model:{value:t.contest.participatingGroups,callback:function(e){t.$set(t.contest,"participatingGroups",e)},expression:"contest.participatingGroups"}},t._l(t.participatingGroupSet,(function(t){return o("Option",{key:t.groupId,attrs:{value:t.groupId,label:t.groupId+": "+t.title}})})),1)],1):t._e()],1),o("TabPane",{attrs:{label:t.tabLabels.problem,name:"problem"}},[o("FormItem",{attrs:{prop:"problems"}},[o("Table",{staticClass:"modal-form-problem",attrs:{"disabled-hover":"","max-height":600,columns:t.problemColumns,data:t.contest.problems},scopedSlots:t._u([{key:"deleteProblem",fn:function(e){var n=e.index;return[o("span",{staticClass:"hover",on:{click:function(e){return t.changeProblemIndex(n,1)}}},[o("Icon",{attrs:{type:"md-arrow-down"}})],1),o("span",{staticClass:"hover",staticStyle:{margin:"0 5px"},on:{click:function(e){return t.changeProblemIndex(n,-1)}}},[o("Icon",{attrs:{type:"md-arrow-up"}})],1),o("span",{staticClass:"hover",on:{click:function(e){return t.deleteProblem(n)}}},[o("Icon",{attrs:{type:"md-remove",color:"#CD6155"}})],1)]}},{key:"index",fn:function(e){var n=e.index;return[o("span",[t._v(t._s(t._f("problemEncode")(n)))])]}},{key:"problemCode",fn:function(e){var n=e.row,s=e.index;return[o("Input",{on:{"on-focus":function(t){n.oldProblemCode=n.problemCode},"on-keypress":function(e){return!e.type.indexOf("key")&&t._k(e.keyCode,"enter",13,e.key,"Enter")?null:t.updateProblem(n,s,"problemCode")},"on-blur":function(e){return t.updateProblem(n,s,"problemCode")}},model:{value:n.problemCode,callback:function(e){t.$set(n,"problemCode",e)},expression:"row.problemCode"}})]}},{key:"problemTitle",fn:function(e){var n=e.row,s=e.index;return[o("Input",{on:{"on-change":function(e){return t.updateProblem(n,s,"problemTitle")}},model:{value:n.problemTitle,callback:function(e){t.$set(n,"problemTitle",e)},expression:"row.problemTitle"}})]}},{key:"problemWeight",fn:function(e){var n=e.row,s=e.index;return[o("InputNumber",{attrs:{min:0},on:{"on-change":function(e){return t.updateProblem(n,s,"problemWeight")}},model:{value:n.problemWeight,callback:function(e){t.$set(n,"problemWeight",e)},expression:"row.problemWeight"}})]}},{key:"problemDescriptionId",fn:function(e){var n=e.row,s=e.index;return[n.$ready===t.CONTEST_PROBLEM_STATUS.INIT?o("div",{staticStyle:{position:"relative",top:"3px"}},[o("Loading")],1):o("Select",{attrs:{transfer:""},on:{"on-change":function(e){return t.updateProblem(n,s,"problemDescriptionId")}},model:{value:n.problemDescriptionId,callback:function(e){t.$set(n,"problemDescriptionId",e)},expression:"row.problemDescriptionId"}},t._l(n.problemDescriptionList,(function(t){return o("Option",{key:t.id,attrs:{value:t.id,label:t.title}})})),1)]}},{key:"color",fn:function(e){var n=e.row,s=e.index;return[o("ColorPicker",{attrs:{transfer:""},on:{"on-change":function(e){return t.updateProblem(n,s,"problemColor")}},model:{value:n.problemColor,callback:function(e){t.$set(n,"problemColor",e)},expression:"row.problemColor"}})]}},{key:"check",fn:function(e){var n=e.row;return[n.$ready===t.CONTEST_PROBLEM_STATUS.INIT?o("div",{staticStyle:{position:"relative",top:"3px"}},[o("Loading")],1):n.$ready===t.CONTEST_PROBLEM_STATUS.READY?o("Icon",{attrs:{type:"md-checkmark",color:"#50ad56"}}):o("Icon",{attrs:{type:"md-close",color:"#CD6155"}})]}}])})],1)],1)],1)],1)],1)],1)},s=[],r=(o("4160"),o("caad"),o("a15b"),o("d81d"),o("a434"),o("d3b7"),o("ac1f"),o("25f0"),o("2532"),o("1276"),o("159b"),o("5530")),a=o("c1df"),i=o.n(a),c=o("e325"),l=function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("div",{style:"position: relative; width: "+(t.size+5)+"px; height: "+(t.size+5)+"px"},[o("Spin",{attrs:{fix:""}},[o("Icon",{staticClass:"spin-icon-load",attrs:{type:"ios-loading",size:t.size}})],1)],1)},u=[],p=(o("a9e3"),{name:"Loading",props:{size:{type:Number,default:18}}}),d=p,m=(o("690a"),o("2877")),b=Object(m["a"])(d,l,u,!1,null,"117a8760",null),f=b.exports,g=o("fa70"),h=o("7c15"),v=o("33e8"),S=o("c9d9");function y(t){t=parseInt(t);var e=[];do{var o=t%26;0===e.length?e.push(String.fromCharCode(65+o)):e.push(String.fromCharCode(64+o)),t=parseInt(t/26)}while(t>0);return e.reverse().join("")}var C={name:"ContestListView",mixins:[c["b"]],components:{Loading:f,MarkdownEditor:g["a"]},data:function(){var t=this;return{contestColumns:[{key:"contestId",maxWidth:80},{title:"Title",slot:"title",minWidth:150},{title:"Start",key:"gmtStart",sortable:"custom",width:200,slot:"time"},{title:"Duration",sortable:"custom",slot:"duration"},{title:"Mode",key:"mode",sortable:"custom",slot:"mode"},{title:"Participants",key:"participantNum",width:140,sortable:"custom"},{title:"Manager Group",slot:"group",minWidth:100},{title:"Owner",key:"username"},{title:"\b",slot:"action"}],problemColumns:[{title:"\b",width:100,align:"right",slot:"deleteProblem",renderHeader:function(e){return e("Icon",{class:"hover",props:{type:"md-add",color:"green"},on:{click:t.addProblem}})}},{width:80,slot:"index"},{title:"Problem",minWidth:150,slot:"problemCode"},{title:"Alias",minWidth:150,slot:"problemTitle"},{title:"Description",minWidth:150,slot:"problemDescriptionId"},{title:"Weight",width:100,slot:"problemWeight"},{title:"Color",slot:"color"},{title:"\b",width:70,slot:"check"}],contests:[],contest:{features:{contestEnd:{},contestRunning:{}},groupId:"",problems:[]},selectedContests:[],contestModal:!1,contestModalLoading:!0,tableLoading:!1,isAddContest:!1,tabErrors:{basic:!1,manage:!1,problem:!0},tabName:"basic",managerGroupQueryLoading:!1,participatingGroupQueryLoading:!1,managerGroupSet:[],participatingGroupSet:[]}},filters:{getDuration:function(t,e){var o=parseInt(e)-parseInt(t),n=i.a.duration(o,"milliseconds"),s=n.minutes()<10?"0"+n.minutes():n.minutes().toString(),r=n.seconds()<10?"0"+n.seconds():n.seconds().toString();return[Math.floor(n.asHours()),s,r].join(":")},parseInt:function(t){function e(e){return t.apply(this,arguments)}return e.toString=function(){return t.toString()},e}((function(t){return parseInt(t)})),problemEncode:function(t){return y(t)}},methods:{changeGmtStart:function(t){this.contest.gmtStart=t,new Date(this.contest.gmtEnd)<new Date(t)&&(this.contest.gmtEnd=t)},changeGmtEnd:function(t){this.contest.gmtEnd=t},onSelect:function(t){this.selectedContests=t},openModal:function(){this.tabErrors.basic=!1,this.tabErrors.manage=!1,this.tabErrors.problem=!1,this.tabName="basic",this.contestModal=!0},onAddContest:function(){var t=6e5*Math.ceil((new Date).getTime()/6e5);this.contest={contestTitle:"",isPublic:1,features:{mode:S["a"].ACM,openness:S["b"].PUBLIC.title,frozenTime:0,contestRunning:{displayPeerSubmission:1,displayRank:1,displayJudgeScore:1,displayCheckpointResult:1,allowToSubmit:1},contestEnd:{displayPeerSubmission:1,displayRank:1,displayJudgeScore:1,displayCheckpointResult:1,allowToSubmit:1}},managerGroupDTO:{},gmtStart:i()(t).format("yyyy-MM-DD HH:mm:ss"),gmtEnd:i()(t).format("yyyy-MM-DD HH:mm:ss"),source:"",markdownDescription:"",problems:[],participants:"",unofficialParticipants:"",password:"",participatingGroups:[],groupId:""},this.$refs.md.setMarkdown(""),this.isAddContest=!0,this.openModal()},onEditContest:function(t,e){var o=this,n=this.$Message.loading({content:"Loading",duration:0});h["a"].getContest({contestId:t}).then((function(t){o.contest=t,o.contest.gmtStart=new Date(parseInt(t.gmtStart)),o.contest.gmtEnd=new Date(parseInt(t.gmtEnd)),o.contest.participants=t.participants.join(","),o.contest.unofficialParticipants=t.unofficialParticipants.join(","),o.$refs.md.setMarkdown(o.contest.markdownDescription),o.contest.problems.forEach((function(t){o.$set(t,"$ready",S["c"].INIT),o.$set(t,"problemDescriptionList",[]),o.getProblemDescriptionList(t)})),o.managerGroupSet=[],o.contest.managerGroupDTO&&o.managerGroupSet.push(o.contest.managerGroupDTO),o.isAddContest=e,o.openModal()})).catch((function(t){o.$Message.error(t.message)})).finally((function(){n()}))},changeProblemIndex:function(t,e){if(!(0===t&&-1===e||t===this.contest.problems.length-1&&1===e)){var o=Object(r["a"])({},this.contest.problems[t]);this.$set(this.contest.problems,t,this.contest.problems[t+e]),this.$set(this.contest.problems,t+e,o)}},addProblem:function(){var t="";if(this.contest.problems.length>0){var e=this.contest.problems[this.contest.problems.length-1].problemCode.split("-");2===e.length&&(e[1]=(parseInt(e[1])+1).toString()),t=e.join("-")}var o={problemCode:t,problemTitle:"",problemWeight:1,problemSearch:0,problemDescriptionId:"",problemDescriptionList:[],problemColor:"",oldProblemCode:"",$ready:S["c"].INIT},n=this.contest.problems.length;this.contest.problems.push(o),this.updateProblem(o,n,"problemCode")},deleteProblem:function(t){this.contest.problems.splice(t,1)},updateProblem:function(t,e,o){var n=this;switch(o){case"problemCode":if(!t.problemCode||t.oldProblemCode===t.problemCode)return;t.oldProblemCode=t.problemCode,h["a"].getProblem({problemCode:t.problemCode}).then((function(e){t.$ready=S["c"].INIT,t.problemDescriptionId="",t.problemWeight=1,t.problemTitle=e.problemTitle,n.getProblemDescriptionList(t).catch((function(e){t.problemTitle="",t.problemDescriptionId="",t.problemDescriptionList=[]}))})).catch((function(e){n.$Message.error(e.message),t.$ready=S["c"].FAILED,t.problemTitle="",t.problemDescriptionId="",t.problemDescriptionList=[]}));break;case"problemTitle":case"problemWeight":case"problemDescriptionId":case"problemColor":break;default:break}this.contest.problems[e]=t,this.contest.problems.splice(0,0)},updateContest:function(){var t=this;if(!this.validateUnofficialParticipants()||!this.validateProblems())return this.contestModalLoading=!1,void this.$nextTick((function(){t.contestModalLoading=!0}));var e=this.isAddContest?"createContest":"updateContest",o=Object(r["a"])(Object(r["a"])({},this.contest),{},{markdownDescription:this.$refs.md.getMarkdown(),gmtStart:new Date(this.contest.gmtStart).getTime(),gmtEnd:new Date(this.contest.gmtEnd).getTime(),participants:Object(v["a"])(this.contest.participants,/[\s,]+/),unofficialParticipants:Object(v["a"])(this.contest.unofficialParticipants,/[\s,]+/),problems:this.contest.problems.map((function(t){return{problemColor:t.problemColor,problemCode:t.problemCode,problemTitle:t.problemTitle,problemDescriptionId:t.problemDescriptionId,problemWeight:t.problemWeight}}))});h["a"][e](o).then((function(e){t.$Message.success("Success"),t.contestModal=!1,t.getContestList()})).catch((function(e){t.$Message.error(e.message),t.contestModalLoading=!1,t.$nextTick((function(){t.contestModalLoading=!0}))}))},getProblemDescriptionList:function(t){var e=this;return new Promise((function(o,n){h["a"].getProblemDescriptionList({problemCode:t.problemCode}).then((function(e){if(t.problemDescriptionList=e,o(e),""===t.problemDescriptionId)e.length>0?(t.problemDescriptionId=e[0].id,t.$ready=S["c"].READY):(t.problemDescriptionId="",t.$ready=S["c"].FAILED);else{var n=e.map((function(t){return t.id}));n.includes(t.problemDescriptionId)?t.$ready=S["c"].READY:t.$ready=S["c"].FAILED}})).catch((function(o){e.$Message.error(o.message),t.$ready=S["c"].FAILED,n(o)}))}))},getContestList:function(){var t=this;this.tableLoading=!0,h["a"].getContestList({pageNow:this.pageNow,pageSize:this.pageSize,sortBy:this.sortBy,ascending:this.ascending}).then((function(e){t.contests=e.rows,t.total=parseInt(e.totalPage)*t.pageSize})).catch((function(e){t.$Message.error(e.message)})).finally((function(){t.tableLoading=!1}))},queryManagerGroups:function(t){var e=this;""!==t?(this.managerGroupQueryLoading=!0,h["a"].queryGroupTitle({title:t}).then((function(t){e.managerGroupSet=t,e.managerGroupQueryLoading=!1})).catch((function(t){e.$Message.error(t.message)}))):this.managerGroupSet=[]},queryParticipatingGroups:function(t){var e=this;""!==t?(this.participatingGroupQueryLoading=!0,h["a"].queryGroupTitle({title:t}).then((function(t){e.participatingGroupSet=t,e.participatingGroupQueryLoading=!1})).catch((function(t){e.$Message.error(t.message)}))):this.participatingGroupSet=[]},setParticipatingGroupSet:function(){this.participatingGroupSet=this.contest.participatingGroupDTOList},validateUnofficialParticipants:function(){for(var t=Object(v["a"])(this.contest.participants,/[\s,]+/),e=Object(v["a"])(this.contest.unofficialParticipants,/[\s,]+/),o=0;o<e.length;++o)if(!t.includes(e[o]))return this.$Message.error("Unofficial participants must be the subset of participants"),this.tabErrors.manage=!0,!1;return this.tabErrors.manage=!1,!0},validateProblems:function(){if(0===this.contest.problems.length)return this.$Message.error("Add at least one problem"),this.tabErrors.problem=!0,!1;for(var t=0;t<this.contest.problems.length;++t){var e=this.contest.problems[t];if(e.$ready!==S["c"].READY||!e.problemDescriptionId||!e.problemTitle)return this.$Message.error("Problem ".concat(y(t)," is not ready")),this.tabErrors.problem=!0,!1}return this.tabErrors.problem=!1,!0}},computed:{CONTEST_OPENNESS:function(){return S["b"]},CONTEST_MODE:function(){return S["a"]},CONTEST_PROBLEM_STATUS:function(){return S["c"]},moment:function(){return i.a},gmtLength:{get:function(){var t=new Date(this.contest.gmtStart).getTime(),e=new Date(this.contest.gmtEnd).getTime(),o=parseInt((e-t)/6e4);return Math.max(0,o)},set:function(t){var e=new Date(this.contest.gmtStart).getTime();this.contest.gmtEnd=i()(new Date(e+6e4*t)).format("yyy-MM-DD HH:mm:ss")}},tabLabels:function(){var t={basic:"Basic",manage:"Management",problem:"Problem"};return this.tabErrors.basic&&(t.basic=function(t){return t("div",[t("span","Basic"),t("Badge",{props:{text:"error"}})])}),this.tabErrors.manage&&(t.manage=function(t){return t("div",[t("span","Management"),t("Badge",{props:{text:"error"}})])}),this.tabErrors.problem&&(t.problem=function(t){return t("div",[t("span","Problem"),t("Badge",{props:{text:"error"}})])}),t}},mounted:function(){this.getContestList()},watch:{$route:function(){this.getContestList()}}},k=C,T=Object(m["a"])(k,n,s,!1,null,"23517144",null);e["default"]=T.exports},2532:function(t,e,o){"use strict";var n=o("23e7"),s=o("5a34"),r=o("1d80"),a=o("ab13");n({target:"String",proto:!0,forced:!a("includes")},{includes:function(t){return!!~String(r(this)).indexOf(s(t),arguments.length>1?arguments[1]:void 0)}})},"5a34":function(t,e,o){var n=o("44e7");t.exports=function(t){if(n(t))throw TypeError("The method doesn't accept regular expressions");return t}},"690a":function(t,e,o){"use strict";var n=o("e33d"),s=o.n(n);s.a},ab13:function(t,e,o){var n=o("b622"),s=n("match");t.exports=function(t){var e=/./;try{"/./"[t](e)}catch(o){try{return e[s]=!1,"/./"[t](e)}catch(n){}}return!1}},caad:function(t,e,o){"use strict";var n=o("23e7"),s=o("4d64").includes,r=o("44d2"),a=o("ae40"),i=a("indexOf",{ACCESSORS:!0,1:0});n({target:"Array",proto:!0,forced:!i},{includes:function(t){return s(this,t,arguments.length>1?arguments[1]:void 0)}}),r("includes")},e33d:function(t,e,o){}}]);
//# sourceMappingURL=chunk-6b1d890a.e46367b4.js.map