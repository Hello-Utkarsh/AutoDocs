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
  const [err, setErr] = useState("")
  const user = useUser()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user.isSignedIn) {
      navigate('/')
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

        <div className='relative justify-center flex w-full'>
          <button onClick={() => setDialog(true)} className='text-white mx-auto py-1 w-3/4 text-lg rounded-md bg-[#714DFF] hover:bg-[#714dffd5] transition-all duration-300' style={{ opacity: !dialog_state ? "1" : "0", zIndex: !dialog_state ? "10" : "0" }}>{err ? err : 'New Table'}</button>
          <div className='flex flex-col absolute top-0 w-56 transition-all duration-300 bg-[#714DFF] rounded-md py-2 px-1 justify-between' style={{ opacity: dialog_state ? "1" : "0", zIndex: dialog_state ? "10" : "0" }}>
            <input type="text" placeholder='Table Name...' onChange={(n) => setNewTable(n.target.value)} className='bg-white rounded-md px-1 text-black' />
            <div className='flex justify-end mt-2'>
              <button onClick={() => {
                setDialog(false)
                createTable(new_table_name, user.user.id, setDialog, set_table_changed, setErr)
              }} className='rounded-md px-2 py-1 mx-1 bg-[#E1F7DD] text-black text-sm font-medium'>Create</button>
              <button onClick={() => { setDialog(false) }} className='rounded-md px-2 py-1 mx-1 bg-black text-sm font-medium'>Close</button>
            </div>
          </div>
        </div>

      </div>
      <Outlet />
    </div>
  )
}

export default SideBar
