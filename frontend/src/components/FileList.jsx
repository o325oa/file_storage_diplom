import React from 'react';
import FileCard from './FileCard';
import '../styles/FileCard.css';

function FileList({ files, onDelete, onRename, onUpdateComment, onDownload, onPublish }) {
  return (
    <div className="file-grid">
      {files.map(file => (
        <FileCard
          key={file.id}
          file={file}
          onDelete={onDelete}
          onRename={onRename}
          onUpdateComment={onUpdateComment}
          onDownload={onDownload}
          onPublish={onPublish}
        />
      ))}
    </div>
  );
}

export default FileList;