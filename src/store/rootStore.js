import { createStore, applyMiddleware, compose } from 'redux';
import reducer from './reducers';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducer, undefined, composeEnhancers(applyMiddleware()));

export default store;
