'use strict';

import React from 'react';
import { Route } from 'react-router';

/*组件*/
import Layout from './components/Layout/index';
import Rank from './components/Rank/index';
import Singer from './components/Singer/index';
import Singer_detail from './components/Singer_detail/index';
import Collection from './components/Collection/index';
import Classification from './components/Classification/index';
import Collection_detail from './components/Collection_detail/index';

export default (
    <Route path="/" component={Layout}>
		<Route path="Rank(/:rank_id(/:pageIndex))" component={Rank} />
		<Route path="Singer" component={Singer} />
		<Route path="Singer_detail" component={Singer_detail} />
		<Route path="Classification" component={Classification} />
		<Route path="Collection" component={Collection} />
		<Route path="Collection_detail" component={Collection_detail} />
    </Route>
);
