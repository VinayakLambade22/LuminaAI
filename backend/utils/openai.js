import "dotenv/config";
import { GoogleGenerativeAI } from "@google/generative-ai";


// const getOpenAIAPIResponse = async (message) => {
//   const options = {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: Bearer ${process.env.OPENAI_API_KEY},
//     },
//     body: JSON.stringify({
//       model: "gpt-4o-mini", // ✅ use valid model name
//       messages: [
//         {
//           role: "user",
//           content: message,
//         },
//       ],
//     }),
//   };

//   try {
//     const response = await fetch(
//       "https://api.openai.com/v1/chat/completions",
//       options
//     );
//     const data = await response.json();

//     if (!data.choices || data.choices.length === 0) {
//       console.error("OpenAI API Error:", data);
//       throw new Error(data.error?.message || "No choices returned");
//     }

//     return data.choices[0].message.content; // reply
//   } catch (err) {
//     console.error("Error in getOpenAIAPIResponse:", err.message);
//     return "Sorry, I couldn't process your request.";
//   }
// };

// export default getOpenAIAPIResponse;




const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const getGeminiAPIResponse = async (message) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const result = await model.generateContent(message);
    return result.response.text();
  } catch (err) {
    console.error("Error in getGeminiAPIResponse:", err.message);
    return "Sorry, I couldn't process your request.";
  }
};

export default getGeminiAPIResponse;
