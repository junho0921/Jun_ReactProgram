/**
 * Created by jiajunhe on 2017/1/9.
 */
import {
	receiveRecommendTag,
	receiveRankDetail,
	receiveRankDate,
	receiveRankSongs,
	changeRankDateId,
	clearDates,
	clearSongs,
	clearPageIndex,
	onLoadingStatus,

	changeSongsOfRank,

	INITIAL_CONTENT,

	CHANG_SONGS_RANK,
	CHANG_SONGS_DATE,
	CHANG_SONGS_PAGE
} from '../action/rank';
import { take, put, call, fork, race, cancelled, all } from 'redux-saga/effects';

import {
	_rankSongsRequest,
	_rankDateRequest,
	_rankDetailRequest,
	_rankListRequest
} from '../utils/requestApi';

/*内部的异步action*/
/*获取rankTag的完整信息, 这里主要是获取rankTag的image信息*/

function* getRankTagAllInfo (idArrays){
	const result = yield call(_rankDetailRequest.get, {data: idArrays});
	yield put(receiveRankDetail(result.data));
}
function* getRankDate (rank_id){
	const result = yield call(_rankDateRequest.get, {data: [{parent_id:rank_id}]});
	yield put(receiveRankDate(result.data, rank_id));
}
function* getRankSongs (rank_id, page){
	yield put(onLoadingStatus());
	yield put(clearSongs());
	const result = yield call(_rankSongsRequest.get, {page, rank_id});
	yield put(receiveRankSongs(result))
}
function* getRecommendTag (classInfo){
	const {models, sortList} = yield call(_rankListRequest.get, classInfo);
	yield put(receiveRecommendTag(models, {[classInfo.name]: sortList}));
	// 请求rankTag的完整信息 fork
	yield fork(getRankTagAllInfo, sortList.map((id) => ({rank_id: id})));
	return {models, sortList}
}

/*用户操作系列*/
function* listen_changeSongsOfRank() {
	while(true) {
		const {rank_id, pageIndex} = yield take(CHANG_SONGS_RANK);
		yield put(clearDates());
		yield put(clearPageIndex());
		yield fork(getRankDate, rank_id);
		yield fork(getRankSongs, rank_id, pageIndex);
	}
}
function* listen_changeSongsOfDate() {
	while(true) {
		const {rankDateId} = yield take(CHANG_SONGS_DATE);
		yield put(changeRankDateId(rankDateId));
		yield put(clearPageIndex());
		yield fork(getRankSongs, rankDateId, 1);
	}
}
function* listen_changeSongsOfPage() {
	while(true) {
		const {rank_id, pageIndex} = yield take(CHANG_SONGS_PAGE);
		yield fork(getRankSongs, rank_id, pageIndex);
	}
}

/*异步的action creator*/
/*页面初始化就要获取推荐的rank标签并在获取后要立即请求默认的rank歌曲.*/
function* listen_initialContent (){
	const {activeTagId, pageIndex, callback} = yield take(INITIAL_CONTENT);
	const re = yield _rankListRequest.list.map((classInfo) => (
		call(function* (classInfo) {
			const {models, sortList} = yield call(getRecommendTag, classInfo);

			if(activeTagId && models[activeTagId]){
				yield put(changeSongsOfRank(activeTagId, pageIndex));
			}else if(!activeTagId && classInfo.name == 'HOT_RANK'){
				yield put(changeSongsOfRank(sortList[0]));
				console.log('sortList[0]', sortList[0]);
				return sortList[0];
			}
		}, classInfo)
	));
	callback(re);
}

export default function* root() {
	yield fork(listen_initialContent);
	yield fork(listen_changeSongsOfRank);
	yield fork(listen_changeSongsOfDate);
	yield fork(listen_changeSongsOfPage);
}
