import { useUser } from '@clerk/clerk-react'
import React, { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { note_id, doc_created, table_id } from '../states/state'

const SideBar = () => {

  const select_note_id = useSetRecoilState(note_id)
  const [tables_created, set_table_created] = useState(false)
  const [is_doc_created, set_doc_created] = useRecoilState(doc_created)
  const set_table_id = useSetRecoilState(table_id)
  const [table, setTable] = useState([])
  const [new_table_name, setNewTable] = useState("")
  const [new_table_content, setNewContent] = useState("")
  const [dialog_state, setDialog] = useState()
  const user = useUser()
  const navigate = useNavigate()

  const user_data = async () => {

    const table_req = await fetch(`${import.meta.env.VITE_PORT}/table/get-table`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 'user_id': user.user.id })
    })
    const req = await table_req.json()

    const docs_req = await fetch(`${import.meta.env.VITE_PORT}/docs/get-docs`, {
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

      new_table.add(table_docs);
    })
    
    return new_table
  }

  const createTable = async () => {
    console.log(new_table_content, new_table_name, user.user.id)
    const req = await fetch(`${import.meta.env.VITE_PORT}/table/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: new_table_name,
        content: new_table_content,
        user_id: user.user.id
      })
    })
    const response = await req.json()
    console.log(response)
    setDialog(false)
    set_table_created(true)
  }

  useEffect(() => {
    if (!user.isSignedIn) {
      navigate('/')
    }
    const ta = user_data().then(data => {
      setTable([...data])
    })

    set_doc_created(false)
  }, [is_doc_created, doc_created, tables_created])

  return (
    <div className='flex mt-20 w-full justify-between'>
      <div className='w-[16%] rounded-r-xl bg-[#E5E5CB] h-[80vh] text-left py-4'>

        {table ? table.map((t) => {

          return <div className='my-1 py-1 w-full rounded-sm'>
            <p className='px-3 hover:bg-[#3C2A21] hover:text-[#E5E5CB]'>{Object.keys(t)}</p>
            <div className='py-1 px-3'>

              {t[Object.keys(t)].map((note) => {
                return <p onClick={() => { select_note_id(note.id) }} className='px-3 hover:bg-[#3C2A21] rounded-md hover:text-[#E5E5CB] cursor-pointer'>{note.name}</p>
              })}
              <p onClick={() => set_table_id(t[Object.keys(t)][0].table_id)} className='px-3 hover:bg-[#3C2A21] rounded-md hover:text-[#E5E5CB] cursor-pointer'>Create New</p>

            </div>
          </div>
        }) : console.log(table)}

        <button onClick={() => setDialog(true)} className='my-1 px-3 py-1 w-full rounded-sm text-start hover:bg-[#3C2A21] hover:text-[#E5E5CB]'>New Table</button>

        {dialog_state ? <dialog open className='bg-[#D5CEA3] rounded-2xl z-10'>
          <div className='h-64 w-72 z-10 rounded-2xl fixed flex flex-col top-[30%] left-[35%] bg-[#D5CEA3] text-[#3C2A21] items-center justify-center py-6 px-6'>
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
