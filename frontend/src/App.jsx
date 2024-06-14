import { useEffect, useState } from 'react'
import { useAuth } from '@clerk/clerk-react'
import './App.css'
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from '@clerk/clerk-react'
import Navbar from '../components/Navbar'
import { useNavigate } from 'react-router-dom'

function App() {

  const user = useUser()
  const navigate = useNavigate()

  useEffect(() => {
    if (user.isSignedIn) {
      navigate('/main')
    }
  })


  return (
    <div className='text-white text-xl'>
      {/* <Navbar /> */}
    </div>
  )
}

export default App
{/* <textarea type="text" onChange={(e) => setCount(e.target.value)} />
        <button onClick={abc}>click</button>
        <p>{format ? format.split('\n').map(e => { return <p>{e}</p> }) : null}</p> */}