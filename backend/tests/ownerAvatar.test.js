const assert = require('node:assert/strict');
const { test } = require('node:test');
const jwt = require('jsonwebtoken');
const User = require('../src/models/User');
const routes = require('../src/routes/businessOwner/businessesRoutes');
const owner = { _id: '507f1f77bcf86cd799439011', fullName: 'Chủ cơ sở', role: 'BUSINESS_OWNER', status: 'ACTIVE', tokenVersion: 0 };
const setup = (t) => {
  const previous = process.env.JWT_SECRET;
  process.env.JWT_SECRET = 'owner-avatar-test';
  t.after(() => { if (previous === undefined) delete process.env.JWT_SECRET; else process.env.JWT_SECRET = previous; });
  return jwt.sign({ userId: owner._id, tokenVersion: 0 }, process.env.JWT_SECRET);
};
const patch = (body, token) => new Promise((resolve, reject) => {
  routes.handle({ method: 'PATCH', url: '/profile/avatar', body, headers: token ? { authorization: 'Bearer ' + token } : {} }, {
    code: 200, status(code) { this.code = code; return this; }, json(body) { resolve({ status: this.code, ...body }); },
  }, (error) => reject(error || new Error('Route did not respond')));
});

test('owner avatar requires authentication and the business owner role', async (t) => {
  const token = setup(t);
  assert.equal((await patch({ avatar: '' })).status, 401);
  const find = t.mock.method(User, 'findById', async () => ({ ...owner, role: 'CUSTOMER' }));
  assert.equal((await patch({ avatar: '' }, token)).status, 403);
  find.mock.mockImplementation(async () => ({ ...owner, role: 'ADMIN' }));
  assert.equal((await patch({ avatar: '' }, token)).status, 403);
});

test('owner avatar rejects invalid images and unrelated profile fields without writing', async (t) => {
  const token = setup(t);
  t.mock.method(User, 'findById', async () => owner);
  const update = t.mock.method(User, 'findOneAndUpdate', () => { throw new Error('Unexpected write'); });
  for (const body of [null, [], {}, { avatar: 3 }, { avatar: '', role: 'ADMIN' }, { avatar: 'javascript:alert(1)' }, { avatar: 'data:image/svg+xml;base64,abcd' }, { avatar: 'data:image/png;base64,' + Buffer.alloc(256 * 1024 + 1).toString('base64') }]) {
    assert.equal((await patch(body, token)).status, 400);
  }
  assert.equal(update.mock.callCount(), 0);
});

test('owner avatar saves only to the active authenticated owner and returns the updated profile', async (t) => {
  const token = setup(t);
  t.mock.method(User, 'findById', async () => owner);
  let savedAvatar;
  t.mock.method(User, 'findOneAndUpdate', (filter, update, options) => {
    assert.deepEqual(filter, { _id: owner._id, role: 'BUSINESS_OWNER', status: 'ACTIVE' });
    savedAvatar = update.$set.avatar;
    assert.deepEqual(Object.keys(update.$set), ['avatar']);
    assert.equal(options.runValidators, true);
    return { select() { return this; }, lean: async () => ({ ...owner, avatar: savedAvatar }) };
  });
  for (const avatar of ['data:image/png;base64,aGVsbG8=', 'https://example.com/avatar.png', '']) {
    const response = await patch({ avatar }, token);
    assert.equal(response.status, 200);
    assert.equal(response.data.user.avatar, avatar);
    assert.equal(response.data.user.name, owner.fullName);
  }
});
