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

  if (
    response.status === 401 &&
    (path === "/auth/me" ||
      path.startsWith("/admin/") ||
      path.startsWith("/customer/"))
  ) {
    const refreshResponse = await sendRequestToRefresh();

    if (refreshResponse) {
      response = await sendRequest(accessToken);
    }
  }

  const data = await response.json().catch(() => ({}));

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

export { request as apiRequest };

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

  updateProfile: (payload) =>
    request("/customer/profile", {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),

  refresh: sendRequestToRefresh,

  logout: () =>
    request("/auth/logout", {
      method: "POST",
    }),

  setAccessToken,
};
export const apiRequest = request;

/**
 * Gửi request và nhận file nhị phân.
 * Dùng chung accessToken và cơ chế refresh của Auth.
 */
export const apiDownload = async (path) => {
  const sendDownloadRequest = (token) =>
    fetch(`${API_URL}${path}`, {
      method: "GET",
      credentials: "include",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

  let response = await sendDownloadRequest(accessToken);

  // Access Token hết hạn thì refresh và thử lại.
  if (response.status === 401 && path.startsWith("/admin/")) {
    const refreshed = await sendRequestToRefresh();

    if (refreshed) {
      response = await sendDownloadRequest(accessToken);
    }
  }

  if (!response.ok) {
    let message = "Không thể tải file Excel";

    try {
      const data = await response.json();
      message = data.message || message;
    } catch {
      // Backend không trả JSON thì sử dụng thông báo mặc định.
    }

    throw new Error(message);
  }

  return response.blob();
};
