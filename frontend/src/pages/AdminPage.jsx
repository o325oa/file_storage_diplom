import React from 'react';
import AdminUserList from '../components/AdminUserList';

function AdminPage() {
  return (
    <div>
      <style>
        {`
          .admin-container {
            max-width: 1000px;
            margin: 0 auto;
            padding: 20px;
          }

          .admin-container h1 {
            text-align: center;
            color: #333;
          }

          .admin-container ul {
            list-style: none;
            padding: 0;
          }

          .admin-container li {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 10px;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            background-color: #f9f9f9;
          }

          .admin-container li span {
            margin-right: 10px;
          }

          .admin-container button {
            padding: 5px 10px;
            background-color: #dc3545;
            color: white;
            border: none;
            border-radius: 4px;
            font-size: 14px;
            cursor: pointer;
          }

          .admin-container button:hover {
            background-color: #c82333;
          }
        `}
      </style>
      <div className="admin-container">
        <h1>Административный интерфейс</h1>
        <AdminUserList />
      </div>
    </div>
  );
}

export default AdminPage;

