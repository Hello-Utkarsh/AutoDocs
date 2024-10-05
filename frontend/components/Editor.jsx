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
        <div className='w-full bg-[#E1F7DD] text-center overflow-y-auto py-2'>
            {markdown && <MDXEditor key={key} onChange={(e) => { if (e !== "") { setMarkdown(e) } }} markdown={markdown} contentEditableClassName="prose" plugins={[headingsPlugin(), listsPlugin(),
            codeBlockPlugin({ defaultCodeBlockLanguage: 'js' }),
            codeMirrorPlugin({ codeBlockLanguages: { js: 'JavaScript', css: 'CSS' } }),
            toolbarPlugin({
                toolbarContents: () => (
                    <>
                        {' '}
                        <div className='w-full flex items-center pb-2 border-b-2 border-[#547B79]'>
                            <UndoRedo />
                            <span className='h-[35px] -mt-1 w-[1px]' />
                            <BlockTypeSelect />
                            <span className='h-[35px] -mt-1 w-[1px]' />
                            <BoldItalicUnderlineToggles />
                            <span className='h-8 -mt-1 w-[1px]' />
                            <ListsToggle />
                            <span className='h-8 -mt-1 w-[1px]' />
                            <ConditionalContents
                                options={[
                                    {
                                        fallback: () => (<>
                                            <InsertCodeBlock />
                                        </>)
                                    }
                                ]}
                            />
                            <input id='doc_name' placeholder='Name of doc' className='bg-[#FAFAFA] w-32 text-[#191818] rounded-lg h-7 mr-2 px-2'></input>
                            <Button className='hover:bg-[#714DFF] text-[#FAFAFA]' onClick={save_docs}>Save</Button>
                            <Button>Publish</Button>
                        </div>
                    </>
                )
            })]} />}

        </div>
    )
}

export default Editor
