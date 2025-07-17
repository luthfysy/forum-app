/* eslint-disable import/extensions */
// src/redux/actions/usersActions.js
import { showLoading, hideLoading } from './loadingActions.js';
import { getAllUsers } from '../../api/index.js';

export const ActionType = {
  RECEIVE_USERS: 'RECEIVE_USERS',
};

export function receiveUsersActionCreator(users) {
  return {
    type: ActionType.RECEIVE_USERS,
    payload: {
      users,
    },
  };
}

export function asyncReceiveUsers() {
  return async (dispatch) => {
    dispatch(showLoading());
    try {
      const users = await getAllUsers();
      dispatch(receiveUsersActionCreator(users));
    } catch (error) {
      // eslint-disable-next-line no-alert
      alert(error.message);
    } finally {
      dispatch(hideLoading());
    }
  };
}
