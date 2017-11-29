import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';

import configureStore from './store/configure-store';

// import {createStore} from 'redux';

// import {initialState} from './reducers/index';

// import {initialState} from './reducers/state-models';
// import actions from './constants/action-types';

import App from './containers/App';

import registerServiceWorker from './registerServiceWorker';

// function initStoreModel(state = initialState) {
//     return state;
// }

// function changeStore(state = initialState, action) {
//     if (action.type === actions.CHANGE_TITLE) {
//         return {
//             ...state,
//             page: {
//                 title: action.title
//             }
//         }
//     }
//
//     return state;
// }

// const store = createStore(initStoreModel);

const store = configureStore();

store.subscribe(() => {
    console.log('subscribe', store.getState());
});
//
// store.dispatch(changeTitle('Создайте турнирную сетку'));

ReactDOM.render(
    <Provider store={store}>
        <App/>
    </Provider>,
    document.getElementById('root')
);

registerServiceWorker();
