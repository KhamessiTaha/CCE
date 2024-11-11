// Chat.js
import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import './Chat.css';

const Chat = ({ roomId }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const { currentUser } = useAuth();

  useEffect(() => {
    const messagesRef = collection(db, 'rooms', roomId, 'messages');
    const unsubscribe = onSnapshot(messagesRef, (snapshot) => {
      const newMessages = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMessages(newMessages.sort((a, b) => a.timestamp - b.timestamp));
    });

    return () => unsubscribe();
  }, [roomId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (input.trim() === '') return;

    const messagesRef = collection(db, 'rooms', roomId, 'messages');

    try {
      await addDoc(messagesRef, {
        text: input,
        user: currentUser ? currentUser.email : `Guest_${Date.now()}`,
        timestamp: serverTimestamp(),
      });
      setInput('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {messages.map((message) => (
          <div key={message.id} className="chat-message">
            <strong className="chat-user">{message.user}:</strong>
            <span className="chat-text">{message.text}</span>
          </div>
        ))}
      </div>
      <form onSubmit={handleSendMessage} className="chat-form">
        <input
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="chat-input"
        />
        <button type="submit" className="chat-send-button">Send</button>
      </form>
    </div>
  );
};

export default Chat;
