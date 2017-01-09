/**
 * Created by jiajunhe on 2016/12/10.
 */
import React from 'react';
import './main.css';
import {connect} from 'react-redux';
import PureComponent from 'react-pure-component';

/*
 * 外部调用:
 * 1, 传参date的数据; 2, activeId; 3, onclick;
 * 内部管理的state:
 * 事件有:1, 点击日期, 选择年份, 滚动列表
 * 1, year; 2, activeDate; 3, pageIndex
 * 1, onShow{year}; 2, memory{year:page ,...}; 3, activeDate
 * */

const config = {
	maxYearLen: 4, 	// 能显示最多的年份个数
	pageSize: 12,	// 每页显示的Date的个数
	pageWith: 168	// 每页的宽度(px)
};

// 日期的信息重新包装
const getDateFormat = (ob) =>({
	rank_dateName: 	(ob.rank_name+'').slice(-4),  		// rank_name
	rank_date: 		(ob.publish_date+'').split(' ')[0], // rank_UpdateTime
	rank_dateIntro: ob.intro, 							// rank_UpdateTime
	rank_id: 		ob.rank_id 							// rank_id
});

function datesReducer (dateDate, currentRankDateId, state) {
	const initialState = {
		list: {
			// {[year] : {
			// 		content:[rank_id, rank_id, rank_id...],
			// 		currentIndex
			// }}, ...
		},
		currentYear : null,
		displayDatePanel: false // 兼容外部控制与内部控制的
	};
	state = state || initialState;

	if(!dateDate || !dateDate.length){return false;}
	const len = dateDate.length;
	let allDates = {}, list = state.list;

	for(let i = len -1; i >=0; i--){
		let item = dateDate[i];
		item = getDateFormat(item);
		const dateYear = item.rank_date.split('-')[0];
		let dateYearList = list[dateYear] = list[dateYear] || {content:[], currentIndex: 1};
		allDates[item.rank_id] = item;
		dateYearList.content.push(item.rank_id);

		if(i == len-1 || item.rank_id == currentRankDateId){
			state.currentYear = dateYear;
		}
	}
	// 处理过多的年份
	const years = Object.keys(list);
	if(years.length > config.maxYearLen){
		let deleteLen = years.length - config.maxYearLen;
		const l = years.sort((a, b) => ((+a>+b) ? 1:-1));
		while (deleteLen--){
			delete list[l[deleteLen]];
		}
	}
	return {allDates, state}
}

const DayList = PureComponent((props) => {
	console.log('渲染组件 dayList', props);
	return (
		<ul
			className='active'>
			{props.listContent.map(function (rank_id) {
				return (
					<li
						key={rank_id}
						onClick={props.onClick && props.onClick.bind({}, rank_id)}
						className={rank_id == props.currentRankDateId && 'active'}>
						{props.allDates[rank_id].rank_dateName}</li>
				)
			})}
		</ul>
	);
});
const YearList = PureComponent((props) => {
	console.log('渲染组件 YearList', props);
	return (
		<div id="choice">
			{props.years.map(function (year) {
				return (
					<span
						className={year == props.activeYear && 'active'}
						onClick={props.onClick.bind({}, year)}
						key={year}>{year}
					</span>
				)
			})}
		</div>
	);
});
/*
* 组件在
* */
class DatePanel extends React.Component {
	// allDates: {[rank_id] : {}, [rank_id2] : {}, ... },
	constructor(props){
		super(props);
		if(props.dates.length){
			console.warn('====DatePanel  constructor====', props.dates.length);
			const data = datesReducer(props.dates, props.currentRankDateId);
			this.state = data.state;
			// Date的具体数据可以直接存储在组件实例的静态属性里, 因为在本实例组件的生命周期里不会再有改动的.
			this.allDates = data.allDates;
		}

		this.toggleDatePanel = this.toggleDatePanel.bind(this);
		this.changeYear = this.changeYear.bind(this);
		this.contentReducer = this.contentReducer.bind(this);
	}
	shouldComponentUpdate(newProps, newState){
		const pastProps = this.props;
		return (
			pastProps.currentRankDateId !== newProps.currentRankDateId ||
			pastProps.displayDatePanel !== newProps.displayDatePanel ||
			pastProps.toggleDatePanel !== newProps.toggleDatePanel ||
			newState !== this.state
		);
	}
	/*由于本组件会频繁重建, 绑定方法都应该在原型属性里*/
	changeYear (year){
		this.setState({currentYear: year})
	}
	toggleDatePanel () {
		if (this.props.toggleDatePanel) {
			this.props.toggleDatePanel();
		} else {
			this.setState({displayDatePanel: !this.state.displayDatePanel})
		}
	}
	changePage (direction){
		const currentYear = this.state.currentYear;
		const info = this.state.list[currentYear];
		const currentPage = info.currentIndex;
		let listInfo;

		if(direction == 'left' && currentPage > 1 ){
			listInfo = Object.assign({...this.state.list}, {
				[currentYear]:  Object.assign({...info})
			});
			listInfo[currentYear].currentIndex--;
			this.setState({list: listInfo})
		}else if(direction == 'right' && currentPage < Math.ceil(info.content.length / config.pageSize) ){
			listInfo = Object.assign({...this.state.list}, {
				[currentYear]:  Object.assign({...info})
			});
			listInfo[currentYear].currentIndex++;
			this.setState({list: listInfo})
		}
	}
	contentReducer() {
		const props = this.props;
		const allDates = this.allDates;
		const currentYear = this.state.currentYear;
		if(!currentYear || !allDates){return false;}

		const listInfo = this.state.list[currentYear];
		const currentRankDateId = props.currentRankDateId;

		// 判断日历表格的展示时外部控制还是内部管理.
		const isControlledDisplayPanel = props.toggleDatePanel && (props.displayDatePanel !== undefined);
		const isShowDatePanel = isControlledDisplayPanel ? props.displayDatePanel : this.state.displayDatePanel;

		let recentDateTips = '';
		if(allDates[currentRankDateId]){
			recentDateTips = allDates[currentRankDateId].rank_date;
		}else{
			try {recentDateTips = allDates[listInfo.content[0]].rank_date;} catch (e){}
		}

		const years = Object.keys(this.state.list);
		const maxPageIndex = Math.ceil(listInfo.content.length / config.pageSize);

		const btnClass = {
			left: listInfo.currentIndex == 1 && 'disable',
			right: listInfo.currentIndex == maxPageIndex && 'disable'
		};
		const listPos = {transform: 'translate3D(-${(listInfo.currentIndex - 1 ) * config.pageWith}px, 0, 0)'};

		return {
			recentDateTips,
			isShowDatePanel,
			years,
			btnClass,
			listInfo,
			listPos
		};
	}
	render () {
		console.log('渲染组件 RankDate');
		const content = this.contentReducer();
		return content && (
			<div id="rankDateWrap" className={content.isShowDatePanel ? 'showPanel': ''}>
				<div className="calender" id="calender">
					<label className="rankDate" onClick={this.toggleDatePanel}>
						<span id="rankDate">{content.recentDateTips}</span>
						<p>更新</p>
						<i className="arrow top"> </i>
					</label>
					<div id="datePanel">
						<YearList
							years={content.years}
							activeYear={this.state.currentYear}
							onClick={this.changeYear}/>
						<div id="dateContent">
							<div id="dayListWrap" style={content.listPos}>
								<DayList
									listContent={content.listInfo.content}
									onClick={this.props.onSelectDate}
									currentRankDateId={this.props.currentRankDateId}
									allDates={this.allDates}/>
							</div>
							<div className="ctrl">
								<span
									key={'left'}
									onClick={this.changePage.bind(this, 'left')}
									className={content.btnClass.left}
									id="toLeft" ><i className="arrow left"> </i></span>
								<span
									key={'right'}
									onClick={this.changePage.bind(this, 'right')}
									className = {content.btnClass.right}
									id="toRight"><i className="arrow right"> </i></span>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

DatePanel.defaultProps = {
	dates: [],
	currentRankDateId: null,
	// onSelectDate: null,
	// toggleDatePanel: null
};

DatePanel.propTypes ={
	dates: React.PropTypes.array,
	// onSelectDate: React.PropTypes.function,
	// toggleDatePanel: React.PropTypes.function
};

export default DatePanel;

// export default function RankDate (props) {
// 	return (
// 		<div>
// 			<DatePanel
// 				dates={props.dates}
// 				onSelectDate={props.onSelectDate}
// 				displayDatePanel={props.displayDatePanel}
// 				toggleDatePanel={props.toggleDatePanel}
// 				currentRankDateId={props.currentRankDateId}/>
// 			<div id="rankTips">
// 				<div className="content">
// 					<p className="intro"> </p>
// 					更新时间：
// 					<p className="updateTimes"> </p>
// 				</div>
// 			</div>
// 		</div>
// 	);
// }
