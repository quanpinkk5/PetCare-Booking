const Pet = require("../../models/Pet");
const Booking = require("../../models/Booking");
const mongoose = require("mongoose");

const createPet = async (req, res, next) => {
  try {
    // 1. Lấy ID Customer từ JWT
    const ownerId = req.user._id || req.user.id;

    // 2. Lấy thông tin thú cưng từ frontend
    const {
      name,
      species,
      breed,
      gender,
      dateOfBirth,
      weight,
      avatar,
      personality,
      feedingNotes,
      careNotes,
    } = req.body || {};

    // 3. Kiểm tra tên
    if (typeof name !== "string" || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Tên thú cưng không được để trống",
      });
    }

    // 4. Kiểm tra loài
    if (!["DOG", "CAT"].includes(species)) {
      return res.status(400).json({
        success: false,
        message: "Loài thú cưng phải là DOG hoặc CAT",
      });
    }

    // 5. Kiểm tra cân nặng nếu được gửi lên
    if (
      weight !== undefined &&
      (typeof weight !== "number" || !Number.isFinite(weight) || weight <= 0)
    ) {
      return res.status(400).json({
        success: false,
        message: "Cân nặng phải là số lớn hơn 0",
      });
    }

    // 6. Chỉ lấy các trường được phép tạo
    const petData = {
      ownerId,
      name: name.trim(),
      species,
      status: "ACTIVE",
    };

    const optionalStrings = {
      breed,
      gender,
      avatar,
      personality,
      feedingNotes,
      careNotes,
    };

    for (const [field, value] of Object.entries(optionalStrings)) {
      if (value !== undefined) {
        if (typeof value !== "string") {
          return res.status(400).json({
            success: false,
            message: `${field} phải là chuỗi`,
          });
        }

        petData[field] = value.trim();
      }
    }

    if (weight !== undefined) {
      petData.weight = weight;
    }

    // 7. Kiểm tra ngày sinh
    if (dateOfBirth !== undefined) {
      if (
        typeof dateOfBirth !== "string" ||
        !/^\d{4}-\d{2}-\d{2}$/.test(dateOfBirth)
      ) {
        return res.status(400).json({
          success: false,
          message: "Ngày sinh phải có dạng YYYY-MM-DD",
        });
      }

      const parsedDate = new Date(`${dateOfBirth}T00:00:00.000Z`);

      if (
        Number.isNaN(parsedDate.getTime()) ||
        parsedDate.toISOString().slice(0, 10) !== dateOfBirth ||
        parsedDate > new Date()
      ) {
        return res.status(400).json({
          success: false,
          message: "Ngày sinh không hợp lệ",
        });
      }

      petData.dateOfBirth = parsedDate;
    }

    // 8. Lưu Pet vào MongoDB
    const pet = await Pet.create(petData);

    // 9. Trả kết quả về frontend
    return res.status(201).json({
      success: true,
      message: "Thêm thú cưng thành công",
      data: pet,
    });
  } catch (error) {
    // Lỗi validation của Mongoose
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    next(error);
  }
};
const getPets = async (req, res, next) => {
  try {
    // 1. Lấy ID Customer từ JWT
    const ownerId = req.user._id || req.user.id;

    // 2. Tìm danh sách Pet của Customer
    const pets = await Pet.find({
      ownerId: ownerId,
      status: "ACTIVE",
    }).sort({ createdAt: -1 });

    // 3. Trả kết quả về frontend
    return res.status(200).json({
      success: true,
      message: "Lấy danh sách thú cưng thành công",
      data: pets,
    });
  } catch (error) {
    next(error);
  }
};
const updatePet = async (req, res, next) => {
  try {
    // 1. Lấy ID Customer từ JWT
    const ownerId = req.user._id || req.user.id;

    // 2. Lấy ID thú cưng từ URL
    const petId = req.params.id;

    // 3. Kiểm tra ID hợp lệ
    if (!mongoose.isValidObjectId(petId)) {
      return res.status(400).json({
        success: false,
        message: "ID thú cưng không hợp lệ",
      });
    }

    // 4. Các trường Customer được phép sửa
    const allowedFields = [
      "name",
      "species",
      "breed",
      "gender",
      "dateOfBirth",
      "weight",
      "avatar",
      "personality",
      "feedingNotes",
      "careNotes",
    ];

    const body = req.body || {};

    // Không cho sửa các trường ngoài danh sách
    const invalidFields = Object.keys(body).filter(
      (field) => !allowedFields.includes(field),
    );

    if (invalidFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Không được cập nhật: ${invalidFields.join(", ")}`,
      });
    }

    const updates = {};

    // 5. Kiểm tra tên
    if (body.name !== undefined) {
      if (typeof body.name !== "string" || !body.name.trim()) {
        return res.status(400).json({
          success: false,
          message: "Tên thú cưng không được để trống",
        });
      }

      updates.name = body.name.trim();
    }

    // 6. Kiểm tra loài
    if (body.species !== undefined) {
      if (!["DOG", "CAT"].includes(body.species)) {
        return res.status(400).json({
          success: false,
          message: "Loài thú cưng phải là DOG hoặc CAT",
        });
      }

      updates.species = body.species;
    }

    // 7. Kiểm tra giới tính
    if (body.gender !== undefined) {
      if (!["MALE", "FEMALE"].includes(body.gender)) {
        return res.status(400).json({
          success: false,
          message: "Giới tính phải là MALE hoặc FEMALE",
        });
      }

      updates.gender = body.gender;
    }

    // 8. Kiểm tra cân nặng
    if (body.weight !== undefined) {
      if (
        typeof body.weight !== "number" ||
        !Number.isFinite(body.weight) ||
        body.weight <= 0
      ) {
        return res.status(400).json({
          success: false,
          message: "Cân nặng phải là số lớn hơn 0",
        });
      }

      updates.weight = body.weight;
    }

    // 9. Kiểm tra ngày sinh
    if (body.dateOfBirth !== undefined) {
      if (
        typeof body.dateOfBirth !== "string" ||
        !/^\d{4}-\d{2}-\d{2}$/.test(body.dateOfBirth)
      ) {
        return res.status(400).json({
          success: false,
          message: "Ngày sinh phải có dạng YYYY-MM-DD",
        });
      }

      const date = new Date(`${body.dateOfBirth}T00:00:00.000Z`);

      if (
        Number.isNaN(date.getTime()) ||
        date.toISOString().slice(0, 10) !== body.dateOfBirth ||
        date > new Date()
      ) {
        return res.status(400).json({
          success: false,
          message: "Ngày sinh không hợp lệ",
        });
      }

      updates.dateOfBirth = date;
    }

    // 10. Kiểm tra các trường dạng chuỗi
    const stringFields = [
      "breed",
      "avatar",
      "personality",
      "feedingNotes",
      "careNotes",
    ];

    for (const field of stringFields) {
      if (body[field] !== undefined) {
        if (typeof body[field] !== "string") {
          return res.status(400).json({
            success: false,
            message: `${field} phải là chuỗi`,
          });
        }

        updates[field] = body[field].trim();
      }
    }

    // 11. Kiểm tra có dữ liệu cần sửa không
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Không có thông tin để cập nhật",
      });
    }

    // 12. Chỉ sửa Pet thuộc Customer và đang ACTIVE
    const pet = await Pet.findOneAndUpdate(
      {
        _id: petId,
        ownerId,
        status: "ACTIVE",
      },
      {
        $set: updates,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!pet) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy thú cưng",
      });
    }

    // 13. Trả thông tin mới
    return res.status(200).json({
      success: true,
      message: "Cập nhật thú cưng thành công",
      data: pet,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    next(error);
  }
};
// Dele /api/customer/pets/:id
const deletePet = async (req, res, next) => {
  try {
    // Lấy ID Customer từ JWT
    const ownerId = req.user._id || req.user.id;

    // Lấy ID Pet từ URL
    const petId = req.params.id;

    // Kiểm tra ID hợp lệ
    if (!mongoose.isValidObjectId(petId)) {
      return res.status(400).json({
        success: false,
        message: "ID thú cưng không hợp lệ",
      });
    }

    // Xóa mềm: ACTIVE -> INACTIVE
    const pet = await Pet.findOneAndUpdate(
      {
        _id: petId,
        ownerId,
        status: "ACTIVE",
      },
      {
        $set: {
          status: "INACTIVE",
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!pet) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy thú cưng",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Xóa thú cưng thành công",
      data: {
        _id: pet._id,
        status: pet.status,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPet,
  getPets,
  updatePet,
  deletePet
};
