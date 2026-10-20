
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

export default function SocketTest() {
    const socketRef = useRef(null);
    const [readInfo, setReadInfo] = useState("");
    const [token, setToken] = useState("");
    const [conversationId, setConversationId] = useState("");
    const [messageText, setMessageText] = useState("");
    const [messages, setMessages] = useState([]);
    const [result, setResult] = useState("Chưa kết nối");

    // Ngắt kết nối khi đóng component
    useEffect(() => {
        return () => {
            socketRef.current?.disconnect();
        };
    }, []);

    // Kết nối Socket.IO bằng access token
    const connectSocket = () => {
        if (socketRef.current) {
            socketRef.current.disconnect();
        }

        setMessages([]);
        setResult("Đang kết nối...");

        const socket = io("http://localhost:5000", {
            auth: {
                token: token.trim(),
            },
            reconnection: false,
        });

        socketRef.current = socket;

        // Lắng nghe tin nhắn mới
        socket.on("message:new", (message) => {
            console.log("Nhận tin nhắn mới:", message);

            setMessages((prev) => [...prev, message]);
        });
        // Nhận thông báo đã đọc từ server
        socket.on("message:read:update", (data) => {
            console.log("Cập nhật trạng thái đã đọc:", data);

            setReadInfo(
                `${data.updatedCount} tin nhắn đã được đánh dấu đã đọc`
            );
        });
        socket.on("connect", () => {
            setResult("Kết nối Socket.IO thành công");
            console.log("Đã kết nối:", socket.id);
        });

        socket.on("connect_error", (error) => {
            setResult(`Kết nối thất bại: ${error.message}`);
            console.error("Lỗi kết nối:", error.message);
        });

        socket.on("disconnect", (reason) => {
            console.log("Đã ngắt kết nối:", reason);
        });
    };

    // Tham gia phòng chat
    const joinConversation = () => {
        if (!socketRef.current?.connected) {
            setResult("Vui lòng kết nối Socket.IO trước");
            return;
        }

        socketRef.current.emit(
            "conversation:join",
            {
                conversationId: conversationId.trim(),
            },
            (response) => {
                console.log("Kết quả tham gia:", response);
                setResult(response.message);
            }
        );
    };

    // Rời phòng chat
    const leaveConversation = () => {
        if (!socketRef.current?.connected) {
            setResult("Vui lòng kết nối Socket.IO trước");
            return;
        }

        socketRef.current.emit(
            "conversation:leave",
            {
                conversationId: conversationId.trim(),
            },
            (response) => {
                console.log("Kết quả rời phòng:", response);
                setResult(response.message);
            }
        );
    };

    // Gửi tin nhắn realtime
    const sendMessage = () => {
        if (!socketRef.current?.connected) {
            setResult("Vui lòng kết nối Socket.IO trước");
            return;
        }

        if (!messageText.trim()) {
            setResult("Vui lòng nhập nội dung tin nhắn");
            return;
        }

        socketRef.current.emit(
            "message:send",
            {
                conversationId: conversationId.trim(),
                content: messageText.trim(),
            },
            (response) => {
                console.log("Kết quả gửi tin nhắn:", response);
                setResult(response.message);

                if (response.success) {
                    setMessageText("");
                }
            }
        );
    };
    const markMessagesAsRead = () => {
        if (!socketRef.current?.connected) {
            setResult("Vui lòng kết nối Socket.IO trước");
            return;
        }

        socketRef.current.emit(
            "message:read",
            {
                conversationId: conversationId.trim(),
            },
            (response) => {
                console.log("Kết quả đánh dấu đã đọc:", response);

                setResult(response.message);

                if (response.success) {
                    setReadInfo(
                        `Đã cập nhật ${response.updatedCount} tin nhắn`
                    );
                }
            }
        );
    };
    return (
        <div style={{ padding: "30px" }}>
            <h2>Kiểm tra Socket.IO PetCare</h2>

            <div>
                <input
                    type="text"
                    placeholder="Nhập access token"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    style={{ width: "400px", padding: "10px" }}
                />
            </div>

            <div style={{ marginTop: "15px" }}>
                <button onClick={connectSocket}>
                    1. Kết nối Socket.IO
                </button>
            </div>

            <div style={{ marginTop: "20px" }}>
                <input
                    type="text"
                    placeholder="Nhập conversationId"
                    value={conversationId}
                    onChange={(e) => setConversationId(e.target.value)}
                    style={{ width: "400px", padding: "10px" }}
                />
            </div>

            <div style={{ marginTop: "15px" }}>
                <button onClick={joinConversation}>
                    2. Tham gia phòng chat
                </button>

                <button
                    onClick={leaveConversation}
                    style={{ marginLeft: "10px" }}
                >
                    3. Rời phòng chat
                </button>
            </div>

            <div style={{ marginTop: "25px" }}>
                <h3>Gửi tin nhắn realtime</h3>

                <input
                    type="text"
                    placeholder="Nhập nội dung tin nhắn"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    style={{ width: "400px", padding: "10px" }}
                />

                <button
                    onClick={sendMessage}
                    style={{ marginLeft: "10px" }}
                >
                    Gửi tin nhắn
                </button>
            </div>

            <div style={{ marginTop: "25px" }}>
                <h3>Tin nhắn nhận được</h3>

                {messages.length === 0 ? (
                    <p>Chưa có tin nhắn mới</p>
                ) : (
                    messages.map((message) => (
                        <div
                            key={message._id}
                            style={{
                                padding: "10px",
                                marginBottom: "8px",
                                border: "1px solid #ccc",
                                borderRadius: "5px",
                            }}
                        >
                            <strong>
                                {message.senderId?.fullName || "Người gửi"}:
                            </strong>{" "}
                            {message.content}
                        </div>
                    ))
                )}
            </div>

            <div style={{ marginTop: "20px" }}>
                <button onClick={markMessagesAsRead}>
                    4. Đánh dấu đã đọc
                </button>

                <p>
                    <strong>Trạng thái đã đọc:</strong> {readInfo}
                </p>
            </div>
        </div>
    );
}
