
const nodemailer = require("nodemailer");

// Cấu hình SMTP Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

// Kiểm tra kết nối Gmail
const verifyEmailConnection = async () => {
  await transporter.verify();
  console.log("Gmail SMTP connected successfully");
};

// Gửi email khôi phục mật khẩu
const sendResetPasswordEmail = async (email, resetUrl) => {
  const mailOptions = {
    from: {
      name: "PetCare Booking",
      address: process.env.EMAIL_USER,
    },
    to: email,
    subject: "Khôi phục mật khẩu PetCare Booking",
    text: [
      "Xin chào,",
      "",
      "Chúng tôi nhận được yêu cầu đặt lại mật khẩu của bạn.",
      "Truy cập liên kết sau để đặt lại mật khẩu:",
      resetUrl,
      "",
      "Liên kết có hiệu lực trong 15 phút.",
      "Nếu bạn không yêu cầu, hãy bỏ qua email này.",
      "",
      "PetCare Booking",
    ].join("\n"),
  };

  return transporter.sendMail(mailOptions);
};

module.exports = {
  verifyEmailConnection,
  sendResetPasswordEmail,
};
