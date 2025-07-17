// src/redux/reducers/__tests__/authReducer.test.js
import authReducer from '../authReducer';
import { ActionType } from '../../actions/authActions';

/**
 * Skenario Pengujian authReducer:
 * 1. Mengembalikan null sebagai state awal.
 * 2. Mengembalikan authUser ketika diberi action SET_AUTH_USER.
 * 3. Mengembalikan null ketika diberi action UNSET_AUTH_USER.
 * 4. Mengembalikan state asli ketika diberi action yang tidak dikenal.
 */
// eslint-disable-next-line no-undef
describe('authReducer', () => {
  // eslint-disable-next-line no-undef
  it('should return null as the initial state', () => {
    const initialState = undefined;
    const action = {};
    const nextState = authReducer(initialState, action);
    // eslint-disable-next-line no-undef
    expect(nextState).toBeNull();
  });

  // eslint-disable-next-line no-undef
  it('should return the authUser when given SET_AUTH_USER action', () => {
    const initialState = null;
    const authUser = {
      id: 'user-123',
      name: 'John Doe',
      email: 'john@example.com',
      avatar: 'https://example.com/avatar.jpg',
    };
    const action = {
      type: ActionType.SET_AUTH_USER,
      payload: { authUser },
    };
    const nextState = authReducer(initialState, action);
    // eslint-disable-next-line no-undef
    expect(nextState).toEqual(authUser);
  });

  // eslint-disable-next-line no-undef
  it('should return null when given UNSET_AUTH_USER action', () => {
    const initialState = {
      id: 'user-123',
      name: 'John Doe',
      email: 'john@example.com',
      avatar: 'https://example.com/avatar.jpg',
    };
    const action = {
      type: ActionType.UNSET_AUTH_USER,
      payload: { authUser: null },
    };
    const nextState = authReducer(initialState, action);
    // eslint-disable-next-line no-undef
    expect(nextState).toBeNull();
  });

  // eslint-disable-next-line no-undef
  it('should return the original state when given an unknown action', () => {
    const initialState = { id: 'user-123' };
    const action = { type: 'UNKNOWN_ACTION' };
    const nextState = authReducer(initialState, action);
    // eslint-disable-next-line no-undef
    expect(nextState).toEqual(initialState);
  });
});
