// Mock data cho Trang đánh giá của tôi (My Reviews)

export const INITIAL_REVIEWS = [
  {
    id: "REV-2026-001",
    bookingId: "BK20260810007",
    businessId: 1,
    businessName: "Happy Pet - Chi nhánh Cầu Giấy",
    businessAddress: "Số 12 Dịch Vọng Hậu, Cầu Giấy, Hà Nội",
    businessPhone: "0912 345 678",
    businessAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuC3-_PP7VWj5tqP7kr55IKE7l-9zTzySPvB0bUIsr9lhb-O0mNTbo04WCOH4eqolILlmIbZy2Z27u4hNCBzi6pyYP1K20skb1-aRCVCsKU8DT5ooCqg3mBwQ0Bx1OmOENFoEKR-DHzJJ9bMWkV89NfSzPJ3IpUweDQjq7ZWYNy3OHSU7Q-tYzeXzdD46WHgj6bXbbQc2KfQNjL-3yDg3VoOEmrypJkaroaWE4Jqjdxw2Y9jm4fU71gt",
    petName: "Milo",
    petBreed: "Golden Retriever (2 tuổi)",
    petGender: "♂",
    petImg: "https://lh3.googleusercontent.com/aida-public/AB6AXuBP587mNN5wmtlVQlCPRRKKNEWLb-82zSpc_16XOBthHFJ_vmEP4PXTK5Vg3lB05Lo8lL11lXHimCW4PVuYw8YADbQkN4gXy5fTkZsLv2AlSWYniMADeXNRELca5iEnIcHlMvdpgWwsUfeluFJQ_VSMQFgvYe2PlLbPN-676c42De38vMX2LxQEh1MTlC6Zwb1HOzYoz75LX7yP3SS_2-7WqavbZ70XU-SlPKi0SsU",
    serviceName: "Combo Tắm trị liệu & Cắt lông bàn",
    serviceDate: "10/08/2026",
    servicePrice: "350.000đ",
    rating: 5,
    ratingLabel: "Tuyệt vời",
    subRatings: {
      cleanliness: 5,
      staff: 5,
      care: 5,
      price: 5
    },
    tags: ["Nhân viên chu đáo", "Lông thơm lâu", "Không gian sạch sẽ", "Cắt tỉa gọn gàng"],
    comment: "Dịch vụ ở Happy Pet Cầu Giấy thực sự vượt mong đợi! Bé Milo nhà mình vốn khá nhút nhát khi đi tắm ở tiệm lạ, nhưng các bạn kỹ thuật viên rất nhẹ nhàng vuốt ve làm quen trước. Sau khi tắm sấy xong lông bé bồng bềnh, thơm mùi thảo dược tự nhiên lưu hương suốt 3 ngày. Chắc chắn sẽ quay lại ủng hộ thường xuyên!",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBP587mNN5wmtlVQlCPRRKKNEWLb-82zSpc_16XOBthHFJ_vmEP4PXTK5Vg3lB05Lo8lL11lXHimCW4PVuYw8YADbQkN4gXy5fTkZsLv2AlSWYniMADeXNRELca5iEnIcHlMvdpgWwsUfeluFJQ_VSMQFgvYe2PlLbPN-676c42De38vMX2LxQEh1MTlC6Zwb1HOzYoz75LX7yP3SS_2-7WqavbZ70XU-SlPKi0SsU",
      "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=700&auto=format&fit=crop&q=80"
    ],
    createdAt: "11/08/2026 09:15",
    updatedAt: null,
    likesCount: 14,
    isLiked: false,
    isAnonymous: false,
    businessReply: {
      id: "REP-001",
      staffName: "Quản lý Happy Pet Cầu Giấy",
      staffRole: "Chăm sóc khách hàng",
      repliedAt: "11/08/2026 14:30",
      content: "Dạ Happy Pet cảm ơn anh An và bé Milo thật nhiều ạ! Thấy Milo tươi cười sảng khoái sau buổi spa là niềm vui lớn nhất của đội ngũ. Cảm ơn anh đã tin tưởng và hẹn gặp lại bé Milo trong lần làm đẹp tiếp theo nhé ạ! ❤️"
    }
  },
  {
    id: "REV-2026-002",
    bookingId: "BK20260805008",
    businessId: 3,
    businessName: "PetSpa Deluxe - Đống Đa",
    businessAddress: "68 Xã Đàn, Đống Đa, Hà Nội",
    businessPhone: "0934 556 789",
    businessAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCkWoPeGoR6ZQL8MS9JxMU7YlAazGtAbhaC7NUdoi8kFeXf5g4UrjACBLH6_xC9_tKjCBA0jnqXlyb_ZFJpmpsF2LWUNrQPStEAmBcLtwlYq8KuNQpDybeAHiC69jjjevZEqkqAHMfegNZL5N3iJr5sZZ1kGPyvxqr66HuTlY29Fa8EthDguirNKHw0R4AhAvWxbI1QnTp-NMiW3-nth23D4hq38ta3YRzXUE9XqPVF479TWeLSxQqo",
    petName: "Mimi",
    petBreed: "British Shorthair (1 tuổi)",
    petGender: "♀",
    petImg: "https://lh3.googleusercontent.com/aida-public/AB6AXuADmpbrQQEfCyUeyvFay8Lc67wcEhewxpwC40xqAvDeFJx57AWlG76O5rzuoTmxZZFNPJMVxFKj4egPoePNa4c9G3dYVcfuSSzp4ut2OTimZcSvaiUQeMZQOCU5a61Vb0Dzob8oF48PsAfxH7uvBqFeJGt76hn2DABai84j3jrrGsV4gPNu_iUtlLtqONhc8ghg_OSxZoYYeg5I0o9Kd6-LpnmMDXxN_hVt4MBGFME",
    serviceName: "Chăm sóc móng & Vệ sinh tai mắt",
    serviceDate: "05/08/2026",
    servicePrice: "150.000đ",
    rating: 5,
    ratingLabel: "Tuyệt vời",
    subRatings: {
      cleanliness: 5,
      staff: 5,
      care: 5,
      price: 4
    },
    tags: ["Thao tác khéo léo", "Bé không bị stress", "Nhân viên nhẹ nhàng", "Giá hợp lý"],
    comment: "Bé Mimi thuộc dạng chúa ghét bị sờ vào tai với chân, ở nhà tự cắt móng là bé cào liền. Mang ra PetSpa Deluxe các bạn chuyên viên làm cực kỳ điêu luyện, vừa gãi cằm dỗ dành vừa làm thoăn thoắt. Vệ sinh tai sạch bong không còn tí bụi bẩn nào.",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuADmpbrQQEfCyUeyvFay8Lc67wcEhewxpwC40xqAvDeFJx57AWlG76O5rzuoTmxZZFNPJMVxFKj4egPoePNa4c9G3dYVcfuSSzp4ut2OTimZcSvaiUQeMZQOCU5a61Vb0Dzob8oF48PsAfxH7uvBqFeJGt76hn2DABai84j3jrrGsV4gPNu_iUtlLtqONhc8ghg_OSxZoYYeg5I0o9Kd6-LpnmMDXxN_hVt4MBGFME"
    ],
    createdAt: "06/08/2026 11:20",
    updatedAt: null,
    likesCount: 9,
    isLiked: true,
    isAnonymous: false,
    businessReply: {
      id: "REP-002",
      staffName: "PetSpa Deluxe Team",
      staffRole: "Chăm sóc khách hàng",
      repliedAt: "06/08/2026 15:10",
      content: "Cảm ơn bạn đã gửi gắm bé Mimi đáng yêu cho PetSpa Deluxe! Mèo cưng rất nhạy cảm nên tụi mình luôn ưu tiên sự bình tĩnh và yêu thương các bé lên hàng đầu. Hẹn sớm gặp lại bạn và Mimi nha!"
    }
  },
  {
    id: "REV-2026-003",
    bookingId: "BK20260728009",
    businessId: 2,
    businessName: "Puppy Spa - Chi nhánh Tây Hồ",
    businessAddress: "45 Lạc Long Quân, Tây Hồ, Hà Nội",
    businessPhone: "0908 112 233",
    businessAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBYwU4d5oE_kIZXazzMLp_Kq8KJRAat_ohctJPpZQo2gwGPIGfQlJHofl7jCYPGPCFhMwDD5VxsVbP7-MAmoiwkFJVN0LYp4KUaeBzsP8DkMtNgGTFUzKu3SvwP7332FA7yPUlFjwHn4JEAhhur-if1E4z7m36FulluMzjIaKPumCGeYrS0Fijda8ZgTZNpABaulHz6PIulpANf_4lzU7QDzd-vjGWG6x6T4dkti5Nw5xC8qIOY5oll",
    petName: "LuLu",
    petBreed: "Corgi Pembroke (1.5 tuổi)",
    petGender: "♂",
    petImg: "https://lh3.googleusercontent.com/aida-public/AB6AXuAn16JMLSetG8eG36VDkWvVxkENnQj4LympLsfE0H6ZB0TO6MnxI0mgP7eklGbVag6qlN77_cGAPyzFFBtK4LREFPEOO4r5yf4FQp-3zfxjTgpE5KyF9Lcvzh8J53om9iTv6VutjgwTONOzTzmXpLtn10j1Vl77KXwmcvogBsQQDA8cyoFftFqh-7SWVaPYHctFQ9Gx14jRlC1Ut7nxyk_PvkshI-577AT9RxBUE-U",
    serviceName: "Grooming cắt tỉa tạo hình mông tim",
    serviceDate: "28/07/2026",
    servicePrice: "320.000đ",
    rating: 5,
    ratingLabel: "Tuyệt vời",
    subRatings: {
      cleanliness: 5,
      staff: 5,
      care: 5,
      price: 5
    },
    tags: ["Tạo hình chuẩn đẹp", "Mông tim siêu nét", "Grooming chuyên nghiệp", "Nhiệt tình"],
    comment: "Tay nghề thợ cắt tỉa ở đây đỉnh thật sự! Cắt tỉa tạo dáng bờ mông trái tim cho bé LuLu cưng xỉu, đường cắt đều và mượt mà lắm. Nhân viên đón tiếp vui vẻ, còn tặng bé một chiếc khăn quàng cổ xinh xắn khi ra về.",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAn16JMLSetG8eG36VDkWvVxkENnQj4LympLsfE0H6ZB0TO6MnxI0mgP7eklGbVag6qlN77_cGAPyzFFBtK4LREFPEOO4r5yf4FQp-3zfxjTgpE5KyF9Lcvzh8J53om9iTv6VutjgwTONOzTzmXpLtn10j1Vl77KXwmcvogBsQQDA8cyoFftFqh-7SWVaPYHctFQ9Gx14jRlC1Ut7nxyk_PvkshI-577AT9RxBUE-U",
      "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=700&auto=format&fit=crop&q=80"
    ],
    createdAt: "29/07/2026 16:45",
    updatedAt: null,
    likesCount: 21,
    isLiked: false,
    isAnonymous: false,
    businessReply: {
      id: "REP-003",
      staffName: "Puppy Spa Tây Hồ",
      staffRole: "Grooming Master",
      repliedAt: "30/07/2026 09:00",
      content: "Bé LuLu siêu hợp tác và đáng yêu trong suốt buổi làm đẹp luôn ạ! Mông tim tròn vo cưng hết nấc. Cảm ơn sen đã chọn Puppy Spa, chúc LuLu luôn vui vẻ và ngoan ngoãn nhé!"
    }
  },
  {
    id: "REV-2026-004",
    bookingId: "BK20260720010",
    businessId: 4,
    businessName: "PetCare Hotel - Ba Đình",
    businessAddress: "25 Liễu Giai, Ba Đình, Hà Nội",
    businessPhone: "0977 889 900",
    businessAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDABg_47wxbv3B97oYWLbdwqg1_FPqogRMBFaOMFXSmNixgV7l6_JIXU5Dw0yESbHttjT7GRwo6bilK9RIsc03W6u4jSTX8tIqhtA8YZwRVLhlSuc1yu5CXJtGUXAfflQZGf-3qYp8I9O8MI8GeBzKjjMW0rcU2IzFA8gSIPkQ9edRqNuO-P_8PnBsvFnKG6Bw74z8AYg79nY6M2oOv-f6fKIyFiYkXByaA2ofOEkCzIMR2sIBxPZ9C",
    petName: "Milo",
    petBreed: "Golden Retriever (2 tuổi)",
    petGender: "♂",
    petImg: "https://lh3.googleusercontent.com/aida-public/AB6AXuBP587mNN5wmtlVQlCPRRKKNEWLb-82zSpc_16XOBthHFJ_vmEP4PXTK5Vg3lB05Lo8lL11lXHimCW4PVuYw8YADbQkN4gXy5fTkZsLv2AlSWYniMADeXNRELca5iEnIcHlMvdpgWwsUfeluFJQ_VSMQFgvYe2PlLbPN-676c42De38vMX2LxQEh1MTlC6Zwb1HOzYoz75LX7yP3SS_2-7WqavbZ70XU-SlPKi0SsU",
    serviceName: "Khách sạn thú cưng lưu trú 3 ngày",
    serviceDate: "20/07/2026",
    servicePrice: "900.000đ",
    rating: 4,
    ratingLabel: "Rất tốt",
    subRatings: {
      cleanliness: 5,
      staff: 5,
      care: 4,
      price: 4
    },
    tags: ["Camera 24/7", "Phòng điều hòa mát", "Cập nhật video mỗi ngày", "Sân chơi rộng"],
    comment: "Gửi Milo 3 ngày đi công tác thấy khá yên tâm. Phòng máy lạnh sạch sẽ, có camera xem liên tục qua app và các bạn nhân viên gửi clip bé chạy nhảy ngoài sân cỏ mỗi ngày. Trừ nhẹ 1 sao vì lúc trả bé các bạn có bỏ quên quả bóng gặm yêu thích của Milo, nhưng sau đó cơ sở đã ship trả tận nhà rất chu đáo.",
    images: [
      "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=700&auto=format&fit=crop&q=80"
    ],
    createdAt: "21/07/2026 10:05",
    updatedAt: "21/07/2026 15:30",
    likesCount: 6,
    isLiked: false,
    isAnonymous: false,
    businessReply: {
      id: "REP-004",
      staffName: "Ban Quản Lý PetCare Hotel",
      staffRole: "Hotline Dịch vụ",
      repliedAt: "21/07/2026 11:30",
      content: "PetCare Hotel chân thành cảm ơn phản hồi đóng góp quý báu từ anh An! Chúng em xin rút kinh nghiệm sâu sắc về việc kiểm đếm đồ chơi của bé khi check-out. Rất vui vì đã được chăm sóc bé Milo năng động và mong được phục vụ anh trong những chuyến công tác tới!"
    }
  },
  {
    id: "REV-2026-005",
    bookingId: "BK20260714011",
    businessId: 2,
    businessName: "Puppy Love Pet Spa",
    businessAddress: "45 Lê Lợi, Bến Nghé, Quận 1, TP. Hồ Chí Minh",
    businessPhone: "0908 112 233",
    businessAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBYwU4d5oE_kIZXazzMLp_Kq8KJRAat_ohctJPpZQo2gwGPIGfQlJHofl7jCYPGPCFhMwDD5VxsVbP7-MAmoiwkFJVN0LYp4KUaeBzsP8DkMtNgGTFUzKu3SvwP7332FA7yPUlFjwHn4JEAhhur-if1E4z7m36FulluMzjIaKPumCGeYrS0Fijda8ZgTZNpABaulHz6PIulpANf_4lzU7QDzd-vjGWG6x6T4dkti5Nw5xC8qIOY5oll",
    petName: "Bông",
    petBreed: "Poodle Tiny (8 tháng)",
    petGender: "♀",
    petImg: "https://lh3.googleusercontent.com/aida-public/AB6AXuCSAtqE-cQJYkq37esYUrle4pB-QwyDR07puul4nnHrfXqF03TuLD2qzxQUHtoNCHqwNLGepOlwBsQ8d6FNQ39VEo7GFPr9d_PU1Nz4uQDcrxUjsIryl2MMtZ78jS30bipK2CVIy0wa9DY9kvY-9w9qSx7j6r5c2H3zkCifXksiHXNNwqGaXbsVuBeb-01dHToFGj3R_elvmCwhu7fGHdhXIrOl-gmtmdLDpMf-vkg",
    serviceName: "Tắm sấy & Phun dưỡng bóng lông Silk",
    serviceDate: "14/07/2026",
    servicePrice: "280.000đ",
    rating: 5,
    ratingLabel: "Tuyệt vời",
    subRatings: {
      cleanliness: 5,
      staff: 5,
      care: 5,
      price: 5
    },
    tags: ["Lông mềm mượt", "Bé rất vui vẻ", "Mùi hương ngọt ngào", "Thời gian nhanh chóng"],
    comment: "Bé Bông nhà mình lông hơi xoăn và khô, sau khi làm gói dưỡng bóng lông Silk thì sờ mượt như nhung luôn. Không gian tiệm thơm mát, sạch sẽ, bé đi về tươi tỉnh không hề bị mệt mỏi hay sợ hãi.",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCSAtqE-cQJYkq37esYUrle4pB-QwyDR07puul4nnHrfXqF03TuLD2qzxQUHtoNCHqwNLGepOlwBsQ8d6FNQ39VEo7GFPr9d_PU1Nz4uQDcrxUjsIryl2MMtZ78jS30bipK2CVIy0wa9DY9kvY-9w9qSx7j6r5c2H3zkCifXksiHXNNwqGaXbsVuBeb-01dHToFGj3R_elvmCwhu7fGHdhXIrOl-gmtmdLDpMf-vkg"
    ],
    createdAt: "15/07/2026 08:30",
    updatedAt: null,
    likesCount: 11,
    isLiked: false,
    isAnonymous: false,
    businessReply: {
      id: "REP-005",
      staffName: "CSKH Puppy Love",
      staffRole: "Tư vấn viên",
      repliedAt: "15/07/2026 10:15",
      content: "Dạ Puppy Love cảm ơn bạn nhiều ạ! Bé Bông nhỏ nhắn dễ cưng xỉu luôn. Khi nào lông bé cần dưỡng lại thì bạn cứ ghé tiệm nhé!"
    }
  }
];

// Các dịch vụ hoàn thành đang CHỜ đánh giá
export const INITIAL_PENDING_REVIEWS = [
  {
    id: "PENDING-001",
    bookingId: "BK20260818005",
    businessId: 5,
    businessName: "Bệnh viện Thú Y PetCare",
    businessAddress: "102 Kim Mã, Ba Đình, Hà Nội",
    businessPhone: "024 3823 4567",
    businessAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDy41SEghjD-Su0C0GIDKStQMA6XwhIz7_0OYuczV-ao5uFnR1gsVRb3EXzhrO95-UaVPo7bZv1SXgIrincJFkxhtbLAaFJOF64Abnq7U6WSP1fm6W20bYukp4qPUonnwxDJPbLdNzuXZCA52IxbGWfQlrgLu_vk9glp5yioJe4V_F9urI-KR1Uc2bmb27r8AODOGs99EaD5FJ5fLMReu4N7bIfg_Zq-1LLG_pnP_homvuDvPdy1dk_",
    petName: "LuLu",
    petBreed: "Corgi Pembroke (1.5 tuổi)",
    petGender: "♂",
    petImg: "https://lh3.googleusercontent.com/aida-public/AB6AXuAn16JMLSetG8eG36VDkWvVxkENnQj4LympLsfE0H6ZB0TO6MnxI0mgP7eklGbVag6qlN77_cGAPyzFFBtK4LREFPEOO4r5yf4FQp-3zfxjTgpE5KyF9Lcvzh8J53om9iTv6VutjgwTONOzTzmXpLtn10j1Vl77KXwmcvogBsQQDA8cyoFftFqh-7SWVaPYHctFQ9Gx14jRlC1Ut7nxyk_PvkshI-577AT9RxBUE-U",
    serviceName: "Tiêm phòng vaccine & Khám tổng quát",
    serviceDesc: "Gói vaccine 7 bệnh, tẩy giun định kỳ, kiểm tra tai mắt tim phổi bởi bác sĩ thú y",
    serviceDate: "18/08/2026",
    servicePrice: "450.000đ",
    completedDate: "18/08/2026 17:30",
    rewardPoints: 50,
    voucherPromo: "Tặng voucher giảm 10% lần khám sau",
    deadlineDays: 25
  }
];

export const QUICK_TAGS_SUGGESTIONS = [
  "Nhân viên nhiệt tình",
  "Không gian sạch sẽ",
  "Cắt tỉa đẹp mắt",
  "Lông thơm lâu",
  "Bé rất hợp tác",
  "Đúng giờ hẹn",
  "Giá cả hợp lý",
  "Bác sĩ chuyên môn cao",
  "Camera sắc nét",
  "Dịch vụ chu đáo",
  "Cơ sở hiện đại",
  "Thao tác nhẹ nhàng"
];

export const RATING_DESCRIPTIONS = {
  1: "Rất thất vọng - Trải nghiệm không tốt",
  2: "Chưa hài lòng - Cần cải thiện nhiều",
  3: "Bình thường - Đạt yêu cầu cơ bản",
  4: "Hài lòng - Dịch vụ chất lượng tốt",
  5: "Tuyệt vời - Vượt ngoài mong đợi!"
};
