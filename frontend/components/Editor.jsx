import React, { useEffect, useState } from 'react'
import { BlockTypeSelect, BoldItalicUnderlineToggles, codeBlockPlugin, codeMirrorPlugin, ConditionalContents, InsertCodeBlock, listsPlugin, ListsToggle, MDXEditor, toolbarPlugin, UndoRedo, headingsPlugin, Button } from '@mdxeditor/editor'
import '@mdxeditor/editor/style.css'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { note_id, doc_created, table_id } from '../states/state'
import { useUser } from '@clerk/clerk-react'

const Editor = () => {

    const [tableId, setTableId] = useRecoilState(table_id)
    const set_created_doc = useSetRecoilState(doc_created)
    const [markdown, setMarkdown] = useState("# **Welcome**")
    const [key, setKey] = useState(true)
    // const [notes, setNotes] = useState("")
    const user = useUser()
    const select_note_id = useRecoilValue(note_id)

    const note_content = async () => {
        if (tableId) {
            setMarkdown(" ")
            setKey(p => !p)
        }
        else {
            const req = await fetch(`${import.meta.env.VITE_PORT}/docs/get-docs-id`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ note_id: select_note_id })
            })

            const note = await req.json()
            if (note.message == "success") {
                setMarkdown(note.docs.content)
                setKey(p => !p)
            }
        }
    }




    useEffect(() => {
        if (select_note_id || tableId) {
            note_content()
        }
    }, [select_note_id, tableId])

    const save_docs = async () => {
        const name = document.getElementById('doc_name').value
        if (tableId) {
            try {
                const req = await fetch(`${import.meta.env.VITE_PORT}/docs/create-docs`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name,
                        table_id: tableId,
                        user_id: user.user.id,
                        content: markdown,
                        publish: false
                    })
                })

                const response = await req.json()
                console.log(response)
                setTableId(false)
                set_created_doc(p => !p)
            } catch (error) {
                console.log(error)
            }
        }
    }

    return (
        <div className='w-[70%] bg-[#E5E5CB] border-4 border-[#E5E5CB] rounded-xl text-center overflow-y-scroll overflow-x-hidden'>
            {markdown && <MDXEditor key={key} onChange={(e) => { if (e !== "") { setMarkdown(e) } }} markdown={markdown} contentEditableClassName="prose" plugins={[headingsPlugin(), listsPlugin(),
            codeBlockPlugin({ defaultCodeBlockLanguage: 'js' }),
            codeMirrorPlugin({ codeBlockLanguages: { js: 'JavaScript', css: 'CSS' } }),
            toolbarPlugin({
                toolbarContents: () => (
                    <>
                        {' '}
                        <div className='w-full bg-[#1A120B] flex h-9 items-center'>
                            <UndoRedo />
                            <span className='h-[35px] -mt-1 w-[1px] bg-[#D5CEA3]' />
                            <BlockTypeSelect />
                            <span className='h-[35px] -mt-1 w-[1px] bg-[#D5CEA3]' />
                            <BoldItalicUnderlineToggles />
                            <span className='h-8 -mt-1 w-[1px] bg-[#D5CEA3]' />
                            <ListsToggle />
                            <span className='h-8 -mt-1 w-[1px] bg-[#D5CEA3]' />
                            <ConditionalContents
                                options={[
                                    {
                                        fallback: () => (<>
                                            <InsertCodeBlock />
                                        </>)
                                    }
                                ]}
                            />
                            <input id='doc_name' placeholder='Name of doc' className='bg-[#fff] w-32 text-[#3C2A21] rounded-lg h-7 mr-2 px-2'></input>
                            <Button onClick={save_docs}>Save</Button>
                            <Button>Publish</Button>
                        </div>
                    </>
                )
            })]} />}

        </div>
    )
}

export default Editor
