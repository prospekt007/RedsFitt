
import React, { useState } from 'react';
import { WorkoutLog, Exercise } from '../types';
import Icon from './Icon';

interface HistoryProps {
  workoutHistory: WorkoutLog[];
  exercises: Exercise[];
}

const History: React.FC<HistoryProps> = ({ workoutHistory, exercises }) => {
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  const getExerciseName = (id: string) => {
    return exercises.find(ex => ex.id === id)?.name || id;
  }

  const toggleExpand = (id: string) => {
    setExpandedLogId(expandedLogId === id ? null : id);
  };
  
  const sortedHistory = [...workoutHistory].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="p-4 md:p-6 space-y-6">
      <h1 className="text-3xl md:text-4xl font-bold text-light">Historial de Entrenamientos</h1>
      
      {sortedHistory.length === 0 ? (
        <div className="text-center text-gray-400 border-2 border-dashed border-gray-600 p-8 rounded-lg">
          <p>Aún no has registrado ningún entrenamiento.</p>
          <p className="text-sm">¡Completa tu primera sesión para verla aquí!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedHistory.map((log) => (
            <div key={log.id} className="bg-light-dark rounded-lg overflow-hidden">
              <button
                onClick={() => toggleExpand(log.id)}
                className="w-full p-4 text-left flex justify-between items-center"
              >
                <div>
                  <p className="font-bold text-lg text-primary">{log.name}</p>
                  <p className="text-sm text-gray-400">
                    {new Date(log.date).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
                <Icon name="chevronDown" className={`w-6 h-6 transform transition-transform ${expandedLogId === log.id ? 'rotate-180' : ''}`} />
              </button>
              {expandedLogId === log.id && (
                <div className="px-4 pb-4 border-t border-gray-700">
                  <ul className="mt-4 space-y-4">
                    {log.exercises.map((loggedEx, index) => (
                      <li key={index} className="bg-dark p-3 rounded-md">
                        <p className="font-semibold text-light">{getExerciseName(loggedEx.exerciseId)}</p>
                        <ul className="mt-2 space-y-1 text-sm text-gray-300">
                          {loggedEx.sets.map((set, setIndex) => (
                            <li key={setIndex} className="flex justify-between">
                              <span>Serie {setIndex + 1}:</span>
                              <span className="font-mono">{set.reps} reps @ {set.weight} kg</span>
                            </li>
                          ))}
                        </ul>
                        {loggedEx.notes && <p className="mt-2 text-xs italic text-gray-400">Nota: {loggedEx.notes}</p>}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
