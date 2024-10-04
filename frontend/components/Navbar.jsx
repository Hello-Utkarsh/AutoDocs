import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from '@clerk/clerk-react'
import React from 'react'
import { Outlet } from 'react-router-dom'

const Navbar = () => {
    const { user } = useUser()
    return (
        <div className='flex flex-col items-center'>
            <div className='flex justify-between items-center mx-auto w-full px-16 py-2 h-16'>
                <h1 className='text-3xl font-bold font-mono tracking-tight text-[#024643]'>AutoDocs</h1>
                {!user && <div className='flex justify-center mx-auto'>
                    <p className='mx-3 font-bold'>Feature</p>
                    <p className='mx-3 font-bold'>Pricing</p>
                    <p className='mx-3 font-bold'>Resources</p>
                    <p className='mx-3 font-bold'>About</p>
                </div>}
                <SignedOut>
                    <SignInButton>
                        <button className='px-4 py-2 rounded-3xl text-[#FAFAFA] bg-[#714DFF]'>SignIn</button>
                    </SignInButton>
                </SignedOut>
                <SignedIn>
                    <UserButton />
                </SignedIn>
            </div>
            <Outlet />
        </div>
    )
}

export default Navbar
