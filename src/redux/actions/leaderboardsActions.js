/* eslint-disable import/extensions */
// src/redux/actions/leaderboardsActions.js
import { showLoading, hideLoading } from './loadingActions.js';
import { getLeaderboards } from '../../api/index.js';

export const ActionType = {
  RECEIVE_LEADERBOARDS: 'RECEIVE_LEADERBOARDS',
};

export function receiveLeaderboardsActionCreator(leaderboards) {
  return {
    type: ActionType.RECEIVE_LEADERBOARDS,
    payload: {
      leaderboards,
    },
  };
}

export function asyncReceiveLeaderboards() {
  return async (dispatch) => {
    dispatch(showLoading());
    try {
      const leaderboards = await getLeaderboards();
      dispatch(receiveLeaderboardsActionCreator(leaderboards));
    } catch (error) {
      // eslint-disable-next-line no-alert
      alert(error.message);
    } finally {
      dispatch(hideLoading());
    }
  };
}
