import { useUser } from '@clerk/clerk-react'
import React, { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

const SideBar = () => {


  const [table, setTable] = useState([])
  const [new_table_name, setNewTable] = useState("")
  const [new_table_content, setNewContent] = useState("")
  const [dialog_state, setDialog] = useState()
  const user = useUser()
  const navigate = useNavigate()

  const user_data = async () => {
    const table_req = await fetch('http://localhost:3000/table/get-table', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 'user_id': user.user.id })
    })
    const req = await table_req.json()

    const docs_req = await fetch('http://localhost:3000/docs/get-docs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ user_id: user.user.id })
    })
    const docs = await docs_req.json()

    const new_table = new Set()

    // for each table, adding all the notes/docs with the same table id and adding to the table state
    req.user_tables.forEach((t) => {
      const table_docs = { [t.name]: [] }
      docs.docs.forEach((d) => {
        if (d.table_id === t.id) {
          table_docs[t.name].push(d)
        }
      })

      if (!table.some((tab) => Object.keys(tab)[0] === t.name)) {
        new_table.add(table_docs);
      }

      // if(!table.some((tab)=> Object.keys(tab)[0] === t.name)){
      //   setTable((p)=>[...p, table_docs])
      // }
    })

    return new_table
  }

  const createTable = async () => {
    setDialog(false)
  }

  useEffect(() => {
    if (!user.isSignedIn) {
      navigate('/')
    }
    const ta = user_data()
    ta.then(data => {
      console.log(...data)
      setTable([...data])
    })
  }, [])

  return (
    <div className='flex mt-16 w-full justify-between'>
      <div className='w-[16%] rounded-r-xl bg-[#E5E5CB] h-[80vh] text-left py-4'>
        {table ? table.map((t) => {
          console.log(t)
          return <div className='my-1 py-1 w-full rounded-sm'>
            <p className='px-3 hover:bg-[#3C2A21] hover:text-[#E5E5CB]'>{Object.keys(t)}</p>
            <div className='py-1 px-3'>
              <p className='px-3 hover:bg-[#3C2A21] rounded-md hover:text-[#E5E5CB]'>{t[Object.keys(t)][0].name}</p>
            </div>
          </div>
        }) : console.log(table)}
        <button onClick={() => setDialog(true)} className='my-1 px-3 py-1 w-full rounded-sm text-start hover:bg-[#3C2A21] hover:text-[#E5E5CB]'>New Table</button>
        {dialog_state ? <dialog open className='bg-[#D5CEA3] rounded-2xl z-10'>
          <div className='h-64 w-72 z-10 rounded-2xl flex flex-col top-32 bg-[#D5CEA3] text-[#3C2A21] items-center justify-center py-6 px-6'>
            <div className='my-2 w-4/6 flex flex-col'>
              <label htmlFor="">Name</label>
              <input type="text" placeholder='Docker Docs' onChange={(n) => setNewTable(n.target.value)} className='w-full px-2 bg-[#E5E5CB] rounded-md' />
            </div>
            <div className='my-2 w-4/6 flex flex-col'>
              <label htmlFor="">Content Type</label>
              <input type="text" placeholder='notes or docs' onChange={(c) => setNewContent(c.target.value)} className='w-full px-2 bg-[#E5E5CB] rounded-md' />
            </div>
            <button onClick={createTable} className='bg-[#3C2A21] text-[#E5E5CB] w-fit px-3 py-1 rounded-lg mx-auto my-4'>Create</button>
          </div>
        </dialog> : null}
      </div>
      <Outlet />
    </div>
  )
}

export default SideBar
