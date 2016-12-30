/**
 * Created by jiajunhe on 2016/12/10.
 */
import React from 'react';
import {
	imagineSinger,
	focusMove,
	selectSinger,
	searchSinger,
	input
} from './action';

import reducer from './reducer';
import './main.css';

/*
* Search组件是用于搜索功能的组件.
* 特点:
* 1, 是独立的组件, 有自己的请求方法与数据渲染, 可以不依赖外部数据
* 2, 提供给外部组件数据:
* props = {
* 	searchWord, 	// 搜索字符串
* 	searchPage,		// 搜索字符串的页码, 可以动态传参来搜索下一页
* 	onSearchOut,	// 搜索返回结果后的callback, 传参searchWord, searchPage, result, maxPageIndex数据
* 	onSelectSinger, // 点击联想歌手后的callback
* }
*
* */
class Search extends React.Component {
	constructor(props){
		super(props);
		const _this = this,
			getState = () => (_this.state),
			dispatch = (action) => {
				if(typeof action == 'function'){action(dispatch, getState);}
				else{
					const newStateContent = reducer(_this.state, action);
					if(newStateContent){_this.setState(newStateContent);}
				}
			};

		this.state = {
			imagineList: [],
			focusIndex: '',
			inputValue: props.searchWord || ''
		};

		/*=============绑定事件=============*/
		this.selectSinger = (singerId) => (() => {
			dispatch(selectSinger(singerId));
			typeof props.onSelectSinger == 'function' && props.onSelectSinger(singerId);
		});
		this.inputChangeHandler = () => {
			dispatch(imagineSinger());
		};
		this.keyPressHandler = (e) => {
			if(e.key && e.key.length < 2){dispatch(input(e.key))}
		};
		this.keyDownHandler = (e) => {
			switch (e.keyCode) {
				// 对非输入的操作键进行对应处理
				case 38: dispatch(focusMove('up')); 	break;
				case 40: dispatch(focusMove('down')); 	break;
				case 8:  dispatch(input('deleteWord'));	break;
				case 13:
					const focusIndex = _this.state.focusIndex;
					if(focusIndex < 0){
						this.searchSinger();
					}else{
						_this.selectSinger(
							_this.state.imagineList[focusIndex].singerid
						)();
					}
			}
		};
		this.searchSinger = (searchPage, searchWord, onSearchOut) => {
			dispatch(searchSinger(
				searchPage 	|| 1,
				searchPage 	|| _this.state.inputValue.trim(),
				onSearchOut || _this.props.onSearchOut
			));
			_this.refs.searchInput.blur && _this.refs.searchInput.blur();
		};
	}

	componentWillReceiveProps(newProps){
		if(newProps.searchPage !== this.props.searchPage){
			console.warn('页面更新了searchSinger', newProps.searchPage , this.props.searchPage);
			this.searchSinger(
				newProps.searchPage,
				newProps.searchWord,
				newProps.onSearchOut
			);
		}
	}

	render() {
		console.log('渲染组件 Search');
		const imagineList = this.state.imagineList,
			focusIndex = this.state.focusIndex,
			selectSinger = this.selectSinger;

		return (
			<div
				id="SearchInput"
				className={this.state.inputValue && 'canSearch'}>
				<input
					key='searchInput'
					ref='searchInput'
					type="text"
					placeholder="搜索歌手"
					onKeyDown={this.keyDownHandler}
					onChange={this.inputChangeHandler}
					onKeyPress={this.keyPressHandler}
					value={this.state.inputValue}/>
				{imagineList.length &&
					/*联想歌手的弹层*/
					(<ul id="poplist">
						{imagineList.map((item, i) => (
							<li
								key={item.singerid}
								className={focusIndex == i && 'active'}
								title={item.singername}
								onClick={selectSinger.bind({}, item.singerid)}>
								{item.singername}
							</li>)
						)}
					</ul>) || ''}
				<span id='searchBtn' title="搜索" onClick={this.searchSinger}>
					<i className="optSongBtn searchBtn" />
				</span>
			</div>
		);
	}
}

export default Search;
