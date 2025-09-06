"use client"

import React from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react';
import { User } from 'next-auth'
import { Button } from './ui/button';

const Navbar = () => {

    const {data: session} = useSession();
    const user: User = session?.user as User;
  return (
   <nav className='p-4 md:p-6 shadow-md w-full'>
  <div className='container mx-auto flex items-center w-full justify-between'>
    <Link href="/" className='text-xl font-bold mb-4 md:mb-0'>Mystery Message</Link>
    {
      session ? (
        <>
          <span className='mr-4 ml-6'>Welcome, {user?.username || user?.email}</span>
          <Button className="w-full md:w-auto ml-2" onClick={() => signOut({})}>Sign Out</Button>
        </>
      ) : (
        <>
          <Link href="/sign-in" className="ml-6">
            <Button className="w-full md:w-auto">Sign In</Button>
          </Link>
        </>
      )
    }
  </div>
</nav>
  )
}

export default Navbar