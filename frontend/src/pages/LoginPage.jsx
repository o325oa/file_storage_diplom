import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LoginForm from '../components/LoginForm';
import { AuthContext } from '../context/AuthContext';
import '../styles/LoginPage.css';

function LoginPage() {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="login-container">
      <h1>Войти</h1>
      <LoginForm />
    </div>
  );
}

export default LoginPage;

