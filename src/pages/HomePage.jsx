// src/pages/HomePage.jsx
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import ThreadCard from '../components/ThreadCard';
import {
  asyncReceiveThreads, asyncUpVoteThread, asyncDownVoteThread, asyncNeutralVoteThread,
} from '../redux/actions/threadsActions';
import { asyncReceiveUsers } from '../redux/actions/usersActions';

function HomePage() {
  const { threads, users } = useSelector((state) => state);
  const authUser = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [filterCategory, setFilterCategory] = useState('all');

  useEffect(() => {
    dispatch(asyncReceiveThreads());
    dispatch(asyncReceiveUsers());
  }, [dispatch]);

  const onUpVoteThread = (id) => {
    dispatch(asyncUpVoteThread(id));
  };

  const onDownVoteThread = (id) => {
    dispatch(asyncDownVoteThread(id));
  };

  const onNeutralVoteThread = (id) => {
    dispatch(asyncNeutralVoteThread(id));
  };

  const threadsWithUsers = threads.list.map((thread) => ({
    ...thread,
    owner: users.find((user) => user.id === thread.ownerId),
  })).filter((thread) => thread.owner);

  const categories = [...new Set(threads.list.map((thread) => thread.category))].filter(Boolean);

  const filteredThreads = filterCategory === 'all'
    ? threadsWithUsers
    : threadsWithUsers.filter((thread) => thread.category === filterCategory);

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Daftar Thread</h1>

      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <strong>Filter by Category: </strong>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        >
          <option value="all">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        {filteredThreads.length > 0 ? (
          filteredThreads.map((thread) => (
            <ThreadCard
              key={thread.id}
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...thread}
              authUser={authUser}
              onUpVote={onUpVoteThread}
              onDownVote={onDownVoteThread}
              onNeutralVote={onNeutralVoteThread}
            />
          ))
        ) : (
          <p style={{ gridColumn: '1 / -1', textAlign: 'center' }}>Tidak ada thread yang tersedia.</p>
        )}
      </div>

      {authUser && (
        <div style={{ position: 'fixed', bottom: '20px', right: '20px' }}>
          <Link
            to="/new"
            style={{
              display: 'block',
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: '#007bff',
              color: 'white',
              fontSize: '3em',
              lineHeight: '60px',
              textAlign: 'center',
              textDecoration: 'none',
              boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
            }}
          >
            +
          </Link>
        </div>
      )}
    </div>
  );
}

export default HomePage;
