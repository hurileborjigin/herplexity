import React from 'react'
import ReactMarkdown from 'react-markdown'
import LLMMarkdown from './LLMMarkdown'
function DisplaySummary({ aiResp }) {
  return (
    <div className='mt-7'>
      {!aiResp&&
      <div>
        <div className='w-full h-5 bg-accent animate-pulse rounded-md mb-5'> </div>
        <div className='w-1/2 mt-2 h-5 bg-accent animate-pulse rounded-md mb-5'> </div>
        <div className='w-[70%] mt-2 h-5 bg-accent animate-pulse rounded-md mb-5'> </div>

      </div>
      }
      <LLMMarkdown content={aiResp}>
        

      </LLMMarkdown>

    </div>
  )
}

export default DisplaySummary