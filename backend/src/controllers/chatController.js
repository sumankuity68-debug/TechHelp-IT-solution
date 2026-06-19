import { GoogleGenAI } from '@google/genai';

// Initialize the Google Gen AI SDK
// The SDK automatically picks up the GEMINI_API_KEY environment variable if instantiated without arguments,
// but we explicitly pass it for clarity.
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/**
 * @desc    Handle chat messages from the frontend and respond using Gemini
 * @route   POST /api/chat
 * @access  Public
 */
export const handleChatMessage = async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message is required',
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        success: false,
        message: 'Gemini API key is not configured on the server.',
      });
    }

    // Prepare the system instruction to guide the AI's persona
    const systemInstruction = `You are the Virtual Assistant for 'TechHelp IT Solutions', a premium IT agency. 
Your goal is to help users understand our services (Web Development, App Development, Digital Marketing, UI/UX Design), 
assist them with navigating the site, and encourage them to contact us or create an account if they need advanced help. 
If a user asks to fix a meeting, book a schedule, or contact us directly, politely tell them they can book a meeting with us here: [Book a Meeting](/book-meeting).
Keep your answers concise, professional, friendly, and formatted nicely. Do not invent pricing or services we don't offer.`;

    // Convert frontend history format to Gemini format if needed, 
    // or just pass the current message for simplicity.
    // For a simple implementation, we'll just use generateContent with system instruction.
    
    // Construct prompt with some context from history if provided
    let fullPrompt = message;
    if (history && Array.isArray(history) && history.length > 0) {
      const formattedHistory = history.map(msg => `${msg.sender === 'user' ? 'User' : 'Assistant'}: ${msg.text}`).join('\n');
      fullPrompt = `Previous conversation:\n${formattedHistory}\n\nUser: ${message}\nAssistant:`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      }
    });

    return res.status(200).json({
      success: true,
      reply: response.text,
    });

  } catch (error) {
    console.error('Chatbot API Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Sorry, I am having trouble connecting to my brain right now. Please try again later.',
    });
  }
};
