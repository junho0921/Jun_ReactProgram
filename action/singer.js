'use strict';
import {_singerRequest} from '../utils/requestApi';
import {superRequest} from '../utils/index';

// 常量: 服务器返回信息
export const RECEIVE_SINGERS = 'RECEIVE_SINGERS';
// 常量: 用户操作
export const CHANGE_DISPLAY_MODE = 'CHANGE_DISPLAY_MODE';
// 常量: 状态
export const LOADING_SINGERS = 'LOADING_SINGERS';
// 常量: 搜索
export const RECEIVE_SEARCH = 'RECEIVE_SEARCH';
export const CHANGE_SEARCH_PAGE = 'CHANGE_SEARCH_PAGE';

import { push } from 'react-router-redux';

const getSingers = (data) => ((dispatch, getState) => {
	if(!data){return false}
	const state = getState();
	let requestData = state.Singer.requestData;
	requestData = Object.assign({...requestData}, data);
	// 改变页面状态
	dispatch({
		type: LOADING_SINGERS,
		data: {config: requestData}
	});
	// 请求数据
	superRequest({
		url: _singerRequest.URL,
		data: Object.assign({..._singerRequest.data}, requestData),
		success: function(result){
			dispatch({
				type: RECEIVE_SINGERS,
				data:{
					result,
					config: requestData
				}
			})
		}
	});
});

export const getDefaultSingers = (data) => (
	getSingers(Object.assign({
		initial: '',
		lang_ids: '',
		sort: 1,
		sex_type: '',
		page: 1,
		pagesize: 60
	}, data || {}))
);

export const change_singer_initial = (initial) => (
	getSingers({
		initial,
		page: 1
	})
);

export const change_singer_class = (sex_type, lang_ids) => (
	getSingers({
		initial: '',
		page: 1,
		sex_type,
		lang_ids
	})
);
export const change_singer_sort = (sort) => (
	getSingers({sort})
);
export const change_singer_page = (page) => (
	getSingers({page})
);

export const change_singer_displayMode = (displayMode) =>({
	type: CHANGE_DISPLAY_MODE,
	data: displayMode
});

/*歌手链接*/
function linkToSingerDetail(singerId){
	console.log('linkToSingerDetail', singerId);
}

/*搜索*/
export const receiveSearch = (data) => ({
	type: RECEIVE_SEARCH,
	data : data || {}
});
export const change_search_Page = (pageIndex) => ({
	type: CHANGE_SEARCH_PAGE,
	data: pageIndex
});