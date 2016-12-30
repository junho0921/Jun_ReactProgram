/*基本库*/
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { Router, hashHistory } from 'react-router';
import { syncHistoryWithStore, routerMiddleware } from 'react-router-redux';
/*reducers*/
import reducers from "./reducers/index";
/*routes*/
import routes from "./routes";

// 需要routerMiddleware中间件才能给store.disptach方法传递react-router-redux的action
const middleware = routerMiddleware(hashHistory);
import ReduxThunk from 'redux-thunk';

const store = createStore(
  reducers,
  applyMiddleware(middleware, ReduxThunk)
);

const history = syncHistoryWithStore(hashHistory, store);

ReactDOM.render(
	<Provider store={store}>
		<Router history={history}>
			{routes}
		</Router>
	</Provider>,
	document.getElementById('rC')
);
