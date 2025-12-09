import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api';

function RegisterForm() {
  const [formData, setFormData] = useState({
    username: '',
    full_name: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { setIsAuthenticated } = useContext(AuthContext);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/accounts/register/', formData);
      console.log('User registered:', response.data);
      navigate('/login');
    } catch (error) {
      if (error.response && error.response.data) {
        setErrors(error.response.data);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Логин"
          required
        />
        {errors.username && <div className="error">{errors.username}</div>}
      </div>
      <div>
        <input
          name="full_name"
          value={formData.full_name}
          onChange={handleChange}
          placeholder="Полное имя"
          required
        />
        {errors.full_name && <div className="error">{errors.full_name}</div>}
      </div>
      <div>
        <input
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        {errors.email && <div className="error">{errors.email}</div>}
      </div>
      <div>
        <input
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Пароль"
          type="password"
          required
        />
        {errors.password && <div className="error">{errors.password}</div>}
      </div>
      <button type="submit">Зарегистрироваться</button>
    </form>
  );
}

export default RegisterForm;

