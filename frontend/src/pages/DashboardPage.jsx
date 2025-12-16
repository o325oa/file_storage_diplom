import React, { useState, useEffect } from 'react';
import FileUpload from '../components/FileUpload';
import FileList from '../components/FileList';
import api from '../api';
import '../styles/DashboardPage.css';
import '../styles/Header.css';

function DashboardPage() {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await api.get('/storage/files/');
        setFiles(response.data.map(file => ({ ...file, public_url: null })));
      } catch (error) {
        console.error('Fetch files error:', error.response.data);
      }
    };
    fetchFiles();
  }, []);

  const handleUpload = (newFile) => {
    setFiles([...files, { ...newFile, public_url: null }]);
  };

  const handleDelete = (fileId) => {
    setFiles(files.filter(file => file.id !== fileId));
  };

  const handleRename = (fileId, newName) => {
    setFiles(files.map(file => file.id === fileId ? { ...file, original_name: newName } : file));
  };

  const handleUpdateComment = (fileId, newComment) => {
    setFiles(files.map(file => file.id === fileId ? { ...file, comment: newComment } : file));
  };

  const handleDownload = (fileId) => {
    const file = files.find(f => f.id === fileId);
    const link = document.createElement('a');
    link.href = `/storage/files/${fileId}/download/`;
    link.download = file.original_name;
    link.click();
  };

  const handlePublish = (fileId, url) => {
    setFiles(files.map(file => file.id === fileId ? { ...file, public_url: url } : file));
  };

  return (
    <div>
      <div className="dashboard-container">
        <h1>Файловое хранилище</h1>
        <FileUpload onUpload={handleUpload} />
        <FileList
          files={files}
          onDelete={handleDelete}
          onRename={handleRename}
          onUpdateComment={handleUpdateComment}
          onDownload={handleDownload}
          onPublish={handlePublish}
        />
      </div>
    </div>
  );
}

export default DashboardPage;
