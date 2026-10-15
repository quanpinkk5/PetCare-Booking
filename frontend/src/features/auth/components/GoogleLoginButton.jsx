
// import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
// import { useAuth } from "../../../context/AuthContext";

// const GoogleLoginButton = ({ onSuccessLogin }) => {
//   const { loginWithGoogle } = useAuth();

//   const handleSuccess = async (credentialResponse) => {
//     if (!credentialResponse.credential) {
//       alert("Không nhận được thông tin đăng nhập từ Google");
//       return;
//     }

//     const result = await loginWithGoogle(
//       credentialResponse.credential
//     );

//     if (!result.success) {
//       alert(result.error);
//       return;
//     }

//     // Để trang Login tự điều hướng theo role
//     onSuccessLogin?.(result.user);
//   };

//   return (
//     <GoogleOAuthProvider
//       clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
//     >
//       <GoogleLogin
//         onSuccess={handleSuccess}
//         onError={() => {
//           alert("Không thể đăng nhập bằng Google");
//         }}
//         theme="outline"
//         size="large"
//         text="signin_with"
//         shape="rectangular"
//         width="210"
//       />
//     </GoogleOAuthProvider>
//   );
// };

// export default GoogleLoginButton;
