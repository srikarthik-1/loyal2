import { GoogleGenAI } from "@google/genai";
import { Customer } from '../types';

// FIX: Per guidelines, assume API_KEY is present and do not add checks for it.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAiInsights = async (customers: Customer[], prompt: string): Promise<string> => {
  try {
    // Sanitize data for privacy and size
    const sanitizedCustomers = customers.map(({ name, pin, ...rest }) => ({
      ...rest,
      customerId: `CUST-${rest.mobile.slice(-4)}` // Anonymize customer slightly
    }));

    // FIX: Use systemInstruction for better prompt structure.
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
        return "No response from AI model.";
    }

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        return `An error occurred while fetching insights: ${error.message}`;
    }
    return "An unknown error occurred while fetching insights.";
  }
};
