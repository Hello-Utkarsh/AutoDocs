import express from 'express'
const chat = express.Router()
import { GoogleGenerativeAI } from '@google/generative-ai'
const genAI = new GoogleGenerativeAI(process.env.VITE_API_KEY);

chat.post('/', async (req, res) => {
    try {
        const { prompt } = await req.body
        if (!prompt) {
            return res.status(400).json({ message: 'Please provide a prompt' })
        }
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();
        return res.status(200).json({ message: text })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
})

export default chat