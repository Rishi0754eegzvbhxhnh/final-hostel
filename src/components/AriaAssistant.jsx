import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const BACKEND = 'http://localhost:5000';

const AriaAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState([{ role: 'ai', content: "Hi! I'm Aria, your Hostel AI. How can I assist you today?" }]);
  const [input, setInput] = useState('');
  const [isAIProcessing, setIsAIProcessing] = useState(false);
  const [context, setContext] = useState(null);
  const chatEndRef = useRef(null);

  const recognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);

  useEffect(() => {
    fetchContext();
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setIsListening(false);
        handleSend(transcript);
      };

      recognitionRef.current.onerror = () => setIsListening(false);
      recognitionRef.current.onend = () => setIsListening(false);
    }
  }, []);

  const fetchContext = async () => {
    try {
      const res = await axios.get(`${BACKEND}/api/ai/context`);
      setContext(res.data);
    } catch { console.error('AI Context error'); }
  };

  const speak = (text) => {
    if (!synthRef.current) return;
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = synthRef.current.getVoices();
    utterance.voice = voices.find(v => v.name.includes('Google') || v.name.includes('Female')) || voices[0];
    synthRef.current.speak(utterance);
  };

  const processResponse = (query) => {
    const q = query.toLowerCase();
    if (!context) return "I'm still loading current hostel data. One second!";

    if (q.includes('food') || q.includes('menu') || q.includes('lunch') || q.includes('dinner') || q.includes('breakfast')) {
      const menu = context.food.menu;
      if (!menu) return "The menu for today hasn't been uploaded yet.";
      return `For today, ${context.food.today}, the menu is: Breakfast is ${menu.breakfast}, Lunch is ${menu.lunch}, and Dinner is ${menu.dinner}. Sounds delicious, right?`;
    }

    if (q.includes('room') || q.includes('available') || q.includes('vacancy') || q.includes('occupied')) {
      return `We currently have ${context.rooms.available} rooms available out of ${context.rooms.total}. Prices range from ${context.rooms.priceRange} per month.`;
    }

    if (q.includes('complaint') || q.includes('issue')) {
      return `There are currently ${context.stats.pendingComplaints} pending complaints being reviewed by the administration. You can file a new one in the Complaints tab.`;
    }

    if (q.includes('laundry')) {
      const free = context.laundry?.available;
      if (free === undefined) return "Laundry services are complimentary!";
      if (free === 0) return "All laundry machines are currently in use. I'd recommend checking back in about 20 minutes!";
      return `We have ${free} machines free right now. Better hurry before they're gone!`;
    }

    if (q.includes('dinner') || q.includes('food') || q.includes('eat')) {
      const menu = context.food.menu;
      if (!menu) return "The menu for today hasn't been uploaded yet.";
      return `For tonight's dinner, we have ${menu.dinner}. Sounds good, doesn't it?`;
    }

    if (q.includes('payment') || q.includes('fee') || q.includes('due') || q.includes('pay') || q.includes('wallet')) {
      return "You can check your outstanding balance in the Payments tab. We accept Cards, UPI, and Hostel Wallet.";
    }

    if (q.includes('who are you') || q.includes('aria')) {
      return "I'm Aria, your intelligent hostel companion. I was designed to make your hostel life effortless.";
    }

    if (q.includes('hostel') || q.includes('about this place')) {
      return "This is the next-generation Student Intelligence Hostel! It features modern smart living, AI-powered assistance, and premium facilities.";
    }

    if (q.includes('hello') || q.includes('hi ') || q.includes('hey')) {
      return "Hello there! I'm Aria. How can I make your day at the hostel better?";
    }

    return null;
  };

  const handleSend = async (text) => {
    const msg = text || input;
    if (!msg.trim()) return;

    setMessages(prev => [...prev, { role: 'user', content: msg }]);
    setInput('');
    setIsAIProcessing(true);

    const q = msg.toLowerCase();

    if (q.includes('news') || q.includes('update me') || q.includes('world update')) {
      try {
        const res = await axios.get(`${BACKEND}/api/news/trending?limit=3`);
        if (res.data && res.data.success && res.data.articles) {
          let displayContent = "Here are the top global news updates:\n\n";
          res.data.articles.forEach((art, index) => {
            displayContent += `${index + 1}. ${art.title}\n${art.description || ''}\n\n`;
          });
          setMessages(prev => [...prev, { role: 'ai', content: displayContent.trim() }]);
          setIsAIProcessing(false);
          return;
        }
      } catch (err) {
        console.error('Failed to fetch news:', err);
        setMessages(prev => [...prev, { role: 'ai', content: "I'm having trouble connecting to the news network right now." }]);
        setIsAIProcessing(false);
        return;
      }
    }

    const localResponse = processResponse(msg);
    if (localResponse) {
      setTimeout(() => {
        setMessages(prev => [...prev, { role: 'ai', content: localResponse }]);
        speak(localResponse);
        setIsAIProcessing(false);
      }, 300);
      return;
    }

    try {
      const rawKey = import.meta.env.VITE_GEMINI_API_KEY;
      const geminiKey = rawKey ? rawKey.replace(/["']/g, '').trim() : '';
      
      if (!geminiKey) {
        const noKeyMsg = "I'm running in basic mode. For full AI capabilities, please add your Gemini API key to the .env file as VITE_GEMINI_API_KEY.";
        setMessages(prev => [...prev, { role: 'ai', content: noKeyMsg }]);
        setIsAIProcessing(false);
        return;
      }

      const res = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiKey}`,
        {
          contents: [{ parts: [{ text: `You are Aria, a helpful AI assistant for a student hostel. Keep responses concise. User asks: ${msg}` }] }]
        },
        { headers: { 'Content-Type': 'application/json' } }
      );
      
      if (res.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        const response = res.data.candidates[0].content.parts[0].text;
        setMessages(prev => [...prev, { role: 'ai', content: response }]);
        speak(response);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error("AI Error:", err);
      
      let errorMsg = "I'm having trouble connecting to the AI service. Please try again.";
      
      if (err.response?.data?.error) {
        const errorInfo = err.response.data.error;
        if (errorInfo.message?.includes('API_KEY')) {
          errorMsg = "Your API key appears to be invalid. Please check your VITE_GEMINI_API_KEY in the .env file.";
        } else if (errorInfo.message?.includes('quota')) {
          errorMsg = "API quota exceeded. Please try again later.";
        } else {
          errorMsg = `AI service error: ${errorInfo.message || 'Unknown error'}`;
        }
      } else if (err.message === 'Network Error') {
        errorMsg = "Network error. Please check your internet connection.";
      }
      
      setMessages(prev => [...prev, { role: 'ai', content: errorMsg }]);
    } finally {
      setIsAIProcessing(false);
    }
  };

  const toggleListen = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      synthRef.current.cancel();
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="fixed bottom-6 right-6 z-[100] font-body">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 rounded-full bg-primary shadow-2xl flex items-center justify-center text-white hover:scale-110 active:scale-90 transition-all group overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-secondary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        {isOpen ? (
          <span className="material-symbols-outlined text-3xl">close</span>
        ) : (
          <div className="relative">
             <span className="material-symbols-outlined text-3xl animate-pulse">auto_awesome</span>
          </div>
        )}
      </button>

      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[400px] h-[550px] bg-white rounded-3xl shadow-[0_32px_80px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-10">
          <div className="bg-primary p-6 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1" }}>auto_videocam</span>
              </div>
              <div>
                <p className="font-headline font-bold text-lg leading-tight">Aria</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="w-2 h-2 bg-secondary-fixed rounded-full animate-pulse" />
                  <p className="text-[10px] font-bold tracking-widest uppercase text-white/60">INTELLIGENCE ACTIVE</p>
                </div>
              </div>
            </div>
            <button onClick={toggleListen} className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isListening ? 'bg-error animate-pulse' : 'bg-white/10 hover:bg-white/20'}`}>
              <span className="material-symbols-outlined text-[20px]">{isListening ? 'mic' : 'mic_off'}</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-surface-container-lowest">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'ai' ? 'justify-start' : 'justify-end'}`}>
                {m.role === 'ai' && (
                  <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center mr-3 shrink-0">
                    <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                  </div>
                )}
                <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm whitespace-pre-wrap ${m.role === 'ai' ? 'bg-surface-container-low text-on-surface' : 'bg-primary text-white font-medium shadow-md shadow-primary/20'}`}>
                  {m.content}
                </div>
              </div>
            ))}
            {isAIProcessing && (
              <div className="flex justify-start animate-pulse">
                <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center mr-3 shrink-0">
                  <span className="material-symbols-outlined text-primary text-sm">sync</span>
                </div>
                <div className="max-w-[80%] px-4 py-3 rounded-2xl text-sm bg-surface-container-low text-on-surface-variant italic">
                  Aria is thinking...
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="p-4 bg-white border-t border-outline-variant/10">
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder={isListening ? 'Listening...' : "Ask anything about the hostel..."}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                className="w-full bg-surface-container-low border-none rounded-2xl pl-5 pr-14 py-3.5 text-sm focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-outline/60"
              />
              <button
                onClick={() => handleSend()}
                className="absolute right-2 w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center active:scale-90 transition-transform"
              >
                <span className="material-symbols-outlined text-[20px]">north</span>
              </button>
            </div>
            <p className="text-center text-[9px] text-outline mt-3 uppercase tracking-widest font-bold opacity-40">Powered by Aria AI Framework</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AriaAssistant;
