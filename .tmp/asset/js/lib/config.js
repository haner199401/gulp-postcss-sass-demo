function createPageUrl(){if(arguments.length){var e="";for(i in arguments){if(!arguments[i])return e;"/"!==arguments[i].charAt(0)&&(arguments[i]="/"+arguments[i]),"/"!==arguments[i].charAt(arguments[i].length)&&(arguments[i]+="/"),e+=arguments[i]}return e.length?(e=e.replace(/\/\//g,"/"),config.pageServer+e.substr(0,e.length-1)+config.pageSuffix):e}}var is8282Server=!1,config={projectName:is8282Server?"/wu-asset-appinterface":"",page:1,pageSize:10,totalPage:0,pageRequest:void 0,currentPage:1,baseUrl:is8282Server?"http://zcbdev.worldunion.com.cn:8282":"http://zcbdev.worldunion.com.cn:8383",interfaceSuffix:"",pageSuffix:".html"};config.server=config.baseUrl?config.baseUrl+config.projectName:location.protocol+"//"+location.host+config.projectName+"/",config.pageServer=location.protocol+"//"+location.host,config.imageServer=config.server+"/api/pictureapi"+config.interfaceSuffix,config.interfaceServer=config.server+"/api/",config.loadMoreImg="/assets/images/ajax-loader.gif",config.IFileServer=config.interfaceServer+"photoUpload",config.ILogin=config.interfaceServer+"login",config.tips={server:"服务器异常，请稍后再试～",timeout:"请求超时啦，请重试～",nodata:"没有数据啦~",nomoredata:"没有更多数据啦~",loading:"加载中…",locationerror:"定位失败,请手动选择城市！",noauth:"非法请求！",fileTypeError:"仅支持jpg、jpeg、png格式！"},config["enum"]={},config.createPageUrl=createPageUrl,config.interfaceUrl=function(e){return config.interfaceServer+e+config.interfaceSuffix},module.exports=config;