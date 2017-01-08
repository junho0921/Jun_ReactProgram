'use strict';
// 常量: 服务器返回信息
export const RECEIVE_RECOMMEND_TAG = 'RECEIVE_RECOMMEND_TAG';
export const RECEIVE_RANK_DETAIL = 'RECEIVE_RANK_DETAIL';
export const RECEIVE_RANK_DATE = 'RECEIVE_RANK_DATE';
export const RECEIVE_RANK_SONGS = 'RECEIVE_RANK_SONGS';
// 常量: 状态
export const CLEAR_DATES = 'CLEAR_DATES';
export const CLEAR_SONGS = 'CLEAR_SONGS';
export const CLEAR_PAGE_INDEX = 'CLEAR_PAGE_INDEX';
export const ON_LOADING_STATUS = 'ON_LOADING_STATUS';
// 常量: 操作
export const TOGGLE_DATE_PANEL = 'TOGGLE_DATE_PANEL';
export const CHANGE_RANK_DATE_ID = 'CHANGE_RANK_DATE_ID';

/*基本action creator: 信号发射器: 指示reducer处理数据*/
const
	receiveRecommendTag = (rankTags, rankClass) => ({
		type: RECEIVE_RECOMMEND_TAG,
		data: {rankTags, rankClass}
	}),
	receiveRankDetail = (data) => ({
		type: RECEIVE_RANK_DETAIL,
		data
	}),
	receiveRankDate = (data, rank_id) => ({
		type: RECEIVE_RANK_DATE,
		data: {data, rank_id}
	}),
	receiveRankSongs = (data) => ({
		type: RECEIVE_RANK_SONGS,
		data
	}),
	changeRankDateId = (data) => ({
		type: CHANGE_RANK_DATE_ID,
		data
	}),
	clearDates = () => ({
		type: CLEAR_DATES
	}),
	clearSongs = () => ({
		type: CLEAR_SONGS
	}),
	clearPageIndex = () => ({
		type: CLEAR_PAGE_INDEX
	}),
	onLoadingStatus = () => ({
		type: ON_LOADING_STATUS
	});
export const toggleDatePanel = (data) => ({
	type: TOGGLE_DATE_PANEL,
	data
});

/*===============================*/
/*===============================*/
/*===============================*/
/*===============================*/

import {config} from './Global';
import {superRequest} from '../utils/index';
import {_tagsReducer} from '../reducers/Rank/';
/*获取排行榜歌曲的接口*/
const _rankSongsRequest = {
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
const _rankDateRequest = {
	get: (data) => (superRequest({
		url: 'v1/rank',
		data: Object.assign({}, _rankDateRequest.params, data)
	})),
	params: Object.assign({...config.param}, {data: [{parent_id: ''}]})
};
/*获取榜单请求*/
const _rankDetailRequest = {
	get: (data) => (superRequest({
		url: 'container/v1/rank',
		data: Object.assign({}, _rankDetailRequest.params, data)
	})),
	params: Object.assign({...config.param}, {data: {data: []}})
};

/*获取排行榜标签*/
const _rankListRequest = {
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

/*异步的action creator*/
/*页面初始化就要获取推荐的rank标签并在获取后要立即请求默认的rank歌曲.*/
/*
 * 加载tagList -> 加载默认歌曲
 * 分别加载三个tagList -> 加载Hot tagList的歌曲
 * 指定的tagId -> 加载三个tagList -> 各第一时间检测来加载歌曲
 * */
export function initialContent (activeTagId, pageIndex){
	return (dispatch) => {
		// if(activeTagId){
		// 	return Promise.all([
		// 		dispatch(changeSongsOfRank(activeTagId, pageIndex)),
		// 		_rankListRequest.eachClassType((classInfo) => (
		// 			dispatch(getRecommendTag(classInfo))
		// 		))
		// 	]);
		// }else{
		// 	return _rankListRequest.eachClassType((classInfo) => (
		// 		dispatch(getRecommendTag(classInfo))
		// 			.then(({models, sortList}) => (
		// 				!activeTagId && classInfo.name == 'HOT_RANK' && dispatch(changeSongsOfRank(sortList[0]))
		// 			))
		// 	))
		// }
		return _rankListRequest.eachClassType((classInfo) => {
			return dispatch(getRecommendTag(classInfo))
				.then(function getDefaultSongs({models, sortList}) {
					return activeTagId ? (// 加载指定的rankTag的歌曲,
						models[activeTagId] && dispatch(changeSongsOfRank(activeTagId, pageIndex))
					) : (// 但没有指定rankTag的话, 默认选择HOT_RANK的第一个rankTag
						classInfo.name == 'HOT_RANK' && dispatch(changeSongsOfRank(sortList[0])).then(()=>(sortList[0]))
					)
				})
		})
	}
}

/*用户操作系列*/
export function changeSongsOfRank(rank_id, pageIndex) {
	return (dispatch) => {
		// UI方面的调整
		dispatch(clearDates());
		dispatch(clearPageIndex());
		// 获取rank的日期版本
		dispatch(getRankDate(rank_id));
		// 获取rank歌曲
		return dispatch(getRankSongs(rank_id, pageIndex || 1));
	}
}
export function changeSongsOfDate(rankDateId) {
	return (dispatch) => {
		const pageIndex = 1; // 选择日历Rank默认是回归到第一页
		// UI方面的调整
		dispatch(changeRankDateId(rankDateId));
		dispatch(clearPageIndex());
		dispatch(getRankSongs(rankDateId, pageIndex));
	}
}
export function changeSongsOfPage(rank_id, pageIndex) {
	return (dispatch) => {
		dispatch(getRankSongs(rank_id, pageIndex))
	}
}
/*内部的异步action*/
/*获取rankTag的完整信息, 这里主要是获取rankTag的image信息*/
const
	getRankTagAllInfo = (idArrays) => (
		(dispatch) => (
			_rankDetailRequest.get({data: idArrays})
				.then((result) => (
					dispatch(receiveRankDetail(result.data))
				))
		)
	),
	getRankDate = (rank_id) => (
		(dispatch) => (
			_rankDateRequest.get({data: [{parent_id:rank_id}]})
				.then((result) => (
					dispatch(receiveRankDate(result.data, rank_id))
				))
		)
	),
	getRecommendTag = (classInfo) => (
		(dispatch) => {
			const p = _rankListRequest.get(classInfo);
			p.then(({models, sortList}) => {
				// 更新store
				dispatch(receiveRecommendTag(models, {[classInfo.name]: sortList}));
				// 请求rankTag的完整信息 fork
				dispatch(getRankTagAllInfo(sortList.map((id) => ({rank_id: id}))));
			});
			return p;
		}
	),
	getRankSongs = (rank_id, page) => (
		(dispatch) => {
			// UI方面的调整
			dispatch(onLoadingStatus());
			dispatch(clearSongs());
			// 请求数据
			return _rankSongsRequest.get({page, rank_id})
				.then((result) => (
					dispatch(receiveRankSongs(result))
				));
		}
	);
