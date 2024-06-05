import { useState } from 'react'
import { useAuth } from '@clerk/clerk-react'
import './App.css'
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from '@clerk/clerk-react'
import Navbar from '../components/Navbar'
import { useNavigate } from 'react-router-dom'

function App() {

  const user = useUser()
  const { getToken } = useAuth()
  const navigate = useNavigate()
  
  if (user.isSignedIn) {
    navigate('/main')
  }
  
  const [count, setCount] = useState("")
  const [format, setFormat] = useState("")

  // trial fetches
  const abc = async () => {
    try {
      const a = await fetch('http://localhost:3000/table/get-table', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "user_id": user.id
        })
      })
      const res = await a.json()
      console.log(res)
    }
    catch (error) {
      console.log(error)
    }
  }


  // abc()

  return (
    <div className='text-white text-xl'>
      <Navbar />
    </div>
  )
}

export default App
{/* <textarea type="text" onChange={(e) => setCount(e.target.value)} />
        <button onClick={abc}>click</button>
        <p>{format ? format.split('\n').map(e => { return <p>{e}</p> }) : null}</p> */}