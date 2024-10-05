import React, { useState } from 'react'
import ChatBot from '../components/ChatBot'
import Navbar from '../components/Navbar'
import Editor from '../components/Editor'

const Dashboards = () => {
  const [open, setOpen] = useState(false)
  return (
    <div className='flex justify-between w-[84%] h-screen'>
      <Editor />
      <button className='absolute rounded-full w-12 h-12 bg-[#024643] right-8 bottom-5 flex justify-center items-center' onClick={() => { setOpen((prev) => !prev) }}><img className='h-7' src="/chat.png" alt="" /></button>
      <div className={`absolute right-2 h-${open ? "96" : "0"} bottom-20 w-[21%] z-10 ${open ? "border-2" : ""} border-[#191818] rounded-lg transition-all duration-500 overflow-x-hidden`}>
        <ChatBot />
      </div>
    </div>
  )
}

export default Dashboards
