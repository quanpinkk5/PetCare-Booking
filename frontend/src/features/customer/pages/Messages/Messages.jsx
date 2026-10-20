import { useParams, useSearchParams } from "react-router-dom";
import { useAuth } from "../../../../context/AuthContext";
import HeroBanner from "../../components/Messages/HeroBanner";
import ChatSidebar from "../../components/Messages/ChatSidebar";
import ChatWindow from "../../components/Messages/ChatWindow";
import RightInfoPanel from "../../components/Messages/RightInfoPanel";
import { useCustomerMessages } from "../../services/useCustomerMessages";

const CustomerMessages = ({ customerId, targetId, businessId, isAuthLoading }) => {
  const { chats, selectedChat, messages, loading, loadingMessages, sending, error, selectChat, sendMessage } = useCustomerMessages(customerId, targetId, businessId);
  return (
    <div className="min-h-screen bg-slate-50 pb-10 text-slate-800 antialiased">
      <HeroBanner />
      <main className="mx-auto max-w-[1440px] px-4 pt-6 sm:px-6">
        {!customerId && <p role="status" className="mb-4 text-sm text-slate-500">{isAuthLoading ? 'Đang tải phiên đăng nhập...' : 'Vui lòng đăng nhập để xem và gửi tin nhắn.'}</p>}
        {error && <p role="alert" className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <div className="grid grid-cols-12 gap-5 items-start">
          <ChatSidebar chats={chats} loading={customerId ? loading : isAuthLoading} selectedChatId={selectedChat?.id} onSelectChat={selectChat} />
          <ChatWindow key={selectedChat?.id || 'empty'} chat={selectedChat} messages={messages} loading={loadingMessages} sending={sending} onSendMessage={sendMessage} />
          <RightInfoPanel chat={selectedChat} />
        </div>
      </main>
    </div>
  );
};

const Messages = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { user, isAuthLoading } = useAuth();
  const targetId = id || searchParams.get('id');
  const businessId = searchParams.get('businessId');
  const customerId = String(user?._id || user?.id || '');
  return <CustomerMessages key={`${customerId}:${targetId || ''}:${businessId || ''}`} customerId={customerId} targetId={targetId} businessId={businessId} isAuthLoading={isAuthLoading} />;
};

export default Messages;
