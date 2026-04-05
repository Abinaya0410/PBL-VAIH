import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { MessageCircle, X, Send, Bot, User, Loader2, Sparkles } from 'lucide-react';

const AIChatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'model', parts: [{ text: "Hello! I'm your AI Academic Assistant. How can I help you today?" }] }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef(null);

    const token = localStorage.getItem('token');

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, loading]);

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMessage = { role: 'user', parts: [{ text: input }] };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/ai/chat`, {
                message: input,
                history: messages
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setMessages(prev => [...prev, { role: 'model', parts: [{ text: res.data.response }] }]);
        } catch (err) {
            console.error(err);
            setMessages(prev => [...prev, { role: 'model', parts: [{ text: "Sorry, I'm having trouble connecting. Please try again later." }] }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* Toggle Button */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 ${isOpen ? 'bg-rose-500 rotate-90' : 'bg-indigo-600 hover:scale-110'}`}
            >
                {isOpen ? <X className="text-white" size={28} /> : <MessageCircle className="text-white" size={28} />}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="absolute bottom-20 right-0 w-80 md:w-96 h-[500px] bg-[var(--background)] border border-[var(--border)] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
                    {/* Header */}
                    <div className="p-4 bg-indigo-600 text-white flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                                <Bot size={24} />
                            </div>
                            <div>
                                <h3 className="font-black uppercase tracking-tight text-sm">Academic AI</h3>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">Online</span>
                                </div>
                            </div>
                        </div>
                        <Sparkles size={18} className="text-amber-300 animate-pulse" />
                    </div>

                    {/* Messages */}
                    <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 dark:bg-slate-900/30">
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                                    msg.role === 'user' 
                                    ? 'bg-indigo-600 text-white rounded-tr-none' 
                                    : 'bg-white dark:bg-slate-800 border border-[var(--border)] text-[var(--foreground)] rounded-tl-none shadow-sm'
                                }`}>
                                    <p className="whitespace-pre-wrap leading-relaxed">{msg.parts[0].text}</p>
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-white dark:bg-slate-800 border border-[var(--border)] p-3 rounded-2xl rounded-tl-none flex items-center gap-2">
                                    <Loader2 size={16} className="animate-spin text-indigo-500" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Thinking...</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t border-[var(--border)] bg-white dark:bg-slate-900">
                        <div className="flex items-center gap-2 bg-gray-100 dark:bg-slate-800 p-2 rounded-2xl border border-[var(--border)] transition-all focus-within:border-indigo-500">
                            <input 
                                type="text" 
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Ask a doubt..."
                                className="flex-1 bg-transparent border-none outline-none px-2 py-1 text-sm font-medium"
                            />
                            <button 
                                onClick={handleSend}
                                disabled={!input.trim() || loading}
                                className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-500 disabled:opacity-50 transition-all"
                            >
                                <Send size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AIChatbot;
