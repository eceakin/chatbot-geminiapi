import React, { use, useEffect, useRef, useState } from "react";
import ChatbotIcon from "./components/ChatbotIcon"
import ChatForm from "./components/ChatForm"
import ChatMessage from "./components/ChatMessage";
import { companyInfo } from "./companyInfo";

const App = () => {
  const [chatHistory , setChatHistory] = useState([
    {
      hideInchat: true,
      role: "model",
      text: companyInfo
    }
  ]);

  const chatBodyRef = useRef();

  const generateBotResponse = async (history) => {
    
    const updateHistory = (text,isError=false) => {
      setChatHistory((prev) => [
        ...prev.filter(msg => msg.text !== "Thinking..."),
        { role: "model", text , isError }
      ]);
    }

    history = history.map(({ role, text }) => ({role,parts: [{text}]}));


    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        
      },
      body: JSON.stringify({
        contents: history
      })
    };
    try {
      //make api call to get the bot response
      const response = await fetch(import.meta.env.VITE_API_URL, requestOptions);
      const data = await response.json();
      if(!response.ok) throw new Error(data.error.message || "Failed to fetch response");
      

      //clean and update the chat history with the bot response
      const apiResponseText = data.candidates[0].content
      .parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim();
      updateHistory(apiResponseText);


  }
  catch (error) {
     updateHistory(error.message, true);
  }} 
  useEffect(() => {
    chatBodyRef.current.scrollTo({ top: chatBodyRef.current.scrollHeight, behavior: "smooth" });
  }, [chatHistory]);


  return (
    <div className="container">
      <div className="chatbot-popup">
        <div className="chat-header">
          <div className="header-info">
            <ChatbotIcon />


            <h2 className="logo-text">Chatbot</h2>
          </div>
          <button className="material-symbols-rounded">
            keyboard_arrow_down
          </button>


        </div>

        <div ref={chatBodyRef} className="chat-body">
          <div className="message bot-message">
            <ChatbotIcon />
            <p className="message-text">
              Hello! <br />
              How can I assist you today?
            </p>
          </div>
       
          {chatHistory.map((chat, index) => (
            <ChatMessage key = {index} chat = {chat} />
          ))}
         
        </div>
        <div className="chat-footer">
         <ChatForm chatHistory={chatHistory} 
         setChatHistory= {setChatHistory} 
         generateBotResponse = {generateBotResponse}/>
        </div>
      </div>
    </div>
    )
}

export default App
