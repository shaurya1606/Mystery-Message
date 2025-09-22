'use client'

import React, { useState } from 'react';

const suggestedMessages = [
  "What's your favorite movie?",
  "Do you have any pets?",
  "What's your dream job?"
];

export default function PublicProfilePage({ params }: { params: { username: string } }) {
  const [message, setMessage] = useState('');
  const [selectedMessage, setSelectedMessage] = useState('');
  const [messages, setMessages] = useState(suggestedMessages);

  const handleSend = () => {
    // Handle sending message logic here
    setMessage('');
    setSelectedMessage('');
  };

  const handleSuggest = () => {
    // Optionally shuffle or add more suggestions
    setMessages([...suggestedMessages]);
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Public Profile Link</h1>
      <div className="mb-6">
        <label className="block font-semibold mb-2">
          Send Anonymous Message to @{params.username}
        </label>
        <textarea
          className="w-full border rounded p-2 mb-4"
          rows={2}
          value={selectedMessage || message}
          onChange={e => {
            setMessage(e.target.value);
            setSelectedMessage('');
          }}
          placeholder="Type your message here..."
        />
        <div className="flex gap-4">
          <button
            className="bg-gray-900 text-white px-6 py-2 rounded"
            onClick={handleSend}
          >
            Send It
          </button>
          <button
            className="bg-gray-900 text-white px-6 py-2 rounded"
            onClick={handleSuggest}
          >
            Suggest Messages
          </button>
        </div>
      </div>
      <div className="mb-4 font-medium">Click on any message below to select it.</div>
      <div className="bg-white rounded shadow p-4">
        <h2 className="text-xl font-semibold mb-2">Messages</h2>
        <ul>
          {messages.map((msg, idx) => (
            <li
              key={idx}
              className="border-b py-2 cursor-pointer hover:bg-gray-100"
              onClick={() => {
                setSelectedMessage(msg);
                setMessage('');
              }}
            >
              {msg}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}