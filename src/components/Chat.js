import React, { useState, useEffect, useRef, useCallback } from "react";
import { db } from "../firebaseConfig";
import {
  collection,
  onSnapshot,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";
import "./Chat.css";

const Chat = ({ roomId, logActivity }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [newMessageNotification, setNewMessageNotification] = useState(null);
  const { currentUser } = useAuth();
  const chatMessagesRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom when messages change
  const scrollToBottom = useCallback((behavior = "smooth") => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTo({
        top: chatMessagesRef.current.scrollHeight,
        behavior: behavior,
      });
    }
  }, []);

  // Show notification for new messages when not at bottom
  const handleScroll = useCallback(() => {
    if (chatMessagesRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatMessagesRef.current;
      const isNearBottom = scrollHeight - (scrollTop + clientHeight) < 100;

      if (!isNearBottom && messages.length > 0) {
        const lastMessage = messages[messages.length - 1];
        if (
          lastMessage.user !==
          (currentUser
            ? currentUser.email
            : `Guest_${localStorage
                .getItem(`room_${roomId}_guestId`)
                ?.slice(-4)}`)
        ) {
          setNewMessageNotification("New message");
        }
      }
    }
  }, [messages, currentUser, roomId]);

  useEffect(() => {
    const messagesRef = collection(db, "rooms", roomId, "messages");
    const q = query(messagesRef, orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate()?.getTime() || Date.now(),
      }));

      setMessages(newMessages);

      // Check if we should auto-scroll
      if (chatMessagesRef.current) {
        const { scrollTop, scrollHeight, clientHeight } =
          chatMessagesRef.current;
        const isNearBottom = scrollHeight - (scrollTop + clientHeight) < 100;

        if (isNearBottom) {
          scrollToBottom("auto");
        }
      }
    });

    return () => unsubscribe();
  }, [roomId, scrollToBottom]);

  // Set up scroll listener
  useEffect(() => {
    const messagesContainer = chatMessagesRef.current;
    if (messagesContainer) {
      messagesContainer.addEventListener("scroll", handleScroll);
      return () =>
        messagesContainer.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll]);

  // Auto-focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Handle typing indicator
  useEffect(() => {
    let timer;
    if (input.trim()) {
      setIsTyping(true);
      timer = setTimeout(() => setIsTyping(false), 2000);
    } else {
      setIsTyping(false);
    }
    return () => clearTimeout(timer);
  }, [input]);

  // Handle notification timeout
  useEffect(() => {
    let timer;
    if (newMessageNotification) {
      timer = setTimeout(() => {
        setNewMessageNotification(null);
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [newMessageNotification]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const trimmedInput = input.trim();
    if (trimmedInput === "") return;

    const messagesRef = collection(db, "rooms", roomId, "messages");
    const user = currentUser
      ? currentUser.email
      : `Guest_${localStorage.getItem(`room_${roomId}_guestId`)?.slice(-4)}`;

    try {
      await addDoc(messagesRef, {
        text: trimmedInput,
        user,
        timestamp: serverTimestamp(),
      });
      setInput("");
      logActivity("sent a message");
      scrollToBottom();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const handleNotificationClick = () => {
    scrollToBottom();
    setNewMessageNotification(null);
  };

  return (
    <div className="chat-container">
      <div className="chat-messages" ref={chatMessagesRef}>
        {messages.map((message) => (
          <div
            key={message.id}
            className={`chat-message ${
              message.user === "System" ? "system-message" : ""
            }`}
          >
            <div className="message-header">
              <strong className="chat-user">{message.user}</strong>
              <span className="message-time">
                {message.timestamp
                  ? new Date(message.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "Just now"}
              </span>
            </div>
            <span className="chat-text">{message.text}</span>
          </div>
        ))}
        {isTyping && (
          <div className="typing-indicator">
            <span>Someone is typing...</span>
            <div className="typing-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSendMessage} className="chat-form">
        <textarea
          ref={inputRef}
          className="chat-input"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
        />
        <button
          type="submit"
          className="chat-send-button"
          disabled={input.trim() === ""}
        >
          Send
        </button>
      </form>

      {newMessageNotification && (
        <div
          className={`notification-badge ${
            !newMessageNotification ? "hide" : ""
          }`}
          onClick={handleNotificationClick}
        >
          <span>↓</span>
          {newMessageNotification}
        </div>
      )}
    </div>
  );
};

export default Chat;
