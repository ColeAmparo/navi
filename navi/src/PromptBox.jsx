// PromptBox.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'


const api_key = import.meta.env.VITE_OPENAI_API_KEY;


const PromptBox = () => {


  const navi_prompt = "Train an AI called Navi to serve as a comprehensive troubleshooting guide for video game-related issues. Ensure the AI can address diverse problems players encounter during gameplay, such as graphical glitches, controller malfunctions, network connectivity issues, performance optimization, and gameplay strategies. Encourage the AI to provide clear, concise, and user-friendly responses, offering step-by-step instructions or troubleshooting tips. Enable the AI to adapt and learn from user interactions, continually improving its ability to provide accurate and helpful advice. Use a conversational tone in the AI's responses to enhance user engagement."

  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchResponse = async () => {

    console.log(isLoading)
    setError(null);
    setIsLoading(true);


    axios.post('https://api.openai.com/v1/chat/completions', {
    max_tokens: 3000,
    model: "gpt-3.5-turbo",
    messages: [{"role": "user", "content": `${navi_prompt} Have Navi respond to the user's following prompt: ${prompt.trim()}. 
    Start every response with "Hey Listen!"s and make sure to use dashes`}],
    temperature: 0,
  },
  {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${api_key}`
    }
  }
)
.then(response => {
    // Extract the generated text from the API response
    const generatedText = response.data.choices[0].message.content;
    setResponse(generatedText);
    console.log(generatedText)
  })
  .catch(error => {
    setError('Error fetching response. Please try again later.');
    console.log(error);
  });

  setIsLoading(false);

  };

  return (
    <div className="relative bg-white px-6 pt-10 pb-8 shadow-xl ring-1 ring-gray-900/5 sm:mx-auto sm:max-w-lg sm:rounded-lg sm:px-10">
      <div className="w-full mb-4 border border-gray-200 rounded-lg bg-gray-50">
        <div className=" px-4 py-2 bg-white rounded-t-lg">
            <textarea 
                className="w-full px-0 text-sm text-gray-900 bg-white border-0 focus:ring-0 dark:text-blue dark:placeholder-gray-400"
                type="text" 
                value={prompt} 
                onChange={(e) => setPrompt(e.target.value)} 
                placeholder="Hey! Ask me a question!"
            />
        </div>
        <button className="inline-flex items-left py-2.5 px-4 text-xs font-medium text-center"
         onClick={fetchResponse} disabled={isLoading || !prompt.trim() }>
            {isLoading ? "Loading..." : 'Generate Response'}
        </button>
      </div>
      <div className="">
        {error && <p>{error}</p>}
        {response && <div className=' bg-white px-6 pt-10 pb-8 shadow-xl ring-1 ring-gray-900/5 sm:mx-auto sm:max-w-lg 
        sm:rounded-lg sm:px-10'><Markdown>{response}</Markdown></div>}
      </div>
    </div>
  );
};

export default PromptBox;