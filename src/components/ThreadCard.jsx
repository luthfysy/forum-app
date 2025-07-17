/* eslint-disable react/no-danger */
/* eslint-disable react/require-default-props */
// src/components/ThreadCard.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { postedAt } from '../utils';

function ThreadCard({
  id,
  title,
  body,
  category,
  createdAt,
  owner,
  totalComments,
  upVotesBy,
  downVotesBy,
  authUser,
  onUpVote,
  onDownVote,
  onNeutralVote,
}) {
  const isUpVoted = authUser && upVotesBy.includes(authUser.id);
  const isDownVoted = authUser && downVotesBy.includes(authUser.id);

  const handleUpVote = (event) => {
    event.stopPropagation();
    if (!authUser) {
      // eslint-disable-next-line no-alert
      alert('Login to vote!');
      return;
    }
    if (isUpVoted) { // If already upvoted by current user, neutral vote
      onNeutralVote(id);
    } else { // If not upvoted, upvote
      onUpVote(id);
    }
  };

  const handleDownVote = (event) => {
    event.stopPropagation();
    if (!authUser) {
      // eslint-disable-next-line no-alert
      alert('Login to vote!');
      return;
    }
    if (isDownVoted) { // If already downvoted by current user, neutral vote
      onNeutralVote(id);
    } else { // If not downvoted, downvote
      onDownVote(id);
    }
  };

  return (
    <div style={{
      border: '1px solid #ccc', padding: '15px', marginBottom: '10px', borderRadius: '5px', backgroundColor: '#fff',
    }}
    >
      <Link to={`/threads/${id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <h3 style={{ marginBottom: '5px' }}>{title}</h3>
      </Link>
      <p style={{ fontSize: '0.9em', color: '#666' }}>
        Category:
        {' '}
        <span style={{ backgroundColor: '#eee', padding: '2px 5px', borderRadius: '3px' }}>{category}</span>
      </p>
      <div dangerouslySetInnerHTML={{ __html: body.substring(0, 100) + (body.length > 100 ? '...' : '') }} style={{ maxHeight: '100px', overflow: 'hidden' }} />
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8em', color: '#888', marginTop: '10px',
      }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img
            src={owner.avatar}
            alt={owner.name}
            style={{
              width: '20px', height: '20px', borderRadius: '50%', marginRight: '5px',
            }}
          />
          <span>{owner.name}</span>
          <span style={{ marginLeft: '10px' }}>{postedAt(createdAt)}</span>
        </div>
        <div>
          <button
            type="button"
            onClick={handleUpVote}
            style={{
              backgroundColor: isUpVoted ? 'green' : '#eee',
              color: isUpVoted ? 'white' : 'black',
              border: 'none',
              padding: '5px 10px',
              borderRadius: '3px',
              cursor: authUser ? 'pointer' : 'not-allowed',
            }}
            disabled={!authUser}
          >
            👍
            {' '}
            {upVotesBy.length}
          </button>
          <button
            type="button"
            onClick={handleDownVote}
            style={{
              backgroundColor: isDownVoted ? 'red' : '#eee',
              color: isDownVoted ? 'white' : 'black',
              border: 'none',
              padding: '5px 10px',
              borderRadius: '3px',
              cursor: authUser ? 'pointer' : 'not-allowed',
              marginLeft: '5px',
            }}
            disabled={!authUser}
          >
            👎
            {' '}
            {downVotesBy.length}
          </button>
          <span style={{ marginLeft: '10px' }}>
            💬
            {' '}
            {totalComments}
          </span>
        </div>
      </div>
    </div>
  );
}

ThreadCard.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  owner: PropTypes.object.isRequired,
  totalComments: PropTypes.number.isRequired,
  upVotesBy: PropTypes.arrayOf(PropTypes.string).isRequired,
  downVotesBy: PropTypes.arrayOf(PropTypes.string).isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  authUser: PropTypes.object,
  onUpVote: PropTypes.func.isRequired,
  onDownVote: PropTypes.func.isRequired,
  onNeutralVote: PropTypes.func.isRequired,
};

export default ThreadCard;
