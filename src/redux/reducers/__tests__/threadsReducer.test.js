/* eslint-disable no-undef */
// src/redux/reducers/__tests__/threadsReducer.test.js
import threadsReducer from '../threadsReducer';
import { ActionType } from '../../actions/threadsActions';

/**
 * Skenario Pengujian threadsReducer:
 * 1. Harus mengembalikan state awal yang benar.
 * 2. Harus mengembalikan list threads ketika diberi action RECEIVE_THREADS.
 * 3. Harus menambahkan thread baru ke list threads ketika diberi action ADD_THREAD.
 * 4. Harus mengatur detailThread ketika diberi action RECEIVE_DETAIL_THREAD.
 * 5. Harus menghapus detailThread ketika diberi action CLEAR_DETAIL_THREAD.
 * 6. Harus menambahkan komentar ke detailThread ketika diberi action ADD_COMMENT.
 * 7. Harus mengelola up-vote pada thread dengan benar.
 * 8. Harus mengelola down-vote pada thread dengan benar.
 * 9. Harus mengelola neutral-vote pada thread dengan benar.
 * 10. Harus mengelola up-vote pada komentar dengan benar.
 * 11. Harus mengelola down-vote pada komentar dengan benar.
 * 12. Harus mengelola neutral-vote pada komentar dengan benar.
 */
// eslint-disable-next-line no-undef
describe('threadsReducer', () => {
  const initialState = { list: [], detailThread: null };
  const mockThreads = [
    {
      id: 'thread-1', title: 'Test Thread 1', upVotesBy: [], downVotesBy: [],
    },
    {
      id: 'thread-2', title: 'Test Thread 2', upVotesBy: [], downVotesBy: [],
    },
  ];
  const mockDetailThread = {
    id: 'thread-detail',
    title: 'Detail Thread',
    comments: [{ id: 'comment-1', upVotesBy: [], downVotesBy: [] }],
  };
  const userId = 'user-test';

  // eslint-disable-next-line no-undef
  it('should return the initial state', () => {
    // eslint-disable-next-line no-undef
    expect(threadsReducer(undefined, {})).toEqual(initialState);
  });

  // eslint-disable-next-line no-undef
  it('should handle RECEIVE_THREADS', () => {
    const action = {
      type: ActionType.RECEIVE_THREADS,
      payload: { threads: mockThreads },
    };
    // eslint-disable-next-line no-undef
    expect(threadsReducer(initialState, action)).toEqual({
      ...initialState,
      list: mockThreads,
    });
  });

  // eslint-disable-next-line no-undef
  it('should handle ADD_THREAD', () => {
    const newThread = {
      id: 'thread-3', title: 'New Thread', upVotesBy: [], downVotesBy: [],
    };
    const action = {
      type: ActionType.ADD_THREAD,
      payload: { thread: newThread },
    };
    const stateWithExistingThreads = { ...initialState, list: mockThreads };
    // eslint-disable-next-line no-undef
    expect(threadsReducer(stateWithExistingThreads, action).list).toEqual([
      newThread,
      ...mockThreads,
    ]);
  });

  it('should handle RECEIVE_DETAIL_THREAD', () => {
    const action = {
      type: ActionType.RECEIVE_DETAIL_THREAD,
      payload: { detailThread: mockDetailThread },
    };
    expect(threadsReducer(initialState, action)).toEqual({
      ...initialState,
      detailThread: mockDetailThread,
    });
  });

  it('should handle CLEAR_DETAIL_THREAD', () => {
    const stateWithDetailThread = { ...initialState, detailThread: mockDetailThread };
    const action = { type: ActionType.CLEAR_DETAIL_THREAD };
    expect(threadsReducer(stateWithDetailThread, action)).toEqual({
      ...initialState,
      detailThread: null,
    });
  });

  it('should handle ADD_COMMENT', () => {
    const newComment = { id: 'comment-2', content: 'New comment' };
    const stateWithDetailThread = { ...initialState, detailThread: { ...mockDetailThread } };
    const action = {
      type: ActionType.ADD_COMMENT,
      payload: { comment: newComment },
    };
    const nextState = threadsReducer(stateWithDetailThread, action);
    expect(nextState.detailThread.comments).toEqual([
      newComment,
      ...mockDetailThread.comments,
    ]);
  });

  // Test cases for Thread Votes
  it('should handle UP_VOTE_THREAD correctly (add vote)', () => {
    const threadId = 'thread-1';
    const action = { type: ActionType.UP_VOTE_THREAD, payload: { threadId, userId } };
    const stateWithThreads = { ...initialState, list: mockThreads };
    const nextState = threadsReducer(stateWithThreads, action);
    expect(nextState.list.find((t) => t.id === threadId).upVotesBy).toContain(userId);
    expect(nextState.list.find((t) => t.id === threadId).downVotesBy).not.toContain(userId);
  });

  it('should handle UP_VOTE_THREAD correctly (remove existing vote)', () => {
    const threadId = 'thread-1';
    const stateWithExistingUpVote = {
      ...initialState,
      list: [{ ...mockThreads[0], upVotesBy: [userId] }],
    };
    const action = { type: ActionType.UP_VOTE_THREAD, payload: { threadId, userId } };
    const nextState = threadsReducer(stateWithExistingUpVote, action);
    expect(nextState.list.find((t) => t.id === threadId).upVotesBy).not.toContain(userId);
  });

  it('should handle DOWN_VOTE_THREAD correctly (add vote)', () => {
    const threadId = 'thread-1';
    const action = { type: ActionType.DOWN_VOTE_THREAD, payload: { threadId, userId } };
    const stateWithThreads = { ...initialState, list: mockThreads };
    const nextState = threadsReducer(stateWithThreads, action);
    expect(nextState.list.find((t) => t.id === threadId).downVotesBy).toContain(userId);
    expect(nextState.list.find((t) => t.id === threadId).upVotesBy).not.toContain(userId);
  });

  it('should handle DOWN_VOTE_THREAD correctly (remove existing vote)', () => {
    const threadId = 'thread-1';
    const stateWithExistingDownVote = {
      ...initialState,
      list: [{ ...mockThreads[0], downVotesBy: [userId] }],
    };
    const action = { type: ActionType.DOWN_VOTE_THREAD, payload: { threadId, userId } };
    const nextState = threadsReducer(stateWithExistingDownVote, action);
    expect(nextState.list.find((t) => t.id === threadId).downVotesBy).not.toContain(userId);
  });

  it('should handle NEUTRAL_VOTE_THREAD correctly (remove all votes)', () => {
    const threadId = 'thread-1';
    const stateWithExistingVotes = {
      ...initialState,
      list: [{ ...mockThreads[0], upVotesBy: [userId], downVotesBy: [userId] }],
    };
    const action = { type: ActionType.NEUTRAL_VOTE_THREAD, payload: { threadId, userId } };
    const nextState = threadsReducer(stateWithExistingVotes, action);
    expect(nextState.list.find((t) => t.id === threadId).upVotesBy).not.toContain(userId);
    expect(nextState.list.find((t) => t.id === threadId).downVotesBy).not.toContain(userId);
  });

  // Test cases for Comment Votes
  it('should handle UP_VOTE_COMMENT correctly (add vote)', () => {
    const threadId = mockDetailThread.id;
    const commentId = mockDetailThread.comments[0].id;
    const action = { type: ActionType.UP_VOTE_COMMENT, payload: { threadId, commentId, userId } };
    const stateWithDetail = { ...initialState, detailThread: { ...mockDetailThread } };
    const nextState = threadsReducer(stateWithDetail, action);
    // eslint-disable-next-line max-len
    expect(nextState.detailThread.comments.find((c) => c.id === commentId).upVotesBy).toContain(userId);
    // eslint-disable-next-line max-len
    expect(nextState.detailThread.comments.find((c) => c.id === commentId).downVotesBy).not.toContain(userId);
  });

  it('should handle DOWN_VOTE_COMMENT correctly (add vote)', () => {
    const threadId = mockDetailThread.id;
    const commentId = mockDetailThread.comments[0].id;
    const action = { type: ActionType.DOWN_VOTE_COMMENT, payload: { threadId, commentId, userId } };
    const stateWithDetail = { ...initialState, detailThread: { ...mockDetailThread } };
    const nextState = threadsReducer(stateWithDetail, action);
    // eslint-disable-next-line max-len
    expect(nextState.detailThread.comments.find((c) => c.id === commentId).downVotesBy).toContain(userId);
    // eslint-disable-next-line max-len
    expect(nextState.detailThread.comments.find((c) => c.id === commentId).upVotesBy).not.toContain(userId);
  });

  it('should handle NEUTRAL_VOTE_COMMENT correctly (remove all votes)', () => {
    const threadId = mockDetailThread.id;
    const commentId = mockDetailThread.comments[0].id;
    const stateWithExistingVotes = {
      ...initialState,
      detailThread: {
        ...mockDetailThread,
        comments: [{ ...mockDetailThread.comments[0], upVotesBy: [userId], downVotesBy: [userId] }],
      },
    };
    // eslint-disable-next-line max-len
    const action = { type: ActionType.NEUTRAL_VOTE_COMMENT, payload: { threadId, commentId, userId } };
    const nextState = threadsReducer(stateWithExistingVotes, action);
    // eslint-disable-next-line max-len
    expect(nextState.detailThread.comments.find((c) => c.id === commentId).upVotesBy).not.toContain(userId);
    // eslint-disable-next-line max-len
    expect(nextState.detailThread.comments.find((c) => c.id === commentId).downVotesBy).not.toContain(userId);
  });
});
