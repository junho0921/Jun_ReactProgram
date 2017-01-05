/**
 * Created by jiajunhe on 2016/12/9.
 */
'use strict';

import React from 'react';
import './main.css';
import {connect} from 'react-redux';

import RankTags from './RankTags';
import AllCtrlBtn from '../common/AllCtrlBtn';
import SongList from '../common/SongList';
import PageIndex from '../common/PageIndex';
import RankDate from '../common/RankDate/index';
import { push } from 'react-router-redux';

import {setCurrentRankPage, setCurrentRankDate, toggleDatePanel} from '../../action/rank';

class Rank extends React.Component {
	constructor(props){
		super(props);
		const _this = this, dispatch = props.dispatch;

		this.setPageIndex = (pageIndex) => {
			dispatch(setCurrentRankPage(pageIndex));
			dispatch(push('Rank/'+this.props.currentRankId+'/'+ pageIndex))
		};

		this.onSelectDate = (rank_id) => {dispatch(setCurrentRankDate(rank_id));};

		this.hideRankDatePanelIfBlur = (e) => {
			if(e.target && !_this.refs.RankDate.contains(e.target)){ _this.hideDatePanel(); }
		};

		this.toggleDatePanel = (boolean) => {dispatch(toggleDatePanel(boolean));};

		this.hideDatePanel = () => {dispatch(toggleDatePanel(false));};

	}
	render() {

		const props = this.props;
		console.log('渲染组件 Rank');
		return (
			<div id="rankPage"
				 className={props.loadingSongs?'wrap loadingSongs':'wrap'}
				/*以RankDate的显示状态来选择性绑定事件*/
				 onClick={props.displayDatePanel && this.hideRankDatePanelIfBlur}>
				<div className="l hoverScrollBar fl">
					<RankTags
						/*使用路由来控制当前加载的排行榜*/
						initialPageIndex={props.pageIndex}
						activeTagId={props.params.rank_id}/>
				</div>
				<div className="r contentScrollBar fr"
					/*以RankDate的显示状态来选择性绑定事件*/
					 onScroll={props.displayDatePanel && this.hideDatePanel}>
					<div className="top" ref='RankDate'>
						<h3 id="rankTitle">{props.currentRankTitle}</h3>
						{props.dates && props.dates.length && (<RankDate
							/*注意: 选择性的渲染组件优化性能*/
							onSelectDate={this.onSelectDate}
							dates={props.dates}
							/*注意: key是组件重新渲染的重要依据*/
							key={props.currentRankId}

							displayDatePanel={props.displayDatePanel}
							toggleDatePanel={this.toggleDatePanel}
							currentRankDateId={props.currentRankDateId}/>) || ''}
					</div>
					{props.maxPageIndex && (<PageIndex
						maxPageIndex={props.maxPageIndex}
						pageIndex={props.pageIndex}
						onClick={this.setPageIndex}/>) || ''}
					<AllCtrlBtn />
					{props.songs && props.songs.length && (<SongList
						songs={props.songs}
						preIndex={props.preIndex}/>) || ''}
				</div>
			</div>
		);
	}
}

export default connect(
	(state, props) => {
		const current = state.Rank.current,
			currentRankTag = current.rankTag,
			currentRankTitle = currentRankTag && currentRankTag.rank_name || '',
			maxPageIndex = +current.pageSize && +current.totalSongsLen && Math.ceil(
				current.totalSongsLen / current.pageSize
			) || 0;
		const
			pageIndex = props.params.pageIndex || 1,
			preIndex = pageIndex && ((pageIndex - 1) * current.pageSize + 1);

		const result = {
			// 页码
			pageIndex, // 通过路由参数来控制
			maxPageIndex,
			// 当前排行榜名称
			currentRankTitle,
			// 歌曲列表
			songs: state.Rank.songs,
			preIndex,
			// 加载歌曲的状态
			loadingSongs : current.loadingSongs,
			// 展示日历组件
			displayDatePanel: current.displayDatePanel,
			// 日历组件数据
			dates : state.Rank.dates,
			currentRankId : currentRankTag && currentRankTag.rank_id,
			currentRankDateId : current.rankDateId
		};
		// console.log('_____rank_props______', result);
		return result
	}
)(Rank);
