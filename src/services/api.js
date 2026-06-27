const getAuthHeader = (token) => {
  const activeToken = token || localStorage.getItem('fute_access_token');
  return activeToken ? { Authorization: `Bearer ${activeToken}` } : {};
};

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.message || `HTTP error! Status: ${response.status}`;
    throw new Error(errorMessage);
  }
  return response.json();
};

let isRefreshing = false;
let refreshSubscribers = [];

const subscribeTokenRefresh = (cb) => {
  refreshSubscribers.push(cb);
};

const onRefreshed = (token) => {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
};

const customFetch = async (url, options = {}) => {
  const headers = {
    ...options.headers,
    ...getAuthHeader(),
  };

  const config = {
    ...options,
    headers,
  };

  let response = await fetch(url, config);

  if (response.status === 401 && !url.includes('/api/auth/login') && !url.includes('/api/auth/refresh')) {
    if (!isRefreshing) {
      isRefreshing = true;
      
      try {
        const refreshToken = localStorage.getItem('fute_refresh_token');
        if (!refreshToken) {
          throw new Error('No refresh token stored');
        }

        const refreshRes = await fetch('/api/auth/refresh', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
        });

        if (!refreshRes.ok) {
          throw new Error('Refresh token is expired or invalid');
        }

        const data = await refreshRes.json();
        localStorage.setItem('fute_access_token', data.accessToken);
        
        isRefreshing = false;
        onRefreshed(data.accessToken);
      } catch (error) {
        isRefreshing = false;
        localStorage.removeItem('fute_access_token');
        localStorage.removeItem('fute_refresh_token');
        localStorage.removeItem('fute_admin_user');
        window.location.reload();
        throw new Error('Session expired. Please log in again.');
      }
    }

    return new Promise((resolve, reject) => {
      subscribeTokenRefresh((newToken) => {
        config.headers = {
          ...config.headers,
          ...getAuthHeader(newToken),
        };
        fetch(url, config)
          .then((res) => handleResponse(res))
          .then(resolve)
          .catch(reject);
      });
    });
  }

  return handleResponse(response);
};

export const api = {
  login: async (email, password) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(res);
  },

  logout: async () => {
    return customFetch('/api/auth/logout', {
      method: 'POST',
    });
  },

  getMe: async () => {
    return customFetch('/api/auth/me', {
      method: 'GET',
    });
  },

  getLeads: async (filters = {}) => {
    const { search = '', status = 'All', unitType = 'All', sortBy = 'createdAt', sortOrder = 'desc' } = filters;
    const queryParams = new URLSearchParams({
      search,
      status,
      unitType,
      sortBy,
      sortOrder,
    }).toString();

    return customFetch(`/api/leads?${queryParams}`, {
      method: 'GET',
    });
  },

  getLeadById: async (id) => {
    return customFetch(`/api/leads/${id}`, {
      method: 'GET',
    });
  },

  createLead: async (leadData) => {
    return customFetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(leadData),
    });
  },

  updateLead: async (id, leadData) => {
    return customFetch(`/api/leads/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(leadData),
    });
  },

  deleteLead: async (id) => {
    return customFetch(`/api/leads/${id}`, {
      method: 'DELETE',
    });
  },

  getSummary: async () => {
    return customFetch('/api/leads/summary', {
      method: 'GET',
    });
  },
};
