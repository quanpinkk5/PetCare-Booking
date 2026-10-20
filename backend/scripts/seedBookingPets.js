require("dotenv").config();

const mongoose = require("mongoose");

const User = require("../src/models/User");
const Pet = require("../src/models/Pet");

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

// Dữ liệu thú cưng chỉ dùng cho kiểm thử
const SAMPLE_PETS = [
  {
    name: "[TEST] Milo",
    species: "DOG",
    breed: "Poodle",
    gender: "MALE",
    weight: 5.2,
    personality: "Thân thiện, năng động",
  },
  {
    name: "[TEST] Mimi",
    species: "CAT",
    breed: "British Shorthair",
    gender: "FEMALE",
    weight: 3.8,
    personality: "Hiền lành, hơi nhút nhát",
  },
  {
    name: "[TEST] Bông",
    species: "DOG",
    breed: "Pomeranian",
    gender: "FEMALE",
    weight: 3.1,
    personality: "Tinh nghịch, thích được vuốt ve",
  },
  {
    name: "[TEST] Mun",
    species: "CAT",
    breed: "Mèo ta",
    gender: "MALE",
    weight: 4.5,
    personality: "Năng động, thích chơi đùa",
  },
  {
    name: "[TEST] Lucky",
    species: "DOG",
    breed: "Golden Retriever",
    gender: "MALE",
    weight: 24,
    personality: "Thân thiện, hòa đồng",
  },
];

async function seedBookingPets() {
  if (!MONGO_URI) {
    throw new Error("Không tìm thấy MONGO_URI hoặc MONGODB_URI trong .env.");
  }

  await mongoose.connect(MONGO_URI);

  console.log("Đã kết nối MongoDB.");

  // Chỉ lấy Customer, không dùng Admin hoặc Business Owner
  const customers = await User.find({
    role: "CUSTOMER",
  })
    .select("_id fullName email")
    .sort({ createdAt: 1 })
    .limit(10)
    .lean();

  if (customers.length === 0) {
    throw new Error('Không có tài khoản với role "CUSTOMER".');
  }

  console.log(`Tìm thấy ${customers.length} Customer để tạo Pet mẫu.`);

  let createdCount = 0;
  let existingCount = 0;

  // Mỗi Customer nhận một Pet mẫu.
  // Nếu có nhiều Customer thì các giống thú cưng
  // được phân bổ xen kẽ.
  for (let i = 0; i < customers.length; i++) {
    const customer = customers[i];
    const sample = SAMPLE_PETS[i % SAMPLE_PETS.length];

    // Kiểm tra trước để không tạo trùng khi chạy lại
    const existingPet = await Pet.findOne({
      ownerId: customer._id,
      name: sample.name,
    });

    if (existingPet) {
      existingCount++;
      console.log(
        `Đã tồn tại: ${sample.name} - ${customer.fullName || customer.email}`,
      );
      continue;
    }

    await Pet.create({
      ownerId: customer._id,
      name: sample.name,
      species: sample.species,
      breed: sample.breed,
      gender: sample.gender,
      dateOfBirth: new Date("2023-05-15"),
      weight: sample.weight,
      avatar: "",
      personality: sample.personality,
      feedingNotes: "Cho ăn đúng giờ, uống đủ nước.",
      careNotes: "Theo dõi sức khỏe trong quá trình sử dụng dịch vụ.",
      status: "ACTIVE",
    });

    createdCount++;

    console.log(
      `Đã tạo ${sample.name} cho ${customer.fullName || customer.email}`,
    );
  }

  console.log("\n===== KẾT QUẢ =====");
  console.log("Pet mới:", createdCount);
  console.log("Pet đã tồn tại:", existingCount);
  console.log("Tổng Customer được xử lý:", customers.length);

  console.log("\nSeed Pet hoàn tất!");
}

seedBookingPets()
  .catch((error) => {
    console.error("Seed Pet thất bại:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
