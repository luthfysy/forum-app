/* eslint-disable no-undef */
// src/components/__tests__/AuthForm.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AuthForm from '../AuthForm';

/**
 * Skenario Pengujian AuthForm:
 * 1. AuthForm harus merender input nama, email, dan password ketika type adalah 'register'.
 * 2. AuthForm harus merender input email dan password saja ketika type adalah 'login'.
 * 3. AuthForm harus memanggil fungsi onSubmit dengan data yang benar saat form disubmit (tipe register).
 * 4. AuthForm harus memanggil fungsi onSubmit dengan data yang benar saat form disubmit (tipe login).
 */
describe('AuthForm Component', () => {
  it('should render name, email, and password inputs when type is "register"', () => {
    const onSubmitMock = jest.fn();
    render(<AuthForm type="register" onSubmit={onSubmitMock} />);

    expect(screen.getByPlaceholderText('Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Register' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Login' })).not.toBeInTheDocument();
  });

  it('should render email and password inputs only when type is "login"', () => {
    const onSubmitMock = jest.fn();
    render(<AuthForm type="login" onSubmit={onSubmitMock} />);

    expect(screen.queryByPlaceholderText('Name')).not.toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Register' })).not.toBeInTheDocument();
  });

  it('should call onSubmit with correct data when form is submitted (register type)', () => {
    const onSubmitMock = jest.fn();
    render(<AuthForm type="register" onSubmit={onSubmitMock} />);

    const nameInput = screen.getByPlaceholderText('Name');
    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByRole('button', { name: 'Register' });

    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    expect(onSubmitMock).toHaveBeenCalledWith({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    });
  });

  it('should call onSubmit with correct data when form is submitted (login type)', () => {
    const onSubmitMock = jest.fn();
    render(<AuthForm type="login" onSubmit={onSubmitMock} />);

    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByRole('button', { name: 'Login' });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    expect(onSubmitMock).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
  });
});
