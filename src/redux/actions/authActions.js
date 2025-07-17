// src/redux/actions/authActions.js
// eslint-disable-next-line import/extensions
import { showLoading, hideLoading } from './loadingActions.js';
import {
  register,
  login,
  getOwnProfile,
  putAccessToken,
  // getAccessToken // Tidak perlu diimport di sini karena hanya dipakai internal oleh fetchWithAuth di api/index.js
// eslint-disable-next-line import/extensions
} from '../../api/index.js';

export const ActionType = {
  SET_AUTH_USER: 'SET_AUTH_USER',
  UNSET_AUTH_USER: 'UNSET_AUTH_USER',
};

export function setAuthUserActionCreator(authUser) {
  return {
    type: ActionType.SET_AUTH_USER,
    payload: {
      authUser,
    },
  };
}

export function unsetAuthUserActionCreator() {
  return {
    type: ActionType.UNSET_AUTH_USER,
    payload: {
      authUser: null,
    },
  };
}

export function asyncRegisterUser({ name, email, password }) {
  return async (dispatch) => {
    dispatch(showLoading());
    try {
      await register({ name, email, password });
      // eslint-disable-next-line no-alert
      alert('Registrasi berhasil! Silakan login.');
      return true;
    } catch (error) {
      // eslint-disable-next-line no-alert
      alert(error.message);
      return false;
    } finally {
      dispatch(hideLoading());
    }
  };
}

export function asyncLoginUser({ email, password }) {
  return async (dispatch) => {
    dispatch(showLoading());
    try {
      const token = await login({ email, password });
      putAccessToken(token);
      const authUser = await getOwnProfile();
      dispatch(setAuthUserActionCreator(authUser));
      return true;
    } catch (error) {
      // eslint-disable-next-line no-alert
      alert(error.message);
      return false;
    } finally {
      dispatch(hideLoading());
    }
  };
}

export function asyncPreloadUser() {
  return async (dispatch) => {
    dispatch(showLoading());
    try {
      const authUser = await getOwnProfile();
      dispatch(setAuthUserActionCreator(authUser));
    } catch (error) {
      dispatch(unsetAuthUserActionCreator());
      // Opsional: Hapus token jika preload gagal (misal token kadaluarsa/invalid)
      putAccessToken('');
    } finally {
      dispatch(hideLoading());
    }
  };
}

export function asyncLogoutUser() {
  return (dispatch) => {
    dispatch(unsetAuthUserActionCreator());
    putAccessToken('');
  };
}
