import { GoogleGenAI, Type } from "@google/genai";
import { CardData } from "../types";

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const processNaturalLanguageEdit = async (
  currentData: CardData,
  userPrompt: string
): Promise<CardData> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
        You are an AI assistant helping a user edit a business card.
        Current JSON state of the card:
        ${JSON.stringify(currentData)}

        User Request: "${userPrompt}"

        Instructions:
        1. Analyze the user's request. It might be in Bulgarian or English.
        2. Update the JSON state based on the request (e.g., "change phone for Plamen to X").
        3. Return the FULL updated JSON object.
        4. If the user wants to translate content, translate the relevant fields.
        5. Maintain the structure exactly.
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            companyNameMain: { type: Type.STRING },
            companyNameSuffix: { type: Type.STRING },
            companyType: { type: Type.STRING },
            slogan: { type: Type.STRING },
            address: { type: Type.STRING },
            email1: { type: Type.STRING },
            email2: { type: Type.STRING },
            website: { type: Type.STRING },
            phone1: { type: Type.STRING },
            person1: { type: Type.STRING },
            phone2: { type: Type.STRING },
            person2: { type: Type.STRING },
            phone3: { type: Type.STRING },
            person3: { type: Type.STRING },
          },
        },
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as CardData;
    }
    throw new Error("No response text from Gemini");
  } catch (error) {
    console.error("Gemini Edit Error:", error);
    throw error;
  }
};