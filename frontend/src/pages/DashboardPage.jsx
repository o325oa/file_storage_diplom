import React, { useState, useEffect } from 'react';
import FileUpload from '../components/FileUpload';
import FileList from '../components/FileList';
import api from '../api';

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
      <style>
        {`
          .file-grid {
            display: grid;
            grid-template-columns: repeat(6, 1fr);
            gap: 10px;
            padding: 20px;
          }

          .file-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            background-color: #f9f9f9;
          }

          .file-item img {
            width: 100px;
            height: 100px;
            object-fit: cover;
            margin-bottom: 10px;
          }

          .file-item span {
            margin-bottom: 5px;
          }

          .file-item button {
            padding: 5px 10px;
            margin-top: 5px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 4px;
            font-size: 14px;
            cursor: pointer;
          }

          .file-item button:hover {
            background-color: #0056b3;
          }

          .file-item button:last-child {
            background-color: #dc3545;
          }

          .file-item button:last-child:hover {
            background-color: #c82333;
          }
        `}
      </style>
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
