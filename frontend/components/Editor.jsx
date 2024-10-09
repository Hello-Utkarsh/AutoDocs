import React, { useEffect, useState } from 'react'
import { BlockTypeSelect, BoldItalicUnderlineToggles, codeBlockPlugin, codeMirrorPlugin, ConditionalContents, InsertCodeBlock, listsPlugin, ListsToggle, MDXEditor, toolbarPlugin, UndoRedo, headingsPlugin, Button } from '@mdxeditor/editor'
import '@mdxeditor/editor/style.css'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { note_id, doc_created, table_id } from '../states/state'
import { SignedIn, UserButton, useUser } from '@clerk/clerk-react'

const Editor = () => {
    const [publish, setPublish] = useState(false)
    const [select, setSelect] = useState("medium")
    const [subtitle, setSubTitle] = useState('')
    const [hashnodePublicationId, setPublicationId] = useState('')
    const [title, setTitle] = useState({ medium: '', hashnode: '' })
    const [tags, setTags] = useState({ medium: "" })
    const [token, setToken] = useState({ medium: "", hashnode: "", 'dev-to': "", x: "" })
    const underline = {
        "medium": ["w-20 left-[30px]", "go to medium.com > setting > Security and apps > Integration token"],
        "dev-to": ["w-8 left-[148px]", ""],
        "hashnode": ["w-8 left-[228px] mt-1", "go to hashnode.com > settings > developer and generate an auth-token. We'll also require a publicationId, for that go to hashnode.com > settings > blogs > blog dashboard/setting icon > copy the id from the url hashnode.com/{publicationId}/dashboard"],
        "x": ["w-10 left-[304px] mt-1", ""]
    }
    const [saveLoading, setSaveLoading] = useState(false)
    const [tableId, setTableId] = useRecoilState(table_id)
    const set_created_doc = useSetRecoilState(doc_created)
    const [markdown, setMarkdown] = useState("# **Welcome**")
    const [key, setKey] = useState(true)
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
        getToken()
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

    const getToken = async () => {
        try {
            const req = await fetch(`${import.meta.env.VITE_PORT}/user/get-token`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    "id": user.user.id
                }
            })
            const res = await req.json()
            if (req.status == 200) {
                setToken(res.token.tokens)
                setPublicationId(res.token.hashnodepubId)
            }
        } catch (error) {
            console.log(error.message)
        }
    }

    const postBlog = async () => {
        if (token['dev-to'] == "" && token.hashnode == "" && token.medium == "" && token.x == "") {
            alert("please enter a auth-token for any of the platform mentioned")
            return
        }
        try {
            console.log("here")
            const mediumDetailsReq = await fetch(`${import.meta.env.VITE_PORT}/user/medium-user-data`, {
                method: "GET",
                headers: {
                    "token": `${token.medium}`,
                }
            })
            const mediumDetailsRes = await mediumDetailsReq.json()
            if (markdown == "" || title == "") {
                alert("Please fill the title and markdown body")
                return
            }
            console.log(title)
            const req = await fetch(`${import.meta.env.VITE_PORT}/blog/post-blog`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'token': JSON.stringify(token),
                    'userid': mediumDetailsRes.id,
                    'publicationid': hashnodePublicationId,
                    'platforms': ['hashnode']
                },
                body: JSON.stringify({
                    title: title,
                    subtitle,
                    tags: tags.medium,
                    content: markdown,
                })
            })
            const postedBlog = await req.json()
            console.log(postedBlog)
        } catch (error) {
            console.log(error.message)
        }
    }

    const saveToken = async () => {
        setSaveLoading(true)
        try {
            const id = user.user.id
            console.log(hashnodePublicationId)
            const req = await fetch(`${import.meta.env.VITE_PORT}/user/add-token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id, tokens: token, hashnodepubId: hashnodePublicationId
                })
            })
            const res = await req.json()
            console.log(res)
            if (req.status == 200) {
                setToken(res.userTokens.tokens)
                setPublicationId(res.userTokens.hashnodepubId)
            }
        } catch (error) {
            console.log(error.message)
        }
        setSaveLoading(false)
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
                            <Button onClick={() => setPublish(e => !e)}>Publish</Button>
                        </div>
                    </>
                )
            })]} />}
            <div className={`transition-all duration-500 bg-transparent w-96 ${publish ? "border-2" : ""} border-[#191818] rounded-md absolute left-[52%] top-14 overflow-hidden`} style={{ height: publish ? "560px" : "0" }}>
                <h1 className='text-xl font-bold text-[#024643] text-start mt-2 mx-4'>Choose Your Platform</h1>
                <div className='flex justify-around px-4 mt-3'>
                    <button onClick={() => setSelect("medium")}><img className='h-7 w-20 object-cover object-right' src="/medium.png" alt="" /></button>
                    <button onClick={() => setSelect("dev-to")}><img className='h-7 mx-3' src="/dev-to.svg" alt="" /></button>
                    <button onClick={() => setSelect("hashnode")}><img className='h-7 mx-3' src="/hashnode.png" alt="" /></button>
                    <button onClick={() => setSelect("x")} value={"x"}><img className='h-7 mx-3' src="/x.png" alt="" /></button>
                </div>
                <div className={`${underline[select][0]} bg-[#024643] h-1 rounded-md absolute transition-all duration-200`} />
                <div className='flex flex-col mx-2 my-2 mt-4'>
                    <label htmlFor="" className='text-start my-1 text-[#024643] text-sm font-medium'>Auth-Token</label>
                    <input onChange={(e) => {
                        setToken(prevToken => ({
                            ...prevToken,
                            [select]: e.target.value // Update the specific key dynamically
                        }));
                    }} value={token[select]} type="text" className='bg-[#547B79] rounded-md px-2 py-1' />
                    <p className='text-[#547B79] text-start mt-4 text-sm font-medium leading-4'>Note: To generate a auth-token {underline[select][1]}</p>
                    <p className='text-[#547B79] text-start my-2 text-sm font-medium leading-4'>Note: We wont be getting access to any of your password and youll be able to delete the auth-token whenever you want</p>
                </div>
                <div className='flex flex-col px-2'>
                    <label htmlFor="" className='text-[#547B79] text-start mb-1 text-sm font-medium leading-4'>Title for the Blog</label>
                    <input type="text" onChange={(e) => setTitle((prev) => ({
                        ...prev,
                        [select]: e.target.value
                    }))} placeholder='Required' className='bg-[#547B79] rounded-md px-2 py-1' />
                    {select == 'hashnode' && <label htmlFor="" className='text-[#547B79] text-start mb-1 text-sm font-medium leading-4'>PublicationId</label>}
                    {select == 'hashnode' && <input type="text" onChange={(e) =>
                        setPublicationId(e.target.value)} value={hashnodePublicationId} placeholder='Required' className='bg-[#547B79] rounded-md px-2 py-1' />}
                    {select == 'hashnode' && <label htmlFor="" className='text-[#547B79] text-start mb-1 text-sm font-medium leading-4'>Subtitle</label>}
                    {select == 'hashnode' && <input type="text" onChange={(e) =>
                        setSubTitle(e.target.value)} placeholder='Not required' className='bg-[#547B79] rounded-md px-2 py-1' />}
                    {select != 'hashnode' && <label htmlFor="" className='text-[#547B79] text-start mb-1 text-sm font-medium leading-4'>Tags</label>}
                    {select != 'hashnode' && <input type="text" onChange={(e) =>
                        setTags(prevTag => ({
                            ...prevTag,
                            [select]: e.target.value
                        }))} placeholder='"football", "coding"' className='bg-[#547B79] rounded-md px-2 py-1' />}
                </div>
                <div className='flex justify-between px-4 mt-4'>
                    <div>
                        <button className='bg-[#714DFF] mr-2 hover:bg-[#714dffd5] px-3 py-1 rounded-md text-[#FAFAFA]' onClick={saveToken}>{saveLoading ? "Processing..." : "Save"}</button>
                        <button className='bg-[#714DFF] hover:bg-[#714dffd5] px-3 py-1 rounded-md text-[#FAFAFA]' onClick={postBlog}>Post</button>
                    </div>
                    <button className='bg-black hover:bg-gray-700 px-3 py-1 rounded-md text-[#FAFAFA]' onClick={() => setPublish(false)}>Close</button>
                </div>
            </div>
        </div>
    )
}

export default Editor