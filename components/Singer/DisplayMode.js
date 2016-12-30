/**
 * Created by jiajunhe on 2016/12/17.
 */


import React from 'react';
import PureComponent from 'react-pure-component';

const displayModeList = ['imgMode', 'listMode'];
function DisplayMode (props) {
	console.log('渲染组件 DisplayMode');
	return (
		<div className="displaySelect">
			<p className="tips">显示:</p>
			{displayModeList.map((displayMode) => (
				<span
					key={displayMode}
					className={props.displayMode == displayMode ? "active displayMode" : "displayMode"}
					onClick={props.onClick.bind({}, displayMode)}>
						<i className={"optSongBtn "+ displayMode} /></span>
			))}
		</div>
	)
}
export default PureComponent(DisplayMode);
