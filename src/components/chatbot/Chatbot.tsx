import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, X, Zap, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Hi! I\'m SolarBot ⚡ Your friendly UrjaLink assistant. How can I help you with solar energy trading today?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const predefinedQuestions = [
    'How to list energy?',
    'How to buy energy?',
    'What is UrjaLink?',
    'Blockchain benefits?',
  ];

  const responses: Record<string, string> = {
    'how to list energy': 'To list your solar energy: 1️⃣ Go to Seller page 2️⃣ Enter energy units (kWh) 3️⃣ Set your price per unit 4️⃣ Click "List Energy" ⚡ Your energy will be available for purchase instantly!',
    'how to buy energy': 'To buy solar energy: 1️⃣ Visit the Buyer page 2️⃣ Browse available energy listings 3️⃣ Click "Buy Now" on your preferred listing 4️⃣ Complete the transaction 💰 Energy will be transferred to your account!',
    'what is urjalink': 'UrjaLink is a revolutionary blockchain-based peer-to-peer solar energy marketplace! 🌱 We connect solar energy producers with consumers, enabling direct trading without intermediaries. All transactions are secure, transparent, and recorded on the blockchain! ⚡',
    'blockchain benefits': 'Blockchain in UrjaLink provides: ✅ Complete transparency ✅ Immutable transaction records ✅ Secure payments ✅ No intermediaries ✅ Lower costs ✅ Global accessibility 🔗 Trust the technology, trust the process!',
    'hello': 'Hello there! ⚡ Welcome to UrjaLink! I\'m here to help you navigate the world of peer-to-peer solar energy trading. What would you like to know?',
    'hi': 'Hi! 🌞 Great to see you on UrjaLink! Ready to explore the future of clean energy trading? Ask me anything!',
    'help': 'I\'m here to help! 🤖 You can ask me about: • How to list/sell energy • How to buy energy • Blockchain technology • UrjaLink features • Market statistics Or just say hello! 👋',
    'price': 'Current market stats: 📊 Average price: ₹4.20/kWh 📈 Today\'s volume: 2,450 kWh 🔥 Active listings: 127 💡 Peak trading hours: 10 AM - 4 PM',
    'wallet': 'Your wallet address is automatically generated when you sign up! 💳 It\'s visible in your profile and navbar. You can also add your existing wallet address during signup. All transactions are secure and blockchain-verified! 🔐',
  };

  const getRandomResponse = () => {
    const randomResponses = [
      'That\'s interesting! 🤔 Could you tell me more about what you\'re looking for?',
      'I\'m still learning! 🤖 Try asking about listing energy, buying energy, or UrjaLink features!',
      'Great question! 💡 For specific help, try our predefined questions below, or ask about solar energy trading!',
      'Hmm, I might need more context! 😊 Ask me about how UrjaLink works or our blockchain technology!',
    ];
    return randomResponses[Math.floor(Math.random() * randomResponses.length)];
  };

  const getBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    for (const [key, response] of Object.entries(responses)) {
      if (lowerMessage.includes(key)) {
        return response;
      }
    }
    
    // Check for energy-related keywords
    if (lowerMessage.includes('energy') || lowerMessage.includes('solar')) {
      return 'Solar energy is the future! ☀️ UrjaLink makes it easy to trade clean energy on the blockchain. Would you like to know about listing energy for sale or buying energy from others?';
    }
    
    if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
      return responses.price;
    }
    
    if (lowerMessage.includes('wallet')) {
      return responses.wallet;
    }
    
    return getRandomResponse();
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (message: string = inputMessage) => {
    if (!message.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: message.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate bot typing delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

    const botResponse: Message = {
      id: (Date.now() + 1).toString(),
      type: 'bot',
      content: getBotResponse(message),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, botResponse]);
    setIsTyping(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Button */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 rounded-full bg-gradient-solar shadow-lg hover:shadow-glow-solar"
        >
          {isOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <MessageCircle className="w-6 h-6 text-white" />
          )}
        </Button>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-24 right-6 w-80 h-96 bg-card border border-border rounded-xl shadow-2xl z-40 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-solar p-4 text-white">
              <div className="flex items-center space-x-3">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="p-1.5 bg-white/20 rounded-full"
                >
                  <Zap className="w-4 h-4" />
                </motion.div>
                <div>
                  <h3 className="font-semibold">SolarBot</h3>
                  <p className="text-xs opacity-90">Powered by UrjaLink</p>
                </div>
                <Bot className="w-5 h-5 ml-auto" />
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg text-sm ${
                        message.type === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {message.content}
                    </div>
                  </motion.div>
                ))}
                
                {/* Typing Indicator */}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="bg-muted text-muted-foreground p-3 rounded-lg">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-current rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:0.1s]" />
                        <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:0.2s]" />
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Quick Questions */}
            <div className="p-2 border-t border-border">
              <div className="grid grid-cols-2 gap-1 mb-2">
                {predefinedQuestions.map((question) => (
                  <Button
                    key={question}
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSendMessage(question)}
                    className="text-xs h-8 p-2 hover:bg-primary/10"
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border">
              <div className="flex space-x-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything..."
                  className="flex-1 text-sm"
                  disabled={isTyping}
                />
                <Button
                  onClick={() => handleSendMessage()}
                  disabled={!inputMessage.trim() || isTyping}
                  size="sm"
                  className="bg-primary hover:bg-primary/90"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;