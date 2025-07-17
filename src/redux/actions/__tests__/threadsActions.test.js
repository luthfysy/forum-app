/* eslint-disable no-trailing-spaces */
/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
/* eslint-disable no-undef */
// src/redux/actions/__tests__/threadsActions.test.js
import { configureStore } from '@reduxjs/toolkit';
import {
  asyncAddThread,
  asyncUpVoteThread,
  asyncDownVoteThread,
  asyncNeutralVoteThread,
  ActionType,
} from '../threadsActions';
import { showLoading, hideLoading } from '../loadingActions';
import * as api from '../../../api';
import threadsReducer from '../../reducers/threadsReducer';
import authReducer from '../../reducers/authReducer';
import loadingReducer from '../../reducers/loadingReducer';

// Mock api module
jest.mock('../../../api', () => ({
  createThread: jest.fn(),
  upVoteThread: jest.fn(),
  downVoteThread: jest.fn(),
  neutralVoteThread: jest.fn(),
  getAllThreads: jest.fn(), // Diperlukan untuk rollback RECEIVE_THREADS jika API-nya ada
}));

// Mock window.alert
window.alert = jest.fn();

/**
 * Skenario Pengujian async threads actions:
 * 1. asyncAddThread harus dispatch aksi yang benar ketika penambahan thread berhasil.
 * 2. asyncAddThread harus dispatch aksi yang benar dan menampilkan alert ketika penambahan thread gagal.
 * 3. asyncUpVoteThread harus dispatch aksi optimistic update dan kemudian memanggil API.
 * 4. asyncUpVoteThread harus melakukan rollback jika panggilan API upVoteThread gagal.
 * 5. asyncDownVoteThread harus dispatch aksi optimistic update dan kemudian memanggil API.
 * 6. asyncDownVoteThread harus melakukan rollback jika panggilan API downVoteThread gagal.
 * 7. asyncNeutralVoteThread harus dispatch aksi optimistic update dan kemudian memanggil API.
 * 8. asyncNeutralVoteThread harus melakukan rollback jika panggilan API neutralVoteThread gagal.
 */
describe('threads async actions', () => {
  let store;
  const mockInitialThreads = [
    {
      id: 'thread-1', title: 'Thread 1', upVotesBy: [], downVotesBy: [], ownerId: 'user-1',
    },
    {
      id: 'thread-2', title: 'Thread 2', upVotesBy: [], downVotesBy: [], ownerId: 'user-2',
    },
  ];
  const mockAuthUser = { id: 'user-auth', name: 'Auth User' };

  beforeEach(() => {
    store = configureStore({
      reducer: {
        threads: threadsReducer,
        auth: authReducer,
        loading: loadingReducer,
      },
      preloadedState: {
        threads: { list: mockInitialThreads, detailThread: null },
        auth: mockAuthUser,
      },
      middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        thunk: true,
        serializableCheck: false,
      }),
    });
    jest.clearAllMocks();
  });

  describe('asyncAddThread', () => {
    it('should dispatch correct actions when add thread succeeds', async () => {
      const mockThread = {
        id: 'thread-new', title: 'New Thread', body: 'Body', category: 'General', 
      };
      api.createThread.mockResolvedValue(mockThread);

      const result = await store.dispatch(asyncAddThread({ title: 'New Thread', body: 'Body', category: 'General' }));

      expect(store.getState().loading).toBeFalsy();
      expect(store.getState().threads.list).toContainEqual(mockThread);
      expect(api.createThread).toHaveBeenCalledWith({ title: 'New Thread', body: 'Body', category: 'General' });
      expect(window.alert).not.toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should dispatch correct actions and show alert when add thread fails', async () => {
      const errorMessage = 'Failed to create thread';
      api.createThread.mockRejectedValue(new Error(errorMessage));

      const result = await store.dispatch(asyncAddThread({ title: 'Invalid Thread', body: '', category: '' }));

      expect(store.getState().loading).toBeFalsy();
      expect(store.getState().threads.list).toEqual(mockInitialThreads); // State should not change
      expect(window.alert).toHaveBeenCalledWith(errorMessage);
      expect(result).toBe(false);
    });
  });

  describe('asyncUpVoteThread', () => {
    it('should dispatch optimistic update and then call API', async () => {
      const threadId = 'thread-1';
      api.upVoteThread.mockResolvedValue({});

      await store.dispatch(asyncUpVoteThread(threadId));

      // Verify optimistic update (user-auth should be in upVotesBy)
      const updatedThread = store.getState().threads.list.find((t) => t.id === threadId);
      expect(updatedThread.upVotesBy).toContain(mockAuthUser.id);
      expect(api.upVoteThread).toHaveBeenCalledWith(threadId);
    });

    it('should rollback if API call fails', async () => {
      const threadId = 'thread-1';
      const errorMessage = 'Vote failed';
      api.upVoteThread.mockRejectedValue(new Error(errorMessage));

      const initialUpVotesBy = [...store.getState().threads.list.find((t) => t.id === threadId).upVotesBy];
      const initialDownVotesBy = [...store.getState().threads.list.find((t) => t.id === threadId).downVotesBy];

      await store.dispatch(asyncUpVoteThread(threadId));

      // Verify rollback (upVotesBy should be back to initial)
      const revertedThread = store.getState().threads.list.find((t) => t.id === threadId);
      expect(revertedThread.upVotesBy).toEqual(initialUpVotesBy);
      expect(revertedThread.downVotesBy).toEqual(initialDownVotesBy);
      expect(window.alert).toHaveBeenCalledWith(errorMessage);
    });
  });

  describe('asyncDownVoteThread', () => {
    it('should dispatch optimistic update and then call API', async () => {
      const threadId = 'thread-1';
      api.downVoteThread.mockResolvedValue({});

      await store.dispatch(asyncDownVoteThread(threadId));

      const updatedThread = store.getState().threads.list.find((t) => t.id === threadId);
      expect(updatedThread.downVotesBy).toContain(mockAuthUser.id);
      expect(api.downVoteThread).toHaveBeenCalledWith(threadId);
    });

    it('should rollback if API call fails', async () => {
      const threadId = 'thread-1';
      const errorMessage = 'Vote failed';
      api.downVoteThread.mockRejectedValue(new Error(errorMessage));

      const initialUpVotesBy = [...store.getState().threads.list.find((t) => t.id === threadId).upVotesBy];
      const initialDownVotesBy = [...store.getState().threads.list.find((t) => t.id === threadId).downVotesBy];

      await store.dispatch(asyncDownVoteThread(threadId));

      const revertedThread = store.getState().threads.list.find((t) => t.id === threadId);
      expect(revertedThread.upVotesBy).toEqual(initialUpVotesBy);
      expect(revertedThread.downVotesBy).toEqual(initialDownVotesBy);
      expect(window.alert).toHaveBeenCalledWith(errorMessage);
    });
  });

  describe('asyncNeutralVoteThread', () => {
    it('should dispatch optimistic update and then call API', async () => {
      const threadId = 'thread-1';
      // Simulate thread already upvoted
      store = configureStore({
        reducer: { threads: threadsReducer, auth: authReducer, loading: loadingReducer },
        preloadedState: {
          threads: { list: [{ ...mockInitialThreads[0], upVotesBy: [mockAuthUser.id] }], detailThread: null },
          auth: mockAuthUser,
        },
        middleware: (getDefaultMiddleware) => getDefaultMiddleware({ thunk: true, serializableCheck: false }),
      });

      api.neutralVoteThread.mockResolvedValue({});

      await store.dispatch(asyncNeutralVoteThread(threadId));

      const updatedThread = store.getState().threads.list.find((t) => t.id === threadId);
      expect(updatedThread.upVotesBy).not.toContain(mockAuthUser.id);
      expect(updatedThread.downVotesBy).not.toContain(mockAuthUser.id);
      expect(api.neutralVoteThread).toHaveBeenCalledWith(threadId);
    });

    it('should rollback if API call fails', async () => {
      const threadId = 'thread-1';
      const errorMessage = 'Vote failed';
      // Simulate thread already upvoted
      store = configureStore({
        reducer: { threads: threadsReducer, auth: authReducer, loading: loadingReducer },
        preloadedState: {
          threads: { list: [{ ...mockInitialThreads[0], upVotesBy: [mockAuthUser.id] }], detailThread: null },
          auth: mockAuthUser,
        },
        middleware: (getDefaultMiddleware) => getDefaultMiddleware({ thunk: true, serializableCheck: false }),
      });

      api.neutralVoteThread.mockRejectedValue(new Error(errorMessage));

      const initialUpVotesBy = [...store.getState().threads.list.find((t) => t.id === threadId).upVotesBy];
      const initialDownVotesBy = [...store.getState().threads.list.find((t) => t.id === threadId).downVotesBy];

      await store.dispatch(asyncNeutralVoteThread(threadId));

      const revertedThread = store.getState().threads.list.find((t) => t.id === threadId);
      expect(revertedThread.upVotesBy).toEqual(initialUpVotesBy);
      expect(revertedThread.downVotesBy).toEqual(initialDownVotesBy);
      expect(window.alert).toHaveBeenCalledWith(errorMessage);
    });
  });
});
