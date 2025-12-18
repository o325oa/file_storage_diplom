import React from 'react';

function HomePage() {
  return (
    <div>
      <style>
        {`
          .home-container {
            text-align: center;
            padding: 20px;
          }

          .home-container h1 {
            color: #333;
          }

          .home-container p {
            color: #666;
          }
        `}
      </style>
      <div className="home-container">
        <h1>Файловое хранилище</h1>
        <p>Здесь вы можете загружать, управлять и делиться своими файлами.</p>
        <p>Администраторы имеют доступ ко всем файлам.</p>
      </div>
    </div>
  );
}

export default HomePage;
