import { Exercise, MuscleGroup } from '../types';

export const EXERCISES_DATA: Exercise[] = [
  // Pecho
  {
    id: 'chest_1',
    name: 'Press de Banca con Barra',
    description: 'Ejercicio fundamental para el desarrollo del pectoral, hombros y tríceps.',
    muscleGroup: MuscleGroup.Chest,
    equipment: 'Barra, Banco plano',
    technique: 'Acuéstate en el banco, agarra la barra con las manos un poco más anchas que los hombros. Baja la barra al pecho y empuja hacia arriba.',
    imageUrl: 'https://picsum.photos/seed/benchpress/400/300',
  },
  {
    id: 'chest_2',
    name: 'Flexiones',
    description: 'Ejercicio de peso corporal clásico para el pecho.',
    muscleGroup: MuscleGroup.Chest,
    equipment: 'Ninguno',
    technique: 'Manos al ancho de los hombros, cuerpo recto. Baja el pecho hasta casi tocar el suelo y empuja hacia arriba.',
    imageUrl: 'https://picsum.photos/seed/pushups/400/300',
  },
  // Espalda
  {
    id: 'back_1',
    name: 'Dominadas',
    description: 'Excelente para desarrollar la amplitud de la espalda.',
    muscleGroup: MuscleGroup.Back,
    equipment: 'Barra de dominadas',
    technique: 'Agarra la barra con las palmas hacia afuera. Sube el cuerpo hasta que la barbilla pase la barra.',
    imageUrl: 'https://picsum.photos/seed/pullups/400/300',
  },
  {
    id: 'back_2',
    name: 'Remo con Barra',
    description: 'Ejercicio clave para la densidad de la espalda.',
    muscleGroup: MuscleGroup.Back,
    equipment: 'Barra',
    technique: 'Inclina el torso hacia adelante con la espalda recta. Tira de la barra hacia la parte baja del abdomen.',
    imageUrl: 'https://picsum.photos/seed/barbellrow/400/300',
  },
  // Piernas
  {
    id: 'legs_1',
    name: 'Sentadillas con Barra',
    description: 'El rey de los ejercicios de piernas.',
    muscleGroup: MuscleGroup.Legs,
    equipment: 'Barra, Rack',
    technique: 'Coloca la barra sobre los trapecios. Baja como si te sentaras en una silla, manteniendo la espalda recta.',
    imageUrl: 'https://picsum.photos/seed/squats/400/300',
  },
  {
    id: 'legs_2',
    name: 'Zancadas',
    description: 'Trabaja cuádriceps, glúteos e isquiotibiales de forma unilateral.',
    muscleGroup: MuscleGroup.Legs,
    equipment: 'Mancuernas (opcional)',
    technique: 'Da un paso adelante y baja la rodilla trasera casi hasta el suelo. Vuelve a la posición inicial y alterna.',
    imageUrl: 'https://picsum.photos/seed/lunges/400/300',
  },
    // Hombros
  {
    id: 'shoulders_1',
    name: 'Press Militar con Barra',
    description: 'Ejercicio fundamental para desarrollar la fuerza y el tamaño de los hombros.',
    muscleGroup: MuscleGroup.Shoulders,
    equipment: 'Barra',
    technique: 'De pie, con la barra a la altura de la clavícula, empújala por encima de la cabeza hasta extender los brazos por completo.',
    imageUrl: 'https://picsum.photos/seed/overheadpress/400/300',
  },
  // Brazos
  {
    id: 'arms_1',
    name: 'Curl de Bíceps con Mancuernas',
    description: 'Ejercicio clásico para aislar y desarrollar los bíceps.',
    muscleGroup: MuscleGroup.Arms,
    equipment: 'Mancuernas',
    technique: 'De pie o sentado, con una mancuerna en cada mano, flexiona los codos para llevar las pesas hacia los hombros.',
    imageUrl: 'https://picsum.photos/seed/bicepcurl/400/300',
  },
  // Abdomen
  {
    id: 'abs_1',
    name: 'Plancha Abdominal',
    description: 'Ejercicio isométrico para fortalecer todo el core.',
    muscleGroup: MuscleGroup.Abs,
    equipment: 'Ninguno',
    technique: 'Mantén el cuerpo en línea recta, apoyado en los antebrazos y las puntas de los pies. Contrae el abdomen.',
    imageUrl: 'https://picsum.photos/seed/plank/400/300',
  },
];
