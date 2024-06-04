import { useState } from 'react'
// import {clerk}
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from '@clerk/clerk-react'

function App() {

  const {user} = useUser()

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
      // const format = res.format
      // console.log(res)
      console.log(res)
      // setFormat(format)
    }
    catch (error) {
      console.log(error)
    }
  }


  // abc()

  return (
    <div className='text-white text-xl'>
      {/* Login and Signin buttons by clerk */}
      <div>
        <textarea type="text" onChange={(e) => setCount(e.target.value)} />
        <button onClick={abc}>click</button>
        <p>{format ? format.split('\n').map(e => { return <p>{e}</p> }) : null}</p>
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </div>
  )
}

export default App
