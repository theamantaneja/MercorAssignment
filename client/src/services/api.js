const API_BASE = '/api';

export const api = {
  // Get candidates with filters and pagination
  getCandidates: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = `${API_BASE}/candidates?${queryString}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch candidates');
    return response.json();
  },

  // Get statistics
  getStats: async () => {
    const response = await fetch(`${API_BASE}/candidates/stats`);
    if (!response.ok) throw new Error('Failed to fetch stats');
    return response.json();
  },

  // Get single candidate
  getCandidate: async (id) => {
    const response = await fetch(`${API_BASE}/candidates/${id}`);
    if (!response.ok) throw new Error('Failed to fetch candidate');
    return response.json();
  },

  // Save selection
  saveSelection: async (selectedCandidates, justifications) => {
    const response = await fetch(`${API_BASE}/candidates/selection`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ selectedCandidates, justifications }),
    });
    if (!response.ok) throw new Error('Failed to save selection');
    return response.json();
  },

  // Get saved selection
  getSelection: async () => {
    const response = await fetch(`${API_BASE}/candidates/selection/current`);
    if (!response.ok) throw new Error('Failed to fetch selection');
    return response.json();
  }
};

