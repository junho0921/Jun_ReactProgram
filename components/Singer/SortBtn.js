/**
 * Created by jiajunhe on 2016/12/17.
 */

import React from 'react';
import PureComponent from 'react-pure-component';

const sortList = [
	{name: '歌手热度', sort: 1},
	{name: '人气飙升', sort: 2},
	{name: '最近发片', sort: 3}
];

function SortBtn (props) {
	console.log('渲染组件 SortBtn');
	return (
		<div className="sortType">
			{sortList.map((item) => (
				<span
					key={item.sort}
					className={props.sort == item.sort && 'active'}
					onClick={props.onClick.bind({}, item.sort)}>{item.name}</span>)
			)}
		</div>
	)
}

export default PureComponent(SortBtn);