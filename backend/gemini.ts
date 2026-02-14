import { GoogleGenAI } from "@google/genai";
import { Customer } from '../types';

// Gracefully handle environments where process.env is not defined (like a raw browser environment).
const getApiKey = (): string | undefined => {
    try {
        // This check is designed to work in environments that have process.env
        // and not crash in those that don't.
        if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
            return process.env.API_KEY;
        }
    } catch (e) {
        console.warn("Could not access process.env.API_KEY. AI features will be disabled.", e);
    }
    return undefined;
};

const apiKey = getApiKey();
// Initialize the AI client only if the API key is available.
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const generateAiInsightsForData = async (customers: Customer[], prompt: string): Promise<string> => {
  // If the AI client wasn't initialized, throw a helpful error that will be caught by the UI.
  if (!ai) {
      throw new Error("AI service is not configured. The API_KEY is not available in this environment.");
  }
    
  try {
    // Sanitize data for privacy and size
    const sanitizedCustomers = customers.map(({ name, pin, ...rest }) => ({
      ...rest,
      customerId: `CUST-${rest.mobile.slice(-4)}` // Anonymize customer slightly
    }));

    const systemInstruction = `You are a world-class data analyst for a high-end customer loyalty program called "Loyalty Pro".
Your task is to analyze the provided customer data and answer the user's question with actionable insights.

The data is provided as an array of JSON objects. Each object represents a customer.
- 'mobile': Customer's mobile number.
- 'points': Current loyalty points balance.
- 'totalSpent': Lifetime spending in Rupees (₹).
- 'history': An array of their past transactions, including 'date', 'bill' amount, and 'points' earned.
- 'customerId': A unique anonymous identifier for the customer.

Based on the data provided, please answer the user's question. Provide a concise, well-formatted, and insightful response. Use markdown for formatting if it helps clarity (e.g., lists, bold text).`;

    const userContent = `
Here is the customer data:
\`\`\`json
${JSON.stringify(sanitizedCustomers, null, 2)}
\`\`\`

User's Question: "${prompt}"
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userContent,
      config: {
        systemInstruction,
      },
    });

    if (response && response.text) {
        return response.text;
    } else {
        throw new Error("No response from AI model.");
    }

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`An error occurred while fetching insights: ${error.message}`);
    }
    throw new Error("An unknown error occurred while fetching insights.");
  }
};