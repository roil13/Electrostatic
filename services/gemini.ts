
import { GoogleGenAI } from "@google/genai";

export const getPhysicsInsight = async (params: any, results: any) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `
    Based on these electrostatics simulation parameters:
    - Surface Charge Density (sigma): ${params.sigma} C/m^2
    - Charge 1 (q1): ${params.q1} C
    - Mass (m1): ${params.m1} kg
    
    Current Results:
    - Deflection Angle (alpha): ${(results.alpha * 180 / Math.PI).toFixed(2)} degrees
    - Tan(alpha): ${results.tanAlpha.toFixed(3)}
    
    Explain in 2-3 concise Hebrew sentences what would happen if we double the surface charge density, citing the physical law involved. Mention if the relationship is linear.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "שגיאה בחיבור למודל הבינה המלאכותית.";
  }
};
