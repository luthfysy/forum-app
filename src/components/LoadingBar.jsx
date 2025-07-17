// src/components/LoadingBar.jsx
import React from 'react';
import { useSelector } from 'react-redux';

function LoadingBar() {
  const isLoading = useSelector((state) => state.loading);

  if (!isLoading) {
    return null;
  }

  const barStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '4px',
    backgroundColor: '#4CAF50', // Green color
    zIndex: 9999,
    animation: 'loading 1s infinite alternate',
  };

  return (
    <div style={barStyle} />
  );
}

export default LoadingBar;
