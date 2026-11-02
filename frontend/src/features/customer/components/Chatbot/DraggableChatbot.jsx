import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  X,
  Send,
  RotateCcw,
  Minimize2,
  Sparkles,
  GripHorizontal,
  Calendar,
  MapPin,
  Scissors,
  ChevronDown,
  PawPrint,
} from "lucide-react";
import { chatbotApi } from "../../services/chatbotApi.js";
import { useAuth } from "../../../../context/AuthContext.jsx";
import { chatbotHistoryKey, readChatbotHistory, writeChatbotHistory } from "../../services/chatbotHistory.js";

// Phân tích văn bản đơn giản (hỗ trợ in đậm, gạch đầu dòng, liên kết)
const FormattedMessage = ({ text, onNavigate }) => {
  if (!text) return null;

  const lines = text.split("\n");

  return (
    <div className="space-y-1.5 text-sm leading-relaxed">
      {lines.map((line, lineIdx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={lineIdx} className="h-1.5" />;
        }

        // Dòng gạch đầu dòng
        const isBullet = trimmed.startsWith("- ") || trimmed.startsWith("* ");
        const content = isBullet ? trimmed.slice(2) : trimmed;

        // Xử lý in đậm và liên kết dạng [Text](url)
        const parts = [];
        const regex = /(\*\*.*?\*\*|\[.*?\]\(.*?\))/g;
        let lastIdx = 0;
        let match;

        while ((match = regex.exec(content)) !== null) {
          if (match.index > lastIdx) {
            parts.push(content.substring(lastIdx, match.index));
          }
          const token = match[0];
          if (token.startsWith("**") && token.endsWith("**")) {
            parts.push(
              <strong key={match.index} className="font-semibold text-emerald-950">
                {token.slice(2, -2)}
              </strong>
            );
          } else if (token.startsWith("[") && token.includes("](")) {
            const label = token.substring(1, token.indexOf("]("));
            const url = token.substring(token.indexOf("](") + 2, token.length - 1);
            parts.push(
              <button
                key={match.index}
                type="button"
                onClick={() => onNavigate(url)}
                className="inline-flex items-center gap-1 font-medium text-emerald-600 hover:text-emerald-700 underline decoration-emerald-400 hover:decoration-emerald-600 transition-colors mx-0.5"
              >
                {label}
              </button>
            );
          }
          lastIdx = regex.lastIndex;
        }

        if (lastIdx < content.length) {
          parts.push(content.substring(lastIdx));
        }

        if (isBullet) {
          return (
            <div key={lineIdx} className="flex items-start gap-2 pl-1">
              <span className="text-emerald-500 font-bold text-xs mt-1">•</span>
              <span className="flex-1">{parts}</span>
            </div>
          );
        }

        return <p key={lineIdx}>{parts}</p>;
      })}
    </div>
  );
};

export default function DraggableChatbot() {
  const { user, isAuthLoading } = useAuth();
  if (isAuthLoading) return null;
  const storageKey = chatbotHistoryKey(user);
  return <ChatbotSession key={storageKey} storageKey={storageKey} />;
}

function ChatbotSession({ storageKey }) {
  const navigate = useNavigate();
  const [savedHistory] = useState(() => {
    try { return readChatbotHistory(window.localStorage, storageKey); } catch { return null; }
  });

  // Trạng thái mở / đóng của hộp chat
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);

  // Vị trí cửa sổ (x, y) trên màn hình
  const [position, setPosition] = useState(() => {
    try {
      const saved = sessionStorage.getItem("petcare_chatbot_pos");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.x === "number" && typeof parsed.y === "number") {
          return parsed;
        }
      }
    } catch {
      // Bỏ qua lỗi truy cập storage
    }
    // Mặc định: Góc dưới bên phải màn hình
    const initX = Math.max(16, window.innerWidth - 88);
    const initY = Math.max(16, window.innerHeight - 96);
    return { x: initX, y: initY };
  });

  // Quản lý kéo thả
  const isDraggingRef = useRef(false);
  const dragStartPosRef = useRef({ x: 0, y: 0 });
  const elementStartPosRef = useRef({ x: 0, y: 0 });
  const hasMovedSignificantlyRef = useRef(false);

  // Tin nhắn và hội thoại
  const [messages, setMessages] = useState(() => savedHistory?.messages || [
    {
      id: "welcome",
      role: "assistant",
      content:
        "Xin chào bạn! 🐾 Mình là **PetCare AI Assistant**.\n\nMình có thể hỗ trợ bạn tìm hiểu về **dịch vụ**, tra cứu **bảng giá**, tìm **chi nhánh gần nhất** hoặc hướng dẫn **đặt lịch hẹn** nhanh chóng.\n\nBạn cần hỗ trợ điều gì hôm nay ạ? 🐶🐱",
    },
  ]);
  const [suggestions, setSuggestions] = useState(() => savedHistory?.suggestions?.length ? savedHistory.suggestions : [
    "Bảng giá dịch vụ spa & tắm",
    "Tìm cơ sở PetCare gần nhất",
    "Tư vấn tỉa lông cún Poodle",
    "Dịch vụ khách sạn thú cưng",
    "Cách đặt lịch hẹn trên PetCare",
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const widgetRef = useRef(null);
  const messageIdRef = useRef(Math.max(0, ...messages.map(m => Number(m.id.split('-').at(-1)) || 0)));
  const [historySaved, setHistorySaved] = useState(true);

  useEffect(() => {
    let active = true;
    let stored = false;
    try { stored = writeChatbotHistory(window.localStorage, storageKey, messages, suggestions); } catch { /* Storage blocked. */ }
    queueMicrotask(() => { if (active) setHistorySaved(stored); });
    return () => { active = false; };
  }, [storageKey, messages, suggestions]);

  // Lưu vị trí vào sessionStorage
  useEffect(() => {
    try {
      sessionStorage.setItem("petcare_chatbot_pos", JSON.stringify(position));
    } catch {
      // Bỏ qua lỗi
    }
  }, [position]);

  // Cuộn xuống tin nhắn mới nhất
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isMinimized, isLoading]);

  // Tự động ẩn tooltip sau 8 giây
  useEffect(() => {
    const timer = setTimeout(() => setShowTooltip(false), 8000);
    return () => clearTimeout(timer);
  }, []);

  // Lấy câu hỏi gợi ý từ backend khi mở lần đầu
  useEffect(() => {
    let active = true;
    chatbotApi
      .getSuggestions()
      .then((res) => {
        if (active && !savedHistory?.suggestions?.length && res?.data?.suggestions?.length) {
          setSuggestions(res.data.suggestions);
        }
      })
      .catch(() => {
        // Fallback tự động giữ nguyên các gợi ý mặc định
      });
    return () => {
      active = false;
    };
  }, [savedHistory]);

  // Xử lý giữ vị trí trong khung hình khi đổi kích thước màn hình
  useEffect(() => {
    const handleResize = () => {
      setPosition((prev) => {
        const width = isOpen ? 380 : 64;
        const height = isOpen ? 520 : 64;
        const clampedX = Math.max(12, Math.min(prev.x, window.innerWidth - width - 12));
        const clampedY = Math.max(12, Math.min(prev.y, window.innerHeight - height - 12));
        return { x: clampedX, y: clampedY };
      });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen]);

  // Bắt đầu kéo (Hỗ trợ cả Chuột và Cảm ứng Mobile/Tablet)
  const handleDragStart = (e) => {
    // Không kéo nếu người dùng nhấp vào nút đóng, icon thu nhỏ, input hoặc link
    if (
      e.target.closest("button") ||
      e.target.closest("input") ||
      e.target.closest("a")
    ) {
      return;
    }

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    isDraggingRef.current = true;
    hasMovedSignificantlyRef.current = false;
    dragStartPosRef.current = { x: clientX, y: clientY };
    elementStartPosRef.current = { ...position };

    const handleDragMove = (moveEvent) => {
      if (!isDraggingRef.current) return;

      const currentX = moveEvent.touches ? moveEvent.touches[0].clientX : moveEvent.clientX;
      const currentY = moveEvent.touches ? moveEvent.touches[0].clientY : moveEvent.clientY;

      const deltaX = currentX - dragStartPosRef.current.x;
      const deltaY = currentY - dragStartPosRef.current.y;

      if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
        hasMovedSignificantlyRef.current = true;
      }

      const width = isOpen ? 380 : 64;
      const height = isOpen ? (isMinimized ? 64 : 520) : 64;

      const newX = elementStartPosRef.current.x + deltaX;
      const newY = elementStartPosRef.current.y + deltaY;

      // Giới hạn trong viewport
      const clampedX = Math.max(12, Math.min(newX, window.innerWidth - width - 12));
      const clampedY = Math.max(12, Math.min(newY, window.innerHeight - height - 12));

      setPosition({ x: clampedX, y: clampedY });
    };

    const handleDragEnd = () => {
      isDraggingRef.current = false;
      window.removeEventListener("mousemove", handleDragMove);
      window.removeEventListener("mouseup", handleDragEnd);
      window.removeEventListener("touchmove", handleDragMove);
      window.removeEventListener("touchend", handleDragEnd);
    };

    window.addEventListener("mousemove", handleDragMove);
    window.addEventListener("mouseup", handleDragEnd);
    window.addEventListener("touchmove", handleDragMove, { passive: true });
    window.addEventListener("touchend", handleDragEnd);
  };

  // Toggle nút bong bóng (chỉ mở nếu người dùng không kéo)
  const handleBubbleClick = (e) => {
    e.stopPropagation();
    if (!hasMovedSignificantlyRef.current) {
      setIsOpen((prev) => !prev);
      setIsMinimized(false);
      setShowTooltip(false);
      // Khi mở ra, đảm bảo cửa sổ không bị tràn khỏi màn hình bên phải hoặc dưới
      setTimeout(() => {
        setPosition((pos) => {
          const width = 380;
          const height = 520;
          const safeX = Math.max(12, Math.min(pos.x, window.innerWidth - width - 12));
          const safeY = Math.max(12, Math.min(pos.y, window.innerHeight - height - 12));
          return { x: safeX, y: safeY };
        });
      }, 50);
    }
  };

  // Gửi tin nhắn
  const handleSendMessage = async (customText) => {
    const textToSend = typeof customText === "string" ? customText : inputText;
    if (!textToSend.trim() || isLoading) return;

    const userMsg = {
      id: "msg-" + ++messageIdRef.current,
      role: "user",
      content: textToSend.trim(),
    };

    const updatedHistory = [...messages, userMsg];
    setMessages(updatedHistory);
    setInputText("");
    setIsLoading(true);

    try {
      // Chuẩn bị lịch sử chuyển đổi cho API
      const historyPayload = messages
        .filter((m) => !m.id.startsWith("welcome"))
        .slice(-10)
        .map((m) => ({ role: m.role, content: m.content }));

      const res = await chatbotApi.sendMessage(userMsg.content, historyPayload);

      if (res?.data?.reply) {
        setMessages((prev) => [
          ...prev,
          {
            id: "bot-" + ++messageIdRef.current,
            role: "assistant",
            content: res.data.reply,
            recommendations: res.data.recommendations || [],
            mode: res.data.mode,
            notice: res.data.notice,
          },
        ]);
        if (res.data.suggestions?.length) {
          setSuggestions(res.data.suggestions);
        }
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: "bot-err-" + ++messageIdRef.current,
          role: "assistant",
          content:
            "Rất tiếc, đã có trục trặc nhỏ khi kết nối. Bạn có thể thử lại hoặc xem nhanh tại trang [Dịch vụ](/services) hoặc [Cơ sở](/businesses) nhé! 🐾",
        },
      ]);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleResetChat = () => {
    if (isLoading) return;
    setSuggestions(["Tìm dịch vụ tắm cho chó", "Tìm cơ sở theo khu vực", "Dịch vụ gửi mèo qua đêm", "Hướng dẫn đặt lịch"]);
    setMessages([
      {
        id: "welcome-" + ++messageIdRef.current,
        role: "assistant",
        content:
          "Chào mừng bạn quay lại! 🐾 Cuộc trò chuyện đã được làm mới. Bạn cần hỗ trợ thêm thông tin về dịch vụ hay cơ sở nào của PetCare ạ?",
      },
    ]);
  };

  const handleNavigate = (path) => {
    if (typeof path === "string" && /^\/(?:services|businesses(?:\/[a-f\d]{24})?|booking)(?:\?[^\s]*)?$/.test(path)) {
      navigate(path);
    }
  };

  return (
    <div
      ref={widgetRef}
      style={{
        position: "fixed",
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: 99999,
        touchAction: "none",
      }}
      className="select-none font-sans"
    >
      {/* 1. NÚT BONG BÓNG THU GỌN (BẤM ĐỂ MỞ HOẶC KÉO DI CHUYỂN) */}
      {!isOpen && (
        <div className="relative group">
          {/* Tooltip chào mừng */}
          {showTooltip && (
            <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap bg-emerald-900/95 backdrop-blur text-white px-3.5 py-2 rounded-2xl shadow-xl text-xs flex items-center gap-2 border border-emerald-700/50 animate-bounce">
              <Sparkles size={14} className="text-yellow-300 animate-spin" />
              <span>Cần tư vấn dịch vụ hay tìm cơ sở? Chat với AI!</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowTooltip(false);
                }}
                className="text-emerald-300 hover:text-white ml-1 p-0.5 rounded-full hover:bg-emerald-800"
              >
                <X size={12} />
              </button>
              {/* Mũi tên tooltip */}
              <div className="absolute left-full top-1/2 -translate-y-1/2 border-8 border-transparent border-l-emerald-900/95" />
            </div>
          )}

          {/* Nút bấm tròn chính */}
          <div
            onMouseDown={handleDragStart}
            onTouchStart={handleDragStart}
            onClick={handleBubbleClick}
            className="w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 text-white shadow-2xl flex items-center justify-center cursor-grab active:cursor-grabbing hover:scale-105 active:scale-95 transition-transform duration-200 border-2 border-white/80 relative"
            title="Nhấn để mở chat AI hoặc giữ chuột để kéo di chuyển"
          >
            {/* Hiệu ứng xung nhịp đang online */}
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white" />
            </span>

            <div className="relative flex items-center justify-center">
              <PawPrint className="w-8 h-8 text-white drop-shadow-md animate-pulse" />
              <Sparkles className="w-4 h-4 text-amber-300 absolute -top-1 -right-1 animate-spin" />
            </div>
          </div>
        </div>
      )}

      {/* 2. CỬA SỔ CHAT TOÀN DIỆN (KHI MỞ) */}
      {isOpen && (
        <div
          className={`w-[360px] sm:w-[380px] bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden flex flex-col transition-all duration-300 ${
            isMinimized ? "h-16" : "h-[530px]"
          }`}
          style={{ boxShadow: "0 20px 40px -15px rgba(16, 185, 129, 0.25), 0 0 25px rgba(0,0,0,0.12)" }}
        >
          {/* THANH TIÊU ĐỀ (HEADER) - KÉO ĐƯỢC TOÀN BỘ CỬA SỔ */}
          <div
            onMouseDown={handleDragStart}
            onTouchStart={handleDragStart}
            className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 px-4 py-3 text-white flex items-center justify-between cursor-grab active:cursor-grabbing select-none shadow-md"
            title="Giữ chuột tại đây để kéo di chuyển cửa sổ khắp màn hình"
          >
            <div className="flex items-center gap-2.5">
              <div className="relative w-10 h-10 rounded-2xl bg-white/15 backdrop-blur border border-white/20 flex items-center justify-center text-white shrink-0">
                <PawPrint size={22} className="text-white" />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-emerald-800" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-sm tracking-wide">PetCare AI</h3>
                  <span className="bg-emerald-500/40 text-emerald-100 text-[10px] px-1.5 py-0.5 rounded-full font-medium">
                    Trợ lý 24/7
                  </span>
                </div>
                <p className="text-[11px] text-emerald-100/90 flex items-center gap-1">
                  <GripHorizontal size={11} className="opacity-70" />
                  Kéo để di chuyển
                </p>
              </div>
            </div>

            {/* CÁC NÚT ĐIỀU KHIỂN CỬA SỔ */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleResetChat}
                disabled={isLoading}
                title="Xóa lịch sử và bắt đầu cuộc trò chuyện mới"
                className="p-1.5 text-emerald-100 hover:text-white hover:bg-white/15 rounded-xl transition-colors"
              >
                <RotateCcw size={15} />
              </button>
              <button
                type="button"
                onClick={() => setIsMinimized((prev) => !prev)}
                title={isMinimized ? "Mở rộng" : "Thu nhỏ"}
                className="p-1.5 text-emerald-100 hover:text-white hover:bg-white/15 rounded-xl transition-colors"
              >
                {isMinimized ? <ChevronDown size={17} className="rotate-180" /> : <Minimize2 size={15} />}
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="Đóng chat"
                className="p-1.5 text-emerald-100 hover:text-white hover:bg-red-500/80 rounded-xl transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* NỘI DUNG CUỘC TRÒ CHUYỆN (KHI KHÔNG BỊ THU NHỎ) */}
          {!isMinimized && (
            <>
              {/* THANH ĐIỀU HƯỚNG NHANH */}
              <div className="bg-emerald-50/70 border-b border-emerald-100/60 px-3 py-2 flex items-center justify-between text-xs">
                <span className="text-emerald-800 font-medium flex items-center gap-1">
                  <Sparkles size={13} className="text-emerald-600" />
                  Lối tắt nhanh:
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleNavigate("/booking")}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-colors shadow-xs"
                  >
                    <Calendar size={11} />
                    Đặt lịch
                  </button>
                  <button
                    type="button"
                    onClick={() => handleNavigate("/services")}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white border border-emerald-200 text-emerald-700 font-medium hover:bg-emerald-100 transition-colors"
                  >
                    <Scissors size={11} />
                    Dịch vụ
                  </button>
                  <button
                    type="button"
                    onClick={() => handleNavigate("/businesses")}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white border border-emerald-200 text-emerald-700 font-medium hover:bg-emerald-100 transition-colors"
                  >
                    <MapPin size={11} />
                    Cơ sở
                  </button>
                </div>
              </div>

              <p className="px-4 py-1 text-[10px] text-slate-500" role="status">
                {historySaved ? "Lưu 100 tin nhắn gần nhất trên trình duyệt này · Giá được kiểm tra lại khi đặt lịch" : "Trình duyệt không cho lưu lịch sử; tải lại trang sẽ mất cuộc trò chuyện"}
              </p>

              {/* DANH SÁCH TIN NHẮN */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-gradient-to-b from-slate-50/50 via-white to-slate-50/30">
                {messages.map((msg) => {
                  const isUser = msg.role === "user";
                  return (
                    <div
                      key={msg.id}
                      className={`flex gap-2.5 ${isUser ? "justify-end" : "justify-start"} items-end`}
                    >
                      {!isUser && (
                        <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200/80 mb-1">
                          <PawPrint size={14} />
                        </div>
                      )}

                      <div
                        className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 shadow-xs ${
                          isUser
                            ? "bg-emerald-600 text-white rounded-br-xs"
                            : "bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs"
                        }`}
                      >
                        {isUser ? (
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                        ) : (
                          <>
                            {msg.mode === "fallback" && <p className="mb-2 text-xs text-slate-500" role="status">{msg.notice || "Hướng dẫn tra cứu · AI tạm chưa khả dụng"}</p>}
                            <FormattedMessage text={msg.content} onNavigate={handleNavigate} />
                            {msg.recommendations?.map((offering) => (
                              <div key={offering.id} className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs space-y-1.5">
                                <p className="font-semibold text-emerald-950">{offering.serviceName}</p>
                                <p>{offering.branch.businessName} · {offering.branch.name}</p>
                                <p>{offering.branch.address || "Địa chỉ đang cập nhật"}</p>
                                <p className="font-semibold">{offering.price.toLocaleString("vi-VN")}đ/{offering.pricingUnit === "PER_DAY" ? "ngày" : "lần"}</p>
                                {offering.durationMinutes != null && <p>Thời lượng: {offering.durationMinutes} phút</p>}
                                <p>Nhận: {offering.petTypes.map(type => type === "DOG" ? "Chó" : "Mèo").join(", ") || "Cần xác nhận với cơ sở"}</p>
                                <div className="flex flex-wrap gap-3 pt-1">
                                  <button type="button" className="text-emerald-700 underline" onClick={() => handleNavigate(offering.branch.url)}>Xem cơ sở</button>
                                  <button type="button" className="text-emerald-700 underline" onClick={() => handleNavigate(offering.bookingUrl)}>Đặt lịch</button>
                                </div>
                              </div>
                            ))}
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* HIỆU ỨNG ĐANG SUY NGHĨ / SOẠN CÂU TRẢ LỜI */}
                {isLoading && (
                  <div className="flex gap-2.5 justify-start items-end">
                    <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200/80 mb-1">
                      <PawPrint size={14} />
                    </div>
                    <div className="bg-white border border-slate-200/80 rounded-2xl rounded-bl-xs px-3.5 py-2.5 shadow-xs flex items-center gap-1.5 text-xs text-slate-500">
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                      <span className="ml-1 text-[11px] text-slate-400">PetCare AI đang trả lời...</span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* KHU VỰC GỢI Ý NHANH (SUGGESTIONS) */}
              {suggestions.length > 0 && !isLoading && (
                <div className="px-3 py-2 bg-slate-50 border-t border-slate-100 flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                  {suggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSendMessage(suggestion)}
                      className="text-[11px] bg-white border border-emerald-200/90 text-emerald-800 hover:bg-emerald-50 hover:border-emerald-300 px-2.5 py-1 rounded-full transition-all text-left shadow-2xs hover:shadow-xs active:scale-95"
                    >
                      ✨ {suggestion}
                    </button>
                  ))}
                </div>
              )}

              {/* Ô NHẬP NỘI DUNG VÀ NÚT GỬI */}
              <div className="p-3 bg-white border-t border-slate-200">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    ref={inputRef}
                    type="text"
                    maxLength={1000}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Hỏi về dịch vụ, cơ sở, đặt lịch..."
                    disabled={isLoading}
                    className="flex-1 bg-slate-100 hover:bg-slate-50 focus:bg-white text-slate-800 placeholder-slate-400 text-sm px-3.5 py-2.5 rounded-2xl border border-transparent focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  />
                  <button
                    type="submit"
                    disabled={!inputText.trim() || isLoading}
                    className="w-10 h-10 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:hover:bg-emerald-600 text-white flex items-center justify-center transition-transform active:scale-90 shadow-md shrink-0"
                    title="Gửi câu hỏi"
                  >
                    <Send size={16} />
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
