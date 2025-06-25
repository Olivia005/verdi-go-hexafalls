import React, { useState } from 'react';
import { MessageCircle, X, Send, Leaf, Sparkles } from 'lucide-react';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: '1',
      message: "🌱 Hi there! I'm EcoBot, your intelligent green assistant. I'm here to help you discover how VerdiGo can transform your lifestyle into a more sustainable one. What would you like to know about our eco-features?",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      const userMessage = {
        id: Date.now().toString(),
        message: inputMessage,
        isBot: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, userMessage]);
      setInputMessage('');
      setIsTyping(true);

      // Simulate bot response
      setTimeout(() => {
        const botResponse = {
          id: (Date.now() + 1).toString(),
          message: getBotResponse(inputMessage),
          isBot: true,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botResponse]);
        setIsTyping(false);
      }, 1500);
    }
  };

  const getBotResponse = (message) => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('green lane')) {
      return "🛣️ Green Lane is our revolutionary eco-smart navigation system! It analyzes traffic patterns, vehicle emissions, and route efficiency to suggest the most sustainable paths. You'll get real-time carbon footprint tracking, alternative transport suggestions, and even find eco-friendly stops along your route. It's like having a personal environmental consultant for every journey!";
    } else if (lowerMessage.includes('local harvest')) {
      return "🌾 Local Harvest connects you directly with local farmers and sustainable food producers! Through our interactive map, you can discover seasonal produce, schedule direct pickups, and even get community recipes. It's farm-to-table made simple, supporting your local economy while ensuring the freshest, most nutritious food for your family.";
    } else if (lowerMessage.includes('air buddy')) {
      return "💨 Air Buddy is your personal air quality guardian! It provides hyper-local air quality monitoring with real-time AQI alerts, personalized outdoor activity recommendations, and even tracks pollen levels. Plus, we give you indoor air quality tips and suggest the best plants to purify your home environment.";
    } else if (lowerMessage.includes('wasteless')) {
      return "♻️ WasteLess transforms how you think about waste! Our intelligent tracking system categorizes your waste, provides recycling guidance, and connects you with local composting programs. You'll get personalized tips for sustainable alternatives and can join zero-waste challenges with our community.";
    } else if (lowerMessage.includes('features') || lowerMessage.includes('what can')) {
      return "✨ VerdiGo offers four powerful eco-tools: Green Lane for sustainable navigation, Local Harvest for farm-to-table connections, Air Buddy for air quality monitoring, and WasteLess for smart waste management. Each tool is designed to make sustainable living easier and more rewarding. Which one interests you most?";
    } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return "🌟 Hello! Welcome to VerdiGo's eco-community! I'm excited to help you discover how our platform can make sustainable living effortless and enjoyable. Feel free to ask me about any of our features, or let me know what environmental challenges you're facing!";
    } else if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
      return "💚 Great question! VerdiGo believes sustainability should be accessible to everyone. We offer flexible pricing plans to suit different needs. Sign up to explore our features and find the perfect plan for your eco-journey!";
    } else {
      return "🌱 That's a wonderful question! I'm here to help you make the most of VerdiGo's eco-features. Whether you're curious about reducing your carbon footprint, finding local sustainable options, or tracking your environmental impact, I've got you covered. What specific aspect of sustainable living interests you most?";
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-gradient-to-r from-emerald-600 via-emerald-600 to-green-700 hover:from-emerald-600 hover:via-emerald-700 hover:to-green-700 text-white p-4 rounded-full shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 group relative"
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <div className="relative">
              <MessageCircle className="w-6 h-6" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <Sparkles className="absolute -top-2 -left-2 w-4 h-4 text-yellow-300 animate-pulse opacity-75" />
            </div>
          )}
        </button>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed top-20 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-emerald-200 z-40 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-500 via-emerald-600 to-green-600 text-white p-6 flex items-center">
            <div className="bg-white/20 p-2 rounded-lg mr-3">
              <Leaf className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg">EcoBot</h3>
              <p className="text-emerald-100 text-sm">Your Green AI Assistant</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-emerald-50/30 to-white">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-xs p-4 rounded-2xl shadow-sm ${
                    msg.isBot
                      ? 'bg-white text-gray-800 border border-emerald-100'
                      : 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{msg.message}</p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-emerald-100">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-emerald-100 bg-white">
            <div className="flex space-x-3">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask about our eco-features..."
                className="flex-1 p-3 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm bg-emerald-50/50"
              />
              <button
                onClick={handleSendMessage}
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white p-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;