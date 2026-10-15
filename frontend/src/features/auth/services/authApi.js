const API_URL = "http://localhost:5000/api";

// Access token chỉ lưu trong bộ nhớ
let accessToken = null;
let refreshPromise = null;

const setAccessToken = (token) => {
  accessToken = token;
};

const request = async (path, options = {}) => {
  const sendRequest = (token) =>
    fetch(`${API_URL}${path}`, {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

  let response = await sendRequest(accessToken);

  // Nếu access token hết hạn, thử làm mới phiên
  if (response.status === 401 && path === "/auth/me") {
    const refreshResponse = await sendRequestToRefresh();

    if (refreshResponse) {
      response = await sendRequest(accessToken);
    }
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Có lỗi xảy ra");
  }

  return data;
};

const refreshAccessToken = async () => {
  try {
    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) {
      accessToken = null;
      return false;
    }

    const data = await response.json();
    setAccessToken(data.data.accessToken);
    return true;
  } catch {
    accessToken = null;
    return false;
  }
};

const sendRequestToRefresh = () => {
  // StrictMode and concurrent 401 responses must share the same token rotation.
  if (!refreshPromise) {
    refreshPromise = refreshAccessToken().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
};

export const authApi = {
  register: (payload) =>
    request("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  login: (payload) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  forgotPassword: (email) =>
    request("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),
//   googleLogin: (idToken) =>
//     request("/auth/google", {
//       method: "POST",
//       body: JSON.stringify({ idToken }),
//     }),

  resetPassword: ({ token, newPassword }) =>
    request("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, newPassword }),
    }),

  getMe: () => request("/auth/me"),

  refresh: sendRequestToRefresh,

  logout: () =>
    request("/auth/logout", {
      method: "POST",
    }),

  setAccessToken,
};
