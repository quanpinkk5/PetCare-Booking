require("dotenv").config();

const mongoose = require("mongoose");

const Business = require("../src/models/Business");
const Branch = require("../src/models/Branch");
const ServiceCategory = require("../src/models/ServiceCategory");
const Service = require("../src/models/Service");
const BranchService = require("../src/models/BranchService");

// Chỉnh tên biến nếu file kết nối MongoDB
// của project đang dùng biến môi trường khác.
const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

// Các dịch vụ dùng để kiểm thử Booking.
// categoryKeywords dùng để tìm danh mục phù hợp
// trong collection serviceCategories.
const SAMPLE_SERVICES = [
  {
    name: "[TEST] Tắm và vệ sinh thú cưng",
    description: "Dịch vụ tắm, vệ sinh cơ bản cho chó và mèo.",
    serviceType: "APPOINTMENT",
    categoryKeywords: /BATH|TAM|TẮM|GROOM|CHAM_SOC|CHĂM SÓC/i,
    price: 150000,
    pricingUnit: "PER_SERVICE",
    durationMinutes: 60,
  },
  {
    name: "[TEST] Cắt tỉa lông",
    description: "Dịch vụ cắt và tạo kiểu lông cho thú cưng.",
    serviceType: "APPOINTMENT",
    categoryKeywords: /GROOM|CAT_TIA|CẮT TỈA|LAM_DEP|LÀM ĐẸP/i,
    price: 250000,
    pricingUnit: "PER_SERVICE",
    durationMinutes: 90,
  },
  {
    name: "[TEST] Spa thú cưng",
    description: "Dịch vụ chăm sóc và thư giãn cho thú cưng.",
    serviceType: "APPOINTMENT",
    categoryKeywords: /SPA|GROOM|CHAM_SOC|CHĂM SÓC/i,
    price: 300000,
    pricingUnit: "PER_SERVICE",
    durationMinutes: 120,
  },
  {
    name: "[TEST] Lưu trú thú cưng",
    description: "Dịch vụ lưu trú và chăm sóc thú cưng theo ngày.",
    serviceType: "BOARDING",
    categoryKeywords: /BOARD|HOTEL|LUU_TRU|LƯU TRÚ|KHACH_SAN|KHÁCH SẠN/i,
    price: 200000,
    pricingUnit: "PER_DAY",
    durationMinutes: null,
  },
];

async function seedBookingServices() {
  if (!MONGO_URI) {
    throw new Error("Không tìm thấy MONGO_URI hoặc MONGODB_URI trong .env.");
  }

  await mongoose.connect(MONGO_URI);

  console.log("Đã kết nối MongoDB.");

  // 1. Chọn một chi nhánh đang hoạt động,
  // thuộc Business đã được phê duyệt.
  const activeBranches = await Branch.find({
    status: "ACTIVE",
  })
    .select("_id name businessId")
    .lean();

  let selectedBranch = null;
  let selectedBusiness = null;

  for (const branch of activeBranches) {
    const business = await Business.findById(branch.businessId)
      .select("_id name status")
      .lean();

    if (business?.status === "APPROVED") {
      selectedBranch = branch;
      selectedBusiness = business;
      break;
    }
  }

  if (!selectedBranch) {
    throw new Error(
      "Chưa có chi nhánh ACTIVE thuộc Business APPROVED. " +
        "Hãy chuẩn bị dữ liệu Business và Branch trước.",
    );
  }

  console.log(
    "Business:",
    selectedBusiness.name || String(selectedBusiness._id),
  );
  console.log("Chi nhánh:", selectedBranch.name);

  // 2. Lấy danh mục đang hoạt động.
  const categories = await ServiceCategory.find({
    status: "ACTIVE",
  })
    .select("_id name code")
    .lean();

  if (categories.length === 0) {
    throw new Error("Chưa có danh mục dịch vụ ACTIVE trong serviceCategories.");
  }

  console.log("\nDanh mục hiện có:");

  for (const category of categories) {
    console.log(`- ${category.code}: ${category.name}`);
  }

  // 3. Kiểm tra xem có đủ danh mục phù hợp không.
  // Kiểm tra trước khi tạo để tránh tạo dở dữ liệu
  // do thiếu một danh mục cần thiết.
  const preparedServices = SAMPLE_SERVICES.map((item) => {
    const matchingCategory = categories.find((category) =>
      item.categoryKeywords.test(`${category.code} ${category.name}`),
    );

    return {
      ...item,
      category: matchingCategory,
    };
  });

  const missingCategories = preparedServices.filter((item) => !item.category);

  if (missingCategories.length > 0) {
    console.log("\nKhông tìm thấy danh mục cho:");

    for (const item of missingCategories) {
      console.log(`- ${item.name}`);
    }

    throw new Error(
      "Hãy kiểm tra mã/tên danh mục trong MongoDB " +
        "và cập nhật categoryKeywords cho phù hợp.",
    );
  }

  let createdServices = 0;
  let createdBranchServices = 0;

  // 4. Tạo Service và BranchService.
  for (const item of preparedServices) {
    let service = await Service.findOne({
      businessId: selectedBusiness._id,
      name: item.name,
    });

    if (!service) {
      service = await Service.create({
        businessId: selectedBusiness._id,
        categoryId: item.category._id,
        name: item.name,
        description: item.description,
        serviceType: item.serviceType,
        images: [],
        status: "ACTIVE",
      });

      createdServices += 1;
      console.log(`Đã tạo Service: ${item.name}`);
    } else {
      // Không tự sửa dữ liệu đã có.
      // Nếu tên trùng nhưng loại khác, dừng để kiểm tra.
      if (service.serviceType !== item.serviceType) {
        throw new Error(
          `Service "${item.name}" đã tồn tại nhưng khác serviceType.`,
        );
      }

      console.log(`Service đã tồn tại: ${item.name}`);
    }

    let branchService = await BranchService.findOne({
      branchId: selectedBranch._id,
      serviceId: service._id,
    });

    if (!branchService) {
      branchService = await BranchService.create({
        branchId: selectedBranch._id,
        serviceId: service._id,
        price: item.price,
        pricingUnit: item.pricingUnit,
        durationMinutes: item.durationMinutes,
        capacity: item.serviceType === "BOARDING" ? 10 : null,
        petTypes: ["DOG", "CAT"],
        status: "ACTIVE",
      });

      createdBranchServices += 1;
      console.log(`Đã gán vào chi nhánh: ${item.name}`);
    } else {
      console.log(`BranchService đã tồn tại: ${item.name}`);
    }
  }

  console.log("\n===== KẾT QUẢ =====");
  console.log("Service mới:", createdServices);
  console.log("BranchService mới:", createdBranchServices);
  console.log("Business ID:", String(selectedBusiness._id));
  console.log("Branch ID:", String(selectedBranch._id));

  console.log("\nSeed dịch vụ hoàn tất!");
}

seedBookingServices()
  .catch((error) => {
    console.error("\nSeed thất bại:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
