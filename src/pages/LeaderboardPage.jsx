// src/pages/LeaderboardPage.jsx
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { asyncReceiveLeaderboards } from '../redux/actions/leaderboardsActions';

function LeaderboardPage() {
  const { leaderboards } = useSelector((state) => state);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(asyncReceiveLeaderboards());
  }, [dispatch]);

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Leaderboard</h1>
      {leaderboards.length > 0 ? (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
              <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Rank</th>
              <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>User</th>
              <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Score</th>
            </tr>
          </thead>
          <tbody>
            {leaderboards.map((leaderboard, index) => (
              <tr key={leaderboard.user.id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>{index + 1}</td>
                <td style={{
                  padding: '12px', border: '1px solid #ddd', display: 'flex', alignItems: 'center',
                }}
                >
                  <img
                    src={leaderboard.user.avatar}
                    alt={leaderboard.user.name}
                    style={{
                      width: '30px', height: '30px', borderRadius: '50%', marginRight: '10px',
                    }}
                  />
                  {leaderboard.user.name}
                </td>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>{leaderboard.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p style={{ textAlign: 'center' }}>Memuat leaderboard...</p>
      )}
    </div>
  );
}

export default LeaderboardPage;
