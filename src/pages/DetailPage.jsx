/* eslint-disable react/no-danger */
// src/pages/DetailPage.jsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import CommentItem from '../components/CommentItem';
import RichTextEditor from '../components/RichTextEditor';
import { postedAt } from '../utils';
import {
  asyncReceiveDetailThread,
  asyncAddComment,
  asyncUpVoteThread,
  asyncDownVoteThread,
  asyncUpVoteComment,
  asyncDownVoteComment,
  asyncNeutralVoteComment,
  ActionType as ThreadsActionType,
} from '../redux/actions/threadsActions';
import { asyncReceiveUsers } from '../redux/actions/usersActions';

function DetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { threads, users } = useSelector((state) => state);
  const authUser = useSelector((state) => state.auth);
  const { detailThread } = threads;
  const [commentContent, setCommentContent] = useState('');

  useEffect(() => {
    dispatch(asyncReceiveDetailThread(id));
    dispatch(asyncReceiveUsers());
    return () => {
      dispatch({ type: ThreadsActionType.CLEAR_DETAIL_THREAD });
    };
  }, [id, dispatch]);

  if (!detailThread || !users.length) {
    return <p style={{ textAlign: 'center', padding: '20px' }}>Memuat detail thread...</p>;
  }

  const threadOwner = users.find((user) => user.id === detailThread.ownerId);
  const detailedThread = {
    ...detailThread,
    owner: threadOwner || detailThread.owner,
    comments: detailThread.comments.map((comment) => ({
      ...comment,
      owner: users.find((user) => user.id === comment.ownerId) || comment.owner,
    })),
  };

  const onAddComment = async () => {
    if (!commentContent.trim()) {
      // eslint-disable-next-line no-alert
      alert('Komentar tidak boleh kosong!');
      return;
    }
    const success = await dispatch(asyncAddComment({ threadId: id, content: commentContent }));
    if (success) {
      setCommentContent('');
    }
  };

  const handleUpVoteThread = () => {
    if (!authUser) {
      // eslint-disable-next-line no-alert
      alert('Login untuk vote!');
      return;
    }
    dispatch(asyncUpVoteThread(id));
  };

  const handleDownVoteThread = () => {
    if (!authUser) {
      // eslint-disable-next-line no-alert
      alert('Login untuk vote!');
      return;
    }
    dispatch(asyncDownVoteThread(id));
  };

  const onUpVoteComment = (threadIdParam, commentId) => {
    if (!authUser) {
      // eslint-disable-next-line no-alert
      alert('Login untuk vote!');
      return;
    }
    dispatch(asyncUpVoteComment(threadIdParam, commentId));
  };

  const onDownVoteComment = (threadIdParam, commentId) => {
    if (!authUser) {
      // eslint-disable-next-line no-alert
      alert('Login untuk vote!');
      return;
    }
    dispatch(asyncDownVoteComment(threadIdParam, commentId));
  };

  const onNeutralVoteComment = (threadIdParam, commentId) => {
    if (!authUser) {
      // eslint-disable-next-line no-alert
      alert('Login untuk vote!');
      return;
    }
    dispatch(asyncNeutralVoteComment(threadIdParam, commentId));
  };

  const isThreadUpVoted = authUser && detailedThread.upVotesBy.includes(authUser.id);
  const isThreadDownVoted = authUser && detailedThread.downVotesBy.includes(authUser.id);

  return (
    <div style={{ padding: '20px' }}>
      <div style={{
        border: '1px solid #ccc', padding: '20px', borderRadius: '8px', marginBottom: '20px', backgroundColor: '#fff',
      }}
      >
        <h2 style={{ marginBottom: '10px' }}>{detailedThread.title}</h2>
        <p style={{ fontSize: '0.9em', color: '#666', marginBottom: '10px' }}>
          Category:
          {' '}
          <span style={{ backgroundColor: '#eee', padding: '3px 8px', borderRadius: '4px' }}>{detailedThread.category}</span>
        </p>
        <div style={{ marginBottom: '15px', display: 'flex', alignItems: 'center' }}>
          <img
            src={detailedThread.owner.avatar}
            alt={detailedThread.owner.name}
            style={{
              width: '30px', height: '30px', borderRadius: '50%', marginRight: '10px',
            }}
          />
          <strong>{detailedThread.owner.name}</strong>
          <span style={{ marginLeft: '15px', fontSize: '0.9em', color: '#888' }}>{postedAt(detailedThread.createdAt)}</span>
        </div>
        <div dangerouslySetInnerHTML={{ __html: detailedThread.body }} style={{ lineHeight: '1.6', marginBottom: '20px' }} />

        <div style={{
          display: 'flex', gap: '10px', alignItems: 'center', borderTop: '1px solid #eee', paddingTop: '15px',
        }}
        >
          <button
            type="button"
            onClick={handleUpVoteThread}
            style={{
              backgroundColor: isThreadUpVoted ? 'green' : '#eee',
              color: isThreadUpVoted ? 'white' : 'black',
              border: 'none',
              padding: '8px 15px',
              borderRadius: '5px',
              cursor: authUser ? 'pointer' : 'not-allowed',
            }}
            disabled={!authUser}
          >
            👍
            {' '}
            {detailedThread.upVotesBy.length}
          </button>
          <button
            type="button"
            onClick={handleDownVoteThread}
            style={{
              backgroundColor: isThreadDownVoted ? 'red' : '#eee',
              color: isThreadDownVoted ? 'white' : 'black',
              border: 'none',
              padding: '8px 15px',
              borderRadius: '5px',
              cursor: authUser ? 'pointer' : 'not-allowed',
            }}
            disabled={!authUser}
          >
            👎
            {' '}
            {detailedThread.downVotesBy.length}
          </button>
        </div>
      </div>

      <div style={{
        border: '1px solid #ccc', padding: '20px', borderRadius: '8px', backgroundColor: '#fff',
      }}
      >
        <h3>
          Komentar (
          {detailedThread.comments.length}
          )
        </h3>
        {authUser ? (
          <div style={{ marginBottom: '20px' }}>
            <RichTextEditor
              value={commentContent}
              onChange={setCommentContent}
              placeholder="Tulis komentar Anda..."
            />
            <button
              type="button"
              onClick={onAddComment}
              style={{
                marginTop: '10px',
                padding: '10px 20px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
            >
              Kirim Komentar
            </button>
          </div>
        ) : (
          <p style={{ textAlign: 'center', margin: '20px 0', color: '#888' }}>
            Login untuk menambahkan komentar.
          </p>
        )}

        <div style={{ marginTop: '20px' }}>
          {detailedThread.comments.map((comment) => (
            <CommentItem
              key={comment.id}
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...comment}
              threadId={id}
              authUser={authUser}
              onUpVoteComment={onUpVoteComment}
              onDownVoteComment={onDownVoteComment}
              onNeutralVoteComment={onNeutralVoteComment}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default DetailPage;
