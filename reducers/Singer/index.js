/**
 * Created by jiajunhe on 2016/12/9.
 */
/*actionType*/
import {
	RECEIVE_SINGERS,
	CHANGE_DISPLAY_MODE,

	CHANGE_SEARCH_PAGE,
	RECEIVE_SEARCH,

	LOADING_SINGERS
} from "../../action/singer";

import {completeImgUrl} from '../../utils/index';

const initialState = {
	/*singers请求数据相关的*/
	requestData :{
		initial: '',
		sort: 1,
		lang_ids: '',
		sex_type: '',
		page:  1,
		pagesize: 60,
	},
	/*singers的基本数据*/
	singersDataList: [
		// { img, author_name, author_id, listIndex } ,...
	],
	/*展示模式*/
	displayMode: 'imgMode',
	/*页码*/
	maxPageIndex: 0,
	/*加载状态*/
	onLoadingSingers: false,
	/*搜索歌手*/
	searchWord: '',
	searchMaxPageIndex: 0,
	searchPage: 1,
	searchResult: [],
};

const Singer = (state = initialState, action) => {
	const data = action.data;

	switch (action.type){
		case RECEIVE_SINGERS:
			const config = data.config;
			const result = data.result,
				preIndex = (config.pagesize * (config.page - 1)) + 1;

			if(result.data && result.data.length){
				result.data.forEach((singerData, i) => {
					singerData.img = completeImgUrl(singerData.avatar);
					singerData.listIndex = preIndex + i;
				})
			}
			return Object.assign({...state}, {
				maxPageIndex: result.total && Math.ceil(result.total / config.pagesize) || 0,
				singersDataList: result.data,
				requestData: config,
				onLoadingSingers: false
			});
		case CHANGE_DISPLAY_MODE:
			return Object.assign({...state}, {displayMode: data});
		case LOADING_SINGERS:
			return Object.assign({...state}, {
				requestData: data.config,
				onLoadingSingers: true
			});

		/*搜索*/
		case RECEIVE_SEARCH:
			console.log('RECEIVE_SEARCH搜索', data);
			return Object.assign({...state}, {
				searchResult: data.data || [],
				searchWord: data.searchWord	|| '',
				searchPage: data.searchPage	|| 1,
				searchMaxPageIndex: data.searchMaxPageIndex || 0
			});
		case CHANGE_SEARCH_PAGE:
			return Object.assign({...state}, {
				searchPage: data
			});

		default:
			return state;
	}
};
export default Singer;