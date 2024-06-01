import React, { useState } from 'react'
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_API_KEY);

async function GenerateChat(prompt) {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text
}

const Gemini = () => {
    const [prompt, setPropmt] = useState("")
    const [chat, setChat] = useState({})
    const Chat = async () => {
        const response = await GenerateChat(prompt)
        setChat([prompt, response])
    }
    return (
        <div>
            <input onChange={(e) => setPropmt(e.target.value)} className='chat-input' type="text" />
            <button onClick={Chat}>Submit</button>
        </div>
    )
}

export default Gemini
