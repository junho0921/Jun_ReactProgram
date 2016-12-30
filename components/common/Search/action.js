/**
 * Created by jiajunhe on 2016/12/17.
 */

/*action 对动态数据有影响的动作*/
/*
 * 1, 按键操作
 * 1-1, 输入或删除, 请求联想歌手
 * 1-2, 按上下键选择联想歌手
 * 1-3, 按enter键搜索歌手
 * 2, 点击联想歌手, 清空界面
 * 3, 点击搜索按钮搜索歌手, 清空界面
 * */
import {ajax} from '../../../utils/jquery.min';
import {singerDataReducer} from './reducer';

let searchData = {
	word: '',
	i: 1,
	s: 1,
	page: 1,
	pagesize: 10,
	pid:'10009'
};

/*actionType 对于修改动态数据的类型*/
export const RECEIVE_IMAGINE_SINGER = 'RECEIVE_IMAGINE_SINGER';
export const FOCUS_MOVE = 'FOCUS_MOVE';
export const RECEIVE_SINGERS = 'RECEIVE_SINGERS';
export const CLEAR_UI = 'CLEAR_UI';
export const INPUT = 'INPUT';

const getSinger = (config) => (
	ajax(Object.assign({
		url: 'http://lib2.service.kugou.com/get/singer',// 这是已废除的接口, 上线的话要注意替换
		dataType: 'jsonp',
		timeout: 3000
	}, config))
);

export const imagineSinger = () => {
	return (dispatch, getState) => {
		searchData.page = 1;
		searchData.pagesize = 10;
		searchData.word = (getState()).inputValue.trim();

		getSinger({
			data: searchData,
			success: (result) => {
				dispatch({
					type: RECEIVE_IMAGINE_SINGER,
					data: result
				});
			},
		});
	}
};
export const input = (inputValue) => ({
	type: INPUT,
	data: inputValue
});

export const searchSinger = (searchPage, searchWord, onSearchOut) => {
	return (dispatch) => {
		// 清理
		dispatch({type: CLEAR_UI});
		// console.log('searchSinger', searchPage, searchWord,  onSearchOut);
		if(searchWord && typeof onSearchOut == 'function'){
			searchData.page = searchPage || 1;
			searchData.pagesize = 30;
			searchData.word = searchWord;
			// console.error('searchSinger', searchData);
			getSinger({
				data: searchData,
				success: (result) => {
					onSearchOut({
						data: singerDataReducer(result),
						searchWord,
						searchMaxPageIndex: result[0] && result[0].total && Math.ceil((result[0].total / 30)),
						searchPage
					});
				},
			});
		}else{console.warn((!searchWord && '请输入搜索字符串') + (typeof onSearchOut !== 'function' && ', 并传参callback'))}
	}
};

export const focusMove = (direction) => ({
	type: FOCUS_MOVE,
	data: direction
});

export const selectSinger = (singerId) => ({
	type: CLEAR_UI
});