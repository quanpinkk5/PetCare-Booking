const Pet = require("../../models/Pet");
const mongoose = require("mongoose");

const editableFields = ["name", "species", "breed", "gender", "dateOfBirth", "weight",
  "avatar", "personality", "feedingNotes", "careNotes"];

const validatePet = (body, partial = false) => {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw new Error("Thông tin thú cưng không hợp lệ");
  }
  const invalidFields = Object.keys(body).filter((field) => !editableFields.includes(field));
  if (invalidFields.length) throw new Error("Không được cập nhật: " + invalidFields.join(", "));
  if (!Object.keys(body).length) throw new Error("Không có thông tin để lưu");
  const data = {};
  if (!partial || body.name !== undefined) {
    if (typeof body.name !== "string" || !body.name.trim()) throw new Error("Tên thú cưng không được để trống");
    data.name = body.name.trim();
  }
  if (!partial || body.species !== undefined) {
    if (!["DOG", "CAT"].includes(body.species)) throw new Error("Loài thú cưng phải là DOG hoặc CAT");
    data.species = body.species;
  }
  if (body.gender !== undefined) {
    if (body.gender !== null && !["MALE", "FEMALE"].includes(body.gender)) throw new Error("Giới tính phải là MALE hoặc FEMALE");
    data.gender = body.gender;
  }
  if (body.weight !== undefined) {
    if (body.weight !== null && (typeof body.weight !== "number" || !Number.isFinite(body.weight) || body.weight <= 0)) {
      throw new Error("Cân nặng phải là số lớn hơn 0");
    }
    data.weight = body.weight;
  }
  if (body.dateOfBirth !== undefined) {
    if (body.dateOfBirth === null) {
      data.dateOfBirth = null;
    } else {
      const value = body.dateOfBirth;
      const date = typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)
        ? new Date(value + "T00:00:00.000Z") : null;
      if (!date || Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value || date > new Date()) {
        throw new Error("Ngày sinh không hợp lệ, cần có dạng YYYY-MM-DD và không ở tương lai");
      }
      data.dateOfBirth = date;
    }
  }
  for (const field of ["breed", "avatar", "personality", "feedingNotes", "careNotes"]) {
    if (body[field] !== undefined) {
      if (typeof body[field] !== "string") throw new Error(field + " phải là chuỗi");
      data[field] = body[field].trim();
      if (field !== "avatar" && data[field].length > 2000) throw new Error(field + " tối đa 2000 ký tự");
    }
  }
  if (data.avatar) {
    const image = /^data:image\/(png|jpeg|webp);base64,([A-Za-z0-9+/]+={0,2})$/.exec(data.avatar);
    const isImage = image && Buffer.byteLength(image[2], "base64") <= 256 * 1024;
    const isUrl = /^https?:\/\/\S+$/.test(data.avatar) && data.avatar.length <= 2048;
    if (!isImage && !isUrl) throw new Error("Ảnh phải là URL HTTP(S) hoặc ảnh PNG, JPEG, WebP tối đa 256 KB");
  }
  return data;
};

const getPetData = (req, res, partial) => {
  try {
    return validatePet(req.body, partial);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
    return null;
  }
};

const handleError = (error, res, next) => {
  if (["ValidationError", "CastError"].includes(error.name)) {
    return res.status(400).json({ success: false, message: "Thông tin thú cưng không hợp lệ" });
  }
  next(error);
};

const createPet = async (req, res, next) => {
  const data = getPetData(req, res, false);
  if (!data) return;
  try {
    const pet = await Pet.create({ ...data, ownerId: req.user._id || req.user.id, status: "ACTIVE" });
    return res.status(201).json({ success: true, message: "Thêm thú cưng thành công", data: pet });
  } catch (error) { handleError(error, res, next); }
};

const getPets = async (req, res, next) => {
  try {
    const pets = await Pet.find({ ownerId: req.user._id || req.user.id, status: "ACTIVE" }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, message: "Lấy danh sách thú cưng thành công", data: pets });
  } catch (error) { handleError(error, res, next); }
};

const updatePet = async (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ success: false, message: "ID thú cưng không hợp lệ" });
  }
  const data = getPetData(req, res, true);
  if (!data) return;
  try {
    const pet = await Pet.findOneAndUpdate({
      _id: req.params.id, ownerId: req.user._id || req.user.id, status: "ACTIVE",
    }, { $set: data }, { new: true, runValidators: true });
    if (!pet) return res.status(404).json({ success: false, message: "Không tìm thấy thú cưng" });
    return res.status(200).json({ success: true, message: "Cập nhật thú cưng thành công", data: pet });
  } catch (error) { handleError(error, res, next); }
};

const deletePet = async (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ success: false, message: "ID thú cưng không hợp lệ" });
  }
  try {
    const pet = await Pet.findOneAndUpdate({
      _id: req.params.id, ownerId: req.user._id || req.user.id, status: "ACTIVE",
    }, { $set: { status: "INACTIVE" } }, { new: true, runValidators: true });
    if (!pet) return res.status(404).json({ success: false, message: "Không tìm thấy thú cưng" });
    return res.status(200).json({ success: true, message: "Xóa thú cưng thành công", data: { _id: pet._id, status: pet.status } });
  } catch (error) { handleError(error, res, next); }
};

module.exports = { createPet, getPets, updatePet, deletePet };
