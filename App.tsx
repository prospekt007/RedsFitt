import React, { useState } from 'react';
import { UserProfile, WorkoutLog, Exercise, ExperienceLevel, UserGoal, Gender, MuscleGroup } from './types';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import AIAssistant from './components/AIAssistant';
import History from './components/History';
import Icon from './components/Icon';
import NutritionAI from './components/NutritionAI';
import { EXERCISES_DATA } from './data/exercises';
import { useLocalStorage } from './hooks/useLocalStorage';

const App: React.FC = () => {
  const [profile, setProfile] = useLocalStorage<UserProfile>('userProfile', {
    name: 'Atleta',
    age: 30,
    gender: Gender.Male,
    height: 180,
    weight: 80,
    experience: ExperienceLevel.Intermediate,
    goal: UserGoal.GainStrength,
  });

  const [workoutHistory, setWorkoutHistory] = useLocalStorage<WorkoutLog[]>('workoutHistory', []);
  const [exercises, setExercises] = useLocalStorage<Exercise[]>('exercises', EXERCISES_DATA);
  const [activeView, setActiveView] = useState('dashboard');

  const handleSaveWorkout = (newLog: WorkoutLog) => {
    setWorkoutHistory(prevHistory => [...prevHistory, newLog]);
  };

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard profile={profile} workoutHistory={workoutHistory} onNavigate={setActiveView} />;
      case 'profile':
        return <Profile profile={profile} onUpdateProfile={setProfile} />;
      case 'ai_assistant':
        return <AIAssistant profile={profile} workoutHistory={workoutHistory} onSaveRoutine={handleSaveWorkout} />;
      case 'history':
        return <History workoutHistory={workoutHistory} exercises={exercises} />;
      case 'nutrition_ai':
        return <NutritionAI profile={profile} onNavigate={setActiveView} />;
      default:
        return <Dashboard profile={profile} workoutHistory={workoutHistory} onNavigate={setActiveView} />;
    }
  };

  return (
    <div className="min-h-screen bg-dark font-sans">
      <main className="pb-20 md:pb-0 md:pl-20">
        <div className="max-w-4xl mx-auto">
          {renderView()}
        </div>
      </main>
      <nav className="fixed bottom-0 left-0 w-full bg-light-dark md:w-20 md:h-full md:top-0">
        <ul className="flex justify-around items-center h-16 md:flex-col md:h-full md:py-8">
          <NavItem icon="dashboard" label="Dashboard" active={activeView === 'dashboard'} onClick={() => setActiveView('dashboard')} />
          <NavItem icon="history" label="Historial" active={activeView === 'history'} onClick={() => setActiveView('history')} />
          <NavItem icon="brain" label="Coach" active={activeView === 'ai_assistant'} onClick={() => setActiveView('ai_assistant')} />
          <NavItem icon="user" label="Perfil" active={activeView === 'profile'} onClick={() => setActiveView('profile')} />
        </ul>
      </nav>
    </div>
  );
};

interface NavItemProps {
  icon: string;
  label: string;
  active: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active, onClick }) => (
  <li>
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center space-y-1 w-20 h-16 md:h-20 transition-colors duration-200 rounded-lg ${
        active ? 'text-primary' : 'text-medium hover:text-light'
      }`}
    >
      <Icon name={icon} className="w-7 h-7" />
      <span className="text-xs font-medium">{label}</span>
    </button>
  </li>
);

export default App;