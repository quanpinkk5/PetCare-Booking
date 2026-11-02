import { useAuth } from "../../../../context/AuthContext";
import ConversationList from "../../components/message/ConversationList";
import ChatWindow from "../../components/message/ChatWindow";
import { useOwnerMessages } from "../../services/useOwnerMessages";

function OwnerMessages({ ownerId, isAuthLoading }) {
    const { chats, selected, messages, loading, loadingMessages, sending, error, selectChat, sendMessage, toggleImportant } = useOwnerMessages(ownerId);
    return (
        <div className="flex flex-col gap-4 h-[calc(100vh-6.5rem)] min-h-[620px] overflow-hidden text-xs text-slate-800 antialiased">
            {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-red-700">{error}</p>}
            <div className="grid flex-1 min-h-0 grid-cols-10 gap-4">
                <ConversationList chats={chats} loading={loading || isAuthLoading}
                    selectedId={selected?.id} onSelectChat={selectChat} />
                <ChatWindow key={selected?.id || "empty"} customer={selected?.customer}
                    messages={messages} loading={loadingMessages} sending={sending}
                    important={selected?.important} onToggleImportant={toggleImportant} onSendMessage={sendMessage} />
            </div>
        </div>
    );
}

export default function MessagesPage() {
    const { user, isAuthLoading } = useAuth();
    const ownerId = String(user?._id || user?.id || "");
    return <OwnerMessages key={ownerId} ownerId={ownerId} isAuthLoading={isAuthLoading} />;
}
