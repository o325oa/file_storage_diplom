import React, { useState, useEffect } from 'react';
import api from '../api';

function PublicDownloadPage({ token }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFile = async () => {
      try {
        const response = await api.get(`/s/${token}/`);
        setFile(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Fetch file error:', error.response.data);
        setLoading(false);
      }
    };
    fetchFile();
  }, [token]);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = `/s/${token}/`;
    link.download = file.original_name;
    link.click();
  };

  if (loading) {
    return <div>Загрузка...</div>;
  }

  return (
    <div>
      <h1>Скачать файл</h1>
      <p>Файл: {file.original_name}</p>
      <button onClick={handleDownload}>Скачать</button>
    </div>
  );
}

export default PublicDownloadPage;
