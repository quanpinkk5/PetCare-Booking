/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react";
import { DEFAULT_USER, DEMO_ACCOUNTS } from "../features/auth/data/mockUsers";

const AUTH_USER_KEY = "petcare_auth_user_v1";
const AUTH_STATUS_KEY = "petcare_auth_status_v1";
const REGISTERED_USERS_KEY = "petcare_registered_users_v1";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Registered users database in localStorage
  const [registeredUsers, setRegisteredUsers] = useState(() => {
    try {
      const stored = localStorage.getItem(REGISTERED_USERS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Current logged in user
  const [user, setUser] = useState(() => {
    try {
      const storedStatus = localStorage.getItem(AUTH_STATUS_KEY);
      if (storedStatus === "false") {
        return null;
      }
      const storedUser = localStorage.getItem(AUTH_USER_KEY);
      if (storedUser) {
        return JSON.parse(storedUser);
      }
    } catch (e) {
      console.error("Failed to load user from localStorage", e);
    }
    // Default to initial logged-in user so existing demo screens work seamlessly
    return DEFAULT_USER;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      const storedStatus = localStorage.getItem(AUTH_STATUS_KEY);
      if (storedStatus === "false") return false;
      return true;
    } catch {
      return true;
    }
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      if (user && isAuthenticated) {
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
        localStorage.setItem(AUTH_STATUS_KEY, "true");
      } else {
        localStorage.removeItem(AUTH_USER_KEY);
        localStorage.setItem(AUTH_STATUS_KEY, "false");
      }
    } catch (e) {
      console.error("Failed to sync auth state to localStorage", e);
    }
  }, [user, isAuthenticated]);

  useEffect(() => {
    try {
      localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(registeredUsers));
    } catch (e) {
      console.error("Failed to sync registered users to localStorage", e);
    }
  }, [registeredUsers]);

  // Login with Email & Password
  const login = async ({ email, password }) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanEmail) {
      return { success: false, error: "Vui lòng nhập địa chỉ email" };
    }
    if (!cleanPass) {
      return { success: false, error: "Vui lòng nhập mật khẩu" };
    }

    // 1. Check in DEMO_ACCOUNTS
    const demoFound = DEMO_ACCOUNTS.find(
      (acc) => acc.email.toLowerCase() === cleanEmail
    );

    if (demoFound) {
      if (demoFound.password === cleanPass) {
        setUser(demoFound);
        setIsAuthenticated(true);
        return { success: true, user: demoFound };
      }
      return { success: false, error: "Mật khẩu không chính xác cho tài khoản này" };
    }

    // 2. Check in Registered Users
    const registeredFound = registeredUsers.find(
      (acc) => acc.email.toLowerCase() === cleanEmail
    );

    if (registeredFound) {
      if (registeredFound.password === cleanPass) {
        setUser(registeredFound);
        setIsAuthenticated(true);
        return { success: true, user: registeredFound };
      }
      return { success: false, error: "Mật khẩu không chính xác" };
    }

    // 3. Fallback: If not demo, require at least 6 characters
    if (cleanPass.length < 6) {
      return {
        success: false,
        error: "Mật khẩu phải có ít nhất 6 ký tự",
      };
    }

    const fallbackUser = {
      id: `usr_${Date.now()}`,
      name: cleanEmail.split("@")[0].replace(/[._-]/g, " ").toUpperCase(),
      email: cleanEmail,
      phone: "0900 000 000",
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${cleanEmail}`,
      role: "customer",
      tier: "Thành viên Mới",
      petCount: 1,
      bookingCount: 0,
      reviewCount: 0,
    };

    setUser(fallbackUser);
    setIsAuthenticated(true);
    return { success: true, user: fallbackUser };
  };

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
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();
    const cleanPhone = phone.trim();
    const cleanPass = password.trim();

    if (!cleanName) return { success: false, error: "Vui lòng nhập họ và tên" };
    if (!cleanEmail) return { success: false, error: "Vui lòng nhập email" };
    if (!cleanPass || cleanPass.length < 6)
      return { success: false, error: "Mật khẩu phải có ít nhất 6 ký tự" };

    const exists =
      DEMO_ACCOUNTS.some((u) => u.email.toLowerCase() === cleanEmail) ||
      registeredUsers.some((u) => u.email.toLowerCase() === cleanEmail);

    if (exists) {
      return { success: false, error: "Email này đã được sử dụng. Vui lòng đăng nhập." };
    }

    const newUser = {
      id: `usr_${Date.now()}`,
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone || "Chưa cập nhật",
      password: cleanPass,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${cleanEmail}`,
      gender: "Chưa cập nhật",
      birthday: "2000-01-01",
      address: "Chưa cập nhật",
      bio: "Thành viên mới yêu thú cưng của PetCare Booking.",
      role: "customer",
      tier: "Thành viên Mới",
      petCount: 0,
      bookingCount: 0,
      reviewCount: 0,
    };

    setRegisteredUsers((prev) => [...prev, newUser]);
    setUser(newUser);
    setIsAuthenticated(true);
    return { success: true, user: newUser };
  };

  // Logout
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem(AUTH_USER_KEY);
    localStorage.setItem(AUTH_STATUS_KEY, "false");
  };

  // Update profile
  const updateUser = (updatedFields) => {
    setUser((prev) => {
      const merged = { ...prev, ...updatedFields };
      try {
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(merged));
      } catch (e) {
        console.error(e);
      }
      return merged;
    });
  };

  const value = {
    user,
    isAuthenticated,
    login,
    loginWithPhone,
    loginWithDemo,
    loginWithSocial,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export { AuthContext };
