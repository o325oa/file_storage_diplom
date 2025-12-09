import React from 'react';
import RegisterForm from '../components/RegisterForm';
import '../styles/RegisterPage.css';

function RegisterPage() {
  return (
    <div className="register-container">
      <h1>Регистрация</h1>
      <RegisterForm />
    </div>
  );
}

export default RegisterPage;
