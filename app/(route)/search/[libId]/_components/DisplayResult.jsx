import React, { useEffect, useState } from 'react'
import AnswerDisplay from './AnswerDisplay';
import axios from 'axios';
import { SEARCH_RESULT } from "@/services/Shared"
import { supabase } from '@/services/supabase'
import { useParams } from 'next/navigation';
import { LucideImage, LucideList, LucideSparkles, LucideVideo } from 'lucide-react';
import ImageList from './ImageList';
import SourceListTab from './SourceListTab';


const tabs = [
    {
        label: 'Answer',
        icon: LucideSparkles
    },
    {
        label: 'Images',
        icon: LucideImage
    },
    {
        label: 'Videos',
        icon: LucideVideo
    },
    {
        label: 'Sources',
        icon: LucideList,
        badge: 10
    }
]


function DisplayResult({ searchInputRecord }) {
    const [activeTab, setActiveTab] = useState('Answer');
    const [searchResult, setSearchResult] = useState(searchInputRecord);
    const { libId } = useParams();
    const [loadingSearch, setLoadingSearch] = useState(false);


    useEffect(() => {
        if (!searchInputRecord) return;

        setSearchResult(searchInputRecord);

        if (!loadingSearch && searchInputRecord?.Chats?.length === 0) {
            GetSearchAPIResult();
        } else {
            GetSearchRecords();
        }
    }, [searchInputRecord]);

    useEffect(() => {
        const channel = supabase
            .channel(`chat-updates-${libId}`)
            .on(
                'postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'Chats', filter: `libId=eq.${libId}` },
                (payload) => {
                    console.log("Realtime update:", payload);
                    GetSearchRecords();
                }
            )
            .subscribe();

        return () => supabase.removeChannel(channel);
    }, [libId]);






    const GetSearchAPIResult = async () => {
        setLoadingSearch(true);
        const result = await axios.post('/api/brave-search-api', {
            searchInput: searchInputRecord?.searchInput,
            searchInputType: searchInputRecord?.searchInputType
        })

        // const result = SEARCH_RESULT;

        // Save tp DB
        const searchResp = result.data
        console.log(searchResp)
        const formattedSearchResp = searchResp?.web?.results?.map((item, index) => (
            {
                title: item?.title,
                description: item?.description,
                long_name: item?.profile?.long_name,
                img: item?.profile?.img,
                url: item?.url,
                thumbnail: item.thumbnail?.src
            }
        ))


        // Fetch latest from DB

        const { data, error } = await supabase
            .from('Chats')
            .insert([
                {
                    libId: libId,
                    searchResult: formattedSearchResp,
                    userSearchInput: searchInputRecord?.searchInput

                },
            ])
            .select()

        await GetSearchRecords();
        setLoadingSearch(false);
        await GenerateAIResp(formattedSearchResp, libId);
        // console.log(JSON.stringify(result.data))
        const runID = result.data
        console.log("Inngest run raw response:", result.data);


        const interval = setInterval(async () => {
            const runResp = await axios.post('/api/get-inngest-status',
                { runID: runID }
            );
            const runs = runResp?.data;
            console.log(runs)
            if (!Array.isArray(runs) || runs.length === 0) {
                console.warn("No runs yet or status unavailable", runResp?.data);
                return;
            }
            if (runs[0]?.status == 'Completed') {
                GetSearchRecords()
                clearInterval(interval);
                // Get updated data from DB
            }
            console.log(runResp.data)
        }, 1000);
    }

    const GenerateAIResp = async (formattedSearchResp, libId) => {
        const result = await axios.post('/api/llm-model', {
            searchInput: searchInputRecord?.searchInput,
            searchResult: formattedSearchResp,
            libId: libId
        })
    }

    const GetSearchRecords = async () => {
        const { data, error } = await supabase
            .from("Library")
            .select("*, Chats(*)")
            .eq("libId", libId)
            .single();
        setSearchResult(data)
    }





    return (
        <div className='mt-7'>
            {!searchResult?.Chats &&
                <div>
                    <div className='w-full h-5 bg-accent animate-pulse rounded-md mb-5'> </div>
                    <div className='w-1/2 mt-2 h-5 bg-accent animate-pulse rounded-md mb-5'> </div>
                    <div className='w-[70%] mt-2 h-5 bg-accent animate-pulse rounded-md mb-5'> </div>

                </div>
            }
            {searchResult?.Chats?.map((chat, index) => (
                <div key={index} className='mt-7'>
                    <h2 className='font-bold text-4xl text-gray-600'>{chat?.userSearchInput}</h2>

                    <div className="flex items-center space-x-6 border-b border-gray-200 pb-2 mt-6">
                        {tabs.map(({ label, icon: Icon, badge }) => (
                            <button
                                key={label}
                                onClick={() => setActiveTab(label)}
                                className={`flex items-center gap-1 relative text-sm font-medium text-gray-700 hover:text-black ${activeTab === label ? 'text-black' : ''
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                <span>{label}</span>

                                {badge && (
                                    <span className="ml-1 text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                                        {badge}
                                    </span>
                                )}

                                {activeTab === label && (
                                    <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-black rounded"></span>
                                )}
                            </button>
                        ))}

                        <div className="ml-auto text-sm text-gray-500">
                            1 task <span className="ml-1">✓</span>
                        </div>
                    </div>
                    <div>
                        {
                            activeTab == 'Answer' ?
                                <AnswerDisplay chat={chat} loadingSearch={loadingSearch}>
                                </AnswerDisplay> :
                                activeTab == 'Images' ?
                                    <ImageList chat={chat} /> :
                                    activeTab == 'Sources' ?
                                        <SourceListTab chat={chat} /> : null
                        }
                    </div>
                    <hr className='my-5' />
                </div>
            )
            )}
        </div>
    )
}

export default DisplayResult
