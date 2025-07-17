// src/redux/actions/loadingActions.js
export const ActionType = {
  SHOW_LOADING: 'SHOW_LOADING',
  HIDE_LOADING: 'HIDE_LOADING',
};

export function showLoading() {
  return { type: ActionType.SHOW_LOADING };
}

export function hideLoading() {
  return { type: ActionType.HIDE_LOADING };
}
