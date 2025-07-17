/* eslint-disable no-undef */
// src/redux/actions/__tests__/authActions.test.js
import { configureStore } from '@reduxjs/toolkit';
import { asyncLoginUser, asyncRegisterUser } from '../authActions';
import * as api from '../../../api'; // Menggunakan alias untuk api
import authReducer from '../../reducers/authReducer';
import loadingReducer from '../../reducers/loadingReducer';

// Mock api module
// eslint-disable-next-line no-undef
jest.mock('../../../api', () => ({
  // eslint-disable-next-line no-undef
  login: jest.fn(),
  // eslint-disable-next-line no-undef
  register: jest.fn(),
  // eslint-disable-next-line no-undef
  getOwnProfile: jest.fn(),
  // eslint-disable-next-line no-undef
  putAccessToken: jest.fn(),
}));

// Mock window.alert
// eslint-disable-next-line no-undef
window.alert = jest.fn();

/**
 * Skenario Pengujian asyncLoginUser dan asyncRegisterUser:
 * 1. asyncLoginUser harus dispatch aksi yang benar ketika login berhasil.
 * 2. asyncLoginUser harus dispatch aksi yang benar dan menampilkan alert ketika login gagal.
 * 3. asyncRegisterUser harus dispatch aksi yang benar dan menampilkan alert ketika registrasi berhasil.
 * 4. asyncRegisterUser harus dispatch aksi yang benar dan menampilkan alert ketika registrasi gagal.
 */
// eslint-disable-next-line no-undef
describe('auth async actions', () => {
  let store;

  // eslint-disable-next-line no-undef
  beforeEach(() => {
    store = configureStore({
      reducer: {
        auth: authReducer,
        loading: loadingReducer,
      },
      middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        thunk: true, // Pastikan Redux Thunk aktif
        serializableCheck: false, // Nonaktifkan cek serializable untuk mock
      }),
    });
    // Reset mocks sebelum setiap tes
    // eslint-disable-next-line no-undef
    jest.clearAllMocks();
  });

  describe('asyncLoginUser', () => {
    it('should dispatch correct actions when login succeeds', async () => {
      // Skenario: login berhasil
      const mockToken = 'mockAccessToken';
      const mockAuthUser = { id: 'user-123', name: 'Test User' };

      api.login.mockResolvedValue(mockToken);
      api.getOwnProfile.mockResolvedValue(mockAuthUser);

      await store.dispatch(asyncLoginUser({ email: 'test@example.com', password: 'password123' }));

      // Memverifikasi dispatch (dengan memeriksa state yang berubah)
      expect(store.getState().loading).toBeFalsy();
      expect(store.getState().auth).toEqual(mockAuthUser);

      expect(api.login).toHaveBeenCalledWith({ email: 'test@example.com', password: 'password123' });
      expect(api.putAccessToken).toHaveBeenCalledWith(mockToken);
      expect(api.getOwnProfile).toHaveBeenCalled();
      expect(window.alert).not.toHaveBeenCalled();
    });

    it('should dispatch correct actions and show alert when login fails', async () => {
      // Skenario: login gagal
      const errorMessage = 'Login failed';
      api.login.mockRejectedValue(new Error(errorMessage));

      await store.dispatch(asyncLoginUser({ email: 'wrong@example.com', password: 'wrongpassword' }));

      expect(store.getState().loading).toBeFalsy();
      expect(store.getState().auth).toBeNull();

      expect(api.login).toHaveBeenCalledWith({ email: 'wrong@example.com', password: 'wrongpassword' });
      expect(api.putAccessToken).not.toHaveBeenCalled();
      expect(api.getOwnProfile).not.toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith(errorMessage);
    });
  });

  describe('asyncRegisterUser', () => {
    it('should dispatch correct actions and show alert when registration succeeds', async () => {
      // Skenario: registrasi berhasil
      const mockUser = { id: 'new-user', name: 'New User' };
      api.register.mockResolvedValue(mockUser);

      await store.dispatch(asyncRegisterUser({ name: 'New User', email: 'new@example.com', password: 'newpassword' }));

      expect(store.getState().loading).toBeFalsy();
      expect(window.alert).toHaveBeenCalledWith('Registrasi berhasil! Silakan login.');
      expect(api.register).toHaveBeenCalledWith({ name: 'New User', email: 'new@example.com', password: 'newpassword' });
    });

    it('should dispatch correct actions and show alert when registration fails', async () => {
      // Skenario: registrasi gagal
      const errorMessage = 'Registration failed';
      api.register.mockRejectedValue(new Error(errorMessage));

      await store.dispatch(asyncRegisterUser({ name: 'Invalid User', email: 'invalid@example.com', password: 'invalidpassword' }));

      expect(store.getState().loading).toBeFalsy();
      expect(window.alert).toHaveBeenCalledWith(errorMessage);
      expect(api.register).toHaveBeenCalledWith({ name: 'Invalid User', email: 'invalid@example.com', password: 'invalidpassword' });
    });
  });
});
