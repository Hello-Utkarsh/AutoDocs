import React from 'react'
import ChatBot from '../components/ChatBot'
import Navbar from '../components/Navbar'
import Editor from '../components/Editor'

const Dashboards = () => {
  return (
    <div>
      <Navbar />
      <div className='flex justify-around w-full mt-16 h-[80vh]'>
        <Editor />
        <ChatBot />
      </div>
    </div>
  )
}

export default Dashboards
