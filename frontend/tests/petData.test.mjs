import assert from 'node:assert/strict';
import { test } from 'node:test';
import { petAge, petFormData, petPayload, selectPets } from '../src/features/customer/services/petData.js';

test('pet form converts stored dates and numeric weight without losing notes or avatar', () => {
  const pet = { _id: 'pet-1', ownerId: 'owner', name: 'Milo', species: 'DOG', gender: 'MALE',
    dateOfBirth: '2024-02-29T00:00:00.000Z', weight: 5.5, avatar: 'https://example.com/pet.png',
    personality: 'Hiền', feedingNotes: 'Ăn hạt', careNotes: 'Dị ứng', status: 'ACTIVE' };
  const form = petFormData(pet);
  assert.equal(form.dateOfBirth, '2024-02-29');
  const payload = petPayload(form);
  assert.equal(payload.weight, 5.5);
  assert.equal(payload.gender, 'MALE');
  assert.equal(payload.careNotes, 'Dị ứng');
  assert.equal(payload.avatar, pet.avatar);
  assert.equal(payload._id, undefined);
  assert.equal(payload.ownerId, undefined);
  assert.equal(payload.status, undefined);
});

test('blank optional fields can be cleared while zero and invalid weight cannot be saved', () => {
  const form = { ...petFormData(), name: '  Milo  ' };
  const payload = petPayload(form);
  assert.equal(payload.name, 'Milo');
  assert.equal(payload.dateOfBirth, null);
  assert.equal(payload.weight, null);
  assert.equal(payload.gender, null);
  for (const weight of ['0', '-1', 'abc', 'Infinity']) {
    assert.throws(() => petPayload({ ...form, weight }), /Cân nặng/);
  }
  assert.throws(() => petPayload({ ...form, name: '  ' }), /tên thú cưng/);
});

test('pet age accounts for the birthday and handles missing or invalid dates', () => {
  const now = new Date('2026-10-19T00:00:00Z');
  assert.equal(petAge('2024-10-20', now), '1 tuổi');
  assert.equal(petAge('2024-10-19', now), '2 tuổi');
  assert.equal(petAge('2026-09-20', now), 'Dưới 1 tháng tuổi');
  assert.equal(petAge('2026-08-19', now), '2 tháng tuổi');
  for (const value of [null, 'invalid', '2999-01-01']) {
    assert.equal(petAge(value, now), 'Chưa có ngày sinh');
  }
});

test('search, species filter and sorting work together without changing the source list', () => {
  const pets = [
    { name: 'Milo', species: 'DOG', breed: 'Poodle', createdAt: '2026-01-01' },
    { name: 'Bella', species: 'CAT', createdAt: '2026-03-01' },
    { name: 'An', species: 'DOG', breed: 'Poodle', createdAt: '2026-02-01' },
  ];
  assert.deepEqual(selectPets(pets, ' POODLE ', 'DOG', 'name').map((pet) => pet.name), ['An', 'Milo']);
  assert.deepEqual(selectPets(pets, '', 'all', 'newest').map((pet) => pet.name), ['Bella', 'An', 'Milo']);
  assert.deepEqual(selectPets(pets, 'MILO', 'CAT', 'name'), []);
  assert.equal(pets[0].name, 'Milo');
});
