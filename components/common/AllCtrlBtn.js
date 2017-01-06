/**
 * Created by jiajunhe on 2016/12/10.
 */
import React from 'react';
import {connect} from 'react-redux';

function AllCtrlBtn (props) {
	console.log('渲染组件 AllCtrlBtn');
	const songs = props.songs;
	const ctrlSong = (type) => (() => {
		if(songs && songs.length){
			console.log(type, songs);
		}else{console.log('没有歌曲信息');}
	});

	return (
		<div className="allCtrl">
			<span onClick={ctrlSong('play')} className="optSongBtn listen all">播放全部</span>
			<span onClick={ctrlSong('add')} className="optSongBtn add all">添加全部</span>
			<span onClick={ctrlSong('download')} className="optSongBtn download all">下载全部</span>
		</div>
	);
}
export default connect((state)=>({
	songs: state.Rank.songs
}))(AllCtrlBtn);

