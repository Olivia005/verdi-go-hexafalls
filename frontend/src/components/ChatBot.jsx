import React, { useState, useRef } from 'react'
import { MessageCircle, X, Send, Leaf, Sparkles, Camera } from 'lucide-react'

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: '1',
      message:
        "🌱 Hi there! I'm EcoBot, your intelligent green assistant. I can analyze images using AI and answer questions with ChatGPT! Upload a photo or ask me about VerdiGo's eco-features!",
      isBot: true,
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const fileInputRef = useRef(null)

  // Handle text messages with ChatGPT API
  // Replace the handleSendMessage function with this improved version:

  const handleSendMessage = async () => {
    if (inputMessage.trim()) {
      const userMessage = {
        id: Date.now().toString(),
        message: inputMessage,
        isBot: false,
        timestamp: new Date(),
        type: 'text'
      }

      setMessages(prev => [...prev, userMessage])
      setInputMessage('')
      setIsTyping(true)

      try {
        // 🎯 Try ChatGPT API first
        console.log('🤖 Attempting ChatGPT API call...')
        const response = await getChatGPTResponse(inputMessage)

        const botResponse = {
          id: (Date.now() + 1).toString(),
          message: response,
          isBot: true,
          timestamp: new Date(),
          type: 'text'
        }

        setMessages(prev => [...prev, botResponse])
        console.log('✅ ChatGPT API response received')
      } catch (error) {
        console.error('❌ ChatGPT API error:', error)
        const getSpecificBotResponse = message => {
          const lowerMessage = message.toLowerCase()

          // Check for specific VerdiGo features
          if (lowerMessage.includes('green lane')) {
            return "🛣️ Green Lane is our revolutionary eco-smart navigation system! It analyzes traffic patterns, vehicle emissions, and route efficiency to suggest the most sustainable paths. You'll get real-time carbon footprint tracking, alternative transport suggestions, and even find eco-friendly stops along your route. It's like having a personal environmental consultant for every journey!"
          } else if (lowerMessage.includes('local harvest')) {
            return "🌾 Local Harvest connects you directly with local farmers and sustainable food producers! Through our interactive map, you can discover seasonal produce, schedule direct pickups, and even get community recipes. It's farm-to-table made simple, supporting your local economy while ensuring the freshest, most nutritious food for your family."
          } else if (lowerMessage.includes('air buddy')) {
            return '💨 Air Buddy is your personal air quality guardian! It provides hyper-local air quality monitoring with real-time AQI alerts, personalized outdoor activity recommendations, and even tracks pollen levels. Plus, we give you indoor air quality tips and suggest the best plants to purify your home environment.'
          } else if (lowerMessage.includes('wasteless')) {
            return "♻️ WasteLess transforms how you think about waste! Our intelligent tracking system categorizes your waste, provides recycling guidance, and connects you with local composting programs. You'll get personalized tips for sustainable alternatives and can join zero-waste challenges with our community."
          } else if (
            lowerMessage.includes('features') ||
            lowerMessage.includes('what can')
          ) {
            return '✨ VerdiGo offers four powerful eco-tools: Green Lane for sustainable navigation, Local Harvest for farm-to-table connections, Air Buddy for air quality monitoring, and WasteLess for smart waste management. Each tool is designed to make sustainable living easier and more rewarding. Which one interests you most?'
          } else if (
            lowerMessage.includes('hello') ||
            lowerMessage.includes('hi')
          ) {
            return "🌟 Hello! Welcome to VerdiGo's eco-community! I'm excited to help you discover how our platform can make sustainable living effortless and enjoyable. Feel free to ask me about any of our features, upload an image for AI analysis, or let me know what environmental challenges you're facing!"
          } else if (
            lowerMessage.includes('price') ||
            lowerMessage.includes('cost')
          ) {
            return '💚 Great question! VerdiGo believes sustainability should be accessible to everyone. We offer flexible pricing plans to suit different needs. Sign up to explore our features and find the perfect plan for your eco-journey!'
          }

          // Return null if no specific match found
          return null
        }

        // 🎯 Check for specific VerdiGo features first (before generic fallback)
        const specificResponse = getSpecificBotResponse(inputMessage)
        if (specificResponse) {
          console.log('🎯 Using specific VerdiGo response')
          const botResponse = {
            id: (Date.now() + 1).toString(),
            message: specificResponse,
            isBot: true,
            timestamp: new Date(),
            type: 'text'
          }
          setMessages(prev => [...prev, botResponse])
        } else {
          console.log('🔄 Using generic fallback response')
          const botResponse = {
            id: (Date.now() + 1).toString(),
            message: getBotResponse(inputMessage),
            isBot: true,
            timestamp: new Date(),
            type: 'text'
          }
          setMessages(prev => [...prev, botResponse])
        }
      } finally {
        setIsTyping(false)
      }
    }
  }

  // Handle image upload and analysis
  const handleImageUpload = async event => {
    const file = event.target.files[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file')
      return
    }

    const imageUrl = URL.createObjectURL(file)

    const userMessage = {
      id: Date.now().toString(),
      message: "🖼️ I've uploaded an image for analysis",
      isBot: false,
      timestamp: new Date(),
      type: 'image',
      imageUrl: imageUrl,
      fileName: file.name
    }

    setMessages(prev => [...prev, userMessage])
    setIsAnalyzing(true)

    try {
      const analysisResult = await analyzeImageWithAI(file)

      const botResponse = {
        id: (Date.now() + 1).toString(),
        message: formatImageAnalysisResponse(analysisResult),
        isBot: true,
        timestamp: new Date(),
        type: 'analysis'
      }

      setMessages(prev => [...prev, botResponse])
    } catch (error) {
      console.error('Image analysis error:', error)
      const errorResponse = {
        id: (Date.now() + 1).toString(),
        message:
          "🤖 I'm having trouble analyzing this image right now. Could you try uploading it again?",
        isBot: true,
        timestamp: new Date(),
        type: 'error'
      }
      setMessages(prev => [...prev, errorResponse])
    } finally {
      setIsAnalyzing(false)
      URL.revokeObjectURL(imageUrl)
    }

    event.target.value = ''
  }

  // ChatGPT API call
  const getChatGPTResponse = async message => {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: `As EcoBot, VerdiGo's AI assistant for sustainable living, respond to: "${message}". VerdiGo has Green Lane (eco-navigation), Local Harvest (farm connections), Air Buddy (air quality), and WasteLess (waste management). Be helpful and focus on sustainability.`,
        max_tokens: 150
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      if (errorData.fallback) {
        throw new Error('Use fallback')
      }
      throw new Error('ChatGPT API failed')
    }

    const data = await response.json()
    return data.response
  }

  // Image analysis with AI model
  const analyzeImageWithAI = async imageFile => {
    const formData = new FormData()
    formData.append('image', imageFile)

    const response = await fetch('/api/analyze-image', {
      method: 'POST',
      body: formData
    })

    if (!response.ok) throw new Error('Image analysis failed')
    return await response.json()
  }

  // Format analysis response
  const formatImageAnalysisResponse = analysisResult => {
    const { classifications, confidence, suggestions, status } = analysisResult

    let response = `🔍 **AI Analysis Complete!**\n\n`

    if (status === 'mock_analysis') {
      response += `🔬 *Demo Analysis - Replace with your trained model*\n\n`
    }

    if (classifications && classifications.length > 0) {
      response += `📊 **What I detected:**\n`
      classifications.forEach((item, index) => {
        response += `${index + 1}. **${item.label}** (${(
          item.confidence * 100
        ).toFixed(1)}% confidence)\n`
      })
      response += `\n`
    }

    if (suggestions && suggestions.length > 0) {
      response += `💡 **Eco-friendly insights:**\n`
      suggestions.forEach(suggestion => {
        response += `• ${suggestion}\n`
      })
      response += `\n`
    }

    response += `❓ **Want to know more?** Ask me about any of these items or sustainable practices!`
    return response
  }

  // Your existing fallback responses
  const getBotResponse = message => {
    const lowerMessage = message.toLowerCase()

    if (lowerMessage.includes('green lane')) {
      return "🛣️ Green Lane is our revolutionary eco-smart navigation system! It analyzes traffic patterns, vehicle emissions, and route efficiency to suggest the most sustainable paths. You'll get real-time carbon footprint tracking, alternative transport suggestions, and even find eco-friendly stops along your route. It's like having a personal environmental consultant for every journey!"
    } else if (lowerMessage.includes('local harvest')) {
      return "🌾 Local Harvest connects you directly with local farmers and sustainable food producers! Through our interactive map, you can discover seasonal produce, schedule direct pickups, and even get community recipes. It's farm-to-table made simple, supporting your local economy while ensuring the freshest, most nutritious food for your family."
    } else if (lowerMessage.includes('air buddy')) {
      return '💨 Air Buddy is your personal air quality guardian! It provides hyper-local air quality monitoring with real-time AQI alerts, personalized outdoor activity recommendations, and even tracks pollen levels. Plus, we give you indoor air quality tips and suggest the best plants to purify your home environment.'
    } else if (lowerMessage.includes('wasteless')) {
      return "♻️ WasteLess transforms how you think about waste! Our intelligent tracking system categorizes your waste, provides recycling guidance, and connects you with local composting programs. You'll get personalized tips for sustainable alternatives and can join zero-waste challenges with our community."
    } else if (
      lowerMessage.includes('features') ||
      lowerMessage.includes('what can')
    ) {
      return '✨ VerdiGo offers four powerful eco-tools: Green Lane for sustainable navigation, Local Harvest for farm-to-table connections, Air Buddy for air quality monitoring, and WasteLess for smart waste management. Each tool is designed to make sustainable living easier and more rewarding. Which one interests you most?'
    } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return "🌟 Hello! Welcome to VerdiGo's eco-community! I'm excited to help you discover how our platform can make sustainable living effortless and enjoyable. Feel free to ask me about any of our features, upload an image for AI analysis, or let me know what environmental challenges you're facing!"
    } else if (
      lowerMessage.includes('price') ||
      lowerMessage.includes('cost')
    ) {
      return '💚 Great question! VerdiGo believes sustainability should be accessible to everyone. We offer flexible pricing plans to suit different needs. Sign up to explore our features and find the perfect plan for your eco-journey!'
    } else {
      return "🌱 That's a wonderful question! I'm here to help you make the most of VerdiGo's eco-features. Whether you're curious about reducing your carbon footprint, finding local sustainable options, or tracking your environmental impact, I've got you covered. You can also upload images for AI analysis! What interests you most?"
    }
  }

  return (
    <>
      {/* Chat Toggle Button */}
      <div className='fixed bottom-8 right-8 z-50'>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className='bg-gradient-to-r from-emerald-600 via-emerald-600 to-green-700 hover:from-emerald-600 hover:via-emerald-700 hover:to-green-700 text-white p-4 rounded-full shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 group relative'
        >
          {isOpen ? (
            <X className='w-6 h-6' />
          ) : (
            <div className='relative'>
              <MessageCircle className='w-6 h-6' />
              <div className='absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse'></div>
              <Sparkles className='absolute -top-2 -left-2 w-4 h-4 text-yellow-300 animate-pulse opacity-75' />
            </div>
          )}
        </button>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className='fixed top-20 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl border border-emerald-200 z-40 flex flex-col overflow-hidden'>
          {/* Header */}
          <div className='bg-gradient-to-r from-emerald-500 via-emerald-600 to-green-600 text-white p-6 flex items-center'>
            <div className='bg-white/20 p-2 rounded-lg mr-3'>
              <Leaf className='w-6 h-6' />
            </div>
            <div>
              <h3 className='font-bold text-lg'>EcoBot AI</h3>
              <p className='text-emerald-100 text-sm'>
                Image Analysis + ChatGPT
              </p>
            </div>
          </div>

          {/* Messages */}
          <div className='flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-emerald-50/30 to-white'>
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.isBot ? 'justify-start' : 'justify-end'
                }`}
              >
                <div
                  className={`max-w-xs p-4 rounded-2xl shadow-sm ${
                    msg.isBot
                      ? 'bg-white text-gray-800 border border-emerald-100'
                      : 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white'
                  }`}
                >
                  {/* Show image if uploaded */}
                  {msg.type === 'image' && msg.imageUrl && (
                    <div className='mb-3'>
                      <img
                        src={msg.imageUrl}
                        alt='Uploaded'
                        className='w-full rounded-lg max-h-40 object-cover'
                      />
                      <p className='text-xs mt-1 opacity-75'>{msg.fileName}</p>
                    </div>
                  )}

                  <p className='text-sm leading-relaxed whitespace-pre-line'>
                    {msg.message}
                  </p>

                  {/* Show analysis indicator */}
                  {msg.type === 'analysis' && (
                    <div className='mt-3 p-2 bg-emerald-50 rounded-lg border border-emerald-200'>
                      <p className='text-xs text-emerald-700 font-medium'>
                        🤖 AI Analysis Complete
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Typing indicators */}
            {(isTyping || isAnalyzing) && (
              <div className='flex justify-start'>
                <div className='bg-white p-4 rounded-2xl shadow-sm border border-emerald-100'>
                  <div className='flex items-center space-x-2'>
                    <div className='flex space-x-1'>
                      <div className='w-2 h-2 bg-emerald-500 rounded-full animate-bounce'></div>
                      <div
                        className='w-2 h-2 bg-emerald-500 rounded-full animate-bounce'
                        style={{ animationDelay: '0.1s' }}
                      ></div>
                      <div
                        className='w-2 h-2 bg-emerald-500 rounded-full animate-bounce'
                        style={{ animationDelay: '0.2s' }}
                      ></div>
                    </div>
                    <span className='text-xs text-emerald-600'>
                      {isAnalyzing ? '🔍 Analyzing image...' : '💭 Thinking...'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className='p-4 border-t border-emerald-100 bg-white'>
            {/* Upload button */}
            <div className='flex space-x-2 mb-3'>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isAnalyzing}
                className='flex items-center space-x-2 px-3 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-lg transition-colors text-sm disabled:opacity-50'
              >
                <Camera className='w-4 h-4' />
                <span>Upload Image</span>
              </button>

              <input
                ref={fileInputRef}
                type='file'
                accept='image/*'
                onChange={handleImageUpload}
                className='hidden'
              />
            </div>

            {/* Text input */}
            <div className='flex space-x-3'>
              <input
                type='text'
                value={inputMessage}
                onChange={e => setInputMessage(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
                placeholder='Ask about eco-features or upload an image...'
                className='flex-1 p-3 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm bg-emerald-50/50'
                disabled={isTyping || isAnalyzing}
              />
              <button
                onClick={handleSendMessage}
                disabled={isTyping || isAnalyzing || !inputMessage.trim()}
                className='bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white p-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50'
              >
                <Send className='w-4 h-4' />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Chatbot
