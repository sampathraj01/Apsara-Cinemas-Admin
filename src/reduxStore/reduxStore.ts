import { configureStore } from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga';
import userReducer from './user/userReducer';
import { userSaga } from './user/userSaga';

import { all } from '@redux-saga/core/effects';

const reducer = {
    user: userReducer,
  }

  const sagaMiddleware = createSagaMiddleware();
const middleware = [sagaMiddleware];


const reduxStore = configureStore({
    reducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
      serializableCheck: false
    }).concat(middleware),
    devTools: true,
  
  });
  
  function* rootSaga() {
    yield all([
      userSaga(),
    ])
    // code after all-effect
  }
  
  const unsubscribe = reduxStore.subscribe(() => { console.log(reduxStore.getState()); });
  
  sagaMiddleware.run(rootSaga);
  export default reduxStore;
  
  
  // Infer the `RootState` and `AppDispatch` types from the store itself
  export type RootState = ReturnType<typeof reduxStore.getState>
  // Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
  export type AppDispatch = typeof reduxStore.dispatch