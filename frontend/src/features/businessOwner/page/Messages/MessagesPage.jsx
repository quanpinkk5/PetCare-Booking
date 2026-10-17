import React, { useState } from "react";
import ConversationList from "../../components/message/ConversationList";
import ChatWindow from "../../components/message/ChatWindow";
import { CONVERSATIONS_DATA, CUSTOMER_DETAILS, INITIAL_MESSAGES } from "../../data/messageData";

export default function MessagesPage() {
    const [selectedChatId, setSelectedChatId] = useState(1);
    const [allConversations, setAllConversations] = useState(CONVERSATIONS_DATA);

    const currentChat = allConversations[selectedChatId] || {
        customer: CUSTOMER_DETAILS,
        messages: INITIAL_MESSAGES,
    };

    const handleSendMessage = (newMsg) => {
        setAllConversations((prev) => {
            const existing = prev[selectedChatId] || {
                customer: CUSTOMER_DETAILS,
                messages: INITIAL_MESSAGES,
            };

            return {
                ...prev,
                [selectedChatId]: {
                    ...existing,
                    messages: [...existing.messages, newMsg],
                },
            };
        });
    };

    return (
        <div className="flex flex-col gap-4 h-[calc(100vh-6.5rem)] min-h-[620px] overflow-hidden text-xs text-slate-800 antialiased">


            <div className="grid flex-1 min-h-0 grid-cols-10 gap-4">
                <ConversationList
                    selectedId={selectedChatId}
                    onSelectChat={setSelectedChatId}
                />
                <ChatWindow
                    customer={currentChat.customer}
                    messages={currentChat.messages}
                    onSendMessage={handleSendMessage}
                />
                {/* <ChatDetailsPanel
                    customer={currentChat.customer}
                /> */}
            </div>
        </div>
    );
}