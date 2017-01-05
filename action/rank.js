'use strict';
import {config} from './Global';

// 常量: 服务器返回信息
export const RECEIVE_RECOMMEND_TAG = 'RECEIVE_RECOMMEND_TAG';
export const RECEIVE_RANK_DETAIL = 'RECEIVE_RANK_DETAIL';
export const RECEIVE_RANK_DATE = 'RECEIVE_RANK_DATE';
export const RECEIVE_RANK_SONGS = 'RECEIVE_RANK_SONGS';
// 常量: 用户操作
export const CHANGE_RANK_TAG = 'CHANGE_RANK_TAG';
export const CHANGE_RANK_DATE = 'CHANGE_RANK_DATE';
export const CHANGE_RANK_PAGE = 'CHANGE_RANK_PAGE';
export const TOGGLE_DATE_PANEL = 'TOGGLE_DATE_PANEL';
export const CONTROL_SONG = 'CONTROL_SONG';
// 常量: 状态
export const LOADING_SONGS = 'LOADING_SONGS';
/*基本action creator: 信号发射器*/
export const controlSong = (type, song) => ({
	type: CONTROL_SONG,
	data: {type, song}
});
export const receiveRecommendTag = (rankTags, rankClass) => ({
	type: RECEIVE_RECOMMEND_TAG,
	data: {rankTags, rankClass}
});
export const receiveRankDetail = (data) => ({
	type: RECEIVE_RANK_DETAIL,
	data : data
});
export const receiveRankDate = (data, parent_rank_id) => ({
	type: RECEIVE_RANK_DATE,
	data : {data, parent_rank_id}
});
export const receiveRankSongs = (songs, pageSize, pageIndex, rankDateId, totalSongsLen) => ({
	type: RECEIVE_RANK_SONGS,
	data: {songs, pageSize, pageIndex, rankDateId, totalSongsLen},
});
export const loadingSongs = () => ({
	type: LOADING_SONGS
});
export const changeRankTag = (rank_id) => ({
	type: CHANGE_RANK_TAG,
	data: {rank_id}
});
export const changeRankDate = (rankDateId, pageIndex) => ({
	type: CHANGE_RANK_DATE,
	data: {rankDateId, pageIndex}
});
export const changeRankPage = (pageIndex) => ({
	type: CHANGE_RANK_PAGE,
	data: pageIndex
});
export const _toggleDatePanel = (boolean) => ({
	type: TOGGLE_DATE_PANEL,
	data: boolean
});



import {superRequest} from '../utils/index';
import {_tagsReducer} from '../reducers/Rank/';
/*获取排行榜歌曲的接口*/
const _rankSongsRequest = {
	URL: 'container/v2/rank_audio', // 获取伴奏接口
	defaultParams: Object.assign({...config.param}, {
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
const _rankDateRequest = {
	URL: 'v1/rank',
	defaultParams: Object.assign({...config.param}, {data: [{parent_id: ''}]})
};
/*获取榜单请求*/
const _rankDetailRequest = {
	URL: 'container/v1/rank',
	defaultParams:  Object.assign({...config.param}, {data: {data: []}})

};
/*获取排行榜标签*/
const _rankListRequest = {
	requestMethod: 'get',
	type: {
		HOT_RANK: { // 热门榜单
			URL: 'http://lib2.service.kugou.com/recommend/data?id=175',
			filter:'type'
		},
		GLOBAL_RANK: { // 全球榜单
			URL: 'http://lib2.service.kugou.com/recommend/data?id=298',
			filter:'is_show'
		},
		SPECIAL_RANK: { // 特色榜单
			URL: 'http://lib2.service.kugou.com/recommend/data?id=299',
			filter:'is_show'
		}
	}
};

/*异步的action creator*/
/*
* 页面初始化就要获取推荐的rank标签并在获取后要立即请求默认的rank歌曲.
* */
export function getAllRecommendTag_toLoadSong(activeTagId, pageIndex) {
	return (dispatch) => {
		const types = _rankListRequest.type;
		Object.keys(types).forEach(function (typeName) {
			const typeInfo = types[typeName];

			// 请求数据
			return superRequest({
				url: typeInfo.URL,
				type: _rankListRequest.requestMethod,
			})
				.then((result) => (
					_tagsReducer(result.data, typeInfo.filter)
				))
				.then(function (tags) {
					// 渲染
					dispatch(receiveRecommendTag(tags.rankTags, {[typeName]: tags.rankTags_IDArray}));
					return tags;
				})
				.then(function (tags) {
					// 请求歌曲
					if(activeTagId && tags.rankTags[activeTagId]){
						// 加载指定的rankTag的歌曲,
						dispatch(setCurrentRankTag(activeTagId, pageIndex));

					}else if(!activeTagId && typeName == 'HOT_RANK') {
						// 但没有指定rankTag的话, 默认选择HOT_RANK的第一个rankTag
						activeTagId = tags.rankTags[tags.rankTags_IDArray[0]].rank_id;
						dispatch(setCurrentRankTag(activeTagId, pageIndex));
					}
					return tags;
				})
				.then(function (tags) {
					// 最后, 请求rankTag的完整信息
					dispatch(getRankTagAllInfo(tags.idArrays))
				});
		});
	};
}

/*获取rankTag的完整信息, 这里主要是获取rankTag的image信息*/
function getRankTagAllInfo (idArrays) {
	return (dispatch) => {
		_rankDetailRequest.defaultParams.data = idArrays;
		superRequest({
			url: _rankDetailRequest.URL,
			data: _rankDetailRequest.defaultParams,
		}).then(function (result) {
			dispatch(receiveRankDetail(result.data));
		});
	}
}

function getRankDate(rank_id) {
	return (dispatch) => {
		_rankDateRequest.defaultParams.data[0].parent_id = rank_id;
		return superRequest({
			url: _rankDateRequest.URL,
			data: _rankDateRequest.defaultParams,
		}).then(function (result) {
			dispatch(receiveRankDate(result.data, rank_id));
		})
	}
}

function getRankSongs(rank_id, pageIndex) {
	return (dispatch) => {
		// 先改变页面状态为正在加载歌曲
		dispatch(loadingSongs());
		// 请求数据
		const params = _rankSongsRequest.defaultParams;
		params.page = pageIndex;
		params.rank_id = rank_id;
		params.pageSize = 30;
		return superRequest({
			url: _rankSongsRequest.URL,
			data: params,
		}).then(function (result) {
			dispatch(receiveRankSongs(
				result.data,
				params.pageSize,
				pageIndex,
				rank_id,
				result.total
			));
		})
	}
}

/*用户操作系列*/
export function setCurrentRankTag(rank_id, pageIndex) {
	return (dispatch) => {
		// 户点击RankTag时pageIndex等于undefined, 但刷新页面的pageIndex可能是有路由参数值
		pageIndex = (pageIndex === undefined) ? 1 : pageIndex;

		// 改变页面显示状态, 高亮所选的, 且页码要回归到指定的.
		dispatch(changeRankTag(rank_id));
		// 获取rank歌曲
		dispatch(getRankSongs(rank_id, pageIndex));
		// 获取rank的日期版本
		dispatch(getRankDate(rank_id));
	}
}
export function setCurrentRankDate(rankDateId) {
	return (dispatch) => {
		const pageIndex = 1; // 选择日历Rank默认是回归到第一页
		dispatch(changeRankDate(rankDateId, pageIndex));
		dispatch(getRankSongs(rankDateId, pageIndex));
	}
}
export function setCurrentRankPage(pageIndex) {
	return (dispatch, getState) => {
		const state = getState();
		dispatch(changeRankPage(pageIndex));
		dispatch(getRankSongs(
			state.Rank.current.rankTag && state.Rank.current.rankTag.rank_id,
			pageIndex
		))
	}
}

export function toggleDatePanel(boolean) {
	return (dispatch, getState) => {
		if(boolean === undefined){
			const state = getState();
			boolean = !state.Rank.current.displayDatePanel;
		}
		dispatch(_toggleDatePanel(boolean));
	}
}
