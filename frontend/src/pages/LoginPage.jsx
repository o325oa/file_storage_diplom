import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LoginForm from '../components/LoginForm';
import { AuthContext } from '../context/AuthContext';

function LoginPage() {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div>
      <style>
        {`
          .login-container {
            max-width: 400px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            background-color: #f9f9f9;
          }

          .login-container h1 {
            text-align: center;
            color: #333;
          }

          .login-container form {
            display: flex;
            flex-direction: column;
          }

          .login-container input {
            margin-bottom: 15px;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 4px;
            font-size: 14px;
            width: 96%;
          }

          .login-container button {
            padding: 10px;
            background-color: #0397f3;
            color: white;
            border: none;
            border-radius: 4px;
            font-size: 16px;
            cursor: pointer;
          }

          .login-container button:hover {
            background-color: #0873d0;
          }
        `}
      </style>
      <div className="login-container">
        <h1>Войти</h1>
        <LoginForm />
      </div>
    </div>
  );
}

export default LoginPage;


