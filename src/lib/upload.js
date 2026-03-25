const API_BASE_URL = 'http://localhost:5001';

/**
 * Uploads a file to the backend avatar endpoint.
 * @param {File} file - The file to upload.
 * @returns {Promise<{url: string, user: object}>}
 */
export const uploadAvatar = async (file) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (!token) {
    throw new Error('You must be logged in to upload an avatar.');
  }

  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/api/auth/upload-avatar`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Error uploading image.');
  }

  return data;
};
