import React from 'react'
import { BoldItalicUnderlineToggles, ChangeCodeMirrorLanguage, codeBlockPlugin, codeMirrorPlugin, ConditionalContents, InsertCodeBlock, insertCodeBlock$, InsertSandpack, listsPlugin, ListsToggle, MDXEditor, sandpackPlugin, ShowSandpackInfo, toolbarPlugin, UndoRedo } from '@mdxeditor/editor'
import { headingsPlugin } from '@mdxeditor/editor'
// import '@mdxeditor/editor/style.css'

const Editor = () => {

    const markdown = `
  * Item 1
  * Item 2
  * Item 3
    * nested item

  1. Item 1
  2. Item 2
`
    return (
        <div className='w-[50%] h-[80%]'>
            <MDXEditor contentEditableClassName="prose" className='border-4 border-[#1A120B] text-center' markdown={markdown} plugins={[headingsPlugin(), listsPlugin(), codeBlockPlugin({ defaultCodeBlockLanguage: 'js' }),
            codeMirrorPlugin({ codeBlockLanguages: { js: 'JavaScript', css: 'CSS' } }),
            toolbarPlugin({
                toolbarContents: () => (
                    <>
                        {' '}
                        <div className='w-full bg-[#1A120B] flex'>
                            <UndoRedo />
                            <span className='h-8 -mt-1 w-[1px] bg-[#D5CEA3]' />
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
                        </div>
                    </>
                )
            })]} />
        </div>
    )
}

export default Editor
