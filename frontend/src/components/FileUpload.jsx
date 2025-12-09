import React, { useState } from 'react';
import api from '../api';

function FileUpload({ onUpload }) {
  const [formData, setFormData] = useState({
    file: null,
    comment: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.files ? e.target.files[0] : e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('file', formData.file);
    data.append('comment', formData.comment);
    try {
      const response = await api.post('/storage/upload/', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      onUpload(response.data);
    } catch (error) {
      console.error('Upload error:', error.response.data);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="file" type="file" onChange={handleChange} required />
      <input name="comment" value={formData.comment} onChange={handleChange} placeholder="Комментарий" />
      <button type="submit">Загрузить</button>
    </form>
  );
}

export default FileUpload;
