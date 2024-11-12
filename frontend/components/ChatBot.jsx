import React, { useRef, useState } from 'react'
import { GoogleGenerativeAI } from '@google/generative-ai';
import { codeBlockLanguages$, codeBlockPlugin, codeMirrorPlugin, headingsPlugin, linkPlugin, listsPlugin, MDXEditor } from '@mdxeditor/editor';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_API_KEY);

async function GenerateChat(prompt) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  return text
}

const ChatBot = () => {

  const [prompt, setPropmt] = useState("")
  const [chat, setChat] = useState([])
  const inputRef = useRef()

  const Chat = async () => {
    try {
      const response = await GenerateChat(prompt)
      const document = response.replace(/```javascript|```\njavascript|```python|```\npython|```bash|```\nbash/g, '```js')
      setChat(p => [...p, [prompt, document]])
    } catch (error) {
      console.log(error.message)
      setChat(p => [...p, [prompt, "Sorry, there was a problem"]])
    }
  }

  return (
    <div className='w-full h-full bg-transparent rounded-l-xl flex relative'>
      <div className='absolute bottom-0 w-full rounded-md bg-[#024643] flex justify-between items-center pr-2 py-1'>
        <input ref={inputRef} onChange={(e) => setPropmt(e.target.value)} className='chat-input h-8 px-1 bg-[#547B79] rounded-lg text-[#E1F7DD] w-full mx-1 text-sm' type="text" />
        <span onClick={Chat} class="material-symbols-outlined text-[#024643] cursor-pointer bg-[#E1F7DD] rounded-full px-1 py-1">
          arrow_upward
        </span>
      </div>
      <div className='flex flex-col px-3 w-full max-h-[21rem] overflow-y-auto'>
        {chat.length > 0 ? chat.map(text => {
          return <div className='flex flex-col w-[100%] text-[#E1F7DD] relative'>
            <p className='text-left w-fit py-1 px-3 my-2 text-sm rounded-xl bg-[#024643]'>{text[0]}</p>
            <MDXEditor readOnly className='chat-mdx text-left w-fit my-2 text-sm rounded-xl bg-[#024643]' markdown={text[1]} plugins={[headingsPlugin(), listsPlugin(), linkPlugin(), codeBlockPlugin({ defaultCodeBlockLanguage: 'js' }),
            codeMirrorPlugin({ codeBlockLanguages: { js: 'JavaScript', css: 'CSS' } }),]} />
          </div>
        }) : <p className='text-left w-fit py-1 px-3 my-2 text-sm rounded-xl text-[#E1F7DD] bg-[#024643]'>Hello, how can i help you</p>}
      </div>
    </div>
  )
}

export default ChatBot
