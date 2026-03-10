const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// ── Upload and analyze a document ──
export const uploadDocument = async (file, onProgress) => {
  const formData = new FormData();
  formData.append('document', file);

  const response = await fetch(`${BASE_URL}/upload`, {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Upload failed');
  }

  return data;
};

// ── Fetch a single analysis by ID ──
export const fetchAnalysis = async (id) => {
  const response = await fetch(`${BASE_URL}/analysis/${id}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch analysis');
  }

  return data;
};

// ── Fetch all analyses (history) ──
export const fetchAllAnalyses = async () => {
  const response = await fetch(`${BASE_URL}/analysis`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch analyses');
  }

  return data;
};

// ── Delete an analysis ──
export const deleteAnalysis = async (id) => {
  const response = await fetch(`${BASE_URL}/analysis/${id}`, {
    method: 'DELETE',
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to delete analysis');
  }

  return data;
};

// ── Accept a suggested rewrite ──
export const acceptRewrite = async (requirementId) => {
  const response = await fetch(`${BASE_URL}/requirements/${requirementId}/accept`, {
    method: 'PATCH',
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to accept rewrite');
  }

  return data;
};