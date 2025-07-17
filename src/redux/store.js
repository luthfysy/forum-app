/* eslint-disable import/extensions */
// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import threadsReducer from './reducers/threadsReducer.js';
import authReducer from './reducers/authReducer.js';
import usersReducer from './reducers/usersReducer.js';
import loadingReducer from './reducers/loadingReducer.js';
import leaderboardsReducer from './reducers/leaderboardsReducer.js';

const store = configureStore({
  reducer: {
    threads: threadsReducer,
    auth: authReducer,
    users: usersReducer,
    loading: loadingReducer,
    leaderboards: leaderboardsReducer,
  },
});

export default store;
