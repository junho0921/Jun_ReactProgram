/**
 * Created by jiajunhe on 2016/12/9.
 */
/*actionType*/
import {
	RECEIVE_RECOMMEND_TAG,
	RECEIVE_RANK_DETAIL,
	RECEIVE_RANK_DATE,
	RECEIVE_RANK_SONGS,

	CHANGE_RANK_TAG,
	CHANGE_RANK_DATE,
	CHANGE_RANK_PAGE,
	TOGGLE_DATE_PANEL,
	CONTROL_SONG,

	LOADING_SONGS
} from "../../action/rank";

import {songPrivilege, by} from '../../utils/index';

const initialState = {
	rankTags:{
		// [id]: {
		// 		rank_name, rank_id, intro, publish_date, update_frequency, icon
		// } ,...
	},
	rankClass:{
		// [rankClass]: [rankId1, rankId2] ,...
	},
	songs: [],
	date: [],
	current: {
		rankDateId: null,	// (object) 日历控件的激活标签Id
		totalSongsLen: null,
		pageSize: null,
		loadingSongs: false,
		displayDatePanel: false // 控制日历控件的展示 可能需要优化
	},
	/*
	* 路由参数有: rank_id, pageIndex
	* */
};

export function _tagsReducer (result, filter) {
	// 数据处理
	let renderDatas = [],
		rankTags = {},
		idArrays = [],
		rankTags_IDArray;

	Object.keys(result.data).forEach(function (key) {
		const value = result.data[key];
		// 过滤榜单标签
		if(+value[filter]){
			value.sort = +value.sort;
			const rank_id = value.cid;
			idArrays.push({rank_id});
			rankTags[rank_id] = {
				rank_name: value.rankname,
				rank_id: rank_id
			};
			renderDatas.push(value);
		}
	});
	renderDatas.sort(by('sort'));
	rankTags_IDArray = renderDatas.map((item) => (item.cid));
	return {
		rankTags,
		idArrays,
		rankTags_IDArray
	};
}

export default Rank = (state = initialState, action) => {
	const data = action.data;

	switch (action.type){
		case RECEIVE_RECOMMEND_TAG:
			return Object.assign({...state}, {
				rankTags: 	Object.assign({...state.rankTags}, data.rankTags),
				rankClass: 	Object.assign({...state.rankClass}, data.rankClass)
			});

		case RECEIVE_RANK_DETAIL:
			let newRankTags = {};
			data.forEach((item) => {
				newRankTags[item.rank_id] = item;
			});
			return Object.assign({...state}, {
				rankTags: Object.assign({...state.rankTags}, newRankTags)
			});

		case RECEIVE_RANK_DATE:
			const dateDate = (data.data && data.data[0]) || [];
			return Object.assign({...state}, {
				dates: dateDate,
				current: Object.assign({...state.current}, {
					rankDateId: data.rank_id
				})
			});

		case RECEIVE_RANK_SONGS:
			let songs = data.songs = data.songs || [];
			songs.forEach(songPrivilege);

			return Object.assign({...state}, {
				songs,
				current: Object.assign({...state.current}, {
					totalSongsLen : data.totalSongsLen,
					pageSize : 		data.pageSize,
					rankDateId : 	data.rankDateId,
					loadingSongs : 	false
				})
			});

		/*用户操作系列*/
		case CHANGE_RANK_TAG:
			return Object.assign({...state}, {
				dates: [], // 必须清理date数据, 为了卸载日历组件.
				current: Object.assign({...state.current}, {
					pageSize: null
				}),
				songs: [] // 先清空歌曲列表
			});
			break;
		case CHANGE_RANK_DATE:
			return Object.assign({...state}, {
				current: Object.assign({...state.current}, {
					rankDateId: data.rankDateId
				}),
				songs: [] // 先清空歌曲列表
			});
			break;
		case CHANGE_RANK_PAGE:
			return Object.assign({...state}, {
				songs: [] // 先清空歌曲列表
			});

		case TOGGLE_DATE_PANEL:
			return Object.assign({...state}, {
				current: Object.assign({...state.current}, {displayDatePanel: data})
			});

		case LOADING_SONGS:
			return Object.assign({...state}, {
				current: Object.assign({...state.current}, {loadingSongs: true})
			});

		case CONTROL_SONG:
			if(data.song.length){
				let i = 0, ary = [];
				for(; i < 10; i++){ary.push(data.song[i].filename)}
				console.log(data.type.toUpperCase(), 'SONG', '==>', ary);
			}else{
				console.log(data.type.toUpperCase(), 'SONG', '==>', data.song.filename);
			}
			return state;

		default:
			return state;
	}
	return state;
}