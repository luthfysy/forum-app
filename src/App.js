/* eslint-disable import/extensions */
// src/App.js
import React, { useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import HomePage from './pages/HomePage.jsx';
import DetailPage from './pages/DetailPage.jsx';
import AddThreadPage from './pages/AddThreadPage.jsx';
import LeaderboardPage from './pages/LeaderboardPage.jsx';
import LoadingBar from './components/LoadingBar.jsx';
import { asyncPreloadUser, asyncLogoutUser } from './redux/actions/authActions.js';

function App() {
  const authUser = useSelector((state) => state.auth);
  // isLoading tidak lagi digunakan secara langsung di JSX App.js,
  // komponen LoadingBar sendiri yang mengakses state.loading.
  // const isLoading = useSelector((state) => state.loading); // Dihapus karena tidak terpakai langsung di sini
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(asyncPreloadUser());
  }, [dispatch]);

  const onLogout = () => {
    dispatch(asyncLogoutUser());
  };

  // Kondisi loading awal aplikasi untuk menunggu preloadUser selesai
  if (authUser === undefined) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '1.5em',
        color: '#555',
      }}
      >
        Memuat aplikasi...
      </div>
    );
  }

  return (
    <>
      {/* LoadingBar akan muncul jika state.loading true */}
      <LoadingBar />
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '15px 30px',
        backgroundColor: '#333',
        color: 'white',
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
      }}
      >
        <h1 style={{ margin: 0 }}><Link to="/" style={{ textDecoration: 'none', color: 'white' }}>Forum App</Link></h1>
        <nav>
          <ul style={{
            listStyle: 'none', margin: 0, padding: 0, display: 'flex', gap: '20px',
          }}
          >
            <li><Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Home</Link></li>
            <li><Link to="/leaderboards" style={{ color: 'white', textDecoration: 'none' }}>Leaderboard</Link></li>
            {authUser ? (
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <img src={authUser.avatar} alt={authUser.name} style={{ width: '24px', height: '24px', borderRadius: '50%' }} />
                <span>{authUser.name}</span>
                <button
                  type="button" // Ditambahkan type="button" untuk ESLint
                  onClick={onLogout}
                  style={{
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    padding: '8px 12px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  Logout
                </button>
              </li>
            ) : (
              <li><Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>Login</Link></li>
            )}
          </ul>
        </nav>
      </header>
      <main style={{ minHeight: 'calc(100vh - 70px)', backgroundColor: '#f4f7f6' }}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/threads/:id" element={<DetailPage />} />
          <Route path="/new" element={authUser ? <AddThreadPage /> : <LoginPage />} />
          <Route path="/leaderboards" element={<LeaderboardPage />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
