/**
 * Created by jiajunhe on 2017/1/9.
 */
import {config} from './Global';
import {superRequest} from './index';
import {_tagsReducer} from '../reducers/Rank/';
/*获取排行榜歌曲的接口*/
export const _rankSongsRequest = {
	get: (data) => (superRequest({
		url: 'container/v2/rank_audio',// 获取伴奏接口
		data: Object.assign({}, _rankSongsRequest.params, data)
	})),
	params: Object.assign({...config.param}, {
		show_video: 0,		// 是否显示视频信息 1=是(default) 0=否
		show_obbligato: 1, 	// 是否显示伴奏 1=是(default) 0=否
		rank_id: '8888',	// 排行榜ID (当查询榜单ID等于6666和8888时,会自动返回最新一期排行榜)
		volume: '',			// 期数
		page: 1,			// 页码
		pagesize: 30,		// 页大小
		sort: 0 			// 排序 0=按序号
	})
};
/*获取榜单版本时间请求*/
export const _rankDateRequest = {
	get: (data) => (superRequest({
		url: 'v1/rank',
		data: Object.assign({}, _rankDateRequest.params, data)
	})),
	params: Object.assign({...config.param}, {data: [{parent_id: ''}]})
};
/*获取榜单请求*/
export const _rankDetailRequest = {
	get: (data) => (superRequest({
		url: 'container/v1/rank',
		data: Object.assign({}, _rankDetailRequest.params, data)
	})),
	params: Object.assign({...config.param}, {data: {data: []}})
};

/*获取排行榜标签*/
export const _rankListRequest = {
	get: ({id, filter, name}) => (
		superRequest({
			url: 'http://lib2.service.kugou.com/recommend/data?id=' + id,
			type: 'get'
		}).then(
			(result) => (_tagsReducer(result, filter))
		)
	),
	eachClassType: (handler) => (
		Promise.all(_rankListRequest.list.map(handler))
	),
	list:[{
		name:'HOT_RANK',
		id: 175,
		filter: 'type'
	},{
		name:'GLOBAL_RANK',
		id: 298,
		filter: 'is_show'
	},{
		name:'SPECIAL_RANK',
		id: 299,
		filter: 'is_show'
	}]
};
/*请求歌手的接口*/
export const _singerRequest = {
	get: (data) => (superRequest({
		url: 'container/v1/author/lang',
		data: Object.assign({}, _singerRequest.params, data)
	})),
	params: Object.assign({...config.param}, {
		initial: '', 		// 字母
		lang_ids: '', 		// 语种
		//lang_logic:'',	// 语种逻辑
		sort: 1, 			// 排序类型
		//is_musician: '',	// 歌手类型, 合作歌手/伴奏歌手
		//filter_ids:'', 	// 过滤的歌手
		sex_type: '',		// 歌手类型, 女歌手, 男歌手, 组合
		page: 1,			// 分页
		pagesize: 60		// 每页的数据量
	})
};