import React from 'react';
import { useParams } from 'react-router-dom';
import PublicDownloadPage from '../components/PublicDownloadPage';

function PublicDownloadPageWrapper() {
  const { token } = useParams();

  return <PublicDownloadPage token={token} />;
}

export default PublicDownloadPageWrapper;
