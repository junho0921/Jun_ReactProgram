
import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import Rank from './Rank/index';
import Singer from './Singer/index';

// 将现有的reduces加上路由的reducer
const rootReducer = combineReducers({
	// 添加各个页面的reducer
	Rank,
	Singer,
	routing: routerReducer
});

export default rootReducer;
