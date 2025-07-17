/* eslint-disable react/no-danger */
// src/components/CommentItem.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { postedAt } from '../utils';

function CommentItem({
  id,
  content,
  createdAt,
  owner,
  upVotesBy,
  downVotesBy,
  authUser,
  threadId,
  onUpVoteComment,
  onDownVoteComment,
  onNeutralVoteComment,
}) {
  const isUpVoted = authUser && upVotesBy.includes(authUser.id);
  const isDownVoted = authUser && downVotesBy.includes(authUser.id);

  const handleUpVote = () => {
    if (!authUser) {
      // eslint-disable-next-line no-alert
      alert('Login to vote!');
      return;
    }
    if (isUpVoted) { // If already upvoted by current user, neutral vote
      onNeutralVoteComment(threadId, id);
    } else { // If not upvoted, upvote
      onUpVoteComment(threadId, id);
    }
  };

  const handleDownVote = () => {
    if (!authUser) {
      // eslint-disable-next-line no-alert
      alert('Login to vote!');
      return;
    }
    if (isDownVoted) { // If already downvoted by current user, neutral vote
      onNeutralVoteComment(threadId, id);
    } else { // If not downvoted, downvote
      onDownVoteComment(threadId, id);
    }
  };

  return (
    <div style={{
      border: '1px solid #eee', padding: '10px', marginBottom: '8px', borderRadius: '4px', backgroundColor: '#f9f9f9',
    }}
    >
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
        <img
          src={owner.avatar}
          alt={owner.name}
          style={{
            width: '24px', height: '24px', borderRadius: '50%', marginRight: '8px',
          }}
        />
        <strong style={{ marginRight: '8px' }}>{owner.name}</strong>
        <span style={{ fontSize: '0.8em', color: '#666' }}>{postedAt(createdAt)}</span>
      </div>
      <p dangerouslySetInnerHTML={{ __html: content }} />
      <div style={{
        display: 'flex', gap: '8px', fontSize: '0.9em', color: '#777',
      }}
      >
        <button
          type="button"
          onClick={handleUpVote}
          style={{
            backgroundColor: isUpVoted ? 'green' : '#ddd',
            color: isUpVoted ? 'white' : 'black',
            border: 'none',
            padding: '4px 8px',
            borderRadius: '3px',
            cursor: authUser ? 'pointer' : 'not-allowed',
          }}
          disabled={!authUser}
        >
          {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
          👍 {upVotesBy.length}
        </button>
        <button
          type="button"
          onClick={handleDownVote}
          style={{
            backgroundColor: isDownVoted ? 'red' : '#ddd',
            color: isDownVoted ? 'white' : 'black',
            border: 'none',
            padding: '4px 8px',
            borderRadius: '3px',
            cursor: authUser ? 'pointer' : 'not-allowed',
          }}
          disabled={!authUser}
        >
          {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
          👎 {downVotesBy.length}
        </button>
      </div>
    </div>
  );
}

CommentItem.propTypes = {
  id: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  owner: PropTypes.object.isRequired,
  upVotesBy: PropTypes.arrayOf(PropTypes.string).isRequired,
  downVotesBy: PropTypes.arrayOf(PropTypes.string).isRequired,
  // eslint-disable-next-line react/forbid-prop-types, react/require-default-props
  authUser: PropTypes.object,
  threadId: PropTypes.string.isRequired,
  onUpVoteComment: PropTypes.func.isRequired,
  onDownVoteComment: PropTypes.func.isRequired,
  onNeutralVoteComment: PropTypes.func.isRequired,
};

export default CommentItem;
