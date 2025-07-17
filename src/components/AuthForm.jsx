// src/components/AuthForm.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';

function AuthForm({ type, onSubmit }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (type === 'register') {
      onSubmit({ name, email, password });
    } else {
      onSubmit({ email, password });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px', margin: 'auto',
      }}
    >
      {type === 'register' && (
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
      )}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
      />
      <button
        type="submit"
        style={{
          padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer',
        }}
      >
        {type === 'register' ? 'Register' : 'Login'}
      </button>
    </form>
  );
}

AuthForm.propTypes = {
  type: PropTypes.oneOf(['login', 'register']).isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default AuthForm;
