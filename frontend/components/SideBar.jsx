import { useUser } from '@clerk/clerk-react'
import React, { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { note_id, doc_created, table_id, user_table } from '../states/state'
import { createTable, handleDel, user_data } from '../actions/actions'

const SideBar = () => {

  const select_note_id = useSetRecoilState(note_id)
  const [table_changed, set_table_changed] = useState(false)
  const [is_doc_created, set_doc_created] = useRecoilState(doc_created)
  const set_table_id = useSetRecoilState(table_id)
  const [table, setTable] = useRecoilState(user_table)
  const [new_table_name, setNewTable] = useState("")
  const [new_table_content, setNewContent] = useState("")
  const [dialog_state, setDialog] = useState()
  const user = useUser()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user.isSignedIn) {
      // navigate('/')
    }
    user_data(user).then(data => {
      if (data) {
        setTable([...data])
      }
    })
    // set_doc_created(false)
  }, [is_doc_created, doc_created, table_changed])

  return (
    <div className='flex w-full'>
      <div className='w-[16%] bg-[#024643] h-screen text-left flex flex-col py-2'>
        <h1 className='text-3xl font-semibold text-center mt-2 mb-4 text-[#E1F7DD]'>AutoDocs</h1>

        <div className='bg-[#547B79] mx-1 rounded-lg my-2'>
          {(table.length > 0) && table.map((t) => {
            return (
              <div id='xyz' className='my-2 w-full rounded-sm'>
                <div className='flex justify-between px-3 mx-1 rounded-lg font-semibold text-xl text-[#FAFAFA] items-center'>
                  <p>{Object.keys(t)}</p>
                  <span onClick={() => handleDel(t, table, setTable)} className="material-symbols-outlined text-[19px] font-normal cursor-pointer">
                    delete
                  </span>
                </div>
                <div className='px-3'>
                  {t[Object.keys(t)].map((note) => {
                    return <p key={note.id} onClick={() => { select_note_id(note.id) }} className='px-3 rounded-md cursor-pointer text-[#FAFAFA] mt-2'>{note.name}</p>
                  })}
                  <p onClick={() => set_table_id(t[Object.keys(t)][0].table_id)} className='px-3 rounded-md cursor-pointer text-[#FAFAFA] mt-2 '>Create New</p>

                </div>
              </div>
            )
          })}
        </div>

        <button onClick={() => setDialog(true)} className='text-white mx-auto py-1 w-3/4 text-lg rounded-md bg-[#714DFF] hover:bg-[#714dffd5]'>New Table</button>

        {dialog_state ? <dialog open className='bg-[#D5CEA3] rounded-2xl z-10'>
          <div className='h-64 w-72 z-10 rounded-2xl fixed flex flex-col top-[30%] left-[35%] bg-[#D5CEA3] text-[#3C2A21] items-center justify-center py-6 px-6'>
            <span onClick={() => setDialog(false)} className="material-symbols-outlined cursor-pointer absolute top-4 right-5">
              close
            </span>
            <div className='my-2 w-4/6 flex flex-col'>
              <label htmlFor="">Name</label>
              <input type="text" placeholder='Docker Docs' onChange={(n) => setNewTable(n.target.value)} className='w-full px-2 bg-[#E5E5CB] rounded-md' />
            </div>
            <div className='my-2 w-4/6 flex flex-col'>
              <label htmlFor="">Content Type</label>
              <input type="text" placeholder='notes or docs' onChange={(c) => setNewContent(c.target.value)} className='w-full px-2 bg-[#E5E5CB] rounded-md' />
            </div>
            <button onClick={() => createTable(new_table_name, new_table_content, user.user.id, setDialog, set_table_changed)} className='bg-[#3C2A21] text-[#E5E5CB] w-fit px-3 py-1 rounded-lg mx-auto my-4'>Create</button>
          </div>
        </dialog> : null}

      </div>
      <Outlet />
    </div>
  )
}

export default SideBar
