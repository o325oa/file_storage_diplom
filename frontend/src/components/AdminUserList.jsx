import React, { useState, useEffect } from 'react';
import api from '../api';
import '../styles/AdminPage.css';

function AdminUserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/accounts/admin/users/');
        setUsers(response.data);
      } catch (error) {
        console.error('Fetch users error:', error.response.data);
      }
    };
    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    try {
      await api.delete(`/accounts/admin/users/${userId}/`);
      setUsers(users.filter(user => user.id !== userId));
    } catch (error) {
      console.error('Delete user error:', error.response.data);
    }
  };

  return (
    <div className="admin-container">
      <h1>Список пользователей</h1>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            <span>{user.username}</span>
            <span>{user.full_name}</span>
            <span>{user.email}</span>
            <span>{user.is_admin ? 'Админ' : 'Пользователь'}</span>
            <span>{user.file_count} файлов, {user.total_size} байт</span>
            <button onClick={() => handleDelete(user.id)}>Удалить</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminUserList;