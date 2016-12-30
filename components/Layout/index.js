'use strict';

import React from 'react';

import Header from '../Header/index';

const Layout = (props) => {
	let pageName = props.location.pathname || '';
	pageName = pageName.split('/')[(pageName.slice(0,1) == '/' ? 1 : 0)];

	return (
		<div id="appWrap">
			<h2>Layout</h2>
			<section id="appHeader">
				<Header pageName={pageName}/>
			</section>
			<section id="appContainer">
				{props.children}
			</section>
		</div>
	)
};

export default Layout;