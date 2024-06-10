import React from 'react'
import ChatBot from '../components/ChatBot'
import Navbar from '../components/Navbar'
import Editor from '../components/Editor'

const Dashboards = () => {
  return (
    <div className='flex justify-between w-[83%] h-[80vh]'>
      <Editor />
      <ChatBot />
    </div>
  )
}

export default Dashboards
