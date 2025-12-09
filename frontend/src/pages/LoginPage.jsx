import React from 'react';
import LoginForm from '../components/LoginForm';
import '../styles/LoginPage.css';

function LoginPage() {
  return (
    <div className="login-container">
      <h1>Войти</h1>
      <LoginForm />
    </div>
  );
}

export default LoginPage;
