import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from '@clerk/clerk-react'
import React from 'react'
import { Outlet } from 'react-router-dom'

const Navbar = () => {
    // const { user } = useUser()
    return (
        <div className='flex flex-col items-center'>
            <div className='flex bg-[#1A120B] text-[#D5CEA3] justify-between items-center mx-auto w-full left-0 px-6 fixed top-0 py-2 h-16'>
                <h1 className='text-5xl'>AutoDocs</h1>
                <div>
                    <SignedOut>
                        <SignInButton />
                    </SignedOut>
                    <SignedIn>
                        <UserButton />
                    </SignedIn>
                </div>
            </div>
            <Outlet />
        </div>
    )
}

export default Navbar
