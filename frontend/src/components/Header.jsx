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
    <div>
      <style>
        {`
          .header {
            background-color: #0397f3;
            color: white;
            padding: 10px 20px;
            border-bottom: 1px solid #0873d0;
          }

          .header nav {
            display: flex;
            gap: 20px;
            align-items: center;
          }

          .header nav a {
            color: white;
            text-decoration: none;
            font-weight: 500;
          }

          .header nav a:hover {
            text-decoration: underline;
          }

          .logout-button {
            background-color: #0873d0;
            color: white;
            border: none;
            padding: 5px 10px;
            border-radius: 4px;
            cursor: pointer;
            font-weight: 500;
          }

          .logout-button:hover {
            background-color: #0056b3;
          }
        `}
      </style>
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
    </div>
  );
}

export default Header;
