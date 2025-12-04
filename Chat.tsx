import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Message } from './types';
import { PRODUCTS } from './constants';

interface ChatProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Chat({ isOpen, onClose }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      text: 'Olá! Sou a consultora virtual da Lumina Essence. Como posso ajudar você a encontrar o produto perfeito hoje?',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMsg: Message = { role: 'user', text: inputValue, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const systemInstruction = `
        Você é uma consultora de vendas especialista e elegante da loja "Lumina Essence".
        Sua missão é ajudar clientes a escolher cosméticos e perfumes.
        Seja educada, sofisticada e prestativa. Use emojis com moderação ✨.
        
        Aqui está o catálogo de produtos disponíveis:
        ${JSON.stringify(PRODUCTS.map(p => ({ id: p.id, name: p.name, price: p.price, category: p.category, benefits: p.benefits })))}
        
        Regras:
        1. Responda apenas sobre produtos de beleza e a loja.
        2. Se perguntarem preços, consulte o catálogo.
        3. Destaque os benefícios dos produtos.
        4. Se o cliente quiser comprar, oriente-o a adicionar ao carrinho (mas você não pode adicionar diretamente).
        5. Mantenha respostas concisas (máx 3 parágrafos curtos).
      `;

      // Create message history for context
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      // Add current message
      history.push({ role: 'user', parts: [{ text: userMsg.text }] });

      const model = ai.models;
      const response = await model.generateContent({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: systemInstruction,
            temperature: 0.7,
        },
        contents: history.map(h => ({ role: h.role, parts: h.parts }))
      });

      const text = response.text || "Desculpe, não consegui processar sua solicitação no momento.";
      
      setMessages(prev => [...prev, {
        role: 'model',
        text: text,
        timestamp: new Date()
      }]);

    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, {
        role: 'model',
        text: "Perdão, tive um pequeno problema técnico. Poderia repetir?",
        timestamp: new Date(),
        isError: true
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-20 right-4 w-96 max-w-[calc(100vw-2rem)] h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50 border border-brand-100 animate-fade-in-up">
      {/* Header */}
      <div className="bg-brand-600 p-4 flex justify-between items-center text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
             <span className="text-xl">✨</span>
          </div>
          <div>
            <h3 className="font-serif font-bold">Lumina Assistant</h3>
            <p className="text-xs text-brand-100 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span> Online agora
            </p>
          </div>
        </div>
        <button onClick={onClose} className="text-brand-100 hover:text-white transition">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-stone-50 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div 
              className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-brand-600 text-white rounded-br-none' 
                  : 'bg-white text-stone-700 shadow-sm border border-stone-100 rounded-bl-none'
              } ${msg.isError ? 'border-red-300 bg-red-50 text-red-600' : ''}`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white p-3 rounded-2xl rounded-bl-none shadow-sm border border-stone-100 flex gap-1 items-center">
              <div className="w-2 h-2 bg-brand-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-brand-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-brand-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-stone-100">
        <div className="relative">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Digite sua dúvida..."
            className="w-full pl-4 pr-12 py-3 bg-stone-50 border border-stone-200 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400 text-sm transition"
          />
          <button 
            type="submit" 
            disabled={!inputValue.trim() || isLoading}
            className="absolute right-1 top-1 p-2 bg-brand-600 text-white rounded-full hover:bg-brand-700 disabled:opacity-50 disabled:hover:bg-brand-600 transition"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}
