const crypto = require("crypto");
const { formatVnpDate } = require("./vnpay");

const queryError = (code, message, details = {}) =>
  Object.assign(new Error(message), { code, ...details });

const sign = (raw) =>
  crypto
    .createHmac("sha512", process.env.VNP_HASH_SECRET)
    .update(raw, "utf8")
    .digest("hex");

function verifyQueryResponse(data) {
  const received = data?.vnp_SecureHash;

  if (typeof received !== "string" || !/^[a-f0-9]{128}$/i.test(received)) {
    return false;
  }

  const fields = [
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

  const raw = fields.map((key) => String(data[key] ?? "")).join("|");

  const expected = Buffer.from(sign(raw), "hex");
  const actual = Buffer.from(received, "hex");

  return crypto.timingSafeEqual(expected, actual);
}

async function queryVnpayTransaction(payment, booking) {
  if (
    !process.env.VNP_TMN_CODE ||
    !process.env.VNP_HASH_SECRET ||
    !process.env.VNP_QUERY_URL
  ) {
    throw queryError("QUERYDR_CONFIG_MISSING", "Thiếu cấu hình VNPAY QueryDR");
  }

  const now = new Date();

  // Ưu tiên thời gian gốc đã lưu khi tạo paymentUrl.
  const transactionDate =
    payment.metadata?.vnpCreateDate || formatVnpDate(payment.createdAt);

  const params = {
    vnp_RequestId: crypto.randomBytes(16).toString("hex"),
    vnp_Version: "2.1.0",
    vnp_Command: "querydr",
    vnp_TmnCode: process.env.VNP_TMN_CODE,
    vnp_TxnRef: payment.paymentCode,
    vnp_OrderInfo: `Query booking ${booking.bookingCode}`,
    vnp_TransactionDate: transactionDate,
    vnp_CreateDate: formatVnpDate(now),
    vnp_IpAddr: process.env.VNP_SERVER_IP || "127.0.0.1",
  };

  const raw = [
    params.vnp_RequestId,
    params.vnp_Version,
    params.vnp_Command,
    params.vnp_TmnCode,
    params.vnp_TxnRef,
    params.vnp_TransactionDate,
    params.vnp_CreateDate,
    params.vnp_IpAddr,
    params.vnp_OrderInfo,
  ].join("|");

  params.vnp_SecureHash = sign(raw);

  let response;
  try {
    response = await fetch(process.env.VNP_QUERY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
    signal: AbortSignal.timeout(10000),
    });
  } catch (error) {
    throw queryError(
      error.name === "TimeoutError" ? "QUERYDR_TIMEOUT" : "QUERYDR_CONNECTION_FAILED",
      "Không kết nối được VNPAY QueryDR",
      { cause: error },
    );
  }

  if (!response.ok) {
    throw queryError("QUERYDR_HTTP_ERROR", `QueryDR HTTP ${response.status}`);
  }

  let data;
  try {
    data = await response.json();
  } catch (error) {
    throw queryError("QUERYDR_INVALID_RESPONSE", "QueryDR không trả về JSON hợp lệ", { cause: error });
  }

  // Gateway errors may be unsigned. Report the error without treating it as
  // a verified transaction result or allowing another payment to be created.
  if (
  !data?.vnp_SecureHash &&
  typeof data?.vnp_ResponseCode === "string" &&
  data.vnp_ResponseCode !== "00"
) {
  console.error("VNPAY QUERYDR GATEWAY:", {
    responseCode: data.vnp_ResponseCode,
    message: data.vnp_Message,
    responseFields: Object.keys(data),
    requestInfo: {
      version: params.vnp_Version,
      command: params.vnp_Command,
      transactionDate: params.vnp_TransactionDate,
      createDate: params.vnp_CreateDate,
      hasHash: Boolean(params.vnp_SecureHash),
    },
  });

  throw queryError(
    "QUERYDR_GATEWAY_ERROR",
    `VNPAY QueryDR trả mã lỗi ${data.vnp_ResponseCode}`,
    {
      gatewayResponseCode: data.vnp_ResponseCode,
    }
  );
}

  if (!verifyQueryResponse(data)) {
  console.error("VNPAY QUERYDR DEBUG:", {
    responseCode: data?.vnp_ResponseCode,
    message: data?.vnp_Message,
    command: data?.vnp_Command,
    fieldNames: Object.keys(data || {}),
    hashPresent: typeof data?.vnp_SecureHash === "string",
    hashLength: data?.vnp_SecureHash?.length,
  });

  throw queryError(
    "QUERYDR_INVALID_SIGNATURE",
    "Chữ ký QueryDR không hợp lệ"
  );
}

  if (
    data.vnp_TmnCode !== params.vnp_TmnCode ||
    data.vnp_TxnRef !== params.vnp_TxnRef
  ) {
    throw new Error("QueryDR trả về sai giao dịch");
  }

  if (
    data.vnp_ResponseCode === "00" &&
    Number(data.vnp_Amount) !== payment.amount * 100
  ) {
    throw new Error("Số tiền QueryDR không khớp");
  }

  return {
    responseCode: data.vnp_ResponseCode,
    transactionStatus: data.vnp_TransactionStatus,
    transactionNo: data.vnp_TransactionNo || "",
    message: data.vnp_Message || "",
  };
}

module.exports = { queryVnpayTransaction };
