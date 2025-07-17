// src/redux/reducers/usersReducer.js
// eslint-disable-next-line import/extensions
import { ActionType } from '../actions/usersActions.js';

export default function usersReducer(users = [], action = {}) {
  switch (action.type) {
  case ActionType.RECEIVE_USERS:
    return action.payload.users;
  default:
    return users;
  }
}
