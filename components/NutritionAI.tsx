import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { UserProfile, ChatMessage } from '../types';
import { getNutritionAdvice } from '../services/geminiService';
import Icon from './Icon';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface NutritionAIProps {
  profile: UserProfile;
  onNavigate: (view: string) => void;
}

const NutritionAI: React.FC<NutritionAIProps> = ({ profile, onNavigate }) => {
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useLocalStorage<ChatMessage[]>('nutrition_chat_history', [
    {
      role: 'model',
      parts: [{ text: `¡Hola ${profile.name}! Soy Tragón IA, tu asistente de nutrición personal. ¿Cómo puedo ayudarte a alcanzar tus objetivos hoy? Puedes pedirme recetas, un plan de comidas, o preguntarme sobre cualquier alimento.` }],
    }
  ]);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatContainerRef.current?.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: 'smooth'
    });
  }, [chatHistory]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || loading) return;

    const newUserMessage: ChatMessage = {
      role: 'user',
      parts: [{ text: userInput.trim() }],
    };

    const newHistory = [...chatHistory, newUserMessage];
    setChatHistory(newHistory);
    setUserInput('');
    setLoading(true);

    try {
      const response = await getNutritionAdvice(userInput.trim(), chatHistory, profile);
      const newAiMessage: ChatMessage = {
        role: 'model',
        parts: [{ text: response }],
      };
      setChatHistory([...newHistory, newAiMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage: ChatMessage = {
        role: 'model',
        parts: [{ text: "Lo siento, algo salió mal. Por favor, inténtalo de nuevo." }],
      };
      setChatHistory([...newHistory, errorMessage]);
    } finally {
      setLoading(false);
    }
  }, [userInput, loading, chatHistory, profile, setChatHistory]);

  return (
    <div className="p-4 md:p-6 h-screen flex flex-col">
      <header className="flex items-center space-x-3 mb-4">
        <button onClick={() => onNavigate('dashboard')} className="p-2 hover:bg-light-dark rounded-full">
            <Icon name="chevronLeft" className="w-6 h-6 text-light" />
        </button>
        <div className="flex items-center space-x-3">
            <Icon name="fire" className="w-10 h-10 text-primary" />
            <div>
                <h1 className="text-2xl font-bold text-light">Tragón IA</h1>
                <p className="text-sm text-medium">Tu asistente de nutrición personal</p>
            </div>
        </div>
      </header>

      <div ref={chatContainerRef} className="flex-grow overflow-y-auto space-y-4 pr-2">
        {chatHistory.map((message, index) => (
          <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-lg p-3 rounded-2xl ${
                message.role === 'user' 
                  ? 'bg-secondary text-white rounded-br-none' 
                  : 'bg-light-dark text-gray-200 rounded-bl-none'
              }`}
            >
              <p className="text-sm" style={{ whiteSpace: 'pre-wrap' }}>{message.parts[0].text}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="max-w-lg p-3 rounded-2xl bg-light-dark text-gray-200 rounded-bl-none">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="mt-4 flex items-center space-x-2">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Pide una receta para ganar músculo..."
          className="w-full bg-light-dark border border-gray-600 rounded-full px-4 py-3 text-light focus:ring-primary focus:border-primary placeholder-gray-500"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !userInput.trim()}
          className="bg-primary text-white p-3 rounded-full hover:bg-primary-dark transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
        >
          <Icon name="paperAirplane" className="w-6 h-6" />
        </button>
      </form>
    </div>
  );
};

export default NutritionAI;
