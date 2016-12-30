/**
 * Created by jiajunhe on 2016/12/17.
 */


import React from 'react';
import PureComponent from 'react-pure-component';

function SingerInitialList (props) {
	console.log('渲染组件 SingerInitialList');
	let initialList = [
		<span
			key='全部歌手'
			className={props.initial === '' && 'active'}
			onClick={props.onClick.bind({}, '')} title="全部歌手">全部</span>
	];
	for(let i= 65; i < 91; i++) { // 小写97~122 大写65~90
		const initial = String.fromCharCode(i);
		initialList.push(
			<span
				key={initial}
				className={props.initial == initial && 'active'}
				onClick={props.onClick.bind({}, initial)}>{initial}</span>);
	}
	return (<div className="num">{initialList}</div>);
}
export default PureComponent(SingerInitialList);