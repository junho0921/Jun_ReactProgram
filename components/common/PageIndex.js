/**
 * Created by jiajunhe on 2016/12/10.
 */
import React from 'react';
import PureComponent from 'react-pure-component';

/*
* 考虑使用react-router来执行
* */
const
	INDEX_LENGTH = 5,
	HIDE_CLASS ='hide',
	SHOW_CLASS = 'show',
	gap = Math.floor((INDEX_LENGTH - 1) / 2);

function getRange ( maxPageIndex, activeIndex ) {
	let startIndex, endIndex;

	if(maxPageIndex <= INDEX_LENGTH ){
		startIndex = 1;
		endIndex = maxPageIndex;
	} else {
		startIndex = activeIndex - gap;
		endIndex = activeIndex + gap;

		if(startIndex < 1 ){
			endIndex += (1 - startIndex);
			startIndex = 1;
		}
		if(endIndex > maxPageIndex ){
			startIndex = startIndex - (endIndex - maxPageIndex);
			endIndex = maxPageIndex;
		}
	}

	return {startIndex, endIndex}
}

const reducer = (props) => {
	const maxPageIndex = +props.maxPageIndex,
		activeIndex = +props.pageIndex;
	return {
		rang: getRange(maxPageIndex, activeIndex),
		btnClass : {
			firstPage: 	 1 == activeIndex ? HIDE_CLASS : SHOW_CLASS,
			backPage: 	 (activeIndex - 1 < 1) ? HIDE_CLASS : SHOW_CLASS,
			forwardPage: (activeIndex + 1 > maxPageIndex) ? HIDE_CLASS : SHOW_CLASS,
			endPage: 	 maxPageIndex == activeIndex ? HIDE_CLASS : SHOW_CLASS,
		},
		nextPageIndex: ((activeIndex + 1) > maxPageIndex - 1 ? maxPageIndex : (activeIndex + 1)),
		lastPageIndex: (activeIndex > 1 ? activeIndex : 1) - 1
	}
};

function PageIndex (props) {
	console.log('渲染组件 PageIndex');
	if(!props.maxPageIndex || +props.maxPageIndex < 2){return false;}

	const content = reducer(props);

	let indexBtns = [];
	for(let i = content.rang.startIndex; i <= content.rang.endIndex; i++){
		indexBtns.push(
			<span
				key={i}
				className={i == props.pageIndex && 'active'}
				title={'第${i}页'}
				onClick={props.onClick.bind({}, i)}>
				{i}
			</span>
		);
	}

	return (
		<div id="pageNavigator">
				<span
					key="首页"
					title = '首页'
					onClick = {props.onClick.bind({}, 1)}
					className = {content.btnClass.firstPage}>首页</span>
				<span
					key="上一页"
					title = '上一页'
					onClick = {props.onClick.bind({}, content.lastPageIndex)}
					className = {content.btnClass.backPage}>上一页</span>

				{indexBtns}

				<span
					key="下一页"
					title = '下一页'
					onClick = {props.onClick.bind({}, content.nextPageIndex)}
					className = {content.btnClass.forwardPage}>下一页</span>
				<span
					key="尾页"
					title = '尾页'
					onClick = {props.onClick.bind({}, props.maxPageIndex)}
					className = {content.btnClass.endPage}>尾页</span>
		</div>);
}

export default PureComponent(PageIndex);
