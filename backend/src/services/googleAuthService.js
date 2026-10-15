
// const { OAuth2Client } = require("google-auth-library");

// const googleClient = new OAuth2Client(
//   process.env.GOOGLE_CLIENT_ID
// );

// const verifyGoogleIdToken = async (idToken) => {
//   if (!process.env.GOOGLE_CLIENT_ID) {
//     throw new Error("GOOGLE_CLIENT_ID chưa được cấu hình");
//   }

//   if (typeof idToken !== "string" || !idToken.trim()) {
//     throw new Error("Google ID Token không hợp lệ");
//   }

//   // Xác minh chữ ký, issuer, audience và thời hạn token
//   const ticket = await googleClient.verifyIdToken({
//     idToken,
//     audience: process.env.GOOGLE_CLIENT_ID,
//   });

//   const payload = ticket.getPayload();

//   if (
//     !payload ||
//     !payload.sub ||
//     !payload.email ||
//     payload.email_verified !== true
//   ) {
//     throw new Error("Tài khoản Google chưa được xác minh");
//   }

//   return {
//     googleId: payload.sub,
//     email: payload.email.trim().toLowerCase(),
//     fullName: payload.name || payload.email.split("@")[0],
//     avatar: payload.picture || null,
//   };
// };

// module.exports = {
//   verifyGoogleIdToken,
// };
