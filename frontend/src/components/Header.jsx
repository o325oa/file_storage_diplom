import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';

function Header() {
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <header className="header">
      <nav>
        <Link to="/">Главная</Link>
        {isAuthenticated ? (
          <>
            <Link to="/dashboard">Файлы</Link>
            {user?.is_admin && <Link to="/admin">Админ панель</Link>}
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
