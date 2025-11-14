'use client'
import Image from 'next/image'
import React, { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight, Atom, AudioLines, Check, Cpu, Globe, Mic, Paperclip, SearchCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AIModelsOption } from "@/services/Shared"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { supabase } from '@/services/supabase'
import { useUser } from '@clerk/nextjs'

import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/navigation'



function ChatInputBox() {
    const [selectedModel, setSelectedModel] = React.useState(AIModelsOption[0])

    

    const [userSearchInput, setUserSearchInput] = useState();
    const [searchType, setSearchType] = useState('search');

    const { user } = useUser();

    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const onSearchQuery = async () => {
        setLoading(true);
        const libId= uuidv4();
        const {data} = await supabase.from('Library').insert([{
            searchInput: userSearchInput,
            userEmail: user?.primaryEmailAddress.emailAddress,
            type: searchType,
            libId: libId
        }]).select();
        setLoading(false);




        // redirect to a new page
        router.push('/search/'+ libId)
        console.log(data[0])
    }




    return (
        <div className='flex flex-col h-screen items-center justify-center '>
            <Image src={'/logo_large.png'} alt='logo' width={260} height={240}></Image>
            <div className='p-2 w-full max-w-2xl border rounded-2xl mt-10'>


                <div className='flex justify-between items-end'>
                    <Tabs defaultValue="search" className="w-[400px]">
                        <TabsContent value="search">
                            <input type='text' onChange={(e) => setUserSearchInput(e.target.value)} placeholder='Ask Anything' className='w-full p-4 outline-none' />
                        </TabsContent>
                        <TabsContent value="research">
                            <input type='text' onChange={(e) => setUserSearchInput(e.target.value)} placeholder='Research Anything' className='w-full p-4 outline-none' />
                        </TabsContent>
                        <TabsList>
                            <TabsTrigger className='text-primary' value="search" onClick={() => setSearchType('search')}><SearchCheck /> Search</TabsTrigger>
                            <TabsTrigger className='text-primary' value="research" onClick={() => setSearchType('research')}><Atom /> Deep Research</TabsTrigger>
                        </TabsList>

                    </Tabs>
                    <div className='flex items-center gap-2'>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant='outline'
                                    className='rounded-full border-muted-foreground/20 bg-muted/40 px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted/70'
                                >
                                    <Cpu className='mr-2 h-4 w-4 text-primary' />
                                    <div className='flex flex-col items-start leading-none'>
                                        <span>{selectedModel?.name ?? "Select model"}</span>
                                        <span className='text-[11px] font-normal text-muted-foreground'>
                                            {selectedModel?.desc}
                                        </span>
                                    </div>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align='end' className='w-64 rounded-2xl p-2'>
                                <DropdownMenuLabel className='text-xs uppercase tracking-wide text-muted-foreground'>
                                    AI Models
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {AIModelsOption.map((model, index) => {
                                    const isActive = selectedModel?.name === model.name
                                    return (
                                        <DropdownMenuItem
                                            key={model.id ?? `${model.name}-${index}`}
                                            className='flex items-center gap-3 rounded-xl px-3 py-2 text-sm '
                                            onClick={() => setSelectedModel(model)}
                                        >
                                            <div className='flex-1'>
                                                <p className='font-semibold text-foreground'>{model.name}</p>
                                                <p className='text-xs text-muted-foreground'>{model.desc}</p>
                                            </div>
                                            {isActive && (
                                                <Check className='h-4 w-4 text-primary' />
                                            )}
                                        </DropdownMenuItem>
                                    )
                                })}
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <Button variant='outline' size='icon' className='rounded-full border-muted-foreground/30'>
                            <Globe className='h-5 w-5 text-muted-foreground' />
                        </Button>
                        <Button variant='outline' size='icon' className='rounded-full border-muted-foreground/30'>
                            <Paperclip className='h-5 w-5 text-muted-foreground' />
                        </Button>
                        <Button variant='outline' size='icon' className='rounded-full border-muted-foreground/30'>
                            <Mic className='h-5 w-5 text-muted-foreground' />
                        </Button>
                        <Button onClick={() => {
                            userSearchInput ? onSearchQuery() : null
                        }}
                            size='icon' className='rounded-full bg-primary text-primary-foreground hover:bg-primary/90'>
                            {!userSearchInput ?
                                <AudioLines className='h-5 w-5' /> :
                                <ArrowRight className='h-5 w-5' disabled={loading} />
                            }
                        </Button>


                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChatInputBox
