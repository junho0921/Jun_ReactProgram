'use strict';

import React from 'react';
import {Link} from 'react-router';
import PureComponent from 'react-pure-component';

const pages = {
	Rank: '排行榜',
	Singer: '歌手',
	Classification: '分类',
	Collection: '歌单',
};

const Header =  (props) => {
	console.log('渲染组件 Header');
	const isActiveClass = (pageName) => (!!props.pageName.match(pageName));
	return (
        <div className="wrap">
			{Object.keys(pages).map(function (pageName) {
                return isActiveClass(pageName) ?
					(<div className="appLink" key={pageName}>
						<span className='active'>{pages[pageName]}</span>
					</div>)
					:(<Link className="appLink" to={pageName} key={pageName}>
						<span>{pages[pageName]}</span>
					</Link>);
			})}
        </div>
	);
};

export default PureComponent(Header);
