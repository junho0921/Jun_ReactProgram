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
/*基本action creator: 信号发射器*/
const
	receiveRecommendTag = (rankTags, rankClass) => ({
		type: RECEIVE_RECOMMEND_TAG,
		data: {rankTags, rankClass}
	}),
	receiveRankDetail = (data) => ({
		type: RECEIVE_RANK_DETAIL,
		data : data
	}),
	receiveRankDate = (data, parent_rank_id) => ({
		type: RECEIVE_RANK_DATE,
		data : {data, parent_rank_id}
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
export const toggleDatePanel = (boolean) => ({
	type: TOGGLE_DATE_PANEL,
	data: boolean
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
		data: Object.assign({}, this.params, data),
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
		data: Object.assign({}, this.params, data),
	})),
	params: Object.assign({...config.param}, {data: [{parent_id: ''}]})
};
/*获取榜单请求*/
const _rankDetailRequest = {
	get: (data) => (superRequest({
		url: 'container/v1/rank',
		data: Object.assign({}, this.params, data),
		// data: this.params,
	})),
	params: Object.assign({...config.param}, {data: {data: []}})
};

/*获取排行榜标签*/
const
	_rankListRequest = {
		get: ({id, filter, name}) => (
			superRequest({
				url: 'http://lib2.service.kugou.com/recommend/data?id=' + id,
				type: 'get'
			}).then((result) => {
				_tagsReducer(result, filter)
			})
		),
		eachClassType: (handler) => (
			Promise.all(this.list.map(handler))
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
export function getAllRecommendTag_toLoadSong (activeTagId, pageIndex){
	return (dispatch) => (
		_rankListRequest.eachClassType(function (classType) {
			const getDefaultSongs = ({rankTags, rankTags_IDArray}) => (
				activeTagId ? (// 加载指定的rankTag的歌曲,
					rankTags[activeTagId] && dispatch(setCurrentRankTag(activeTagId, pageIndex))
				):(// 但没有指定rankTag的话, 默认选择HOT_RANK的第一个rankTag
					typeName == 'HOT_RANK' && dispatch(setCurrentRankTag(rankTags[rankTags_IDArray[0]].rank_id, pageIndex))
				)
			);
			return dispatch(getRecommendTag(classType)).then(getDefaultSongs)
		})
	)
}

/*用户操作系列*/
export function setCurrentRankTag(rank_id, pageIndex) {
	return (dispatch) => {
		// UI方面的调整
		dispatch(clearDates());
		dispatch(clearPageIndex());
		// 获取rank歌曲
		dispatch(getRankSongs(rank_id, pageIndex || 1));
		// 获取rank的日期版本
		dispatch(getRankDate(rank_id));
	}
}
export function setCurrentRankDate(rankDateId) {
	return (dispatch) => {
		const pageIndex = 1; // 选择日历Rank默认是回归到第一页
		// UI方面的调整
		dispatch(changeRankDateId(rankDateId));
		dispatch(clearPageIndex());
		dispatch(getRankSongs(rankDateId, pageIndex));
	}
}
export function setCurrentRankPage(rank_id, pageIndex) {
	return (dispatch) => {
		dispatch(getRankSongs(rank_id, pageIndex))
	}
}
/*内部的异步action*/
/*获取rankTag的完整信息, 这里主要是获取rankTag的image信息*/
function getRankTagAllInfo (idArrays) {
	return (dispatch) => {
		return _rankDetailRequest.get({data: idArrays})
			.then(function (result) {
				dispatch(receiveRankDetail(result.data));
			});
	}
}

function getRankDate(rank_id) {
	return (dispatch) => {
		return _rankDateRequest.get({data: [{parent_id:rank_id}]})
			.then(function (result) {
				dispatch(receiveRankDate(result.data, rank_id));
			})
	}
}

const getRecommendTag = (classType) => (
	(dispatch) => (
		_rankListRequest.get(classType)
			.then(function (tags) {
				// 更新store
				dispatch(receiveRecommendTag(tags.rankTags, {[classType.name]: tags.rankTags_IDArray}));
				// 请求rankTag的完整信息 fork
				dispatch(getRankTagAllInfo(tags.idArrays));
				return tags;
			})
	)
);

function getRankSongs(rank_id, page) {
	return (dispatch) => {
		// UI方面的调整
		dispatch(onLoadingStatus());
		dispatch(clearSongs());
		// 请求数据
		return _rankSongsRequest.get({page, rank_id})
			.then(function (result) {
				dispatch(receiveRankSongs(result));
			});
	}
}

/*不适合的*/
//function getAllRecommendTag (){
//	return Promise.all([
//		superRequest({
//			url: 'http://lib2.service.kugou.com/recommend/data?id=175',
//			type: 'get'
//		}).then((result) => (_tagsReducer(result, 'type'))),
//		superRequest({
//			url: 'http://lib2.service.kugou.com/recommend/data?id=298',
//			type: 'get'
//		}).then((result) => (_tagsReducer(result, 'is_show'))),
//		superRequest({
//			url: 'http://lib2.service.kugou.com/recommend/data?id=299',
//			type: 'get'
//		}).then((result) => (_tagsReducer(result, 'is_show')))
//	])
//}
//
//function initialPage (activeTagId, pageIndex){
//	return (dispatch) => (
//		getAllRecommendTag()
//			.then(function (tags) {
//				// 渲染
//				dispatch(receiveRecommendTag(tags.rankTags));
//				return tags;
//			})
//			.then(function (tags) {
//				// 加载指定的rankTag的歌曲, 但没有指定rankTag的话, 默认选择HOT_RANK的第一个rankTag
//				activeTagId = activeTagId || tags.rankTags[tags.rankTags_IDArray[0]].rank_id;
//
//				dispatch(setCurrentRankTag(activeTagId, pageIndex));
//				return tags;
//			})
//			.then(function (tags) {
//				// 最后, 请求rankTag的完整信息
//				dispatch(getRankTagAllInfo(tags.idArrays))
//			})
//	)
//}

/*过去式*/
//export function getAllRecommendTag_toLoadSong2(activeTagId, pageIndex) {
//	return (dispatch) => {
//		let ary = [];
//		Object.keys(_rankListRequest.type).forEach(function (typeName) {
//			const typeInfo = _rankListRequest.type[typeName];
//			// 请求数据
//			ary.push(
//				superRequest({
//					url: typeInfo.URL,
//					type: _rankListRequest.requestMethod,
//				})
//					.then((result) => (
//						_tagsReducer(result.data, typeInfo.filter)
//					))
//					.then(function (tags) {
//						// 渲染
//						dispatch(receiveRecommendTag(tags.rankTags, {[typeName]: tags.rankTags_IDArray}));
//						return tags;
//					})
//					.then(function (tags) {
//						// 请求歌曲
//						if(activeTagId && tags.rankTags[activeTagId]){
//							// 加载指定的rankTag的歌曲,
//							dispatch(setCurrentRankTag(activeTagId, pageIndex));
//
//						}else if(!activeTagId && typeName == 'HOT_RANK') {
//							// 但没有指定rankTag的话, 默认选择HOT_RANK的第一个rankTag
//							activeTagId = tags.rankTags[tags.rankTags_IDArray[0]].rank_id;
//							dispatch(setCurrentRankTag(activeTagId, pageIndex));
//						}
//						return tags;
//					})
//					.then(function (tags) {
//						// 最后, 请求rankTag的完整信息
//						dispatch(getRankTagAllInfo(tags.idArrays))
//					})
//			)
//		});
//		return Promise.all(ary);
//	};
//}