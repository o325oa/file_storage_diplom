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
        <p>Welcome to the cloud storage app.</p>
      </div>
    </div>
  );
}

export default HomePage;
