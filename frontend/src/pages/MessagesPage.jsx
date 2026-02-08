import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useMessageStore } from "../store/useMessageStore";
import { useAuthStore } from "../store/useAuthStore";
import { MessageCircleIcon, SendIcon } from "lucide-react";
import axios from "axios";

const BASE_URL = "http://localhost:1515";

function MessagesPage() {
  const [searchParams] = useSearchParams();
  const toUserId = searchParams.get("to");
  const { user } = useAuthStore();
  const { conversations, messages, fetchConversations, fetchMessages, sendMessage } =
    useMessageStore();
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [inputText, setInputText] = useState("");

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  useEffect(() => {
    if (toUserId) {
      axios.get(`${BASE_URL}/api/users/${toUserId}`).then((res) => {
        setSelectedPartner({ id: res.data.data.id, email: res.data.data.email });
        fetchMessages(toUserId);
      }).catch(() => {
        setSelectedPartner({ id: parseInt(toUserId), email: "User" });
        fetchMessages(toUserId);
      });
    }
  }, [toUserId, fetchMessages]);

  useEffect(() => {
    if (selectedPartner) {
      fetchMessages(selectedPartner.id);
    }
  }, [selectedPartner?.id, fetchMessages]);

  const handleSelectConversation = (conv) => {
    setSelectedPartner(conv.partner);
    fetchMessages(conv.partner.id);
  };

  const handleSend = async () => {
    if (!inputText.trim() || !selectedPartner) return;
    await sendMessage(selectedPartner.id, inputText.trim());
    setInputText("");
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p>Please sign in to view messages</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <MessageCircleIcon className="size-8" />
        Messages
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-base-100 rounded-lg shadow overflow-hidden">
          <div className="p-3 border-b font-semibold">Conversations</div>
          <div className="max-h-96 overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="p-4 text-sm text-base-content/70">No conversations</div>
            ) : (
              conversations.map((conv) => (
                <button
                  key={conv.id}
                  className={`w-full text-left p-4 hover:bg-base-200 transition-colors ${
                    selectedPartner?.id === conv.partner.id ? "bg-base-200" : ""
                  }`}
                  onClick={() => handleSelectConversation(conv)}
                >
                  <div className="font-medium">{conv.partner.email}</div>
                  <div className="text-xs text-base-content/60 truncate">
                    {conv.lastMessage}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        <div className="md:col-span-2 bg-base-100 rounded-lg shadow flex flex-col min-h-[400px]">
          {selectedPartner ? (
            <>
              <div className="p-3 border-b font-semibold">
                {selectedPartner.email}
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-64">
                {messages.map((msg) => {
                  const isMe = msg.senderId === user.id;
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg px-4 py-2 ${
                          isMe ? "bg-primary text-primary-content" : "bg-base-200"
                        }`}
                      >
                        <p className="text-sm">{msg.text}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="p-4 border-t flex gap-2">
                <input
                  type="text"
                  className="input input-bordered flex-1"
                  placeholder="Type a message..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />
                <button
                  className="btn btn-primary"
                  onClick={handleSend}
                  disabled={!inputText.trim()}
                >
                  <SendIcon className="size-5" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-base-content/60">
              Select a conversation or start a new chat from a seller&apos;s profile
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MessagesPage;
