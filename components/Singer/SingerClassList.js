/**
 * Created by jiajunhe on 2016/12/17.
 */

import React from 'react';
import PureComponent from 'react-pure-component';

const list = [
	{name: '全部歌手', 	lang_ids: '',	sex_type:''},

	{name: '华语男歌手', lang_ids: 1,	sex_type:2},
	{name: '华语女歌手', lang_ids: 1,	sex_type:1},
	{name: '华语组合', 	lang_ids: 1,	sex_type:3},

	{name: '日本男歌手', lang_ids: 2,	sex_type:2},
	{name: '日本女歌手', lang_ids: 2,	sex_type:1},
	{name: '日本组合', 	lang_ids: 2,	sex_type:3},

	{name: '韩国男歌手', lang_ids: 3,	sex_type:2},
	{name: '韩国女歌手', lang_ids: 3,	sex_type:1},
	{name: '韩国组合', 	lang_ids: 3,	sex_type:3},

	{name: '欧美男歌手', lang_ids: 4,	sex_type:2},
	{name: '欧美女歌手', lang_ids: 4,	sex_type:1},
	{name: '欧美组合', 	lang_ids: 4,	sex_type:3},

	{name: '其他', 		lang_ids: 5,	sex_type:''}
];

function SingerClassList (props) {
	console.log('渲染组件 SingerClassList');
	return (
		<ul className="sng1 clear_fix">
			{list.map((singerClass) => (
				<li
					key={singerClass.name}
					className={(props.lang_ids == singerClass.lang_ids && props.sex_type == singerClass.sex_type) ? "active type" : "type"}
					title={singerClass.name}
					onClick={props.onClick.bind({}, singerClass.sex_type, singerClass.lang_ids)}>
					{singerClass.name}
				</li>))}
		</ul>
	)
}

export default PureComponent(SingerClassList);