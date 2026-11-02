// Illustrative stock photos; these do not depict the demo businesses themselves.
const pexels = id => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop`;
const unsplash = id => `https://images.unsplash.com/photo-${id}?w=900&h=600&fit=crop&auto=format&q=80`;

module.exports = {
  'Tắm chó VIP': {
    url: unsplash('1516734212186-a967f81ad0d7'),
  },
  'Tắm mèo dịu nhẹ': {
    url: pexels('17802936'),
    source: 'https://www.pexels.com/photo/cute-cat-sleeping-in-pet-bath-17802936/',
  },
  'Cắt tỉa lông tạo kiểu': {
    url: pexels('19145880'),
    source: 'https://www.pexels.com/photo/woman-hand-trimming-dog-19145880/',
  },
  'Khám sức khỏe tổng quát': {
    url: unsplash('1628009368231-7bb7cfcb0def'),
  },
  'Tiêm phòng': {
    url: pexels('7469213'),
    source: 'https://www.pexels.com/photo/a-veterinarian-vaccinating-a-dog-7469213/',
  },
  'Khách sạn thú cưng tiêu chuẩn': {
    url: pexels('1954031'),
    source: 'https://www.pexels.com/photo/calm-fluffy-dog-resting-on-bed-in-apartment-1954031/',
  },
};
