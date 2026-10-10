import { useMemo, useState } from 'react';
import ReviewTable from '../../components/review/ReviewTable';
import ReviewDetailPanel from '../../components/review/ReviewDetailPanel';

const initialReviews = [
  {
    id: 'RVW-20250520-001245',
    customer: {
      name: 'Trần Minh Anh',
      email: 'minhanh@gmail.com',
      phone: '0901 234 567',
      avatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCvf5yZ9iT0NgqHswKkJSUGPUEN2vLmVwS6ljVucOpOUCIWZ21lgTOEJzEW7-ia-LCDyeCePB-z9p0q59Y5N4kUpXoXmu-2Iub-Hk4wz6sJj80m5NqKEBvE48sSopoYSz4Hgwb5hKXnZXu44_IKXjWxk6F9ypYwRwNuqqEfXclsJj1ALu-WY1eFDKTR1lw21Lrz2CrgjuBzQbakpiwot5GqyDeWhCP0a-eXP8cEGM4',
    },
    facility: {
      name: 'Happy Paws Spa',
      location: 'Quận 1, TP.HCM',
    },
    service: 'Tắm & Cắt tỉa lông',
    petType: 'Chó - Poodle',
    rating: 5,
    content:
      'Dịch vụ rất tốt, nhân viên nhiệt tình và chu đáo. Bé nhà mình được tắm sạch sẽ, cắt tỉa đẹp. Sẽ quay lại ủng hộ nhiều lần nữa!',
    createdDate: '20/05/2025',
    createdTime: '14:30',
    status: 'HIỂN THỊ',
    media: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDBwxV8jxFkHWRnyayc_LZmfL9DryQTm5emWSIbYFV8CkbrZFrKvZYGEGC9difzumZ8sCGLttQZ4SgDsodEwWh_4EeNHRmITSyb3ZEAiGfMefgBz3lo_HyKZcVf9HoKAzXuHHi-RvY3tNhucloyIIFdCVJ2Px0V1POu83wQAvtcOrm_7DGrQi2OiLZS-0ZsJs12laeKSfCVruhpmIwwIRvR2PaGaiGJFMd-hVLSBhI',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCcAT8lwadULSf36oeOeKcFCbeHJhM-Bwm33K0blQxTCjAUbzsOYF8qg_wk3bLtiPHCfZhuUpYZI7Uq-b21OlJ---K8q6UX_2Vd4VJR7XQi-LCe7rVAiwOJrFvT329PYxSnh0NcTiOTrjyIKMiKRW0fhxzMBlcV_7RrS54OvaGyBuifzGS6MoHJUvXc8PJC221BlriHONkya4AQbMZp6OW4NnnyeS2gbgbZ70ljUu0',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDKKP4Jxn-NOOUt1g8aYqGgZxiR3JQTxIvu92zHh-D3s8ugLZMNSfraVov4b53eIwpkwgh4_29jwGtrm6nd1OaDmEWlqQz5bbUUEDCt7ujZTPWPWT0k01DmUNuxsqc7DKGA0OUoNqKlg78rMLjFFFbXcomN0Y8VDjNeE5hYKBKG6IbBSwW5mT-GYcV_EQROoiLVhA2TjnoeFU1oBbLf_jwlvdEt1w11nQot9YMv_bQ',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCymEN_jbFnkAP58e95IyciMhkcUHlixWQBGtQFEym6brp2hMTys6imKIFCGZSDsP_uAoMZcub3hcjrPRdoT26vWmxYfMCSWkRPCC8uYL4Js5YKU7p5VQwM8DsIXYYNcUesK8dcoF9lc4Lf0dkL0cxgVhWLqr61hkc0dLcVHOqRYvUKs3m_Fuo07uvKKSG6tbiviQCm6IcfgUPnzxkF-VtC_gTX-fziIqm3RrVpPUI',
    ],
    extraMediaCount: 2,
  },

  {
    id: 'RVW-20250519-001244',
    customer: {
      name: 'Lê Hoàng Nam',
      email: 'nam.le1990@gmail.com',
      phone: '0912 345 678',
      avatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuD3HPZhnvCx-trCJSZlygPxv23fwq1_39m8-TDFiS1h5QiGdDHhkuA-SkRJBqc0iwDQqxRGN7U-t12jwrmtpf8jrm_f62TcyXtz5v6xH0q00aZ-cfz-qSzOdPACdooSh1wIVHuYK9nPXi1sHAiWthP3n4-ZTBhcJcG9p4wRqMFI00Ash8Q0PKhoV17HdqF0HK8JeJc4nMp3bVuoYxB45puIsQX5cPVTRM9UqDa5Tcs',
    },
    facility: {
      name: 'PetCare Center',
      location: 'Cầu Giấy, Hà Nội',
    },
    service: 'Khách sạn thú cưng',
    petType: 'Mèo - Anh lông ngắn',
    rating: 4,
    content:
      'Phòng ốc sạch sẽ, có camera theo dõi nên rất yên tâm khi gửi bé tại đây.',
    createdDate: '19/05/2025',
    createdTime: '10:15',
    status: 'BỊ BÁO CÁO',
    media: [],
    extraMediaCount: 0,
  },

  {
    id: 'RVW-20250518-001243',
    customer: {
      name: 'Phạm Thu Thảo',
      email: 'thuthao.pt@gmail.com',
      phone: '0987 654 321',
      avatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBb9HH2DZNLmWXeLAqyGGD5gBlvoqpWEiB5w27M7-mGSRA06Ok2Q-GJzhJDoRpFqCy-_VC4d2DUw5WMxmJtpG7FyWtJkG0DvXZVabcGDD3Umroi9BiDRsBOcndxCiN9SYfs26STYr62c73P0j5r9WRJc9iOuq1Jg_mkMFkLVDmEzowlQtI7wKhla7k0YMNcsrCcJAsVk__Ia-2I_QtOxrKQa5YJYd2yZWFoOZKqIrc',
    },
    facility: {
      name: 'Mew & Woof House',
      location: 'Thủ Đức, TP.HCM',
    },
    service: 'Spa trị liệu',
    petType: 'Chó - Corgi',
    rating: 5,
    content: 'Bé nhà mình rất thích, sẽ ủng hộ dài dài!',
    createdDate: '18/05/2025',
    createdTime: '09:45',
    status: 'HIỂN THỊ',
    media: [],
    extraMediaCount: 0,
  },

  {
    id: 'RVW-20250517-001242',
    customer: {
      name: 'Nguyễn Đức Duy',
      email: 'ducduy.nguyen@gmail.com',
      phone: '0938 111 222',
      avatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuC4AvXc_94T1WHZ2DNStExtKqNh9XFzIstnug42qo11rsp66igoKnhUc5nZ4ughCKOZkEhzxPM2hqZSe6iPN3wb7f6gQmYObt7KfUCJ4GwMC9xHsLNDR93JBj-zF4855L-hr86YwTXDQfjK97Gac7rebOpNMBnSm98OfLhWfgqfS9b8oB3Dip9gnT_A73_f4DNqfqkpxi6POSiaSX3AJtyY9VzBhhINLOOOGvLW94M',
    },
    facility: {
      name: 'Happy Paws Spa',
      location: 'Quận 1, TP.HCM',
    },
    service: 'Tắm & Cắt tỉa lông',
    petType: 'Chó - Poodle',
    rating: 3,
    content: 'Chờ khá lâu, nhân viên bận rộn. Cần cải thiện dịch vụ.',
    createdDate: '17/05/2025',
    createdTime: '16:20',
    status: 'ĐÃ ẨN',
    media: [],
    extraMediaCount: 0,
  },

  {
    id: 'RVW-20250517-001241',
    customer: {
      name: 'Võ Kiều My',
      email: 'kieumy.vo@gmail.com',
      phone: '0909 333 444',
      avatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAtI5bFcorSlsaGq6n08NzdtuR_TZbbYCyiI2tRfC4lxFx6Ge6wxTXzKbRbCCNTheySshG4klFNUHJwmKDp_-M31anIvY0PZ3hUT9wG7RR-5YfX16LYukHFU9uMbR_1j6fJGGTWmh0dZHlTnyj2PhThMJm8Gn-1LWL6z3FdpcRe1Xq1JYIfF_7o3QjSgV3txNePEVmVtxiAMq9PAd2QB9Q4Mk4NNU25RGuikauAuEw',
    },
    facility: {
      name: 'PetCare Center',
      location: 'Cầu Giấy, Hà Nội',
    },
    service: 'Khách sạn thú cưng',
    petType: 'Chó - Shiba Inu',
    rating: 5,
    content: 'Dịch vụ ổn, sẽ quay lại lần sau.',
    createdDate: '17/05/2025',
    createdTime: '11:05',
    status: 'HIỂN THỊ',
    media: [],
    extraMediaCount: 0,
  },

  {
    id: 'RVW-20250516-001240',
    customer: {
      name: 'Đặng Minh Quân',
      email: 'minhquan.dang@gmail.com',
      phone: '0918 555 666',
      avatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuA65c_foLaxop5JcxqdnxuimH0gu6dswpho32qOQfLyaH9dwwmIhvwsFoBjwgoxDuz97SnAz_8n9JSCNSgoPyDx6Y7sgZNJp8gzDzv8jJgffosSagGb-xSgGOaMWgSW4wtgojJHCK3l-9Y5U6oxW2CfQsYh3AbVV1wv84_d8w1jfkkTGhOp1u1Yy1wFMNhEdR6Xmosz895M3mPtoN99UEsMCL8mywXOrjLPecE6fRo',
    },
    facility: {
      name: 'Paw Paradise',
      location: 'Đà Nẵng',
    },
    service: 'Huấn luyện cơ bản',
    petType: 'Chó - Golden',
    rating: 5,
    content: 'Huấn luyện viên rất chuyên nghiệp và kiên nhẫn.',
    createdDate: '16/05/2025',
    createdTime: '08:30',
    status: 'HIỂN THỊ',
    media: [],
    extraMediaCount: 0,
  },

  {
    id: 'RVW-20250515-001239',
    customer: {
      name: 'Bùi Thanh Trúc',
      email: 'thanhtruc.bui@gmail.com',
      phone: '0977 888 999',
      avatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAdM-WQ_oNb9pKoKbLkn3bDw4JlVFJG-fGQch469iflrvw3uLAQTiyEH7pLe_PmAeUhaiLLeG9l4dxE2O9M99SwgcDxoStLjdjyvV3Cr-R1R5eZh5Z5rPYxQvAHQ9rnR_tV15ek-62AYoCpWHUOIx5A1Xulps4VvN7R6_ddSHPPHt-rVm4Xe22yTEHMZtGEsoE_4awujWf384eMmtnGU8b0nMhFcFGq_v2P50KYqMs',
    },
    facility: {
      name: 'Mew & Woof House',
      location: 'Thủ Đức, TP.HCM',
    },
    service: 'Spa trị liệu',
    petType: 'Mèo - Munchkin',
    rating: 3,
    content: 'Giá hơi cao nhưng chất lượng tốt.',
    createdDate: '15/05/2025',
    createdTime: '20:10',
    status: 'BỊ BÁO CÁO',
    media: [],
    extraMediaCount: 0,
  },
];

export default function ReviewList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Tất cả');
  const [starFilter, setStarFilter] = useState('Tất cả');
  const [facilityFilter, setFacilityFilter] = useState('Tất cả');

  const [selectedReviewId, setSelectedReviewId] = useState(
    'RVW-20250520-001245'
  );
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const reviews = initialReviews;

  const filteredReviews = useMemo(() => {
    return reviews.filter((item) => {
      if (statusFilter !== 'Tất cả' && item.status !== statusFilter) {
        return false;
      }

      if (starFilter !== 'Tất cả') {
        const starNum = parseInt(starFilter.split(' ')[0], 10);

        if (item.rating !== starNum) {
          return false;
        }
      }

      if (
        facilityFilter !== 'Tất cả' &&
        item.facility.name !== facilityFilter
      ) {
        return false;
      }

      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();

        const matchCustomer = item.customer.name
          .toLowerCase()
          .includes(query);

        const matchFacility = item.facility.name
          .toLowerCase()
          .includes(query);

        const matchContent = item.content
          .toLowerCase()
          .includes(query);

        return matchCustomer || matchFacility || matchContent;
      }

      return true;
    });
  }, [reviews, searchQuery, statusFilter, starFilter, facilityFilter]);

  const activeReview = useMemo(() => {
    return (
      reviews.find((review) => review.id === selectedReviewId) ||
      filteredReviews[0] ||
      reviews[0]
    );
  }, [reviews, selectedReviewId, filteredReviews]);

  return (
    <div className="space-y-6">
      <div className="w-full">
        <ReviewTable
          reviews={filteredReviews}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          starFilter={starFilter}
          setStarFilter={setStarFilter}
          facilityFilter={facilityFilter}
          setFacilityFilter={setFacilityFilter}
          selectedReviewId={selectedReviewId}
          setSelectedReviewId={setSelectedReviewId}
          activeReview={activeReview}
          onOpenDetail={(rev) => {
            if (rev) setSelectedReviewId(rev.id);
            setIsDetailOpen(true);
          }}
        />
      </div>

      <ReviewDetailPanel
        review={activeReview}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />
    </div>
  );
}
