import React from 'react';
import api from '../api';

function FileCard({ file, onDelete, onRename, onUpdateComment, onDownload, onPublish }) {
  const handleDelete = async () => {
    try {
      await api.delete(`/storage/files/${file.id}/`);
      onDelete(file.id);
    } catch (error) {
      console.error('Delete error:', error.response.data);
    }
  };

  const handlePublish = async () => {
    try {
      const response = await api.post(`/storage/files/${file.id}/publish/`);
      onPublish(file.id, response.data.url);
    } catch (error) {
      console.error('Publish error:', error.response.data);
    }
  };

  const handleRename = async (newName) => {
    try {
      await api.patch(`/storage/files/${file.id}/rename/`, { new_name: newName });
      onRename(file.id, newName);
    } catch (error) {
      console.error('Rename error:', error.response.data);
    }
  };

  const handleUpdateComment = async (newComment) => {
    try {
      await api.patch(`/storage/files/${file.id}/comment/`, { comment: newComment });
      onUpdateComment(file.id, newComment);
    } catch (error) {
      console.error('Update comment error:', error.response.data);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await api.get(`/storage/files/${file.id}/download/`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = file.original_name;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error.response.data);
    }
  };

  return (
    <div className="file-card">
      <div className="file-icon">
        <img src="/path/to/file-icon.png" alt="File Icon" />
      </div>
      <div className="file-info">
        <span>{file.original_name}</span>
        {file.public_url && (
          <div>
            <input type="text" value={file.public_url} readOnly />
            <button onClick={() => navigator.clipboard.writeText(file.public_url)}>Копировать</button>
          </div>
        )}
        <input
          type="text"
          defaultValue={file.comment}
          onBlur={(e) => handleUpdateComment(e.target.value)}
          placeholder="Комментарий"
        />
        <input
          type="text"
          defaultValue={file.original_name}
          onBlur={(e) => handleRename(e.target.value)}
          placeholder="Новое имя"
        />
        <button onClick={handleDownload}>Скачать</button>
        <button onClick={handlePublish}>Опубликовать</button>
        <button onClick={handleDelete}>Удалить</button>
      </div>
    </div>
  );
}

export default FileCard;
