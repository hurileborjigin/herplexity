"use client"
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { supabase } from '@/services/supabase'
import Header from './_components/Header';
import DisplayResult from './_components/DisplayResult';



function SearchQueryResult() {

    const { libId } = useParams();
    const [searchInputRecord, setSearchInputRecord] = useState();

    useEffect(() => {
        if (!libId) return;
        (async () => {
            const { data, error } = await supabase
                .from("Library")
                .select("*, Chats(*)")
                .eq("libId", libId)
                .single();

            if (error) {
                console.error("Failed to load library record", error);
                return;
            }

            setSearchInputRecord(data);
        })();
    }, [libId]); // run once when libId is ready




    return (
        <div>
            <Header searchInputRecord={searchInputRecord} />
            <div className='px-10 md:px-20 lg:px-36 xl:px-56 mt-20'>
                <DisplayResult searchInputRecord={searchInputRecord} />
            </div>
        </div>
    )
}

export default SearchQueryResult