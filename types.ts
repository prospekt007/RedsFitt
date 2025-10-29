export enum ExperienceLevel {
  Beginner = 'Principiante',
  Intermediate = 'Intermedio',
  Advanced = 'Avanzado',
}

export enum UserGoal {
  GainStrength = 'Ganar Fuerza',
  LoseWeight = 'Perder Peso',
  Tone = 'Tonificar',
  Maintain = 'Mantener Forma',
}

export enum Gender {
  Male = 'Masculino',
  Female = 'Femenino',
  Other = 'Otro',
}

export enum MuscleGroup {
  Legs = 'Piernas',
  Back = 'Espalda',
  Chest = 'Pecho',
  Arms = 'Brazos',
  Shoulders = 'Hombros',
  Abs = 'Abdomen',
  Glutes = 'Glúteos',
  FullBody = 'Cuerpo Completo',
}

export interface UserProfile {
  name: string;
  age: number;
  gender: Gender;
  height: number; // in cm
  weight: number; // in kg
  experience: ExperienceLevel;
  goal: UserGoal;
}

export interface ProgressMetric {
  date: string; // ISO string
  weight: number; // kg
  bodyFat?: number; // percentage
}

export interface Exercise {
  id: string;
  name: string;
  description: string;
  muscleGroup: MuscleGroup;
  equipment: string;
  technique: string;
  imageUrl: string;
}

export interface WorkoutSet {
  reps: number;
  weight: number; // in kg
}

export interface LoggedExercise {
  exerciseId: string;
  sets: WorkoutSet[];
  notes?: string;
}

export interface WorkoutLog {
  id: string;
  date: string; // ISO string
  name: string;
  exercises: LoggedExercise[];
}

export interface AiRoutineExercise {
    name: string;
    sets: string;
    reps: string;
}

export interface AiRoutineDay {
    day: number;
    name: string;
    focus: string;
    exercises: AiRoutineExercise[];
}

export interface AiRoutine {
    week: number;
    plan: AiRoutineDay[];
    rationale: string;
}

export interface ChatMessage {
    role: 'user' | 'model';
    parts: { text: string }[];
}
