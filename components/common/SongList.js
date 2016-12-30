/**
 * Created by jiajunhe on 2016/12/10.
 */
import React from 'react';
import CtrlBtn from './CtrlBtn';
import PureComponent from 'react-pure-component';

function SongList (props) {
	console.log('渲染组件 SongList');
	const preIndex = props.preIndex;
	return (
		<div id="list" className="clear_fix">
			<ul className="clear_fix" id="songList">
				{props.songs.map((song, i) => (
					<li
						key={song.filename}
						title={song.filename}>
						<span className="num">{preIndex + i}. </span>
						<span className="text">{song.filename}</span>
						<CtrlBtn song={song}/>
					</li>)
				)}
			</ul>
		</div>);
}

export default PureComponent(SongList);
