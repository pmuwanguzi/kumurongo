"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";

interface Message {
  id: string;
  content: string;
  senderId: string;
  createdAt: string;
  sender: { id: string; name: string | null };
}

interface ChatUser {
  id: string;
  name: string | null;
}

export default function ChatPage() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();

  const providerId = searchParams.get("providerId");
  const serviceId = searchParams.get("serviceId");

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [chatUser, setChatUser] = useState<ChatUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // The other user's ID
  const otherUserId = providerId || null;

  // Generate chat room ID
  const chatRoomId =
    session && otherUserId
      ? [session.user.id, otherUserId].sort().join("_")
      : null;

  // Fetch other user's info
  useEffect(() => {
    if (!otherUserId) return;
    fetch(`/api/users/${otherUserId}`)
      .then((res) => res.json())
      .then((data) => setChatUser(data))
      .catch(console.error);
  }, [otherUserId]);

  // Fetch messages
  const fetchMessages = async () => {
    if (!chatRoomId) return;
    try {
      const response = await fetch(
        `/api/messages?chatRoomId=${chatRoomId}`
      );
      const data = await response.json();
      if (Array.isArray(data)) {
        setMessages(data);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch and polling every 3 seconds
  useEffect(() => {
    if (!chatRoomId) return;
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [chatRoomId]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim() || !otherUserId || isSending) return;

    setIsSending(true);
    const tempMessage = newMessage;
    setNewMessage("");

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          receiverId: otherUserId,
          content: tempMessage,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessages((prev) => [...prev, data]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setNewMessage(tempMessage);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!session) {
    return (
      <div className="container py-5 text-center">
        <p>Please log in to use chat.</p>
      </div>
    );
  }

  if (!otherUserId) {
    return (
      <div className="container py-5 text-center">
        <div style={{ fontSize: "4rem" }}>💬</div>
        <h4 className="mt-3">No conversation selected</h4>
        <p className="text-muted">
          Go to a service page and click Chat with Provider to start a
          conversation.
        </p>
        <button
          className="btn btn-primary"
          onClick={() => router.push("/services")}
        >
          Browse Services
        </button>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div
            className="card border-0 shadow-sm"
            style={{ height: "80vh", display: "flex", flexDirection: "column" }}
          >

            {/* Chat Header */}
            <div className="card-header bg-primary text-white p-3">
              <div className="d-flex align-items-center">
                <div
                  className="bg-white text-primary rounded-circle d-flex align-items-center justify-content-center me-3"
                  style={{ width: 40, height: 40, fontWeight: "bold" }}
                >
                  {chatUser?.name?.charAt(0).toUpperCase() || "?"}
                </div>
                <div>
                  <div className="fw-bold">
                    {chatUser?.name || "Loading..."}
                  </div>
                  <small className="opacity-75">
                    {serviceId ? "Re: Service Inquiry" : "Direct Message"}
                  </small>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div
              className="flex-grow-1 p-3 overflow-auto"
              style={{ backgroundColor: "#f8f9fa" }}
            >
              {isLoading ? (
                <div className="text-center py-5 text-muted">
                  <div className="spinner-border spinner-border-sm" />
                  <p className="mt-2 small">Loading messages...</p>
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center py-5 text-muted">
                  <div style={{ fontSize: "3rem" }}>👋</div>
                  <p className="mt-2">
                    Start the conversation with {chatUser?.name}
                  </p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isMine = msg.senderId === session.user.id;
                  return (
                    <div
                      key={msg.id}
                      className={`d-flex mb-3 ${
                        isMine ? "justify-content-end" : "justify-content-start"
                      }`}
                    >
                      <div>
                        {!isMine && (
                          <small className="text-muted ms-1 d-block mb-1">
                            {msg.sender.name}
                          </small>
                        )}
                        <div
                          className={
                            isMine
                              ? "chat-bubble-sent"
                              : "chat-bubble-received"
                          }
                        >
                          {msg.content}
                        </div>
                        <small
                          className={`text-muted d-block mt-1 ${
                            isMine ? "text-end" : ""
                          }`}
                          style={{ fontSize: "0.7rem" }}
                        >
                          {new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </small>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="card-footer bg-white p-3">
              <div className="d-flex gap-2">
                <textarea
                  className="form-control"
                  rows={2}
                  placeholder="Type a message... (Enter to send)"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  style={{ resize: "none" }}
                />
                <button
                  className="btn btn-primary px-4"
                  onClick={handleSend}
                  disabled={isSending || !newMessage.trim()}
                >
                  {isSending ? (
                    <span className="spinner-border spinner-border-sm" />
                  ) : (
                    "Send"
                  )}
                </button>
              </div>
              <small className="text-muted">
                Press Enter to send, Shift+Enter for new line
              </small>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}