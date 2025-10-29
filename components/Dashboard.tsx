import React, { useState, useEffect } from 'react';
import type { UserProfile, WorkoutLog } from '../types';
import { getMotivationalQuote } from '../services/geminiService';
import Icon from './Icon';

interface DashboardProps {
  profile: UserProfile;
  workoutHistory: WorkoutLog[];
  onNavigate: (view: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ profile, workoutHistory, onNavigate }) => {
  const [quote, setQuote] = useState<string>('');
  const [loadingQuote, setLoadingQuote] = useState<boolean>(true);

  useEffect(() => {
    const fetchQuote = async () => {
      setLoadingQuote(true);
      const newQuote = await getMotivationalQuote();
      setQuote(newQuote);
      setLoadingQuote(false);
    };
    fetchQuote();
  }, []);

  const lastWorkout = workoutHistory.length > 0 ? workoutHistory[workoutHistory.length - 1] : null;

  return (
    <div className="p-4 md:p-6 space-y-6">
      <h1 className="text-3xl md:text-4xl font-bold text-light">Bienvenido, {profile.name}</h1>

      <div className="bg-light-dark p-4 rounded-lg text-center">
        <p className="text-lg italic text-gray-300">"{loadingQuote ? 'Cargando inspiración...' : quote}"</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Peso Actual" value={`${profile.weight} kg`} />
        <StatCard title="Entrenamientos" value={workoutHistory.length.toString()} />
        <StatCard title="Objetivo" value={profile.goal} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ActionCard
          title="Tragón IA"
          description="Consulta a tu experto en nutrición."
          icon="fire"
          onClick={() => onNavigate('nutrition_ai')}
        />
        <ActionCard
          title="Ver Historial"
          description="Revisa tu progreso y entrenamientos pasados."
          icon="history"
          onClick={() => onNavigate('history')}
        />
        <ActionCard
          title="Coach IA"
          description="Genera una nueva rutina personalizada."
          icon="brain"
          onClick={() => onNavigate('ai_assistant')}
        />
        <ActionCard
          title="Mi Perfil"
          description="Actualiza tus datos y objetivos."
          icon="user"
          onClick={() => onNavigate('profile')}
        />
      </div>

      {lastWorkout && (
        <div className="bg-light-dark p-4 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Último Entrenamiento</h3>
          <p className="text-gray-400">{new Date(lastWorkout.date).toLocaleDateString()}</p>
          <p className="font-bold text-primary">{lastWorkout.name}</p>
          <ul className="list-disc list-inside mt-2 text-gray-300">
            {lastWorkout.exercises.slice(0, 3).map((ex, index) => (
              <li key={index}>{ex.exerciseId} ({ex.sets.length} series)</li>
            ))}
            {lastWorkout.exercises.length > 3 && <li>...y más</li>}
          </ul>
        </div>
      )}
    </div>
  );
};

const StatCard: React.FC<{ title: string; value: string }> = ({ title, value }) => (
  <div className="bg-light-dark p-4 rounded-lg text-center">
    <p className="text-sm text-gray-400">{title}</p>
    <p className="text-2xl font-bold text-primary">{value}</p>
  </div>
);

const ActionCard: React.FC<{ title: string; description: string; icon: string; onClick: () => void }> = ({ title, description, icon, onClick }) => (
  <button onClick={onClick} className="bg-light-dark p-4 rounded-lg text-left hover:bg-gray-700 transition-colors duration-200 flex items-center space-x-4">
    <div className="bg-primary/20 p-3 rounded-full">
      <Icon name={icon} className="w-6 h-6 text-primary" />
    </div>
    <div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm text-gray-400">{description}</p>
    </div>
  </button>
);

export default Dashboard;
