// const User = require("../../models/User");
// const { createAuthSession } = require("../../services/authService");
// const { verifyGoogleIdToken } = require("../../services/googleAuthService");

// // Đăng nhập hoặc đăng ký bằng Google
// const googleLogin = async (req, res) => {
//   try {
//     const { idToken } = req.body || {};

//     if (typeof idToken !== "string" || !idToken.trim()) {
//       return res.status(400).json({
//         success: false,
//         message: "Thiếu Google ID Token",
//       });
//     }

//     // Xác minh ID Token thật với Google
//     let googleProfile;

//     try {
//       googleProfile = await verifyGoogleIdToken(idToken);
//     } catch (error) {
//       console.error("Google verify error:", error.message);
//       return res.status(401).json({
//         success: false,
//         message: "Xác thực tài khoản Google thất bại",
//       });
//     }

//     // Ưu tiên tìm tài khoản đã liên kết bằng Google ID
//     let user = await User.findOne({
//       googleId: googleProfile.googleId,
//     });

//     if (!user) {
//       // Không tự động liên kết vào tài khoản có email trùng
//       const existingUser = await User.findOne({
//         email: googleProfile.email,
//       });

//       if (existingUser) {
//         return res.status(409).json({
//           success: false,
//           message:
//             "Email này đã có tài khoản. Vui lòng đăng nhập bằng phương thức trước đó.",
//         });
//       }

//       // Đăng ký tài khoản CUSTOMER mới từ Google
//       try {
//         user = await User.create({
//           fullName: googleProfile.fullName,
//           email: googleProfile.email,
//           googleId: googleProfile.googleId,
//           avatar: googleProfile.avatar,
//           role: "CUSTOMER",
//           status: "ACTIVE",
//         });
//       } catch (error) {
//         // Tránh tạo tài khoản trùng khi có request đồng thời
//         if (error.code === 11000) {
//           user = await User.findOne({
//             googleId: googleProfile.googleId,
//           });

//           if (!user) {
//             return res.status(409).json({
//               success: false,
//               message: "Email đã được sử dụng bởi tài khoản khác",
//             });
//           }
//         } else {
//           throw error;
//         }
//       }
//     }

//     // Không cho tài khoản bị khóa đăng nhập
//     if (user.status !== "ACTIVE") {
//       return res.status(403).json({
//         success: false,
//         message: "Tài khoản đã bị khóa",
//       });
//     }

//     // Tạo JWT + Refresh Token bằng authService hiện tại
//     const { accessToken, refreshToken } = await createAuthSession(user, {
//       userAgent: req.get("user-agent") || "",
//       ipAddress: req.ip || "",
//     });

//     // Cookie phải dùng cùng cấu hình với login thông thường
//     res.cookie("petcare_refresh_token", refreshToken, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "lax",
//       path: "/api/auth",
//       maxAge: 7 * 24 * 60 * 60 * 1000,
//     });

//     return res.status(200).json({
//       success: true,
//       message: "Đăng nhập Google thành công",
//       data: {
//         accessToken,
//         user: {
//           id: user._id,
//           fullName: user.fullName,
//           name: user.fullName,
//           email: user.email,
//           avatar: user.avatar,
//           role: user.role,
//           status: user.status,
//         },
//       },
//     });
//   } catch (error) {
//     console.error("Google login error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Không thể đăng nhập Google lúc này",
//     });
//   }
// };

// module.exports = {
//   googleLogin,
// };
