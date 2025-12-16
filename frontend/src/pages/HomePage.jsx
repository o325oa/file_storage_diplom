import React from 'react';
import '../styles/HomePage.css';
import '../styles/Header.css';

function HomePage() {
  return (
    <div className="home-page">
      <h1>Файловое хранилище</h1>
      <p>Здесь вы можете загружать, управлять и делиться своими файлами.</p>
      <p>Администраторы имеют доступ ко всем файлам.</p>
    </div>
  );
}

export default HomePage;
