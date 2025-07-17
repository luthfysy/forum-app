// src/pages/RegisterPage.jsx
import React from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import { asyncRegisterUser } from '../redux/actions/authActions';

function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onRegister = async ({ name, email, password }) => {
    const success = await dispatch(asyncRegisterUser({ name, email, password }));
    if (success) {
      navigate('/login');
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h2>Register</h2>
      <AuthForm type="register" onSubmit={onRegister} />
      <p style={{ marginTop: '15px' }}>
        Sudah punya akun?
        {' '}
        <Link to="/login">Login di sini.</Link>
      </p>
    </div>
  );
}

export default RegisterPage;
