import React, { useState,useEffect,useCallback } from 'react';
import axios from 'axios';
import './styles.css';

const ChatApp = () => {
  const [idInstance, setIdInstance] = useState('');
  const [apiTokenInstance, setApiTokenInstance] = useState('');
  const [recipientNumber, setRecipientNumber] = useState('');
  const [messageText, setMessageText] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  const handleSendMessage = () => {
    let data = JSON.stringify({
      "chatId": recipientNumber + "@c.us",
      "message": messageText
    });

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `https://api.green-api.com/waInstance${idInstance}/sendMessage/${apiTokenInstance}`,
      headers: {
        'Content-Type': 'application/json'
      },
      data: data
    };

    axios.request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        setChatHistory(prevChatHistory => [...prevChatHistory, { sender: 'user', text: messageText }]);
      })
      .catch((error) => {
        console.log(error);
      },);
  }

 
  const receiveNotification = useCallback(() => {
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `https://api.green-api.com/waInstance${idInstance}/lastIncomingMessages/${apiTokenInstance}`,
      headers: {},
    };
  
    axios.request(config)
      .then((response) => {
        console.log('API response:', response.data);
        if (response.data.messages && response.data.messages.length > 0) {
          const newMessages = response.data.messages.map(message => ({ sender: 'recipient', text: message.textMessage }));
          setChatHistory(prevChatHistory => [...prevChatHistory, ...newMessages]);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, [idInstance, apiTokenInstance]);
  

useEffect(() => {
  const interval = setInterval(() => {
    receiveNotification();
  }, 3000);
  return () => clearInterval(interval);
}, [receiveNotification]);
  return (
  
      <div className="chat-app">
      <div className="chat-header">
        <h2>WhatsApp Chat</h2>
      </div>
      <div className="chat-history">
        <ul>
          {chatHistory.map((message, index) => (
            <li
              key={index}
              className={
                message.sender === 'user'
                  ? 'chat-message user-message'
                  : 'chat-message recipient-message'
              }
            >
              <span className="message-sender">{message.sender}</span>
              <span className="message-text">{message.text}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="chat-form">
        <input
          type="text"
          placeholder="Recipient Number"
          value={recipientNumber}
          onChange={(e) => setRecipientNumber(e.target.value)}
        />
        <input
          type="text"
          placeholder="Id Instance"
          value={idInstance}
          onChange={(e) => setIdInstance(e.target.value)}
        />
        <input
          type="text"
          placeholder="API Token Instance"
          value={apiTokenInstance}
          onChange={(e) => setApiTokenInstance(e.target.value)}
        />
        <textarea
          placeholder="Message Text"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
        />
        <button onClick={handleSendMessage}  >Send Message</button>
      </div>
    </div>
  );
};

export default ChatApp;
























