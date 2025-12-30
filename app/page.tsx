"use client";

import { useState, useEffect, useRef } from "react";
import { FiSend, FiMic } from "react-icons/fi";
import Head from "next/head";
import { motion } from "framer-motion";

export default function Home() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    setIsTyping(true);
    // Simulate a delay of 1-2 seconds
    await new Promise((resolve) => setTimeout(resolve, Math.random() * 1000 + 1000));

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ request: input }),
      });
      const data = await res.json();
      const botMessage = { sender: "bot", text: data.response };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      <Head>
        <title>Cô Thư Ký</title>
      </Head>
      <div className="flex items-center justify-center min-h-screen bg-white font-sans">
        <div className="w-full max-w-md h-[90vh] bg-[rgb(84,75,204)] rounded-3xl shadow-lg flex flex-col overflow-hidden">
          <header className="bg-[rgb(84,75,204)] text-white p-4 text-center font-bold">
            Chat
          </header>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`p-3 rounded-lg max-w-xs ${
                    msg.sender === "user"
                      ? "bg-white text-[rgb(114,104,216)] shadow-md"
                      : "bg-[rgb(114,104,216)] text-white"
                  }`}
                >
                  {msg.text}
                </div>
              </motion.div>
            ))}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex justify-start"
              >
                <div className="p-3 rounded-lg max-w-xs bg-[rgb(114,104,216)] text-white">
                  <div className="flex items-center space-x-2">
                    <span className="dot bg-white"></span>
                    <span className="dot bg-white"></span>
                    <span className="dot bg-white"></span>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <form
            onSubmit={handleSend}
            className="bg-gray-100 p-4 flex items-center space-x-3 border-t"
          >
            <button type="button" className="text-gray-500">
              <FiMic size={24} />
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 p-3 rounded-full border focus:outline-none focus:ring-2 focus:ring-[rgb(84,75,204)]"
            />
            <button
              type="submit"
              className="bg-[rgb(84,75,204)] text-white p-3 rounded-full"
            >
              <FiSend size={20} />
            </button>
          </form>
        </div>
      </div>

      <style jsx>{`
        .dot {
          width: 8px;
          height: 8px;
          background-color: white; /* Changed from blue to white */
          border-radius: 50%;
          animation: blink 1.5s infinite;
        }
        .dot:nth-child(2) {
          animation-delay: 0.2s;
        }
        .dot:nth-child(3) {
          animation-delay: 0.4s;
        }
        @keyframes blink {
          0%,
          80%,
          100% {
            opacity: 0;
          }
          40% {
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}
