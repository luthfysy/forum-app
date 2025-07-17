/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/function-component-definition */
/* eslint-disable no-undef */
// src/__mocks__/react-router-dom.js
// Ini adalah mock untuk react-router-dom agar Jest dapat merendernya di lingkungan Node.js/JSDOM
import React from 'react';

// Mock BrowserRouter (atau Router) sebagai div sederhana
export const BrowserRouter = ({ children }) => {
  // console.log('Mocked BrowserRouter rendered'); // Debugging opsional
  return <div>{children}</div>;
};

// Mock Link sebagai tag <a> sederhana
export const Link = ({ to, children, ...props }) => {
  // console.log('Mocked Link rendered:', to); // Debugging opsional
  return <a href={to} {...props}>{children}</a>;
};

// Mock useParams hook (jika digunakan di komponen yang diuji secara langsung)
export const useParams = jest.fn(() => ({}));

// Mock useNavigate hook (jika digunakan di komponen yang diuji secara langsung)
export const useNavigate = jest.fn(() => jest.fn());
