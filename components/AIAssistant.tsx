'use client';

import { useState } from 'react';
import { X, Send, Phone, Search, Tag, MessageCircle } from 'lucide-react';
import { trackAIAssistantInteraction, trackPhoneClick, trackButtonClick } from '@/lib/analytics';

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
}

export default function AIAssistant({ isOpen, onClose, onOpen }: AIAssistantProps) {
  const [messages, setMessages] = useState([
    { type: 'bot', text: "Hi! I'm your flight assistant. Would you like help finding the best deal or booking your flight?" }
  ]);
  const [input, setInput] = useState('');

  const quickReplies = [
    { icon: Search, text: 'Search Flights', action: () => {
      trackAIAssistantInteraction('Quick Reply - Search Flights');
      window.location.href = '#home';
    }},
    { icon: Phone, text: 'Call Agent', action: () => {
      trackPhoneClick('888-602-6667');
      trackAIAssistantInteraction('Quick Reply - Call Agent');
      window.location.href = 'tel:888-602-6667';
    }},
    { icon: Tag, text: 'Show Offers', action: () => {
      trackAIAssistantInteraction('Quick Reply - Show Offers');
      window.location.href = '#offers';
    }}
  ];

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    trackAIAssistantInteraction('Message Sent');

    const newMessages = [...messages, { type: 'user', text: userMessage }];
    setMessages(newMessages);
    setInput('');

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/chat-assistant`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ messages: newMessages }),
        }
      );

      const data = await response.json();

      setMessages(prev => [...prev, {
        type: 'bot',
        text: data.response || "I'm here to help! For immediate assistance, call 888-602-6667."
      }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        type: 'bot',
        text: "I'm having trouble connecting right now. Please call our team at 888-602-6667 for immediate assistance!"
      }]);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => {
          trackAIAssistantInteraction('Assistant Opened');
          onOpen();
        }}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full shadow-2xl z-[9999] flex items-center justify-center hover:scale-110 transition-transform duration-200 animate-bounce"
      >
        <MessageCircle className="w-8 h-8" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 max-w-[calc(100vw-3rem)] bg-white rounded-2xl shadow-2xl z-[9999] flex flex-col max-h-[600px]">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-2xl flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden bg-white">
            <img src="/ai-assistant-logo.png" alt="LST Logo" className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="font-bold">Flight Assistant</div>
            <div className="text-xs text-blue-100">Online now</div>
          </div>
        </div>
        <button onClick={onClose} className="hover:bg-white/20 p-2 rounded-lg transition">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                msg.type === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-gray-100 text-gray-800 rounded-bl-none'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {messages.length === 1 && (
          <div className="space-y-2">
            {quickReplies.map((reply, idx) => (
              <button
                key={idx}
                onClick={reply.action}
                className="w-full flex items-center gap-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition text-left"
              >
                <reply.icon className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-gray-800">{reply.text}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
          />
          <button
            onClick={handleSend}
            className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <div className="text-xs text-gray-500 mt-2 text-center">
          Powered by LST • Available 24/7
        </div>
      </div>
    </div>
  );
}
