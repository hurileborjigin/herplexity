"use client"
import { useUser } from '@clerk/nextjs'
import React, { useEffect } from 'react'

function Provider({ children }) {
    const { user } = useUser();
    useEffect(() => {
        user && CreateUser();
    }, [user])

    const CreateUser = async () => {
        // If user already exists

        let { data: Users, error } = await supabase
            .from('Users')
            .select('*')
            .eq('email', user?.primaryEmailAddress.emailAddress);

        console.log(Users);
        if (Users.length == 0) {

            const { data, error } = await supabase
                .from('Users')
                .insert([
                    {
                        name: user?.fullName,
                        email: user?.primaryEmailAddress
                    },
                ])
                .select();
            console.log(data)

        }


    }
    return (
        <div className='w-full'>{children}</div>
    )
}

export default Provider