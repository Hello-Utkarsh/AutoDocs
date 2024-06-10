import React, { useEffect, useState } from 'react'
import { BlockTypeSelect, BoldItalicUnderlineToggles, codeBlockPlugin, codeMirrorPlugin, ConditionalContents, InsertCodeBlock, listsPlugin, ListsToggle, MDXEditor, toolbarPlugin, UndoRedo, headingsPlugin, Button } from '@mdxeditor/editor'
import '@mdxeditor/editor/style.css'

const Editor = () => {

    const abc = async() => {
        const a = await fetch('http://localhost:3000/docs/get-docs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({'table_id': 4})
        })

        const b = await a.json()
        setNotes(b.docs[0].content)
    }

    
    const [notes, setNotes] = useState("")
    let markdown = "# **Welcome**"
    

    useEffect(()=>{
        abc()
    }, [])

    const save = async () => {
        console.log(JSON.stringify(notes))
    }
    // console.log(notes)

    return (
        <div className='w-[70%] bg-[#E5E5CB] border-4 border-[#E5E5CB] rounded-xl text-center overflow-y-scroll overflow-x-hidden'>
            {markdown ? <MDXEditor contentEditableClassName="prose" markdown={markdown} plugins={[headingsPlugin() ,listsPlugin(), codeBlockPlugin({ defaultCodeBlockLanguage: 'js' }),
            codeMirrorPlugin({ codeBlockLanguages: { js: 'JavaScript', css: 'CSS' } }),
            toolbarPlugin({
                toolbarContents: () => (
                    <>
                        {' '}
                        <div className='w-full bg-[#1A120B] flex h-9'>
                            <UndoRedo />
                            <span className='h-[35px] -mt-1 w-[1px] bg-[#D5CEA3]' />
                            <BlockTypeSelect/>
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
                            <Button onClick={save}>Save</Button>
                            <Button>Publish</Button>
                        </div>
                    </>
                )
            })]} /> :null}
            
        </div>
    )
}

export default Editor
