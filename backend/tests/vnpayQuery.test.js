
const assert = require("node:assert/strict");
const { test } = require("node:test");
const crypto = require("node:crypto");
const mongoose = require("mongoose");
const BranchService = require("../src/models/BranchService");
const Branch = require("../src/models/Branch");

const {
  queryVnpayTransaction,
} = require("../src/utils/vnpayQuery");

const {
  retryVnpayPayment,
} = require("../src/controllers/customer/paymentsController");

const Booking = require("../src/models/Booking");
const Payment = require("../src/models/Payment");

const booking = {
  _id: "507f1f77bcf86cd799439012",
  bookingCode: "BK-TEST",
  status: "PENDING",
  paymentStatus: "UNPAID",
};

const payment = {
  _id: "507f1f77bcf86cd799439013",
  paymentCode: "TEST-REF",
  amount: 10000,
  createdAt: new Date("2026-11-02T02:00:00Z"),
  expiresAt: new Date(0),
  metadata: {
    vnpCreateDate: "20261102090000",
  },
};

const RESPONSE_FIELDS = [
  "vnp_ResponseId",
  "vnp_Command",
  "vnp_ResponseCode",
  "vnp_Message",
  "vnp_TmnCode",
  "vnp_TxnRef",
  "vnp_Amount",
  "vnp_BankCode",
  "vnp_PayDate",
  "vnp_TransactionNo",
  "vnp_TransactionType",
  "vnp_TransactionStatus",
  "vnp_OrderInfo",
  "vnp_PromotionCode",
  "vnp_PromotionAmount",
];

function configure(t) {
  const config = {
    VNP_TMN_CODE: "TESTCODE",
    VNP_HASH_SECRET: "test-secret",
    VNP_QUERY_URL: "https://example.com/query",
    VNP_URL: "https://example.com/pay",
    VNP_RETURN_URL: "http://localhost:5000/api/customer/payments/vnpay/return",
  };

  for (const [key, value] of Object.entries(config)) {
    const previous = process.env[key];
    process.env[key] = value;

    t.after(() => {
      if (previous === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = previous;
      }
    });
  }
}

function signResponse(data) {
  const raw = RESPONSE_FIELDS
    .map((key) => String(data[key] ?? ""))
    .join("|");

  return crypto
    .createHmac("sha512", "test-secret")
    .update(raw, "utf8")
    .digest("hex");
}

function makeSignedResponse(overrides = {}) {
  const data = {
    vnp_ResponseId: "response",
    vnp_Command: "querydr",
    vnp_ResponseCode: "00",
    vnp_Message: "Success",
    vnp_TmnCode: "TESTCODE",
    vnp_TxnRef: payment.paymentCode,
    vnp_Amount: "1000000",
    vnp_BankCode: "NCB",
    vnp_PayDate: "20261102090000",
    vnp_TransactionNo: "123",
    vnp_TransactionType: "01",
    vnp_TransactionStatus: "00",
    vnp_OrderInfo: "Query booking BK-TEST",
    vnp_PromotionCode: "",
    vnp_PromotionAmount: "",
    ...overrides,
  };

  data.vnp_SecureHash = signResponse(data);

  return data;
}

function mockFetch(t, data) {
  t.mock.method(global, "fetch", async () => {
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  });
}

test(
  "Unsigned gateway error 99 is reported as gateway failure",
  async (t) => {
    configure(t);

    mockFetch(t, {
      vnp_ResponseCode: "99",
      vnp_Message: "Unexpected error",
    });

    await assert.rejects(
      queryVnpayTransaction(payment, booking),
      {
        code: "QUERYDR_GATEWAY_ERROR",
        gatewayResponseCode: "99",
      }
    );
  }
);

test(
  "Retry does not create or update Payment when gateway returns unsigned error",
  async (t) => {
    configure(t);

    mockFetch(t, {
      vnp_ResponseCode: "99",
      vnp_Message: "Unexpected error",
    });

    t.mock.method(console, "error", () => {});

    t.mock.method(Booking, "findOne", async (filter) => {
      assert.equal(String(filter._id), booking._id);
      return booking;
    });

    t.mock.method(Payment, "findOne", () => ({
      select() {
        return this;
      },
      sort: async () => payment,
    }));

    const create = t.mock.method(Payment, "create", () => {
      throw new Error("Unexpected payment creation");
    });

    const update = t.mock.method(
      Payment,
      "findOneAndUpdate",
      () => {
        throw new Error("Unexpected payment update");
      }
    );

    let result;

    await retryVnpayPayment(
      {
        body: {
          bookingId: booking._id,
        },
        user: {
          _id: "customer",
          role: "CUSTOMER",
        },
      },
      {
        status(code) {
          this.code = code;
          return this;
        },
        json(body) {
          result = {
            status: this.code,
            ...body,
          };
          return this;
        },
      },
      (error) => {
        throw error;
      }
    );

    assert.equal(result.status, 503);
    assert.equal(result.success, false);
    assert.equal(result.code, "QUERYDR_UNAVAILABLE");

    assert.equal(
      result.data.reasonCode,
      "QUERYDR_GATEWAY_ERROR"
    );

    assert.equal(
      result.data.gatewayResponseCode,
      "99"
    );

    assert.equal(create.mock.callCount(), 0);
    assert.equal(update.mock.callCount(), 0);
  }
);

test(
  "Connection failure exposes a diagnostic code",
  async (t) => {
    configure(t);

    t.mock.method(global, "fetch", async () => {
      throw new TypeError("fetch failed");
    });

    await assert.rejects(
      queryVnpayTransaction(payment, booking),
      {
        code: "QUERYDR_CONNECTION_FAILED",
      }
    );
  }
);

test(
  "Unsigned success response is rejected",
  async (t) => {
    configure(t);

    const data = makeSignedResponse();
    delete data.vnp_SecureHash;

    mockFetch(t, data);

    await assert.rejects(
      queryVnpayTransaction(payment, booking),
      {
        code: "QUERYDR_INVALID_SIGNATURE",
      }
    );
  }
);

test(
  "Valid signed success response is accepted",
  async (t) => {
    configure(t);

    const data = makeSignedResponse();

    mockFetch(t, data);

    const result = await queryVnpayTransaction(
      payment,
      booking
    );

    assert.equal(result.responseCode, "00");
    assert.equal(result.transactionStatus, "00");
    assert.equal(result.transactionNo, "123");
  }
);

test(
  "Tampered signed response is rejected",
  async (t) => {
    configure(t);

    const data = makeSignedResponse();

    // Thay đổi số tiền sau khi đã ký.
    data.vnp_Amount = "1";

    mockFetch(t, data);

    await assert.rejects(
      queryVnpayTransaction(payment, booking),
      {
        code: "QUERYDR_INVALID_SIGNATURE",
      }
    );
  }
);

test(
  "Valid signature but wrong amount is rejected",
  async (t) => {
    configure(t);

    // Số tiền sai nhưng chữ ký được tính lại hợp lệ.
    const data = makeSignedResponse({
      vnp_Amount: "1",
    });

    mockFetch(t, data);

    await assert.rejects(
      queryVnpayTransaction(payment, booking),
      /Số tiền QueryDR không khớp/
    );
  }
);

test(
  "Valid signature but wrong transaction is rejected",
  async (t) => {
    configure(t);

    const data = makeSignedResponse({
      vnp_TxnRef: "WRONG-REF",
    });

    mockFetch(t, data);

    await assert.rejects(
      queryVnpayTransaction(payment, booking),
      /QueryDR trả về sai/
    );
  }
);

const invokeRetry = async (body = { bookingId: booking._id }, user = { _id: 'customer', role: 'CUSTOMER' }) => {
  let result;
  await retryVnpayPayment({ body, user, ip: '127.0.0.1' }, {
    status(code) { this.code = code; return this; },
    json(data) { result = { status: this.code, ...data }; },
  }, (error) => { throw error; });
  return result;
};

function setupRetry(t, response = makeSignedResponse()) {
  configure(t);
  mockFetch(t, response);
  t.mock.method(console, 'error', () => {});
  const state = {
    booking: { ...booking, totalPrice: payment.amount, customerId: 'customer', branchServiceId: 'offering' },
    active: { ...payment, bookingId: booking._id, status: 'PROCESSING' },
    created: [], paymentSaves: 0, bookingSaves: 0, ended: 0, updates: 0,
  };
  state.currentBooking = { ...state.booking, async save() { state.bookingSaves += 1; } };
  state.currentPayment = { ...state.active, metadata: { vnpCreateDate: payment.metadata.vnpCreateDate }, async save() { state.paymentSaves += 1; } };
  t.mock.method(Booking, 'findOne', async () => state.booking);
  t.mock.method(Payment, 'findOne', () => ({
    select() { return this; }, sort: async () => state.active,
    then(resolve, reject) { return Promise.resolve(state.active).then(resolve, reject); },
  }));
  const session = {
    withTransaction: async (callback) => callback(),
    endSession: async () => { state.ended += 1; },
  };
  t.mock.method(mongoose, 'startSession', async () => session);
  t.mock.method(Payment, 'findById', () => ({
    select() { return this; }, session: async () => state.currentPayment,
  }));
  t.mock.method(Booking, 'findById', () => ({ session: async () => state.currentBooking }));
  t.mock.method(Payment, 'findOneAndUpdate', async (filter, update) => {
    assert.equal(filter.amount, payment.amount);
    assert.equal(filter.paymentCode, payment.paymentCode);
    assert.equal(filter.bookingId, booking._id);
    assert.equal(filter.method, 'VNPAY');
    state.updates += 1;
    if (!state.currentPayment || !filter.status.$in.includes(state.currentPayment.status)) return null;
    assert.equal(update.$set['metadata.queryTransactionStatus'], '02');
    state.active = null;
    return { ...state.currentPayment, status: 'FAILED' };
  });
  t.mock.method(BranchService, 'findById', async () => ({ branchId: 'branch' }));
  t.mock.method(Branch, 'findById', async () => ({ businessId: 'business' }));
  t.mock.method(Payment, 'create', async (data) => {
    state.created.push(data);
    return { _id: 'new-payment', ...data };
  });
  t.mock.method(Payment, 'updateOne', async () => ({ modifiedCount: 1 }));
  return { state, session };
}

test('retry rejects unauthenticated requests and missing booking IDs without database queries', async (t) => {
  t.mock.method(Booking, 'findOne', () => { throw new Error('Unexpected DB query'); });
  assert.equal((await invokeRetry({}, null)).status, 401);
  assert.equal((await invokeRetry({}, { role: 'ADMIN' })).status, 403);
  assert.equal((await invokeRetry(null)).status, 400);
});

test('already paid bookings return success without QueryDR or another payment', async (t) => {
  const { state } = setupRetry(t);
  state.booking.paymentStatus = 'PAID';
  state.booking.status = 'CONFIRMED';
  t.mock.method(global, 'fetch', () => { throw new Error('Unexpected QueryDR'); });
  const result = await invokeRetry();
  assert.equal(result.status, 200);
  assert.equal(result.code, 'PAYMENT_ALREADY_PAID');
  assert.equal(state.created.length, 0);
});

test('retry creates a payment when no active attempt exists', async (t) => {
  const { state } = setupRetry(t);
  state.active = null;
  const result = await invokeRetry();
  assert.equal(result.status, 201);
  assert.equal(state.created.length, 1);
  assert.ok(result.data.paymentUrl.startsWith('https://example.com/pay?'));
});

test('unexpired payments do not call QueryDR or create another payment', async (t) => {
  const { state } = setupRetry(t);
  state.active.expiresAt = new Date(Date.now() + 60000);
  t.mock.method(global, 'fetch', () => { throw new Error('Unexpected QueryDR'); });
  assert.equal((await invokeRetry()).code, 'PAYMENT_IN_PROGRESS');
  assert.equal(state.created.length, 0);
});

test('verified paid result updates payment and booking and preserves original request metadata', async (t) => {
  const { state } = setupRetry(t);
  const result = await invokeRetry();
  assert.equal(result.status, 200);
  assert.equal(state.currentPayment.status, 'PAID');
  assert.equal(state.currentBooking.paymentStatus, 'PAID');
  assert.equal(state.currentPayment.metadata.vnpCreateDate, payment.metadata.vnpCreateDate);
  assert.equal(state.paymentSaves, 1);
  assert.equal(state.bookingSaves, 1);
  assert.equal(state.created.length, 0);
  assert.equal(state.ended, 1);
});

test('verified failed result closes the old attempt before creating a new payment', async (t) => {
  const { state } = setupRetry(t, makeSignedResponse({ vnp_TransactionStatus: '02' }));
  assert.equal((await invokeRetry()).status, 201);
  assert.equal(state.updates, 1);
  assert.equal(state.created.length, 1);
});

test('concurrent IPN payment cannot be overwritten by a failed QueryDR result', async (t) => {
  const { state } = setupRetry(t, makeSignedResponse({ vnp_TransactionStatus: '02' }));
  state.currentPayment.status = 'PAID';
  const result = await invokeRetry();
  assert.equal(result.code, 'PAYMENT_STATE_CHANGED');
  assert.equal(state.created.length, 0);
});

test('IPN confirmed during gateway failure returns success instead of a stale 503', async (t) => {
  const { state } = setupRetry(t);
  t.mock.method(global, 'fetch', async () => {
    state.booking = { ...state.booking, paymentStatus: 'PAID' };
    return Response.json({ vnp_ResponseCode: '99', vnp_Message: 'Unexpected error' });
  });
  const result = await invokeRetry();
  assert.equal(result.status, 200);
  assert.equal(result.code, 'PAYMENT_ALREADY_PAID');
  assert.equal(state.created.length, 0);
});

for (const status of ['01', '04', '05', '07']) test(`unsettled transaction status ${status} never creates another payment`, async (t) => {
  const { state } = setupRetry(t, makeSignedResponse({ vnp_TransactionStatus: status }));
  assert.equal((await invokeRetry()).code, 'PAYMENT_RECONCILIATION_REQUIRED');
  assert.equal(state.created.length, 0);
  assert.equal(state.updates, 0);
});

test('changed amount after QueryDR requires reconciliation rather than marking the booking paid', async (t) => {
  const { state } = setupRetry(t);
  state.currentPayment.amount += 100;
  state.currentBooking.totalPrice = state.currentPayment.amount;
  assert.equal((await invokeRetry()).code, 'MANUAL_RECONCILIATION_REQUIRED');
  assert.equal(state.paymentSaves, 0);
  assert.equal(state.bookingSaves, 0);
  assert.equal(state.ended, 1);
});

test('a paid Payment with an unpaid Booking requires reconciliation', async (t) => {
  const { state } = setupRetry(t);
  state.currentPayment.status = 'PAID';
  const result = await invokeRetry();
  assert.equal(result.status, 409);
  assert.equal(result.code, 'MANUAL_RECONCILIATION_REQUIRED');
  assert.equal(state.bookingSaves, 0);
});

test('a cancelled booking discovered after QueryDR is never marked paid', async (t) => {
  const { state } = setupRetry(t);
  state.currentBooking.status = 'CANCELLED';
  assert.equal((await invokeRetry()).code, 'MANUAL_RECONCILIATION_REQUIRED');
  assert.equal(state.bookingSaves, 0);
  assert.equal(state.paymentSaves, 0);
});

test('MongoDB transaction retry clears the previous callback outcome', async (t) => {
  const { state, session } = setupRetry(t);
  session.withTransaction = async (callback) => {
    state.currentBooking.status = 'CANCELLED';
    await callback();
    state.currentBooking.status = 'PENDING';
    await callback();
  };
  assert.equal((await invokeRetry()).code, 'PAYMENT_ALREADY_PAID');
  assert.equal(state.paymentSaves, 1);
  assert.equal(state.bookingSaves, 1);
});
