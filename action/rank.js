'use strict';
export const
	// 常量: 服务器返回信息
	RECEIVE_RECOMMEND_TAG = 'RECEIVE_RECOMMEND_TAG',
	RECEIVE_RANK_DETAIL = 'RECEIVE_RANK_DETAIL',
	RECEIVE_RANK_DATE = 'RECEIVE_RANK_DATE',
	RECEIVE_RANK_SONGS = 'RECEIVE_RANK_SONGS',
	// 常量: 状态
	CLEAR_DATES = 'CLEAR_DATES',
	CLEAR_SONGS = 'CLEAR_SONGS',
	CLEAR_PAGE_INDEX = 'CLEAR_PAGE_INDEX',
	ON_LOADING_STATUS = 'ON_LOADING_STATUS',
	// 常量: 操作
	TOGGLE_DATE_PANEL = 'TOGGLE_DATE_PANEL',
	CHANGE_RANK_DATE_ID = 'CHANGE_RANK_DATE_ID',
/*基本action creator: 信号发射器: 指示reducer处理数据*/
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
	}),
	toggleDatePanel = (data) => ({
		type: TOGGLE_DATE_PANEL,
		data
	});

// 异步动作信号
export const
	INITIAL_CONTENT = 'INITIAL_CONTENT',
	CHANG_SONGS_RANK = 'CHANG_SONGS_RANK',
	CHANG_SONGS_DATE = 'CHANG_SONGS_DATE',
	CHANG_SONGS_PAGE = 'CHANG_SONGS_PAGE',
	initialContent = (activeTagId, pageIndex) => ({
		type: CHANG_SONGS_RANK,
		data: activeTagId, pageIndex
	}),
	changeSongsOfRank = (rank_id, pageIndex) => ({
		type: INITIAL_CONTENT,
		data: rank_id, pageIndex
	}),
	changeSongsOfDate = (rankDateId) => ({
		type: CHANG_SONGS_DATE,
		data: rankDateId
	}),
	changeSongsOfPage = (rank_id, pageIndex) => ({
		type: CHANG_SONGS_PAGE,
		data: rank_id, pageIndex
	});