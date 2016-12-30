/**
 * Created by jiajunhe on 2016/12/9.
 */
'use strict';

import React from 'react';
import './main.css';
import {connect} from 'react-redux';

import SingerList from '../common/SingerList';
import PageIndex from '../common/PageIndex';
import Search from '../common/Search/index';

import SingerClassList from './SingerClassList';
import SortBtn from './SortBtn';
import SingerInitialList from './SingerInitialList';
import DisplayMode from './DisplayMode';
import SearchResultList from './SearchResultList';

import {
	change_singer_class,
	change_singer_displayMode,
	change_singer_page,
	change_singer_sort,
	change_singer_initial,

	receiveSearch,
	change_search_Page,

	getDefaultSingers} from '../../action/singer';

class Singer extends React.Component {
	constructor (props) {
		super(props);
		const dispatch = props.dispatch;
		// todo 使用路由参数
		dispatch(getDefaultSingers());
		// 实例对象方法, 由于只使用dispatch方法, 所以这样处理来优化
		this.change_singer_class = (sex_type, lang_ids) => {
			dispatch(receiveSearch());
			dispatch(change_singer_class(sex_type, lang_ids));
		};
		this.change_singer_sort = (sort) => (
			dispatch(change_singer_sort(sort))
		);
		this.change_singer_displayMode = (mode) => (
			dispatch(change_singer_displayMode(mode))
		);

		this.change_singer_Page = (pageIndex) => (
			dispatch(change_singer_page(pageIndex))
		);

		this.change_singer_initial = (initial) => (
			dispatch(change_singer_initial(initial))
		);
		this.onSearchOutSinger = (data) => {
			dispatch(receiveSearch(data))
		};
		this.onClearResult = () => (dispatch(receiveSearch()));
		this.onSelectSinger = (data) => {
			console.log('SingerPage onSelectSinger', data);
		};
		this.change_search_Page = (pageIndex) => {
			console.log('change_search_Page', pageIndex);
			dispatch(change_search_Page(pageIndex));
		};
	}

	render () {
		const props = this.props, singerListOptions = props.singerListOptions,
			contentClassName = "r fr contentScrollBar " + (props.onLoadingSingers && 'onLoadingSingers' || '') + (props.searchWord && ' onSearchResult' || '');

		return (
			<div className="main sng" id="singerPage">
				<div className="l fl">
					<Search
						searchPage={props.searchPage}
						searchWord={props.searchWord}
						onSearchOut={this.onSearchOutSinger}
						onSelectSinger={this.onSelectSinger}
					/>
					<SingerClassList
						lang_ids={singerListOptions.lang_ids}
						sex_type={singerListOptions.sex_type}
						onClick={this.change_singer_class}/>
				</div>
				<div className={contentClassName}>
					<div id="singerListView">
						<SingerInitialList
							initial={singerListOptions.initial}
							onClick={this.change_singer_initial}/>
						<div className="list_sort_style" id="list_sort_style">
							<DisplayMode
								displayMode={props.displayMode}
								onClick={this.change_singer_displayMode}/>
							<SortBtn
								sort={singerListOptions.sort}
								onClick={this.change_singer_sort}/>
						</div>
						{props.singersDataList.length && <SingerList
							displayMode={props.displayMode}
							onSelectSinger={this.onSelectSinger}
							singersDataList={props.singersDataList}/> || ''}
						<PageIndex
							pageIndex={props.pageIndex}
							maxPageIndex={props.maxPageIndex}
							onClick={this.change_singer_Page}/>
					</div>
					{props.searchWord && (
						<div>
							<SearchResultList
								searchWord={props.searchWord}
								onSelectSinger={this.onSelectSinger}
								onClearResult={this.onClearResult}
								singerList={props.searchResult}/>
							<PageIndex
								pageIndex={props.searchPage}
								maxPageIndex={props.searchMaxPageIndex}
								onClick={this.change_search_Page}/>
						</div>) || ''}
				</div>
			</div>
		);
	}
}

export default connect(
	(state) => {
		const data = state.Singer,
			singerListOptions = data.requestData;

		const result = {
			// 页码
			pageIndex: singerListOptions.page || 1, // 通过路由参数来控制
			maxPageIndex: data.maxPageIndex,
			// 歌手列表的相关配置, 涉及各个选项的激活值
			singerListOptions,
			// 列表的展示模式
			displayMode: data.displayMode,
			// 歌手列表内容
			singersDataList: data.singersDataList,
			// 页面加载状态
			onLoadingSingers: data.onLoadingSingers,
			// 搜索歌手列表
			searchWord: data.searchWord,
			searchResult: data.searchResult,
			searchMaxPageIndex: data.searchMaxPageIndex,
			searchPage: data.searchPage
		};
		console.log('_____Singer_props______', result);
		return result
	}
)(Singer);