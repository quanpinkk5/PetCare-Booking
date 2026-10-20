
require("dotenv").config();

const mongoose = require("mongoose");

const User = require("../src/models/User");
const Business = require("../src/models/Business");
const Branch = require("../src/models/Branch");
const EXISTING_OWNER_EMAIL = "binh.owner@example.com";
const TEST_OWNER_PASSWORD = process.env.SEED_OWNER_PASSWORD;

const seedData = [
  {
    name: "Happy Pet",
    ownerName: "Nguyễn Văn Bình",
    status: "APPROVED",
    provinces: ["Hà Nội", "Hà Nội", "Bắc Ninh"],
  },
  {
    name: "Pet Paradise",
    ownerName: "Trần Hoàng Nam",
    status: "PENDING",
    provinces: ["TP. Hồ Chí Minh", "Bình Dương"],
  },
  {
    name: "Meow Care",
    ownerName: "Lê Thu Hà",
    status: "APPROVED",
    provinces: ["Đà Nẵng", "Quảng Nam"],
  },
  {
    name: "Poodle House",
    ownerName: "Phạm Quốc Bảo",
    status: "SUSPENDED",
    provinces: ["Hải Phòng"],
  },
  {
    name: "Paws Spa",
    ownerName: "Vũ Thị Thanh Tâm",
    status: "REJECTED",
    provinces: ["Cần Thơ"],
  },
  {
    name: "Pet Home",
    ownerName: "Đỗ Minh Đức",
    status: "PENDING",
    provinces: ["Hà Nội"],
  },
  {
    name: "Dog & Cat Care",
    ownerName: "Hoàng Thị Lan",
    status: "APPROVED",
    provinces: ["Nghệ An", "Hà Tĩnh"],
  },
  {
    name: "Little Paws",
    ownerName: "Bùi Thanh Phong",
    status: "PENDING",
    provinces: ["Thanh Hóa"],
  },
  {
    name: "Pet Garden",
    ownerName: "Ngô Thu Trang",
    status: "SUSPENDED",
    provinces: ["Đồng Nai"],
  },
  {
    name: "Lovely Pet",
    ownerName: "Đặng Quốc Huy",
    status: "APPROVED",
    provinces: ["Hà Nội", "Hải Phòng"],
  },
  {
    name: "Pet Wellness",
    ownerName: "Phan Ngọc Mai",
    status: "PENDING",
    provinces: ["Khánh Hòa"],
  },
  {
    name: "Fluffy House",
    ownerName: "Trịnh Anh Tuấn",
    status: "REJECTED",
    provinces: ["Lâm Đồng"],
  },
  {
    name: "Puppy Love",
    ownerName: "Mai Thị Hương",
    status: "APPROVED",
    provinces: ["TP. Hồ Chí Minh"],
  },
  {
    name: "Cat Kingdom",
    ownerName: "Lý Minh Khang",
    status: "SUSPENDED",
    provinces: ["Huế"],
  },
  {
    name: "Pet Family",
    ownerName: "Nguyễn Thảo Vy",
    status: "PENDING",
    provinces: ["Bắc Ninh", "Hà Nội"],
  },
];

function getMongoUri() {
  return process.env.MONGODB_URI || process.env.MONGO_URI;
}

async function connectDB() {
  const uri = getMongoUri();

  if (!uri) {
    throw new Error(
      "Thiếu MONGODB_URI hoặc MONGO_URI trong .env"
    );
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "Không được chạy seed test trong môi trường production"
    );
  }

  await mongoose.connect(uri);

  // Thêm lớp bảo vệ để tránh vô tình seed vào database production
  const databaseName = mongoose.connection.db.databaseName;

  if (/prod|production/i.test(databaseName)) {
    throw new Error(
      `Từ chối seed vào database: ${databaseName}`
    );
  }

  console.log(`Đã kết nối MongoDB: ${databaseName}`);
}

async function getExistingOwner() {
  const owner = await User.findOne({
    email: EXISTING_OWNER_EMAIL,
    role: "BUSINESS_OWNER",
  });

  if (!owner) {
    throw new Error(
      `Không tìm thấy BUSINESS_OWNER: ${EXISTING_OWNER_EMAIL}`
    );
  }

  return owner;
}

async function getOrCreateTestOwner(index, item) {
  const number = String(index + 1).padStart(2, "0");

  // Owner đầu tiên dùng tài khoản Nguyễn Văn Bình có sẵn
  if (index === 0) {
    return getExistingOwner();
  }

  const email = `petcare.seed.owner${number}@example.com`;

  let owner = await User.findOne({ email });

  if (owner) {
    if (owner.role !== "BUSINESS_OWNER") {
      throw new Error(
        `Email ${email} đã tồn tại nhưng không phải BUSINESS_OWNER`
      );
    }

    return owner;
  }

  if (!TEST_OWNER_PASSWORD || TEST_OWNER_PASSWORD.length < 8) {
    throw new Error(
      "Cần đặt SEED_OWNER_PASSWORD dài ít nhất 8 ký tự trong .env"
    );
  }

  // User.create() sẽ kích hoạt pre("save") để hash mật khẩu
  owner = await User.create({
    fullName: item.ownerName,
    email,
    phone: `098700${String(index + 1).padStart(4, "0")}`,
    password: TEST_OWNER_PASSWORD,
    avatar: "",
    role: "BUSINESS_OWNER",
    status: "ACTIVE",
    address: {},
  });

  console.log(`  + Tạo Owner: ${owner.fullName}`);

  return owner;
}

async function getOrCreateBusiness(index, item, owner) {
  const number = String(index + 1).padStart(2, "0");
  const slug = `test-petcare-${number}`;

  const businessBySlug = await Business.findOne({ slug });

  // Nếu thương hiệu test đã tồn tại thì không sửa trạng thái của nó
  if (businessBySlug) {
    if (String(businessBySlug.ownerId) !== String(owner._id)) {
      throw new Error(
        `Business ${slug} đang thuộc một Owner khác. Dừng seed để tránh sửa dữ liệu.`
      );
    }

    console.log(`  = Business đã tồn tại: ${businessBySlug.name}`);
    return { business: businessBySlug, created: false };
  }

  // Ràng buộc nghiệp vụ: một Owner chỉ có một Business
  const existingBusiness = await Business.findOne({
    ownerId: owner._id,
  });

  if (existingBusiness) {
    throw new Error(
      `Owner ${owner.email} đã có thương hiệu "${existingBusiness.name}". ` +
      `Không tạo thêm thương hiệu thứ hai.`
    );
  }

  const business = await Business.create({
    ownerId: owner._id,
    name: `TEST - ${item.name}`,
    slug,
    description:
      "Dữ liệu thử nghiệm cho chức năng Admin quản lý thương hiệu.",
    logo: "",
    images: [],
    phone: `090800${String(index + 1).padStart(4, "0")}`,
    email: `petcare.seed.brand${number}@example.com`,
    status: item.status,
    averageRating: 0,
    totalReviews: 0,
  });

  console.log(
    `  + Business: ${business.name} (${business.status})`
  );

  return { business, created: true };
}

async function createMissingBranches(index, item, business) {
  let created = 0;

  for (let branchIndex = 0; branchIndex < item.provinces.length; branchIndex++) {
    const province = item.provinces[branchIndex];

    const number = String(index + 1).padStart(2, "0");
    const branchNumber = branchIndex + 1;

    const branchName =
      `TEST - ${item.name} - Chi nhánh ${branchNumber}`;

    const existingBranch = await Branch.findOne({
      businessId: business._id,
      name: branchName,
    });

    if (existingBranch) {
      continue;
    }

    await Branch.create({
      businessId: business._id,
      name: branchName,
      phone: `091800${number}${String(branchNumber).padStart(2, "0")}`,
      email:
        `petcare.seed.branch${number}.${branchNumber}@example.com`,

      address: {
        province,
        district: "Khu vực kiểm thử",
        detail: `Số ${branchNumber}, Đường PetCare Test`,
      },

      openingHours: [],
      images: [],
      status: "ACTIVE",
    });

    created++;

    console.log(
      `    + Chi nhánh ${branchNumber}: ${province}`
    );
  }

  return created;
}

async function runSeed() {
  await connectDB();

  const existingOwner = await getExistingOwner();

  console.log(
    `\nOwner có sẵn: ${existingOwner.fullName} (${existingOwner.email})`
  );

  // Kiểm tra trước khi tạo dữ liệu:
  // nếu tài khoản có sẵn đã sở hữu một Business thật,
  // không được tạo thêm Business test cho tài khoản đó.
  const firstSeedSlug = "test-petcare-01";

  const currentBusiness = await Business.findOne({
    ownerId: existingOwner._id,
  });

  if (
    currentBusiness &&
    currentBusiness.slug !== firstSeedSlug
  ) {
    throw new Error(
      `Nguyễn Văn Bình đã có thương hiệu "${currentBusiness.name}". ` +
      "Dừng seed để bảo đảm quy tắc 1 Owner - 1 Business."
    );
  }

  // Kiểm tra tránh chiếm nhầm slug của thương hiệu khác
  const seedSlugs = seedData.map(
    (_, index) =>
      `test-petcare-${String(index + 1).padStart(2, "0")}`
  );

  const existingSeedBusinesses = await Business.find({
    slug: { $in: seedSlugs },
  }).lean();

  for (const business of existingSeedBusinesses) {
    const index = seedSlugs.indexOf(business.slug);

    const expectedEmail =
      index === 0
        ? EXISTING_OWNER_EMAIL
        : `petcare.seed.owner${String(index + 1).padStart(2, "0")}@example.com`;

    const owner = await User.findById(business.ownerId)
      .select("email")
      .lean();

    if (!owner || owner.email !== expectedEmail) {
      throw new Error(
        `Slug "${business.slug}" đã được dùng bởi dữ liệu không khớp seed.`
      );
    }
  }

  let newOwners = 0;
  let newBusinesses = 0;
  let newBranches = 0;

  for (let index = 0; index < seedData.length; index++) {
    const item = seedData[index];

    console.log(`\n[${index + 1}/15] ${item.name}`);

    const number = String(index + 1).padStart(2, "0");

    const ownerEmail =
      index === 0
        ? EXISTING_OWNER_EMAIL
        : `petcare.seed.owner${number}@example.com`;

    const ownerExisted = await User.exists({
      email: ownerEmail,
    });

    const owner = await getOrCreateTestOwner(index, item);

    if (!ownerExisted) {
      newOwners++;
    }

    const { business, created } =
      await getOrCreateBusiness(index, item, owner);

    if (created) {
      newBusinesses++;
    }

    newBranches += await createMissingBranches(
      index,
      item,
      business
    );
  }

  console.log("\n========== KẾT QUẢ SEED ==========");
  console.log(`Owner mới: ${newOwners}`);
  console.log(`Business mới: ${newBusinesses}`);
  console.log(`Branch mới: ${newBranches}`);
  console.log("Seed Facilities hoàn tất!");
}

runSeed()
  .catch((error) => {
    console.error("\nLỖI SEED:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
