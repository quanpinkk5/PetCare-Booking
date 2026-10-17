export const REVIEW_METRICS = [
  {
    title: "Đánh giá trung bình",
    value: "4.8",
    suffix: "/ 5.0",
    description: "Từ 180 lượt đánh giá",
    growth: "+0.2",
    growthDescription: "so với tháng trước",
    icon: "star",
    color: "amber",
  },
  {
    title: "Tổng số đánh giá",
    value: "180",
    suffix: "lượt",
    description: "98% phản hồi tích cực",
    growth: "+12.5%",
    growthDescription: "so với tháng trước",
    icon: "messages",
    color: "emerald",
  },
  {
    title: "Chưa phản hồi",
    value: "2",
    suffix: "đánh giá",
    description: "Cần phản hồi trong 24h",
    growth: null,
    growthDescription: "Cần xử lý sớm",
    icon: "message",
    color: "blue",
  },
  {
    title: "Độ hài lòng",
    value: "98%",
    suffix: "",
    description: "176/180 khách hàng hài lòng",
    growth: "+2.1%",
    growthDescription: "so với tháng trước",
    icon: "smile",
    color: "teal",
  },
];

export const RATING_DISTRIBUTION = [
  { stars: 5, count: 145, percent: 80.6, color: "bg-emerald-500" },
  { stars: 4, count: 25, percent: 13.9, color: "bg-emerald-400" },
  { stars: 3, count: 6, percent: 3.3, color: "bg-amber-400" },
  { stars: 2, count: 3, percent: 1.7, color: "bg-orange-400" },
  { stars: 1, count: 1, percent: 0.5, color: "bg-rose-400" },
];

export const SENTIMENT_DISTRIBUTION = [
  { label: "Tích cực (4-5★)", count: 170, percent: 94, color: "bg-emerald-500" },
  { label: "Trung tính (3★)", count: 6, percent: 4, color: "bg-blue-500" },
  { label: "Tiêu cực (1-2★)", count: 4, percent: 2, color: "bg-rose-500" },
];

export const REVIEW_FILTERS = [
  { label: "Tất cả", value: "all", count: 6 },
  { label: "Chưa phản hồi", value: "unreplied", count: 2 },
  { label: "5 sao", value: "5", count: 4 },
  { label: "4 sao", value: "4", count: 1 },
  { label: "3 sao", value: "3", count: 1 },
  { label: "Đánh giá thấp", value: "low", count: 1 },
];

export const REVIEW_STRENGTHS = [
  "Nhân viên nhiệt tình, chu đáo và yêu thương động vật",
  "Kỹ thuật cắt tỉa đẹp, đúng phom và đúng yêu cầu",
  "Không gian sạch sẽ, không mùi hôi, khử trùng kỹ lưỡng",
  "Cập nhật hình ảnh và nhật ký chăm sóc kịp thời",
];

export const REVIEW_IMPROVEMENTS = [
  "Thời gian chờ vào giờ cao điểm cuối tuần đôi lúc hơi lâu",
  "Cần bổ sung thêm chỗ đỗ xe ô tô cho khách",
  "Gửi thông báo nhắc lịch hẹn trước 1-2 tiếng qua app",
];

export const QUICK_REPLY_TEMPLATES = [
  "Cảm ơn bạn đã tin tưởng dịch vụ của Happy Pet!",
  "Rất vui vì bé cưng đã có trải nghiệm thoải mái và vui vẻ tại cơ sở ạ!",
  "Happy Pet xin ghi nhận phản hồi và sẽ nỗ lực nâng cao chất lượng hơn nữa.",
  "Dạ cơ sở xin lỗi vì trải nghiệm chưa trọn vẹn, chúng tôi sẽ liên hệ hỗ trợ bạn ngay ạ!",
];

export const REVIEWS_DATA = [
  {
    id: "REV-001",
    customer: "Thùy Chi",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80",
    verified: true,
    service: "Grooming toàn diện & Tắm spa",
    serviceType: "Grooming",
    branch: "Happy Pet - Cầu Giấy",
    date: "14/10/2026",
    rating: 5,
    pet: {
      name: "Bé Bông",
      breed: "Poodle • 4.5kg",
      emoji: "🐩",
    },
    content: "Bé nhà mình đi spa về thơm tho sạch sẽ, nhân viên cực kỳ nhiệt tình và nhẹ nhàng với bé cún! Cắt tỉa rất khéo, đúng kiểu mình thích.",
    images: [
      "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=300&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=300&auto=format&fit=crop&q=80",
    ],
    reply: {
      author: "Happy Pet Cầu Giấy",
      date: "14/10/2026 14:30",
      content: "Dạ cảm ơn bạn Thùy Chi đã tin yêu và gửi gắm bé Bông cho Happy Pet. Hẹn gặp lại bạn và bé trong những buổi spa tiếp theo nhé!",
    },
    replied: true,
  },
  {
    id: "REV-002",
    customer: "Huy Quang",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
    verified: true,
    service: "Khách sạn thú cưng phòng VIP",
    serviceType: "Boarding",
    branch: "Happy Pet - Cầu Giấy",
    date: "13/10/2026",
    rating: 5,
    pet: {
      name: "Bé Simba",
      breed: "Mèo Anh lông ngắn • 4kg",
      emoji: "🐈",
    },
    content: "Dịch vụ phòng khách sạn lưu trú rất sạch sẽ, có camera xem trực tiếp và nhân viên cập nhật ảnh pet diary hàng ngày qua app. Rất yên tâm khi đi công tác xa.",
    images: [
      "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=300&auto=format&fit=crop&q=80",
    ],
    reply: {
      author: "Happy Pet Cầu Giấy",
      date: "13/10/2026 18:20",
      content: "Happy Pet cảm ơn anh Quang! Bé Simba rất ngoan và ăn uống rất tốt trong suốt thời gian lưu trú ạ.",
    },
    replied: true,
  },
  {
    id: "REV-003",
    customer: "Minh Anh",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80",
    verified: true,
    service: "Khám tổng quát & Vắc xin",
    serviceType: "Clinic",
    branch: "Happy Pet - Hà Đông",
    date: "12/10/2026",
    rating: 5,
    pet: {
      name: "Bé Milo",
      breed: "Golden Retriever • 18kg",
      emoji: "🐕",
    },
    content: "Bác sĩ kiểm tra rất kỹ, tư vấn chế độ ăn uống cho bé rất chu đáo. Tiêm vắc xin êm ru không thấy bé kêu đau gì cả. Sẽ quay lại thường xuyên!",
    images: [],
    reply: null,
    replied: false,
  },
  {
    id: "REV-004",
    customer: "Hoàng Yến Chi",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
    verified: true,
    service: "Tắm spa thảo dược & Vệ sinh tai",
    serviceType: "Grooming",
    branch: "Happy Pet - Hà Đông",
    date: "11/10/2026",
    rating: 4,
    pet: {
      name: "Bé Lucky",
      breed: "Corgi • 11kg",
      emoji: "🐕",
    },
    content: "Dịch vụ tốt, bé tắm xong lông mềm mượt thơm lâu. Tuy nhiên cuối tuần hơi đông nên phải đợi khoảng 15 phút mới tới lượt bé check-in.",
    images: [],
    reply: {
      author: "Happy Pet Hà Đông",
      date: "11/10/2026 16:45",
      content: "Dạ Happy Pet cảm ơn góp ý của chị Chi ạ. Cơ sở đang tăng cường thêm nhân sự vào các khung giờ cao điểm cuối tuần để phục vụ quý khách nhanh chóng hơn ạ!",
    },
    replied: true,
  },
  {
    id: "REV-005",
    customer: "Đỗ Phương Dung",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80",
    verified: true,
    service: "Khách sạn thú cưng phòng Tiêu chuẩn",
    serviceType: "Boarding",
    branch: "Happy Pet - Cầu Giấy",
    date: "10/10/2026",
    rating: 5,
    pet: {
      name: "Bé Miu Miu",
      breed: "Mèo Ba Tư • 3.5kg",
      emoji: "🐱",
    },
    content: "Các bạn chăm sóc bé rất kỹ, dọn khay cát thường xuyên và cho ăn đúng giờ theo dặn dò của mình. Rất hài lòng!",
    images: [
      "https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=300&auto=format&fit=crop&q=80",
    ],
    reply: {
      author: "Happy Pet Cầu Giấy",
      date: "10/10/2026 20:00",
      content: "Cảm ơn chị Dung đã luôn tin tưởng Happy Pet. Chúc bé Miu Miu luôn khỏe mạnh và đáng yêu ạ!",
    },
    replied: true,
  },
  {
    id: "REV-006",
    customer: "Lê Quốc Bảo",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80",
    verified: false,
    service: "Cắt móng & Vệ sinh răng",
    serviceType: "Grooming",
    branch: "Happy Pet - Cầu Giấy",
    date: "08/10/2026",
    rating: 3,
    pet: {
      name: "Bé Choco",
      breed: "Pug • 8kg",
      emoji: "🐶",
    },
    content: "Dịch vụ cơ bản ổn nhưng chỗ để xe ô tô hơi bất tiện vì đường đông. Nhân viên làm việc nhanh nhẹn.",
    images: [],
    reply: null,
    replied: false,
  },
];
