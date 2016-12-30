/**
 * Created by jiajunhe on 2016/12/10.
 */
import React from 'react';
import PureComponent from 'react-pure-component';

function SingerList (props) {
	console.log('渲染 SingerList');
	return (
		<div id="list" className={props.displayMode}>
			<ul>
				{props.singersDataList.map((singer) => (
					<li
						key={singer.author_id}
						onClick={props.onSelectSinger.bind({}, singer.author_id)}>
						<div className="pic">
							{singer.img && <img src={singer.img}/> || ''}
							<i className="rankWord">{singer.listIndex}. </i>
						</div>
						<span className="singerName">
								<em className="preIndex">{singer.listIndex}. </em>
							{singer.author_name}
							</span>
					</li>)
				)}
			</ul>
		</div>);
}

export default PureComponent(SingerList);
