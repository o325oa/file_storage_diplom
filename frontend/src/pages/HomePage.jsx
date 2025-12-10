import React from 'react';
import Header from '../components/Header';
import '../styles/HomePage.css';
import '../styles/Header.css';

function HomePage() {
  return (
    <div>
      <Header />
      <div className="home-container">
        <h1>Cloud Storage</h1>
        <p>Добро пожаловать в облачное хранилище</p>
      </div>
    </div>
  );
}

export default HomePage;
