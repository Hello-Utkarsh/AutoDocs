import React, { useEffect, useState } from 'react'
import { BlockTypeSelect, BoldItalicUnderlineToggles, codeBlockPlugin, codeMirrorPlugin, ConditionalContents, InsertCodeBlock, listsPlugin, ListsToggle, MDXEditor, toolbarPlugin, UndoRedo, headingsPlugin, Button } from '@mdxeditor/editor'
import '@mdxeditor/editor/style.css'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { note_id, doc_created, table_id, user_table } from '../states/state'
import { useClerk, useUser } from '@clerk/clerk-react'

const Editor = () => {
    const { signOut } = useClerk()
    const [publish, setPublish] = useState(false)
    const [select, setSelect] = useState("medium")
    const [subtitle, setSubTitle] = useState('')
    const [hashnodePublicationId, setPublicationId] = useState('')
    const [title, setTitle] = useState('')
    const [tags, setTags] = useState()
    const [token, setToken] = useState({ medium: "", hashnode: "", 'dev-to': "", x: "" })
    const underline = {
        "medium": ["w-20 left-[30px]", "go to medium.com > setting > Security and apps > Integration token", "445px"],
        "dev-to": ["w-8 left-[148px]", "go to https://dev.to/settings/extensions > Generate API Key", "445px"],
        "hashnode": ["w-8 left-[228px] mt-1", "go to hashnode.com > settings > developer and generate an auth-token. We'll also require a publicationId, for that go to hashnode.com > settings > blogs > blog dashboard/setting icon > copy the id from the url hashnode.com/{publicationId}/dashboard", "560px"],
        "x": ["w-10 left-[304px] mt-1", "", "430px"]
    }
    const [saveLoading, setSaveLoading] = useState(false)
    const [tableId, setTableId] = useRecoilState(table_id)
    const set_created_doc = useSetRecoilState(doc_created)
    const [table, setTable] = useRecoilState(user_table)
    const [markdown, setMarkdown] = useState("# **Welcome, Please select/create a table**")
    const [key, setKey] = useState(true)
    const user = useUser()
    const select_note_id = useRecoilValue(note_id)
    const select_note = useSetRecoilState(note_id)
    const [errors, setErrors] = useState({ hashnode: '', ['dev-to']: '', medium: "" })

    const delete_note = async (id) => {
        if (!id) {
            alert('Please select the doc to delete')
        }
        try {
            const req = await fetch(`${import.meta.env.VITE_PORT}/docs/delete-doc/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            const res = await req.json()
            if (res.message == 'success') {
                const new_tables = table.map(x => {
                    const key = Object.keys(x)[0]
                    let docs = x[Object.keys(x)[0]]
                    if (Object.keys(docs).length == 1) {
                        const table_id = docs[0].table_id
                        docs = docs.filter(x => x.id != res.id)
                        return { [key]: [{ table_id }] }
                    }
                    docs = docs.filter(x => x.id != res.id)
                    return { [key]: docs }
                })
                select_note(new_tables[0][Object.keys(new_tables[0])][0]?.id | null)
                setTable(new_tables)
            }
        } catch (error) {
            console.log(error)
        }
    }

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
        if (user.user?.id) {
            getToken()
        }
    }, [select_note_id, tableId])

    const save_docs = async () => {
        const name = document.getElementById('doc_name').value
        if (!name && !select_note_id) {
            return alert("Please enter a name for the docs")
        }
        if (!tableId && !select_note_id) {
            return alert("Please select the table in which you would to create the docs")
        }
        if (tableId || select_note_id) {
            try {
                const req = await fetch(`${import.meta.env.VITE_PORT}/docs/create-docs`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name,
                        note_id: select_note_id | null,
                        table_id: tableId | null,
                        user_id: user.user.id,
                        content: markdown,
                        publish: false
                    })
                })

                const response = await req.json()
                select_note(response.docs.id)
                setTable(p => [...p, response.docs])
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
        if (token.hashnode != "" && hashnodePublicationId == "") {
            alert("Please enter the publicationId to post on hashnode")
        }
        const platform = []
        Array.from(Object.keys(token)).map(x => {
            if ((token[x] != "")) {
                platform.push(x)
            }
        })
        try {
            const mediumDetailsReq = await fetch(`${import.meta.env.VITE_PORT}/user/medium-user-data`, {
                method: "GET",
                headers: {
                    "token": `${token.medium}`,
                }
            })
            const mediumDetailsRes = await mediumDetailsReq.json()
            if (platform.includes('medium') && (!title || !markdown || !token.medium || !mediumDetailsRes.id)) {
                alert("Please provide the mentioned details")
                return
            }
            if (platform.includes('dev-to') && (!title || !markdown || !token['dev-to'])) {
                alert("Please provide the mentioned details")
                return
            }
            if (platform.includes('hashnode') && (!title || !subtitle || !markdown || token.hashnode == "" || !hashnodePublicationId)) {
                if (subtitle.length < 6) {
                    alert("subtitle must be of 6 letters")
                    return
                }
                alert("Please provide the mentioned details")
                return
            }
            const req = await fetch(`${import.meta.env.VITE_PORT}/blog/post-blog`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'token': JSON.stringify(token),
                    'mediumuserid': mediumDetailsRes.id,
                    hashnodePublicationId,
                    'platforms': platform
                },
                body: JSON.stringify({
                    title: title,
                    subtitle,
                    tags: tags.medium,
                    content: markdown,
                })
            })
            const postedBlog = (await req.json()).posted
            console.log(postedBlog)
            const errPlatforms = Object.keys(postedBlog).map(x => {
                if (postedBlog[x].error || postedBlog[x].errors) {
                    return x
                }
            })
            if (errPlatforms) {
                console.log(errPlatforms)
                alert(`Oops, The post failed to publish on ${errPlatforms.map(x => { if (x != undefined) { return x } })}`)
            }
        } catch (error) {
            console.log(error.message)
        }
    }

    const deleteToken = async () => {
        token[select] = ""
        try {
            const id = user.user.id
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
            if (req.status == 200) {
                setToken(res.userTokens.tokens)
                setPublicationId(res.userTokens.hashnodepubId)
            }
        } catch (error) {
            console.log(error.message)
        }
    }

    const saveToken = async () => {
        setSaveLoading(true)
        try {
            const id = user.user.id
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
        <div className='w-full bg-[#E1F7DD] text-center overflow-y-auto'>
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
                            <Button onClick={() => delete_note(select_note_id)}>Delete</Button>
                            <Button onClick={() => signOut()}>Logout</Button>
                        </div>
                    </>
                )
            })]} />}
            <div className={`transition-all duration-500 bg-transparent w-96 ${publish ? "border-2" : ""} border-[#191818] rounded-md absolute left-[52%] top-14 overflow-hidden`} style={{ height: publish ? underline[select][2] : "0" }}>
                <h1 className='text-xl font-bold text-[#024643] text-start mt-2 mx-4'>Choose Your Platform</h1>
                <div className='flex justify-around px-4 mt-3'>
                    <button onClick={() => setSelect("medium")}><img className='h-7 w-20 object-cover object-right' src="/medium.png" alt="" /></button>
                    <button onClick={() => setSelect("dev-to")}><img className='h-7 mx-3' src="/dev-to.svg" alt="" /></button>
                    <button onClick={() => setSelect("hashnode")}><img className='h-7 mx-3' src="/hashnode.png" alt="" /></button>
                    <button onClick={() => setSelect("x")} value={"x"}><img className='h-7 mx-3' src="/x.png" alt="" /></button>
                </div>
                <div className={`${underline[select][0]} bg-[#024643] h-1 rounded-md absolute transition-all duration-200`} />
                <div className='flex flex-col mx-2 my-2 mt-4'>
                    <div className='flex justify-between items-center'>
                        <label htmlFor="" className='text-start my-1 text-[#024643] text-sm font-medium'>Auth-Token</label>
                        <span onClick={deleteToken} className="material-symbols-outlined text-[19px] text-red-500 font-medium cursor-pointer mr-2">
                            delete
                        </span>
                    </div>
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
                    <input type="text" onChange={(e) => setTitle(e.target.value)} placeholder='Required' className='bg-[#547B79] rounded-md px-2 py-1' />
                    {select == 'hashnode' && <label htmlFor="" className='text-[#547B79] text-start mb-1 text-sm font-medium leading-4'>PublicationId</label>}
                    {select == 'hashnode' && <input type="text" onChange={(e) =>
                        setPublicationId(e.target.value)} value={hashnodePublicationId} placeholder='Required' className='bg-[#547B79] rounded-md px-2 py-1' />}
                    {select == 'hashnode' && <label htmlFor="" className='text-[#547B79] text-start mb-1 text-sm font-medium leading-4'>Subtitle</label>}
                    {select == 'hashnode' && <input type="text" value={subtitle} onChange={(e) =>
                        setSubTitle(e.target.value)} placeholder='Not required' className='bg-[#547B79] rounded-md px-2 py-1' />}
                    {select != 'hashnode' && <label htmlFor="" className='text-[#547B79] text-start mb-1 text-sm font-medium leading-4'>Tags</label>}
                    {select != 'hashnode' && <input type="text" value={tags} onChange={(e) =>
                        setTags(e.target.value)} placeholder='"football", "coding"' className='bg-[#547B79] rounded-md px-2 py-1' />}
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