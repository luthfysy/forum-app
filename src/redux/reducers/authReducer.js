// src/redux/reducers/authReducer.js
// eslint-disable-next-line import/extensions
import { ActionType } from '../actions/authActions.js';

export default function authReducer(authUser = null, action = {}) {
  switch (action.type) {
  case ActionType.SET_AUTH_USER:
    return action.payload.authUser;
  case ActionType.UNSET_AUTH_USER:
    return null;
  default:
    return authUser;
  }
}
