var log=function(t){"undefined"!=typeof console&&console.log(t)},DialogType={confirm:"confirm",tip:"tip"};!function(t,e){var o=t.documentElement,n="orientationchange"in window?"orientationchange":"resize",i=480,r=function(){var t=o.clientWidth;return t?(t>=i&&(t=i),void(o.style.fontSize=20*(t/320)+"px")):void log("documentElement.clientWidth is undefined!")};e.px2rem=function(t){return t/20/2},t.addEventListener&&(e.addEventListener(n,r,!1),t.addEventListener("DOMContentLoaded",r,!1))}(document,window);var Ajax=function(){function t(t){var e=Object.keys(t);e=e.sort();var o={};e.forEach(function(e){o[e]=t[e]});var n="";for(var i in o)"object"==typeof o[i]&&(o[i]=JSON.stringify(o[i])),n+=i+o[i];return n}function e(e){var o=Storage.get(Storage.AUTH)||{},n=Storage.get(Storage.AUTH)||{},i=t($.extend(o,e));return $.extend(n,{sign:$.md5(i)})}function o(t){}function n(){}function i(){$('[data-rule="number_"]').isNumber_(),$('[data-rule="number"]').isNumber(),$('[data-rule="idcard"]').isIDCard()}$.ajaxSettings.timeout=7e3,$.ajaxSettings.crossDomain=!0;var r=[];return{pageRequest:function(t,a,s){var c=t.renderFor||"wu-list-tmpl",d=t.renderEle||"#wu-list",u=t.clear||"true",g={pageSize:config.pageSize,page:config.page},l=$(".wlist_next"),f='<a class="wlist_next">更多</a>';0==l.length&&($(d).after(f),l=$(".wlist_next")),1===config.page&&"true"===u&&$(d).html(""),l.show().addClass("wu_loading").text(config.tips.loading),t.data=$.extend(g,t.data),r.push("first requrse"),$.ajax({url:t.url,data:{jsonData:JSON.stringify(t.data)},type:t.type||"GET",dataType:"json",cache:!1,beforeSend:o,headers:e(t.data)}).then(function(e,o,n){if(r.shift(),!(r.length>0)){if(l.removeClass("wu_loading"),!e||!e.code||"0"!==e.code)return e?UserService.getToken()?(l.text(config.tips.server),e?void Tools.toast(e.desc||config.tips.server):void Tools.toast(config.tips.server)):void l.text("登录后获取..."):void Tools.toast(config.tips.server);var i=e.data[t.showlistkey]||e.data||[];if(log("Response： \n"),log(i),$("#"+c).length){var s=template.render(c,{list:i});$(d).append(s)}0==i.length?0==config.page?l.html(config.tips.nodata):l.html(config.tips.nomoredata):i.length<config.pageSize?(l.text(config.tips.nomoredata),l.addClass("wu_loading")):(config.page+=1,l.text("更多")),$.isFunction(a)&&a(e)}}).done(function(t,e){$.isFunction(s)&&s(),i()}).fail(function(e,o,n){log("[pageRequest] "+o+":"+t.url),l.removeClass("wu_loading"),"timeout"===o?l.text(config.tips.timeout):l.text(config.tips.server)}).always(function(t){n()})},queryRecord:function(t,r,a,s){var c=t.renderFor||"wu-detail-tmpl",d=t.renderEle||"#wu-detail";$.ajax({url:t.url,data:{jsonData:JSON.stringify(t.data)},type:t.type||"GET",dataType:"json",cache:!1,beforeSend:o,headers:e(t.data)}).then(function(t){if(!t||!t.code||"0"!==t.code){if(!t)return void Tools.toast(config.tips.server);Tools.toast(t.desc||config.tips.server)}if($("#"+c).length){var e=template.render(c,t.data||{});$(d).html(e)}$.isFunction(r)&&r(t)}).done(function(){$.isFunction(a)&&a(),i()}).fail(function(e,o,n){log("[queryRecord] "+o+":"+t.url),"timeout"===o?Tools.toast(config.tips.timeout):Tools.toast(config.tips.server),$.isFunction(s)&&s()}).always(function(){n()})},submitForm:function(t,r,a,s){var c,d=!!t.data.length;d?(c=Tools.formJson(t.data),t.data.find('input[type="submit"],#submit_btn').attr("disabled",!0)):c=t.data,UserService.getUserId()&&(c.userId=UserService.getUserId()),$.ajax({url:t.url,data:{jsonData:JSON.stringify(c)},type:t.type||"POST",dataType:"json",beforeSend:o,headers:e(c)}).then(function(e){return d&&t.data.find('input[type="submit"],#submit_btn').removeAttr("disabled"),e&&e.code?"0"!==e.code?void Tools.toast(e.desc||config.tips.server):void($.isFunction(r)&&r(e)):void Tools.toast(config.tips.server)}).done(function(){d&&t.data.find('input[type="submit"],#submit_btn').removeAttr("disabled"),$.isFunction(a)&&a(),i()}).fail(function(e,o,n){log("[submitForm] "+o+":"+t.url),d&&t.data.find('input[type="submit"],#submit_btn').removeAttr("disabled"),"timeout"===o?Tools.toast(config.tips.timeout):Tools.toast(config.tips.server),$.isFunction(s)&&s()}).always(function(){log("always....."),d&&t.data.find('input[type="submit"],#submit_btn').removeAttr("disabled"),n()})},custom:function(t,r,a){var s=t.renderFor,c=t.renderEle;$.ajax({url:t.url,data:{jsonData:JSON.stringify(t.data)},type:t.type||"GET",dataType:"json",beforeSend:o,headers:e(t.data)}).then(function(e,o,n){if(!e||!e.code||"0"!==e.code&&"001"!==e.code){if(!e)return void Tools.toast(config.tips.server);Tools.toast(e.desc||config.tips.server)}if($("#"+s).length){var i=e.data[t.showlistkey]||e.data||[];log("Response \n\r"+JSON.stringify(i));var a=template.render(s,{list:i||[]});$(c).html(a)}"function"==typeof r&&r(e)}).fail(function(e,o,n){log("[custom] "+o+":"+t.url),"timeout"===o?Tools.toast(config.tips.timeout):Tools.toast(config.tips.server),$.isFunction(a)&&a()}).always(function(){n(),i()})},getDictionary:function(t,e,r){var a=t.renderFor,s=t.renderEle;$.ajax({url:t.url,data:{jsonData:JSON.stringify(t.data)},type:"GET",dataType:"json",beforeSend:o}).then(function(t,o,n){if(i(),t&&t.code&&"0"===t.code||Tools.toast(t.desc||config.tips.server),$("#"+a).length)try{var r=template.render(a,{list:t.data[0].values||[]});$(s).html(r)}catch(c){Tools.toast(t.desc||config.tips.server)}"function"==typeof e&&e(t.data[0].values)}).fail(function(e,o,n){log("[getDictionary] "+o+":"+t.url),"timeout"===o?Tools.toast(config.tips.timeout):Tools.toast(config.tips.server),$.isFunction(r)&&r()}).always(function(){n()})}}}(),Tools=function(){var t,e,o,n,i={btnsText:["取消","确认"],text:"",yesCb:void 0,noCb:void 0,type:DialogType.confirm};return{formatDate:function(t,e){var o="yyyy-MM-dd hh:mm";switch(e){case 1:o="yyyy年M月d日";break;case 2:o="hh:mm";break;case 3:o="yyyy.M.d";break;case 4:o="yyyy-MM-dd hh:mm:ss";break;case 5:o="yyyy年MM月";break;case 6:o="yyyy-MM-dd";break;default:o=e?e:o}if(isNaN(t)||null==t)return t;if("object"==typeof t){var n=dd.getFullYear(),i=dd.getMonth()+1,r=dd.getDate();10>i&&(i="0"+i);var a=n+"-"+i+"-"+r,s=a.match(/(\d+)/g),c=new Date(s[0],s[1]-1,s[2]);return c.format(o)}var c=new Date(parseInt(t));return c.format(o)},getWindow:function(){return{width:window.innerWidth,height:window.innerHeight}},getDocument:function(){var t=document.documentElement||document.body;return{width:t.clientWidth,height:t.clientHeight}},getScreen:function(){return{width:screen.width,height:screen.height}},showOrHideScrollBar:function(e){t=t||function(t){t.preventDefault()},(document.documentElement||document.body).style.overflow=e?"auto":"hidden",e?document.removeEventListener("touchmove",t,!1):document.addEventListener("touchmove",t,!1)},formJson:function(t){var e={};if("object"!=typeof t)return e;var o=t.serializeArray();return $.each(o,function(){void 0!==e[this.name]?(e[this.name].push||(e[this.name]=[e[this.name]]),e[this.name].push(this.value||"")):e[this.name]=this.value||""}),e},showConfrim:function(t){t||(t={}),t.type=DialogType.confirm,this.showPanel(t)},showTip:function(t){var e={};"object"==typeof t&&(e=t),"string"==typeof t&&(e.text=t),e.type=DialogType.tip,this.showPanel(e)},showPanel:function(t){i=$.extend(i,t),e=e||$("#dialog");var o=i.type,n=i.text;config.onYesClick=i.yesCb,config.onNoClick=i.noCb,e.find("p").html(n);var r=e.find(".options");o===DialogType.tip?r.html('<div style="width: 100%;" class="btn btn_ok">'+(i.btnsText[0]||"")+"</div>"):r.html('<div class="btn btn_no fl">'+i.btnsText[0]+'</div><div class="btn btn_ok fr">'+i.btnsText[1]+"</div>"),e.show(),$("#dialog_bg").show(),r.find(".btn_ok").on("click",function(){"function"==typeof config.onYesClick&&(config.onYesClick(),$("#dialog,#dialog_bg").hide(),config.onYesClick=void 0)}),r.find(".btn_no").on("click",function(){"function"==typeof config.onNoClick&&o!==DialogType.tip?($("#dialog,#dialog_bg").hide(),config.onNoClick(),config.onNoClick=void 0):(e.hide(),$("#dialog_bg").hide())})},toast:function(t,e,i){n=n||$("#wu-toast"),i=i||1e3,o&&clearTimeout(o),n.find("span").text(t),n.fadeIn(),o=setTimeout(function(){n.fadeOut(),$.isFunction(e)&&e()},i)},isMicorMessage:function(){var t=navigator.userAgent,e={};return e[/android/.test(t)?"isAndroid":/iphone/.test(t)?"isIphone":""]=!0,e}}}(),Storage=function(){return{AUTH:"WORLDUNION_AUTH",ACCOUNT:"WORLDUNION_ACCOUNT",REMEMBER:"WORLDUNION_REMEMBER",OPENID:"WORLDUNION_OPENID",CITY:"WORLDUNION_CITY",get:function(t,e){if(Storage.isLocalStorage()){var o=Storage.getStorage(e).getItem(t);return o?JSON.parse(o):void 0}},set:function(t,e,o){Storage.isLocalStorage()&&(e=JSON.stringify(e),Storage.getStorage(o).setItem(t,e))},remove:function(t,e){Storage.isLocalStorage()&&Storage.getStorage(e).removeItem(t)},getStorage:function(t){return t?sessionStorage:localStorage},isLocalStorage:function(){try{return window.localStorage?(localStorage.setItem("isLocalStorage","abc"),localStorage.removeItem("isLocalStorage"),!0):(log("不支持本地存储"),!1)}catch(t){return log("本地存储已关闭"),!1}}}}(),UserService={getUser:function(){return Storage.get(Storage.ACCOUNT)||{}},getUserId:function(){return this.getUser().id||""},getToken:function(){try{return Storage.get(Storage.AUTH).token||Storage.get(Storage.ACCOUNT).token}catch(t){return void log(t)}},removeUser:function(){Storage.remove(Storage.AUTH),Storage.remove(Storage.ACCOUNT),Storage.remove(Storage.CITY)},saveUser:function(t){Storage.set(Storage.ACCOUNT,$.extend(this.getUser(),t||{}))},setCity:function(t){var e=Storage.get(Storage.CITY)||{};Storage.set(Storage.CITY,$.extend(e,t))}};Date.prototype.format=function(t){var e={"M+":this.getMonth()+1,"d+":this.getDate(),"h+":this.getHours(),"m+":this.getMinutes(),"s+":this.getSeconds(),"q+":Math.floor((this.getMonth()+3)/3),S:this.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(this.getFullYear()+"").substr(4-RegExp.$1.length)));for(var o in e)new RegExp("("+o+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?e[o]:("00"+e[o]).substr((""+e[o]).length)));return t},String.prototype.isSpaces=function(){for(var t=0;t<this.length;t+=1){var e=this.charAt(t);if(" "!=e&&"\n"!=e&&"	"!=e&&"\r"!=e)return!1}return!0},String.prototype.isValidMail=function(){return new RegExp(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/).test(this)},String.prototype.isPhone=function(){return new RegExp(/^1\d{10}?$/).test(this)},String.prototype.isEmpty=function(){return/^\s*$/.test(this)},String.prototype.isValidPwd=function(){return new RegExp(/^([_]|[a-zA-Z0-9]){8,16}$/).test(this)},String.prototype.isPostCode=function(){return new RegExp(/^\d{6}?$/).test(this)},String.prototype.getQueryValue=function(t){var e=this,o=[];if(e.length>1){var n=e.indexOf("?");e=e.substring(n+1,e.length)}else e=null;if(e)for(var i=0;i<e.split("&").length;i++)o[i]=e.split("&")[i];for(var r=0;r<o.length;r++)if(o[r].split("=")[0]==t)return decodeURI(o[r].split("=")[1]);return""},String.prototype.trim=function(){return this.replace(/^\s+|\s+$/g,"")},String.prototype.isNumber=function(){return!/^[1-9]\d*(\.\d+)?$/.test(this)},String.prototype.isNumber2=function(){return!/^[1-9]\d*(\d+)?$/.test(this)},String.prototype.isNumber3=function(){return!/^[0-9]\d*(\.\d+)?$/.test(this)},String.prototype.isNumber4=function(){return!/^[1-9]\d*(\.\d{0,2})?$/.test(this)},String.prototype.isIDCard=function(){return/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(this)},String.prototype.acceptFileType=function(){return/(\.|\/)(jpe?g|png)$/i.test(this)};