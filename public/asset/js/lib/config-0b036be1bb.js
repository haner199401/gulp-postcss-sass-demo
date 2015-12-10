/**
 * 配置说明
 * 静态页面跳转
 * 静态数据
 * 接口地址
 * 测试服务器 http://zcbapi.fanglb.com:8888
 * 开发服务器 http://zcbdev.worldunion.com.cn:8282
 * 本地测试地址 http://192.168.1.152
 */

var is8282Server = !!0;

var config = {
	projectName: is8282Server ? '/wu-asset-appinterface':'',
	page: 1, //当前第几页，从1开始
	pageSize: 10, //默认分页大小,
	totalPage: 0, //总页数,
	pageRequest: undefined,
	currentPage: 1,
    baseUrl: is8282Server ? 'http://zcbdev.worldunion.com.cn:8282' : 'http://zcbdev.worldunion.com.cn:8383',
    interfaceSuffix: '',
	pageSuffix: '.html'
};

//服务器地址
config.server = config.baseUrl ? (config.baseUrl + config.projectName) : (location.protocol + '//' + location.host + config.projectName + '/');
//页面地址
config.pageServer = location.protocol + '//' + location.host;
//图片地址
config.imageServer = config.server + '/api/pictureapi' + config.interfaceSuffix;
//接口地址
config.interfaceServer = config.server + '/api/';
//loading img
config.loadMoreImg = '/assets/images/ajax-loader.gif';



//文件存放地址
config.IFileServer = config.interfaceServer + 'photoUpload';


//登录接口
config.ILogin = config.interfaceServer + 'login';

/**
 * Tips
 */
config.tips = {
    server: '服务器异常，请稍后再试～',
    timeout: '请求超时啦，请重试～',
    nodata: '没有数据啦~',
    nomoredata: '没有更多数据啦~',
    loading: '加载中…',
    locationerror:'定位失败,请手动选择城市！',
    noauth:'非法请求！',
    fileTypeError:'仅支持jpg、jpeg、png格式！'
};



/**
 * 枚举罗列
 * @type {string}
 */
config.enum = {
};



function createPageUrl() {
    if (!arguments.length) return;
    var n = '';
    for (i in arguments) {
        if (!arguments[i]) return n;
        if (arguments[i].charAt(0) !== '/') arguments[i] = '/' + arguments[i];
        if (arguments[i].charAt(arguments[i].length) !== '/') arguments[i] += '/';
        n += arguments[i];
    }
    if (!n.length) return n;
    n = n.replace(/\/\//g, '/');
    return config.pageServer + n.substr(0, n.length - 1) + config.pageSuffix;
}

config.createPageUrl = createPageUrl;
config.interfaceUrl = function(url){
    return config.interfaceServer + url + config.interfaceSuffix;
};

module.exports  = config;
