
/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

import { authApi } from "../features/auth/services/authApi";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const isAuthenticated = Boolean(user);

  // Khôi phục phiên đăng nhập khi tải lại trang
  useEffect(() => {
    let cancelled = false;

    const restoreSession = async () => {
      try {
        const refreshed = await authApi.refresh();

        if (!refreshed || cancelled) return;

        const response = await authApi.getMe();

        if (!cancelled) {
          setUser(response.data.user);
        }
      } catch (error) {
        if (cancelled) return;

        console.error("Restore session error:", error);

        authApi.setAccessToken(null);

        if (!cancelled) {
          setUser(null);
        }
      } finally {
        if (!cancelled) {
          setIsAuthLoading(false);
        }
      }
    };

    restoreSession();

    return () => {
      cancelled = true;
    };
  }, []);

  // Đăng nhập bằng email và mật khẩu
  const login = async ({ email, password }) => {
    try {
      const response = await authApi.login({
        email: email.trim().toLowerCase(),
        password,
      });

      authApi.setAccessToken(response.data.accessToken);
      setUser(response.data.user);

      return {
        success: true,
        user: response.data.user,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || "Đăng nhập thất bại",
      };
    }
  };



  // Register new account
  const register = async ({ name, email, phone, password }) => {
    try {
      const response = await authApi.register({
        fullName: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone?.trim() || "",
        password,
      });

      authApi.setAccessToken(response.data.accessToken);
      setUser(response.data.user);

      return {
        success: true,
        user: response.data.user,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || "Đăng ký thất bại",
      };
    }
  };

  // Đăng xuất
  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      authApi.setAccessToken(null);
      setUser(null);
    }
  };
//   const loginWithGoogle = async (idToken) => {
//   try {
//     const response = await authApi.googleLogin(idToken);

//     authApi.setAccessToken(response.data.accessToken);
//     setUser(response.data.user);

//     return {
//       success: true,
//       user: response.data.user,
//     };
//   } catch (error) {
//     return {
//       success: false,
//       error: error.message || "Đăng nhập Google thất bại",
//     };
//   }
// };

  // Các chức năng chưa có API thật
  const loginWithPhone = async () => ({
    success: false,
    error: "Đăng nhập OTP đang được phát triển",
  });

  const loginWithDemo = () => ({
    success: false,
    error: "Đăng nhập demo đã tạm tắt",
  });

  const loginWithSocial = async () => ({
    success: false,
    error: "Đăng nhập mạng xã hội đang được phát triển",
  });

  // Tạm thời chỉ cập nhật state giao diện.
  // Chưa lưu xuống MongoDB.
  const updateUser = () => {
    console.warn(
      "Cần triển khai API cập nhật hồ sơ trước khi sử dụng updateUser"
    );
    return {
      success: false,
      error: "Chức năng cập nhật hồ sơ chưa được kết nối backend",
    };
  };

  const value = {
    user,
    isAuthenticated,
    isAuthLoading,
    login,
    register,
    logout,
    // loginWithGoogle,
    loginWithPhone,
    loginWithDemo,
    loginWithSocial,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used within an AuthProvider"
    );
  }

  return context;
};

export { AuthContext };
