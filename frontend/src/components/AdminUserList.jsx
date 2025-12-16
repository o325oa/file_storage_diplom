import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { login } from '../store/slices/authSlice';
import api from '../api';

function AdminUsersList() {
  const [users, setUsers] = useState([]);
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isAuthenticated && user.is_admin) {
      api.get('/accounts/admin/users/')
        .then(response => {
          console.log('Server response:', response.data);
          if (Array.isArray(response.data)) {
            setUsers(response.data);
          } else {
            console.error('Expected array, got:', response.data);
          }
        })
        .catch(error => console.error('Error fetching users:', error));
    }
  }, [isAuthenticated, user]);

  const toggleAdmin = (userId) => {
    api.patch(`/admin/users/${userId}/toggle/`)
      .then(response => {
        setUsers(users.map(u => u.id === userId ? { ...u, is_admin: response.data.is_admin } : u));
        if (userId === user.id) {
          dispatch(login.fulfilled({ user: { ...user, is_admin: response.data.is_admin } }));
        }
      })
      .catch(error => console.error('Error toggling admin status:', error));
  };

  const deleteUser = (userId) => {
    api.delete(`/admin/users/${userId}/`)
      .then(() => {
        setUsers(users.filter(u => u.id !== userId));
      })
      .catch(error => console.error('Error deleting user:', error));
  };

  if (!isAuthenticated || !user.is_admin) {
    return <div>Доступ запрещён</div>;
  }

  return (
    <div>
      <h2>Список пользователей</h2>
      <table>
        <thead>
          <tr>
            <th>Логин</th>
            <th>Email</th>
            <th>Файлы</th>
            <th>Размер</th>
            <th>Админ</th>
            <th>Действие</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.file_count}</td>
              <td>{user.total_size}</td>
              <td>{user.is_admin ? 'Да' : 'Нет'}</td>
              <td>
                <button onClick={() => toggleAdmin(user.id)}>
                  {user.is_admin ? 'Снять админа' : 'Сделать админом'}
                </button>
                <button onClick={() => deleteUser(user.id)}>Удалить</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminUsersList;
