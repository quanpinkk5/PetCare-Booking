export const petFormData = (pet = {}) => ({
  name: pet.name || '', species: pet.species || 'DOG', breed: pet.breed || '',
  gender: pet.gender || '', dateOfBirth: pet.dateOfBirth?.slice(0, 10) || '',
  weight: pet.weight ?? '', avatar: pet.avatar || '', personality: pet.personality || '',
  feedingNotes: pet.feedingNotes || '', careNotes: pet.careNotes || '',
});

export const petPayload = (form) => {
  if (!form.name.trim()) throw new Error('Vui lòng nhập tên thú cưng.');
  const weight = form.weight === '' ? null : Number(form.weight);
  if (weight !== null && (!Number.isFinite(weight) || weight <= 0)) {
    throw new Error('Cân nặng phải là số lớn hơn 0.');
  }
  return {
    name: form.name.trim(), species: form.species, breed: form.breed.trim(),
    gender: form.gender || null, dateOfBirth: form.dateOfBirth || null, weight,
    avatar: form.avatar.trim(), personality: form.personality.trim(),
    feedingNotes: form.feedingNotes.trim(), careNotes: form.careNotes.trim(),
  };
};

export const petAge = (dateOfBirth, now = new Date()) => {
  if (!dateOfBirth) return 'Chưa có ngày sinh';
  const birth = new Date(dateOfBirth);
  if (Number.isNaN(birth.getTime()) || birth > now) return 'Chưa có ngày sinh';
  let months = (now.getUTCFullYear() - birth.getUTCFullYear()) * 12 + now.getUTCMonth() - birth.getUTCMonth();
  if (now.getUTCDate() < birth.getUTCDate()) months -= 1;
  if (months < 1) return 'Dưới 1 tháng tuổi';
  if (months < 12) return `${months} tháng tuổi`;
  return `${Math.floor(months / 12)} tuổi`;
};

export const selectPets = (pets, search, species, sort) => {
  const query = search.trim().toLocaleLowerCase('vi');
  return pets.filter((pet) => (species === 'all' || pet.species === species) &&
    [pet.name, pet.breed].some((value) => (value || '').toLocaleLowerCase('vi').includes(query)))
    .sort((a, b) => sort === 'name'
      ? a.name.localeCompare(b.name, 'vi')
      : new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
};
