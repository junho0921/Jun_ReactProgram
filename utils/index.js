/**
 * Created by jiajunhe on 2016/9/21.
 */
import {config} from './requestApi'
const contentTypeObj = {
	1: "application/x-www-form-urlencoded",
	2: "application/json;charset=utf-8",
	3: "Referer/http://fanxing.kugou.com"
};

const superCallSID = {
	"OPERATE_SONG": 3001,
	"REQUEST": 1019
};

export function completeImgUrl (imgFileName) {
	const pre = imgFileName.substring(0, 8);
	const url = config.singerImgUrl + pre + '/' + imgFileName;
	return url || config.singerDefaultImg;
}

function _fxcSuperCall (data) {
	if(!window.external.fxcSuperCall){return false;}
	return new Promise(function (resolve, reject) {
		data.callback = function (o) {
			const preText = '['+data.url.slice(29)+ "]接口:";
			try {
				const JSONData = JSON.parse(o);
				console.log(preText, [JSONData, data]);
				if(+JSONData.status === 1){
					resolve(JSONData);
				} else {
					reject(JSONData);
				}
			} catch (e) {
				console.warn(preText, o, e);
				reject(o);
			}
		};
		window.external.fxcSuperCall(superCallSID.REQUEST, data);
	});
}

export function by (value) {
	return function(o, p) {
		if(typeof o === 'object' && typeof p === 'object' && o && p){
			let a = o[value];
			let b = p[value];
			if(a === b){
				return 0;
			}
			if(typeof a === typeof b) {
				return a < b ? -1 : 1;
			}
			return typeof a < typeof b ? -1 : 1;
		}
	};
}

export function superRequest (argsObj) {
	// 补充
	if(argsObj.url.indexOf('http://') < 0){argsObj.url = config.url + argsObj.url;}

	// 通过客户端的请求方法
	//通过contentType的值1，2，3等来决定需要用什么content-Type 默认是1
	if(Object.prototype.toString.call(argsObj) !== '[object Object]'){return false;}

	let data = {
		url: null,
		type: "post",
		data: '',
		success: null,
		error: null,
		fail: null,
		timeout: null, // 仅在传参了超时回调才js设3秒的定时器监听返回值
		contentType: contentTypeObj[1],
		cache: 0
	};

	// argsObj = Object.assign({...data}, argsObj);
	//兼容url，callback写法
	Object.keys(argsObj).forEach(function (key) {
		data[key] = argsObj[key];
	});

	//将post的data转为字符串
	if (typeof data.data != "string") {
		data.data = JSON.stringify(data.data);
	}

	return _fxcSuperCall(data);
}
export function getSearchWords () {
	let hash = window.location.hash;
	let index =hash.indexOf('?');
	if(index>=0){
		return hash.slice(index+1);
	}
}
export function songPrivilege (songData) {
	// 判断歌曲的权限. 以128音质即普通音质作为判断依据
	if(songData.privilege_128){
		// 繁星伴奏乐库页面显示的播放与下载按钮的用户权限是以普通音质的用户权限作为判断依据
		const code = songData.privilege_128 && songData.privilege_128.toString(2);
		// 下载是否询问| 下载是否禁止| 试听是否询问| 试听是否禁止
		const isDownloadCharge = +code[0],
			isDownloadForbidden = +code[1],
			isPlayCharge = +code[2],
			isPlayForbidden = +code[3];
		songData.downloadPriv	= (isDownloadCharge ? 'isCharge' : '') + '' +(isDownloadForbidden ? 'forbidden' : '');
		songData.listenPriv		= (isPlayCharge ? 'isCharge' : '') + '' +(isPlayForbidden ? 'forbidden' : '');
		songData.addPriv		= ((isDownloadCharge && isPlayCharge) || (isDownloadForbidden && isPlayForbidden)) ? 'forbidden' : '';
	}
}
export function superOperateSong (type, songData, songlistname) {
	/*
	 * 调用客户端的接口来操作歌曲的添加, 下载与试听
	 * @param type (string)操作类型, 例如'play', 'download'
	 * @param songData (array) 歌曲数据, 后端返回的数据
	 * @param songlistname(string) 歌单名称
	 * */
	if($.type(songData) !== 'array'){return false;}
	let data = {
		ver:		'0.01',
		isplay: 	!!type.match(/play/g),
		isdownload: !!type.match(/download/g),
		sid: 		'', 		// JS回调命令标识id
		sourcepath: '',
		//singer: 	singleSong ? songData.author_name : '',
		//count: 		singleSong ? 1: songData.length,	// 歌曲数量,与'Files'关联|至少有一首歌
		songlistname: 	songlistname || '', 	// 歌单名,如果不为空,则新建歌单
		filelist: 		songData // Json list 数据.存储歌曲的基本信
	};

	// 客户端需要的参数: 若是没有就给空字符串
	data.filelist.forEach(function (item) {
		item.bitrate_128 = item.bitrate_128 || 128;
		item.bitrate_320 = item.bitrate_320 || 320;
		// 部分接口的filename没有提供, 那就使用author_name与audio_name拼起来的字符串
		item.filename = item.filename || item.author_name+ ' - ' + item.audio_name;
		const format = '.'+item.extname, fixWord = ' - 伴奏';
		// 伴奏页面的歌曲都需要添加"伴奏"的后缀
		if(window.location.hash == '#accompany' && !item.filename.match(fixWord)){item.filename += fixWord}
		// filename必须是歌手名称+歌曲名称+歌曲格式后缀
		if(!item.filename.match(format)){
			item.filename += format;
		}
	});
	// console.log('Song['+type+'] ===========>> ', songData.map(function (item) {return item.audio_name;}), songlistname);
	// console.log('Song['+type+'] ===========>> ', data);
	try {
		external.fxcSuperCall(superCallSID.OPERATE_SONG, JSON.stringify(data));
	} catch (ex) {
		console.log("哎呀报错了，supercall需要在客户端执行才正常！");
	}
}

/*
 * controlSongs 歌曲操作按钮的处理, 本函数绑定在歌曲的li标签上, 请看示例
 * @params currentSongs {object} 歌曲信息集合
 * @params currentSongs.data {array} 所有歌曲的信息
 * @params currentSongs.songlistname {string}  歌曲集合的名称
 * @params e {object} 事件对象
 * 歌曲操作按钮的提示语是以按钮的className判断是否禁止下载或收费来提示
 * */
export function controlSongs (currentSongs, e) {
	if(!e || !e.target || !currentSongs || ($.type(currentSongs.data) !== 'array')){return false;}

	let data = currentSongs.data,

		$t = $(e.target),
		className = $t.attr('class') || '',
		isOptSongBtn = className.match(/optSongBtn/),
		dataType = $t.attr('data-type') || 'play',
		name = {download:'下载', play: '试听', add: '添加歌曲'},
		itemTxt = name[dataType] || '';

	// 若点击的不是button, 那么以试听button的className作为权限判断
	if(!isOptSongBtn){
		if(!$t.is('li')){
			$t = $t.parents('li');
			if(!$t[0]){return false;}
		}
		className = $t.find('.listen').attr('class');
	}

	const isForbidden = className.match(/forbidden/),
		isCharge = className.match(/isCharge/);

	if(isForbidden){
		showTips('禁止'+ itemTxt);
		return true;
	}else if(isCharge){
		showTips('收费曲目，请到酷狗客户端'+ itemTxt +'哦~');
		return true;
	} else {
		if(!className.match(/all/g)){
			// 若按钮不是全部进行操作的话, 以当前事件对象的index值来获取歌曲	信息.
			var index = $(e.currentTarget).index();
			data = data.slice(index, index+1);
		}
		app.utils.superOperateSong(dataType, data, currentSongs.songlistname);
	}
}
