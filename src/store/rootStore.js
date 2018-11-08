import { createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools';

import reducer from './reducers';

// const store = createStore(reducer, undefined, composeWithDevTools());
const store = createStore(reducer, undefined);

// persistStore(store, { whitelist: ['user']});

export default store;
