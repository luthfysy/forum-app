/* eslint-disable import/extensions */
// src/redux/actions/threadsActions.js
import { showLoading, hideLoading } from './loadingActions.js';
import {
  getAllThreads,
  createThread,
  getDetailThread,
  createComment,
  upVoteThread,
  downVoteThread,
  neutralVoteThread,
  upVoteComment,
  downVoteComment,
  neutralVoteComment,
} from '../../api/index.js';

export const ActionType = {
  RECEIVE_THREADS: 'RECEIVE_THREADS',
  ADD_THREAD: 'ADD_THREAD',
  RECEIVE_DETAIL_THREAD: 'RECEIVE_DETAIL_THREAD',
  CLEAR_DETAIL_THREAD: 'CLEAR_DETAIL_THREAD',
  ADD_COMMENT: 'ADD_COMMENT',
  UP_VOTE_THREAD: 'UP_VOTE_THREAD',
  DOWN_VOTE_THREAD: 'DOWN_VOTE_THREAD',
  NEUTRAL_VOTE_THREAD: 'NEUTRAL_VOTE_THREAD',
  UP_VOTE_COMMENT: 'UP_VOTE_COMMENT',
  DOWN_VOTE_COMMENT: 'DOWN_VOTE_COMMENT',
  NEUTRAL_VOTE_COMMENT: 'NEUTRAL_VOTE_COMMENT',
};

export function receiveThreadsActionCreator(threads) {
  return {
    type: ActionType.RECEIVE_THREADS,
    payload: {
      threads,
    },
  };
}

export function addThreadActionCreator(thread) {
  return {
    type: ActionType.ADD_THREAD,
    payload: {
      thread,
    },
  };
}

export function receiveDetailThreadActionCreator(detailThread) {
  return {
    type: ActionType.RECEIVE_DETAIL_THREAD,
    payload: {
      detailThread,
    },
  };
}

export function clearDetailThreadActionCreator() {
  return {
    type: ActionType.CLEAR_DETAIL_THREAD,
    payload: null,
  };
}

export function addCommentActionCreator(comment) {
  return {
    type: ActionType.ADD_COMMENT,
    payload: {
      comment,
    },
  };
}

// Thunks
export function asyncReceiveThreads() {
  return async (dispatch) => {
    dispatch(showLoading());
    try {
      const threads = await getAllThreads();
      dispatch(receiveThreadsActionCreator(threads));
    } catch (error) {
      // eslint-disable-next-line no-alert
      alert(error.message);
    } finally {
      dispatch(hideLoading());
    }
  };
}

export function asyncAddThread({ title, body, category }) {
  return async (dispatch) => {
    dispatch(showLoading());
    try {
      const thread = await createThread({ title, body, category });
      dispatch(addThreadActionCreator(thread));
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

export function asyncReceiveDetailThread(threadId) {
  return async (dispatch) => {
    dispatch(showLoading());
    try {
      const detailThread = await getDetailThread(threadId);
      dispatch(receiveDetailThreadActionCreator(detailThread));
    } catch (error) {
      // eslint-disable-next-line no-alert
      alert(error.message);
    } finally {
      dispatch(hideLoading());
    }
  };
}

export function asyncAddComment({ threadId, content }) {
  return async (dispatch) => {
    dispatch(showLoading());
    try {
      const comment = await createComment({ threadId, content });
      dispatch(addCommentActionCreator(comment));
      dispatch(asyncReceiveDetailThread(threadId)); // Refresh detail thread for new comment count
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

// Optimistic Vote Thunks for Threads
export function asyncUpVoteThread(threadId) {
  return async (dispatch, getState) => {
    const { auth, threads } = getState();
    const userId = auth ? auth.id : null;
    if (!userId) {
      // eslint-disable-next-line no-alert
      alert('Login untuk vote!');
      return;
    }

    const thread = threads.list.find((t) => t.id === threadId);
    if (!thread) return;

    const initialUpVotesBy = [...thread.upVotesBy];
    const initialDownVotesBy = [...thread.downVotesBy];

    dispatch({
      type: ActionType.UP_VOTE_THREAD,
      payload: { threadId, userId },
    });

    try {
      await upVoteThread(threadId);
    } catch (error) {
      // eslint-disable-next-line no-alert
      alert(error.message);
      // Rollback optimistic update for list
      const revertedThreads = threads.list.map((t) => {
        if (t.id === threadId) {
          return { ...t, upVotesBy: initialUpVotesBy, downVotesBy: initialDownVotesBy };
        }
        return t;
      });
      dispatch({
        type: ActionType.RECEIVE_THREADS,
        payload: {
          threads: revertedThreads,
        },
      });

      // Rollback optimistic update for detailThread if it's the current one
      if (threads.detailThread && threads.detailThread.id === threadId) {
        dispatch(receiveDetailThreadActionCreator({
          ...threads.detailThread,
          upVotesBy: initialUpVotesBy,
          downVotesBy: initialDownVotesBy,
        }));
      }
    }
  };
}

export function asyncDownVoteThread(threadId) {
  return async (dispatch, getState) => {
    const { auth, threads } = getState();
    const userId = auth ? auth.id : null;
    if (!userId) {
      // eslint-disable-next-line no-alert
      alert('Login untuk vote!');
      return;
    }

    const thread = threads.list.find((t) => t.id === threadId);
    if (!thread) return;

    const initialUpVotesBy = [...thread.upVotesBy];
    const initialDownVotesBy = [...thread.downVotesBy];

    dispatch({
      type: ActionType.DOWN_VOTE_THREAD,
      payload: { threadId, userId },
    });

    try {
      await downVoteThread(threadId);
    } catch (error) {
      // eslint-disable-next-line no-alert
      alert(error.message);
      const revertedThreads = threads.list.map((t) => {
        if (t.id === threadId) {
          return { ...t, upVotesBy: initialUpVotesBy, downVotesBy: initialDownVotesBy };
        }
        return t;
      });
      dispatch({
        type: ActionType.RECEIVE_THREADS,
        payload: {
          threads: revertedThreads,
        },
      });

      if (threads.detailThread && threads.detailThread.id === threadId) {
        dispatch(receiveDetailThreadActionCreator({
          ...threads.detailThread,
          upVotesBy: initialUpVotesBy,
          downVotesBy: initialDownVotesBy,
        }));
      }
    }
  };
}

export function asyncNeutralVoteThread(threadId) {
  return async (dispatch, getState) => {
    const { auth, threads } = getState();
    const userId = auth ? auth.id : null;
    if (!userId) {
      // eslint-disable-next-line no-alert
      alert('Login untuk vote!');
      return;
    }

    const thread = threads.list.find((t) => t.id === threadId);
    if (!thread) return;

    const initialUpVotesBy = [...thread.upVotesBy];
    const initialDownVotesBy = [...thread.downVotesBy];

    dispatch({
      type: ActionType.NEUTRAL_VOTE_THREAD,
      payload: { threadId, userId },
    });

    try {
      await neutralVoteThread(threadId);
    } catch (error) {
      // eslint-disable-next-line no-alert
      alert(error.message);
      const revertedThreads = threads.list.map((t) => {
        if (t.id === threadId) {
          return { ...t, upVotesBy: initialUpVotesBy, downVotesBy: initialDownVotesBy };
        }
        return t;
      });
      dispatch({
        type: ActionType.RECEIVE_THREADS,
        payload: {
          threads: revertedThreads,
        },
      });

      if (threads.detailThread && threads.detailThread.id === threadId) {
        dispatch(receiveDetailThreadActionCreator({
          ...threads.detailThread,
          upVotesBy: initialUpVotesBy,
          downVotesBy: initialDownVotesBy,
        }));
      }
    }
  };
}

// Optimistic Vote Thunks for Comments
export function asyncUpVoteComment(threadId, commentId) {
  return async (dispatch, getState) => {
    const { auth, threads } = getState();
    const userId = auth ? auth.id : null;
    if (!userId) {
      // eslint-disable-next-line no-alert
      alert('Login untuk vote!');
      return;
    }

    const thread = threads.detailThread;
    const comment = thread?.comments.find((c) => c.id === commentId);
    if (!comment) return;

    const initialUpVotesBy = [...comment.upVotesBy];
    const initialDownVotesBy = [...comment.downVotesBy];

    dispatch({
      type: ActionType.UP_VOTE_COMMENT,
      payload: { threadId, commentId, userId },
    });

    try {
      await upVoteComment(threadId, commentId);
    } catch (error) {
      // eslint-disable-next-line no-alert
      alert(error.message);
      dispatch(receiveDetailThreadActionCreator({
        ...thread,
        comments: thread.comments.map((c) => (
          // eslint-disable-next-line max-len
          c.id === commentId ? { ...c, upVotesBy: initialUpVotesBy, downVotesBy: initialDownVotesBy } : c
        )),
      }));
    }
  };
}

export function asyncDownVoteComment(threadId, commentId) {
  return async (dispatch, getState) => {
    const { auth, threads } = getState();
    const userId = auth ? auth.id : null;
    if (!userId) {
      // eslint-disable-next-line no-alert
      alert('Login untuk vote!');
      return;
    }

    const thread = threads.detailThread;
    const comment = thread?.comments.find((c) => c.id === commentId);
    if (!comment) return;

    const initialUpVotesBy = [...comment.upVotesBy];
    const initialDownVotesBy = [...comment.downVotesBy];

    dispatch({
      type: ActionType.DOWN_VOTE_COMMENT,
      payload: { threadId, commentId, userId },
    });

    try {
      await downVoteComment(threadId, commentId);
    } catch (error) {
      // eslint-disable-next-line no-alert
      alert(error.message);
      dispatch(receiveDetailThreadActionCreator({
        ...thread,
        comments: thread.comments.map((c) => (
          // eslint-disable-next-line max-len
          c.id === commentId ? { ...c, upVotesBy: initialUpVotesBy, downVotesBy: initialDownVotesBy } : c
        )),
      }));
    }
  };
}

export function asyncNeutralVoteComment(threadId, commentId) {
  return async (dispatch, getState) => {
    const { auth, threads } = getState();
    const userId = auth ? auth.id : null;
    if (!userId) {
      // eslint-disable-next-line no-alert
      alert('Login untuk vote!');
      return;
    }

    const thread = threads.detailThread;
    const comment = thread?.comments.find((c) => c.id === commentId);
    if (!comment) return;

    const initialUpVotesBy = [...comment.upVotesBy];
    const initialDownVotesBy = [...comment.downVotesBy];

    dispatch({
      type: ActionType.NEUTRAL_VOTE_COMMENT,
      payload: { threadId, commentId, userId },
    });

    try {
      await neutralVoteComment(threadId, commentId);
    } catch (error) {
      // eslint-disable-next-line no-alert
      alert(error.message);
      dispatch(receiveDetailThreadActionCreator({
        ...thread,
        comments: thread.comments.map((c) => (
          // eslint-disable-next-line max-len
          c.id === commentId ? { ...c, upVotesBy: initialUpVotesBy, downVotesBy: initialDownVotesBy } : c
        )),
      }));
    }
  };
}
