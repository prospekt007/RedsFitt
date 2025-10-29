import { GoogleGenAI, Type } from "@google/genai";
import type { UserProfile, WorkoutLog, AiRoutine, ChatMessage } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // This is a fallback for development and should be handled by the environment.
  console.warn("API_KEY is not set in environment variables. AI features will not work.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const model = "gemini-2.5-flash";

export const getNutritionAdvice = async (
    userPrompt: string,
    history: ChatMessage[],
    profile: UserProfile
): Promise<string> => {
    try {
        const systemInstruction = `
            Eres 'Tragón IA', un experto mundial en nutrición deportiva y alimentación saludable. Tu propósito es proporcionar consejos claros, detallados y prácticos.
            - Personalización: Basa tus respuestas en el perfil del usuario (edad: ${profile.age}, género: ${profile.gender}, peso: ${profile.weight}kg, altura: ${profile.height}cm, objetivo: ${profile.goal}, experiencia: ${profile.experience}) para ofrecer recomendaciones personalizadas. No menciones sus datos explícitamente a menos que sea relevante para la consulta.
            - Detalle en Recetas: Cuando recomiendes recetas, incluye una lista clara de ingredientes con cantidades, pasos detallados para la preparación y una explicación de por qué es beneficiosa para el objetivo del usuario.
            - Adaptabilidad: Si el usuario menciona alergias, restricciones (vegano, sin gluten, etc.) o preferencias, adapta tus sugerencias de manera estricta.
            - Claridad Conceptual: Explica conceptos como macronutrientes, calorías, y micronutrientes de forma sencilla y aplicable.
            - Formato: Utiliza markdown simple (negritas con **, listas con -) para que tus respuestas sean fáciles de leer y estructuradas. No uses encabezados (#).
            - Tono: Sé amigable, motivador y profesional. Tu objetivo es empoderar al usuario para que tome mejores decisiones sobre su alimentación.
        `;

        const contents = [
            ...history,
            { role: 'user' as const, parts: [{ text: userPrompt }] }
        ];

        const result = await ai.models.generateContent({
            model,
            contents,
            config: {
                systemInstruction,
                temperature: 0.7,
            },
        });
        
        return result.text.trim();

    } catch (error) {
        console.error("Error getting nutrition advice:", error);
        return "Lo siento, tuve un problema para procesar tu solicitud. Por favor, inténtalo de nuevo más tarde.";
    }
};


export const generateAIRoutine = async (profile: UserProfile, history: WorkoutLog[]): Promise<AiRoutine | null> => {
    try {
        const prompt = `
            Eres un experto entrenador personal de IA. Basado en el siguiente perfil de usuario y su historial de entrenamiento reciente, crea un plan de entrenamiento semanal equilibrado y efectivo de 3 días.

            Perfil de Usuario:
            - Edad: ${profile.age}
            - Género: ${profile.gender}
            - Peso: ${profile.weight} kg
            - Altura: ${profile.height} cm
            - Experiencia: ${profile.experience}
            - Objetivo: ${profile.goal}

            Historial de Entrenamiento Reciente (últimos 5):
            ${history.slice(-5).map(log => `- ${log.date.substring(0, 10)}: ${log.name} (${log.exercises.length} ejercicios)`).join('\n') || 'Sin historial reciente.'}

            Genera el plan en el formato JSON especificado. Cada día debe tener un nombre (ej. 'Día de Empuje'), un enfoque muscular, y una lista de 5-6 ejercicios. Para cada ejercicio, especifica el nombre, número de series y un rango de repeticiones objetivo. Proporciona una breve justificación de tus elecciones.
        `;

        const responseSchema = {
            type: Type.OBJECT,
            properties: {
                week: { type: Type.INTEGER, description: "Número de la semana del plan." },
                plan: {
                    type: Type.ARRAY,
                    description: "Plan de entrenamiento para la semana.",
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            day: { type: Type.INTEGER },
                            name: { type: Type.STRING },
                            focus: { type: Type.STRING },
                            exercises: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        name: { type: Type.STRING },
                                        sets: { type: Type.STRING },
                                        reps: { type: Type.STRING }
                                    },
                                    required: ['name', 'sets', 'reps']
                                }
                            }
                        },
                        required: ['day', 'name', 'focus', 'exercises']
                    }
                },
                rationale: { type: Type.STRING, description: "Justificación del plan de entrenamiento." }
            },
            required: ['week', 'plan', 'rationale']
        };

        const result = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema,
                temperature: 0.7,
            },
        });
        
        const jsonText = result.text.trim();
        return JSON.parse(jsonText) as AiRoutine;

    } catch (error) {
        console.error("Error generating AI routine:", error);
        return null;
    }
};

export const getMotivationalQuote = async (): Promise<string> => {
    try {
        const prompt = "Dame una cita motivacional corta y poderosa sobre fitness o superación personal, en español.";
        const result = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                temperature: 1.0,
                maxOutputTokens: 50,
                // FIX: Added thinkingConfig to prevent an empty response when using maxOutputTokens with gemini-2.5-flash.
                thinkingConfig: { thinkingBudget: 25 },
            }
        });
        return result.text.trim().replace(/"/g, '');
    } catch (error) {
        console.error("Error getting motivational quote:", error);
        return "El único entrenamiento malo es el que no se hizo.";
    }
};