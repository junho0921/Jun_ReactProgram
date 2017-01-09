import {
	receiveRecommendTag,
	receiveRankDetail,
	receiveRankDate,
	receiveRankSongs,
	changeRankDateId,
	clearDates,
	clearSongs,
	clearPageIndex,
	onLoadingStatus
} from './rank';
import {
	_rankSongsRequest,
	_rankDateRequest,
	_rankDetailRequest,
	_rankListRequest
} from '../utils/requestApi';

/*异步的action creator*/
/*页面初始化就要获取推荐的rank标签并在获取后要立即请求默认的rank歌曲.*/
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
