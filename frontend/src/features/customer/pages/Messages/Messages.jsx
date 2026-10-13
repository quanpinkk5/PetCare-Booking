import { useState, useMemo } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import HeroBanner from "../../components/Messages/HeroBanner";
import ChatSidebar from "../../components/Messages/ChatSidebar";
import ChatWindow from "../../components/Messages/ChatWindow";
import RightInfoPanel from "../../components/Messages/RightInfoPanel";
import { CHAT_LIST, INITIAL_MESSAGES } from "../../data/messagesData";

const Messages = () => {
  const { id: paramId } = useParams();
  const [searchParams] = useSearchParams();
  const queryId = searchParams.get("id");

  // Khởi tạo chatId từ params / query / mặc định là id đầu tiên
  const initialChatId = useMemo(() => {
    const targetId = Number(paramId || queryId);
    if (targetId && CHAT_LIST.some((c) => c.id === targetId)) {
      return targetId;
    }
    return CHAT_LIST[0]?.id || 1;
  }, [paramId, queryId]);

  const [selectedChatId, setSelectedChatId] = useState(initialChatId);
  const [allMessages, setAllMessages] = useState(INITIAL_MESSAGES);

  const selectedChat = useMemo(() => {
    return CHAT_LIST.find((c) => c.id === selectedChatId) || CHAT_LIST[0];
  }, [selectedChatId]);

  const currentMessages = allMessages[selectedChatId] || [];

  const handleSendMessage = (text) => {
    if (!text.trim()) return;

    const now = new Date();
    const timeString = `${now.getHours().toString().padStart(2, "0")}:${now
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;

    const newUserMessage = {
      id: Date.now(),
      sender: "user",
      text: text.trim(),
      time: timeString,
      isRead: false,
    };

    setAllMessages((prev) => ({
      ...prev,
      [selectedChatId]: [...(prev[selectedChatId] || []), newUserMessage],
    }));

    // Phản hồi tự động sau 1.2s tạo trải nghiệm thực tế
    setTimeout(() => {
      setAllMessages((prev) => {
        const currentList = prev[selectedChatId] || [];
        // Cập nhật tin của user thành isRead: true
        const updatedList = currentList.map((m) =>
          m.id === newUserMessage.id ? { ...m, isRead: true } : m
        );

        const replyTime = new Date();
        const replyTimeString = `${replyTime
          .getHours()
          .toString()
          .padStart(2, "0")}:${replyTime
          .getMinutes()
          .toString()
          .padStart(2, "0")}`;

        const autoReply = {
          id: Date.now() + 1,
          sender: "business",
          avatar: selectedChat?.avatarText || "HP",
          text: `Cảm ơn bạn đã nhắn tin cho ${
            selectedChat?.name || "cơ sở"
          }. Chuyên viên phụ trách đang xử lý và sẽ phản hồi chi tiết tới bạn ngay ạ!`,
          time: replyTimeString,
          isRead: true,
        };

        return {
          ...prev,
          [selectedChatId]: [...updatedList, autoReply],
        };
      });
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-10 text-slate-800 antialiased">
      {/* Banner đầu trang */}
      <HeroBanner />

      {/* Vùng chat chính */}
      <main className="mx-auto max-w-[1440px] px-4 pt-6 sm:px-6">
        <div className="grid grid-cols-12 gap-5 items-start">
          {/* Cột 1: Danh sách cuộc trò chuyện */}
          <ChatSidebar
            selectedChatId={selectedChatId}
            onSelectChat={(chat) => setSelectedChatId(chat.id)}
          />

          {/* Cột 2: Cửa sổ nhắn tin */}
          <ChatWindow
            chat={selectedChat}
            messages={currentMessages}
            onSendMessage={handleSendMessage}
          />

          {/* Cột 3: Bảng thông tin chi tiết dịch vụ & thú cưng */}
          <RightInfoPanel chat={selectedChat} />
        </div>
      </main>
    </div>
  );
};

export default Messages;
