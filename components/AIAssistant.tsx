
import React, { useState, useCallback, useMemo } from 'react';
import type { UserProfile, WorkoutLog, AiRoutine, LoggedExercise, WorkoutSet } from '../types';
import { generateAIRoutine } from '../services/geminiService';
import Icon from './Icon';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface AIAssistantProps {
  profile: UserProfile;
  workoutHistory: WorkoutLog[];
  onSaveRoutine: (log: WorkoutLog) => void;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ profile, workoutHistory, onSaveRoutine }) => {
  const [routine, setRoutine] = useLocalStorage<AiRoutine | null>('ai_routine', null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [completedKeys, setCompletedKeys] = useLocalStorage<string[]>('ai_completed_exercises', []);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  
  const completedExercises = useMemo(() => new Set(completedKeys), [completedKeys]);

  const totalExercises = useMemo(() => {
    if (!routine) return 0;
    return routine.plan.reduce((total, day) => total + day.exercises.length, 0);
  }, [routine]);

  const allExercisesCompleted = useMemo(() => {
    if (totalExercises === 0) return false;
    return completedKeys.length === totalExercises;
  }, [completedKeys, totalExercises]);

  const handleToggleComplete = (dayIndex: number, exIndex: number) => {
    const key = `${dayIndex}-${exIndex}`;
    setCompletedKeys(prev => {
      if (prev.includes(key)) {
        return prev.filter(k => k !== key);
      } else {
        return [...prev, key];
      }
    });
  };

  const handleFinishRoutine = () => {
    if (!routine || !allExercisesCompleted) return;

    const loggedExercises: LoggedExercise[] = [];
    
    routine.plan.forEach(day => {
      day.exercises.forEach(exerciseData => {
        const numSets = parseInt(exerciseData.sets.split('-')[0], 10) || 3;
        const sets: WorkoutSet[] = [];
        for (let i = 0; i < numSets; i++) {
            const reps = parseInt(exerciseData.reps.split('-')[0], 10) || 8;
            sets.push({ reps, weight: 0 });
        }

        loggedExercises.push({
            exerciseId: exerciseData.name,
            sets,
            notes: 'Completado desde rutina de Coach IA. El peso no fue registrado.',
        });
      });
    });

    if (loggedExercises.length > 0) {
        const newLog: WorkoutLog = {
            id: new Date().toISOString(),
            date: new Date().toISOString(),
            name: `Rutina de Coach IA - Semana ${routine.week}`,
            exercises: loggedExercises,
        };
        onSaveRoutine(newLog);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
        
        setRoutine(null);
        setCompletedKeys([]);
    }
  };

  const handleGenerateRoutine = useCallback(async () => {
    setLoading(true);
    setError(null);
    setRoutine(null);
    setCompletedKeys([]);
    try {
      const result = await generateAIRoutine(profile, workoutHistory);
      if (result) {
        setRoutine(result);
      } else {
        setError("No se pudo generar la rutina. Inténtalo de nuevo.");
      }
    } catch (err) {
      setError("Ocurrió un error al contactar al asistente de IA.");
    } finally {
      setLoading(false);
    }
  }, [profile, workoutHistory, setRoutine, setCompletedKeys]);

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="text-center">
        <Icon name="brain" className="w-16 h-16 mx-auto text-primary" />
        <h1 className="text-3xl md:text-4xl font-bold text-light mt-2">Coach de IA</h1>
        <p className="text-medium mt-2">Obtén un plan de entrenamiento semanal personalizado según tus objetivos y progreso.</p>
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleGenerateRoutine}
          disabled={loading}
          className="bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-primary-dark transition-colors duration-200 disabled:bg-gray-500 flex items-center justify-center w-full md:w-auto"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            'Generar Mi Rutina'
          )}
        </button>
      </div>

      {error && <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded-lg text-center">{error}</div>}
      
      {saveSuccess && <div className="bg-green-900 border border-green-700 text-green-100 px-4 py-3 rounded-lg text-center">¡Rutina guardada en tu historial con éxito!</div>}

      {routine && (
        <div className="bg-light-dark p-4 md:p-6 rounded-lg space-y-6">
          <h2 className="text-2xl font-bold text-primary">Tu Plan Semanal (Semana {routine.week})</h2>
          <p className="text-gray-300 italic">"{routine.rationale}"</p>
          <div className="space-y-4">
            {routine.plan.map((day, dayIndex) => (
              <div key={day.day} className="bg-dark p-4 rounded-md">
                <h3 className="text-xl font-semibold">{day.name} - <span className="text-primary">{day.focus}</span></h3>
                <ul className="mt-2 space-y-2">
                  {day.exercises.map((ex, exIndex) => (
                    <li key={exIndex} className="flex justify-between items-center text-gray-300">
                      <label htmlFor={`ex-${dayIndex}-${exIndex}`} className="flex items-center space-x-3 cursor-pointer select-none">
                        <input
                          id={`ex-${dayIndex}-${exIndex}`}
                          type="checkbox"
                          checked={completedExercises.has(`${dayIndex}-${exIndex}`)}
                          onChange={() => handleToggleComplete(dayIndex, exIndex)}
                          className="w-5 h-5 bg-gray-700 border-gray-600 rounded text-primary focus:ring-primary focus:ring-offset-dark focus:ring-2"
                        />
                        <span>{ex.name}</span>
                      </label>
                      <span className="font-mono bg-light-dark px-2 py-1 rounded-md text-sm">{ex.sets} x {ex.reps}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
           <div className="mt-6 flex justify-center">
            <button
                onClick={handleFinishRoutine}
                disabled={!allExercisesCompleted || loading}
                className="bg-secondary text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center"
            >
                <Icon name="history" className="w-5 h-5 mr-2" />
                Finalizar Rutina
            </button>
        </div>
        </div>
      )}

      {!loading && !routine && (
        <div className="text-center text-gray-400 border-2 border-dashed border-gray-600 p-8 rounded-lg">
          <p>Tu rutina generada por IA aparecerá aquí.</p>
          <p className="text-sm">¡Haz clic en el botón para comenzar!</p>
        </div>
      )}
    </div>
  );
};

export default AIAssistant;
