// src/redux/reducers/loadingReducer.js
// eslint-disable-next-line import/extensions
import { ActionType } from '../actions/loadingActions.js';

export default function loadingReducer(isLoading = false, action = {}) {
  switch (action.type) {
  case ActionType.SHOW_LOADING:
    return true;
  case ActionType.HIDE_LOADING:
    return false;
  default:
    return isLoading;
  }
}
