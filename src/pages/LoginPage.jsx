// src/pages/LoginPage.jsx
import React from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import { asyncLoginUser } from '../redux/actions/authActions';

function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onLogin = async ({ email, password }) => {
    const success = await dispatch(asyncLoginUser({ email, password }));
    if (success) {
      navigate('/');
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h2>Login</h2>
      <AuthForm type="login" onSubmit={onLogin} />
      <p style={{ marginTop: '15px' }}>
        Belum punya akun?
        {' '}
        <Link to="/register">Daftar di sini.</Link>
      </p>
    </div>
  );
}

export default LoginPage;
