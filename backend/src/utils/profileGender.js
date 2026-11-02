// Keep database values compatible with Admin and Vietnamese labels with Profile.
const toStoredGender = (label) => ({ Nam: "MALE", "Nữ": "FEMALE", "Khác": "OTHER", "": null })[label];

const toProfileGender = (value) => ({ MALE: "Nam", FEMALE: "Nữ", OTHER: "Khác" })[value] ||
  (["Nam", "Nữ", "Khác"].includes(value) ? value : "");

module.exports = { toStoredGender, toProfileGender };
