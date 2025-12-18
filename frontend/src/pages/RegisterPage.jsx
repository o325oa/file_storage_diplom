import React from 'react';
import RegisterForm from '../components/RegisterForm';

function RegisterPage() {
  return (
    <div>
      <style>
        {`
          .register-container {
            max-width: 500px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            background-color: #f9f9f9;
          }

          .register-container h1 {
            text-align: center;
            color: #333;
          }

          .register-container form {
            display: flex;
            flex-direction: column;
          }

          .register-container input {
            margin-bottom: 15px;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 4px;
            font-size: 14px;
            width: 96%;
          }

          .register-container button {
            padding: 10px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 4px;
            font-size: 16px;
            cursor: pointer;
          }

          .register-container button:hover {
            background-color: #0056b3;
          }

          .error {
            color: red;
            font-size: 14px;
            margin-top: 5px;
          }
        `}
      </style>
      <div className="register-container">
        <h1>Регистрация</h1>
        <RegisterForm />
      </div>
    </div>
  );
}

export default RegisterPage;
