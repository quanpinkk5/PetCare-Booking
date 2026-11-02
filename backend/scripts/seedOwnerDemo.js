// Run from backend: node scripts/seedOwnerDemo.js [--apply]
// Defaults to a read-only preview. Existing records and account credentials are preserved.
require('dotenv').config({ quiet: true });
const fs = require('node:fs');
const path = require('node:path');
const mongoose = require('mongoose');
const User = require('../src/models/User');
const Business = require('../src/models/Business');
const Branch = require('../src/models/Branch');
const Service = require('../src/models/Service');
const Category = require('../src/models/ServiceCategory');
const BranchService = require('../src/models/BranchService');
const Schedule = require('../src/models/Schedule');
const demoImages = require('./ownerDemoImages');

const OWNERS = [
  { email: 'maiducthanh@petcare.com', city: 'Hà Nội', branches: [
    { suffix: 'Cầu Giấy', district: 'Cầu Giấy', ward: 'Dịch Vọng', detail: '120 Trần Thái Tông' },
    { suffix: 'Hà Đông', district: 'Hà Đông', ward: 'Mộ Lao', detail: '25 Nguyễn Văn Lộc' },
  ] },
  { email: 'nguyenducminh@petcare.com', city: 'TP. Hồ Chí Minh', branches: [
    { suffix: 'Phú Nhuận', district: 'Phú Nhuận', ward: 'Phường 8', detail: '85 Hoa Lan' },
    { suffix: 'Thủ Đức', district: 'Thủ Đức', ward: 'Thảo Điền', detail: '32 Nguyễn Văn Hưởng' },
  ] },
  { email: 'nguyenngochong@petcare.com', city: 'Đà Nẵng', branches: [
    { suffix: 'Hải Châu', district: 'Hải Châu', ward: 'Hòa Cường Bắc', detail: '68 Núi Thành' },
    { suffix: 'Sơn Trà', district: 'Sơn Trà', ward: 'An Hải Bắc', detail: '42 Ngô Quyền' },
  ] },
];
const DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
const HOURS = ['Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy', 'Chủ Nhật']
  .map(day => ({ day, time: '08:00 - 12:00, 13:30 - 18:30' }));
const CATALOG = [
  { name: 'Tắm chó VIP', category: 'BATH_GROOMING', price: 150000, duration: 60, pets: ['DOG'], description: 'Tắm, sấy khô, vệ sinh tai và cắt móng cho chó.' },
  { name: 'Tắm mèo dịu nhẹ', category: 'BATH_GROOMING', price: 180000, duration: 60, pets: ['CAT'], description: 'Tắm và sấy với sản phẩm phù hợp cho mèo, vệ sinh tai và cắt móng.' },
  { name: 'Cắt tỉa lông tạo kiểu', category: 'HAIR_STYLING', price: 250000, duration: 90, pets: ['DOG', 'CAT'], description: 'Tư vấn và cắt tỉa tạo kiểu theo giống, tình trạng lông và yêu cầu của chủ nuôi.' },
  { name: 'Khám sức khỏe tổng quát', category: 'HEALTH_CHECK', price: 200000, duration: 30, pets: ['DOG', 'CAT'], description: 'Lịch hẹn khám tổng quát và trao đổi tình trạng sức khỏe với bác sĩ thú y.' },
  { name: 'Tiêm phòng', category: 'VACCINATION', price: 300000, duration: 30, pets: ['DOG', 'CAT'], description: 'Lịch hẹn kiểm tra điều kiện tiêm và tư vấn vaccine với bác sĩ thú y.' },
  { name: 'Khách sạn thú cưng tiêu chuẩn', category: 'PET_HOTEL', price: 220000, duration: null, pets: ['DOG', 'CAT'], description: 'Lưu trú theo ngày, chăm sóc ăn uống, vệ sinh khu ở và cập nhật tình hình thú cưng.' },
];

async function main() {
  const apply = process.argv.includes('--apply');
  if (!process.env.MONGODB_URI) throw new Error('Missing MONGODB_URI');
  await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
  const users = await User.find({ email: { $in: OWNERS.map(o => o.email) } }).select('email role status').lean();
  for (const owner of OWNERS) {
    const user = users.find(u => u.email === owner.email);
    if (!user || user.role !== 'BUSINESS_OWNER' || user.status !== 'ACTIVE') throw new Error(`Owner unavailable: ${owner.email}`);
    const business = await Business.findOne({ ownerId: user._id }).lean();
    if (!business || business.status !== 'APPROVED') throw new Error(`Approved business required: ${owner.email}`);
    console.log(JSON.stringify({ email: owner.email, business: business.name, mode: apply ? 'apply' : 'preview', target: { branches: 2, services: 6, daysPerOffering: 7 } }));
  }
  const categories = await Category.find({ code: { $in: CATALOG.map(s => s.category) }, status: 'ACTIVE' }).lean();
  for (const item of CATALOG) if (!categories.some(c => c.code === item.category)) throw new Error(`Missing active category ${item.category}`);
  if (!apply) return;

  const reportPath = path.join(__dirname, '..', 'artifacts', `owner-demo-${Date.now()}.json`);
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  const originals = await Business.find({ ownerId: { $in: users.map(u => u._id) } }).lean();
  fs.writeFileSync(reportPath, JSON.stringify({ state: 'prepared', originalBusinessProfiles: originals }, null, 2));
  const session = await mongoose.startSession();
  let report;
  try {
    await session.withTransaction(async () => {
      report = { created: { branches: [], services: [], branchServices: [], schedules: [] }, owners: [] };
      async function ensure(Model, filter, data, kind) {
        const existing = await Model.findOne(filter).session(session);
        if (existing) return existing;
        const [record] = await Model.create([data], { session });
        report.created[kind].push(String(record._id));
        return record;
      }
      for (const owner of OWNERS) {
        const user = users.find(u => u.email === owner.email);
        const business = await Business.findOne({ ownerId: user._id }).session(session);
        const additions = {
          description: `${business.name} cung cấp dịch vụ tắm, cắt tỉa, chăm sóc sức khỏe và lưu trú cho chó mèo. Hồ sơ demo để kiểm thử hệ thống PetCare.`,
          email: owner.email, businessType: 'Chăm sóc thú cưng',
          openingHours: HOURS,
          policies: ['Dữ liệu demo: địa chỉ và giá dịch vụ dùng để kiểm thử.', 'Lịch đặt cần được cơ sở xác nhận trước khi khách hàng thanh toán.', 'Khách vui lòng cung cấp thông tin sức khỏe và nhu cầu chăm sóc của thú cưng.'],
          note: 'Dữ liệu demo do seedOwnerDemo.js bổ sung; không phải thông tin cơ sở thực tế.',
        };
        for (const [key, value] of Object.entries(additions)) {
          if (!business[key] || (Array.isArray(business[key]) && !business[key].length)) business[key] = value;
        }
        await business.save({ session });
        const branches = await Branch.find({ businessId: business._id }).session(session).sort({ createdAt: 1 });
        for (let i = branches.length; i < 2; i++) {
          const location = owner.branches[i];
          const branch = await ensure(Branch, { businessId: business._id, name: `${business.name} - ${location.suffix}` }, {
            businessId: business._id, name: `${business.name} - ${location.suffix}`, email: owner.email,
            address: { province: owner.city, city: owner.city, district: location.district, ward: location.ward, detail: `${location.detail} (địa chỉ demo)` },
            openingHours: HOURS, status: 'ACTIVE',
          }, 'branches');
          branches.push(branch);
        }
        const services = [];
        for (const item of CATALOG) {
          const service = await ensure(Service, { businessId: business._id, name: item.name }, {
            businessId: business._id, categoryId: categories.find(c => c.code === item.category)._id,
            name: item.name, description: `${item.description} Dịch vụ demo để kiểm thử đặt lịch.`,
            images: [demoImages[item.name].url],
            serviceType: item.duration === null ? 'BOARDING' : 'APPOINTMENT', status: 'ACTIVE', isHighlight: services.length < 2,
          }, 'services');
          services.push({ service, item });
        }
        for (const branch of branches) {
          for (const { service, item } of services) {
            const offering = await ensure(BranchService, { branchId: branch._id, serviceId: service._id }, {
              branchId: branch._id, serviceId: service._id, price: item.price,
              pricingUnit: service.serviceType === 'BOARDING' ? 'PER_DAY' : 'PER_SERVICE',
              durationMinutes: item.duration, capacity: service.serviceType === 'BOARDING' ? 10 : 3,
              petTypes: item.pets, status: 'ACTIVE',
            }, 'branchServices');
            for (const dayOfWeek of DAYS) {
              await ensure(Schedule, { branchServiceId: offering._id, dayOfWeek }, {
                branchServiceId: offering._id, dayOfWeek, isActive: true,
                slots: [{ startTime: '08:00', endTime: '12:00' }, { startTime: '13:30', endTime: '18:30' }],
              }, 'schedules');
            }
          }
        }
        const offerings = await BranchService.find({ branchId: { $in: branches.map(b => b._id) } }).session(session);
        report.owners.push({ email: owner.email, business: business.name, branches: branches.length,
          services: await Service.countDocuments({ businessId: business._id }).session(session),
          branchServices: offerings.length,
          schedules: await Schedule.countDocuments({ branchServiceId: { $in: offerings.map(o => o._id) } }).session(session) });
      }
    });
    fs.writeFileSync(reportPath, JSON.stringify({ state: 'committed', originalBusinessProfiles: originals, ...report }, null, 2));
    console.log(JSON.stringify({ reportPath, created: Object.fromEntries(Object.entries(report.created).map(([key, ids]) => [key, ids.length])), owners: report.owners }, null, 2));
  } finally {
    await session.endSession();
  }
}
main().catch(error => { console.error(error.message); process.exitCode = 1; }).finally(() => mongoose.disconnect());
