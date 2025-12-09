import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Header() {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      <nav>
        <Link to="/">Главная</Link>
        {isAuthenticated ? (
          <>
            <Link to="/dashboard">Файлы</Link>
            <button onClick={handleLogout} className="logout-button">Выход</button>
          </>
        ) : (
          <>
            <Link to="/register">Регистрация</Link>
            <Link to="/login">Вход</Link>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;
