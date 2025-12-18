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

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(file.public_url);
      alert('Ссылка скопирована!');
    } catch (err) {
      console.error('Ошибка копирования:', err);
    }
  };

  return (
    <div>
      <style>
        {`
          .file-card {
            display: flex;
            border: 1px solid #ddd;
            border-radius: 8px;
            overflow: hidden;
            margin-bottom: 10px;
            background-color: #f9f9f9;
          }

          .file-icon {
            width: 60px;
            height: 60px;
            background-color: #0397f3;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .file-icon img {
            width: 40px;
            height: 40px;
            filter: invert(1); /* чтобы иконка была белой */
          }

          .file-info {
            padding: 10px;
            flex: 1;
          }

          .file-info h4 {
            margin: 0 0 5px 0;
            font-size: 16px;
            color: #333;
          }

          .file-info p {
            margin: 5px 0;
            font-size: 14px;
            color: #555;
          }

          .file-info label {
            display: block;
            margin-top: 8px;
            font-size: 14px;
            color: #333;
          }

          .file-info input[type="text"] {
            width: 100%;
            padding: 5px;
            margin-top: 3px;
            border: 1px solid #ccc;
            border-radius: 4px;
          }

          .public-link {
            margin-top: 10px;
          }

          .public-link input {
            width: 70%;
            margin-right: 5px;
            border: 1px solid #ccc;
            border-radius: 4px;
          }

          .public-link button {
            padding: 5px 10px;
            background-color: #0397f3;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
          }

          .public-link button:hover {
            background-color: #0873d0;
          }

          .file-actions {
            margin-top: 10px;
          }

          .file-actions button {
            margin-right: 5px;
            padding: 5px 10px;
            background-color: #0397f3;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
          }

          .file-actions button:hover {
            background-color: #0873d0;
          }
        `}
      </style>
      <div className="file-card">
        <div className="file-icon">
          <img src="/path/to/file-icon.png" alt="File Icon" />
        </div>
        <div className="file-info">
          <h4>{file.original_name}</h4>
          <p>Размер: {file.size} байт</p>
          <p>Дата загрузки: {file.uploaded_at}</p>
          <p>Дата последнего скачивания: {file.last_download || '—'}</p>
          <div>
            <label>Комментарий:</label>
            <input
              type="text"
              defaultValue={file.comment}
              onBlur={(e) => handleUpdateComment(e.target.value)}
              placeholder="Комментарий"
            />
          </div>
          <div>
            <label>Новое имя:</label>
            <input
              type="text"
              defaultValue={file.original_name}
              onBlur={(e) => handleRename(e.target.value)}
              placeholder="Новое имя"
            />
          </div>
          {file.public_url && (
            <div className="public-link">
              <label>Публичная ссылка:</label>
              <input type="text" value={file.public_url} readOnly />
              <button onClick={copyToClipboard}>Копировать</button>
            </div>
          )}
          <div className="file-actions">
            <button onClick={handleDownload}>Скачать</button>
            <button onClick={handlePublish}>Опубликовать</button>
            <button onClick={handleDelete}>Удалить</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FileCard;
