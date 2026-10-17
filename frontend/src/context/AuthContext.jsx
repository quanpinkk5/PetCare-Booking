
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

<<<<<<<<< Temporary merge branch 1
  // Login with Phone & OTP
  const loginWithPhone = async ({ phone, otp }) => {
    const cleanPhone = phone.trim().replace(/\s+/g, "");
    if (!cleanPhone || cleanPhone.length < 9) {
      return { success: false, error: "Vui lòng nhập số điện thoại hợp lệ" };
    }
    if (!otp || otp.length !== 6) {
      return { success: false, error: "Mã OTP phải gồm 6 chữ số" };
    }

    // Mock OTP verification (accept 123456 or any 6 digits in demo mode)
    const demoFound = DEMO_ACCOUNTS.find(
      (acc) => acc.phone.replace(/\s+/g, "") === cleanPhone
    );

    const targetUser = demoFound || {
      id: `usr_${Date.now()}`,
      name: `Khách hàng ${cleanPhone.slice(-4)}`,
      email: `customer${cleanPhone.slice(-4)}@petcare.vn`,
      phone: cleanPhone,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${cleanPhone}`,
      role: "customer",
      tier: "Thành viên Mới",
      petCount: 0,
      bookingCount: 0,
      reviewCount: 0,
    };

    setUser(targetUser);
    setIsAuthenticated(true);
    return { success: true, user: targetUser };
  };

  // Login with Demo Role (1-click)
  const loginWithDemo = (role = "customer") => {
    const target =
      DEMO_ACCOUNTS.find(
        (acc) =>
          acc.role === role ||
          ((role === "businessOwner" || role === "partner") &&
            (acc.role === "businessOwner" || acc.role === "partner"))
      ) || DEMO_ACCOUNTS[0];
    setUser(target);
    setIsAuthenticated(true);
    return { success: true, user: target };
  };

  // Login with Social Provider (Google / Facebook / Apple)
  const loginWithSocial = (provider = "Google") => {
    const socialUser = {
      id: `usr_social_${Date.now()}`,
      name: `Người dùng ${provider}`,
      email: `user.${provider.toLowerCase()}@gmail.com`,
      phone: "0912 345 678",
      avatar:
        provider === "Google"
          ? "https://lh3.googleusercontent.com/aida-public/AB6AXuDy41SEghjD-Su0C0GIDKStQMA6XwhIz7_0OYuczV-ao5uFnR1gsVRb3EXzhrO95-UaVPo7bZv1SXgIrincJFkxhtbLAaFJOF64Abnq7U6WSP1fm6W20bYukp4qPUonnwxDJPbLdNzuXZCA52IxbGWfQlrgLu_vk9glp5yioJe4V_F9urI-KR1Uc2bmb27r8AODOGs99EaD5FJ5fLMReu4N7bIfg_Zq-1LLG_pnP_homvuDvPdy1dk_"
          : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
      role: "customer",
      tier: "Thành viên Bạc",
      petCount: 1,
      bookingCount: 2,
      reviewCount: 1,
      socialProvider: provider,
    };
    setUser(socialUser);
    setIsAuthenticated(true);
    return { success: true, user: socialUser };
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
