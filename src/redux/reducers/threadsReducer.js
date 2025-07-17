// src/redux/reducers/threadsReducer.js
// eslint-disable-next-line import/extensions
import { ActionType } from '../actions/threadsActions.js';

function threadsReducer(state = { list: [], detailThread: null }, action = {}) {
  switch (action.type) {
  case ActionType.RECEIVE_THREADS:
    return {
      ...state,
      list: action.payload.threads,
    };
  case ActionType.ADD_THREAD:
    return {
      ...state,
      list: [action.payload.thread, ...state.list],
    };
  case ActionType.RECEIVE_DETAIL_THREAD:
    return {
      ...state,
      detailThread: action.payload.detailThread,
    };
  case ActionType.CLEAR_DETAIL_THREAD:
    return {
      ...state,
      detailThread: null,
    };
  case ActionType.ADD_COMMENT:
    return {
      ...state,
      detailThread: state.detailThread ? {
        ...state.detailThread,
        comments: [action.payload.comment, ...state.detailThread.comments],
      } : null,
    };

  case ActionType.UP_VOTE_THREAD:
  case ActionType.DOWN_VOTE_THREAD:
  case ActionType.NEUTRAL_VOTE_THREAD: {
    const { threadId, userId } = action.payload;

    const updatedThreadList = state.list.map((thread) => {
      if (thread.id === threadId) {
        let newUpVotesBy = [...thread.upVotesBy];
        let newDownVotesBy = [...thread.downVotesBy];

        if (action.type === ActionType.UP_VOTE_THREAD) {
          if (newUpVotesBy.includes(userId)) {
            newUpVotesBy = newUpVotesBy.filter((id) => id !== userId);
          } else {
            newUpVotesBy = [...newUpVotesBy, userId];
            newDownVotesBy = newDownVotesBy.filter((id) => id !== userId);
          }
        } else if (action.type === ActionType.DOWN_VOTE_THREAD) {
          if (newDownVotesBy.includes(userId)) {
            newDownVotesBy = newDownVotesBy.filter((id) => id !== userId);
          } else {
            newDownVotesBy = [...newDownVotesBy, userId];
            newUpVotesBy = newUpVotesBy.filter((id) => id !== userId);
          }
        } else if (action.type === ActionType.NEUTRAL_VOTE_THREAD) {
          newUpVotesBy = newUpVotesBy.filter((id) => id !== userId);
          newDownVotesBy = newDownVotesBy.filter((id) => id !== userId);
        }

        return {
          ...thread,
          upVotesBy: newUpVotesBy,
          downVotesBy: newDownVotesBy,
        };
      }
      return thread;
    });

    const newDetailThread = state.detailThread && state.detailThread.id === threadId ? (() => {
      let newUpVotesBy = [...state.detailThread.upVotesBy];
      let newDownVotesBy = [...state.detailThread.downVotesBy];

      if (action.type === ActionType.UP_VOTE_THREAD) {
        if (newUpVotesBy.includes(userId)) {
          newUpVotesBy = newUpVotesBy.filter((id) => id !== userId);
        } else {
          newUpVotesBy = [...newUpVotesBy, userId];
          newDownVotesBy = newDownVotesBy.filter((id) => id !== userId);
        }
      } else if (action.type === ActionType.DOWN_VOTE_THREAD) {
        if (newDownVotesBy.includes(userId)) {
          newDownVotesBy = newDownVotesBy.filter((id) => id !== userId);
        } else {
          newDownVotesBy = [...newDownVotesBy, userId];
          newUpVotesBy = newUpVotesBy.filter((id) => id !== userId);
        }
      } else if (action.type === ActionType.NEUTRAL_VOTE_THREAD) {
        newUpVotesBy = newUpVotesBy.filter((id) => id !== userId);
        newDownVotesBy = newDownVotesBy.filter((id) => id !== userId);
      }
      return {
        ...state.detailThread,
        upVotesBy: newUpVotesBy,
        downVotesBy: newDownVotesBy,
      };
    })() : state.detailThread;

    return {
      ...state,
      list: updatedThreadList,
      detailThread: newDetailThread,
    };
  }

  case ActionType.UP_VOTE_COMMENT:
  case ActionType.DOWN_VOTE_COMMENT:
  case ActionType.NEUTRAL_VOTE_COMMENT: {
    const { threadId, commentId, userId } = action.payload;

    if (!state.detailThread || state.detailThread.id !== threadId) {
      return state;
    }

    const updatedComments = state.detailThread.comments.map((comment) => {
      if (comment.id === commentId) {
        let newUpVotesBy = [...comment.upVotesBy];
        let newDownVotesBy = [...comment.downVotesBy];

        if (action.type === ActionType.UP_VOTE_COMMENT) {
          if (newUpVotesBy.includes(userId)) {
            newUpVotesBy = newUpVotesBy.filter((id) => id !== userId);
          } else {
            newUpVotesBy = [...newUpVotesBy, userId];
            newDownVotesBy = newDownVotesBy.filter((id) => id !== userId);
          }
        } else if (action.type === ActionType.DOWN_VOTE_COMMENT) {
          if (newDownVotesBy.includes(userId)) {
            newDownVotesBy = newDownVotesBy.filter((id) => id !== userId);
          } else {
            newDownVotesBy = [...newDownVotesBy, userId];
            newUpVotesBy = newUpVotesBy.filter((id) => id !== userId);
          }
        } else if (action.type === ActionType.NEUTRAL_VOTE_COMMENT) {
          newUpVotesBy = newUpVotesBy.filter((id) => id !== userId);
          newDownVotesBy = newDownVotesBy.filter((id) => id !== userId);
        }

        return {
          ...comment,
          upVotesBy: newUpVotesBy,
          downVotesBy: newDownVotesBy,
        };
      }
      return comment;
    });

    return {
      ...state,
      detailThread: {
        ...state.detailThread,
        comments: updatedComments,
      },
    };
  }

  default:
    return state;
  }
}

export default threadsReducer;
