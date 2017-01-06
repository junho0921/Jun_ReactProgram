/**
 * Created by jiajunhe on 2016/12/10.
 */
import React from 'react';
import {connect} from 'react-redux';

function CtrlBtn (props) {
	console.log('渲染组件 CtrlBtn');
	const ctrlSong = (type) => (() =>{
		console.log(type, props.song);
	});

	return (
		<div className="fr">
			<span title="播放" onClick={ctrlSong('play')} className="listen optSongBtn"> </span>
			<span title="添加" onClick={ctrlSong('add')} className="add optSongBtn"> </span>
			<span title="下载" onClick={ctrlSong('download')} className="optSongBtn download"> </span>
		</div>
	);
}
export default connect()(CtrlBtn);


