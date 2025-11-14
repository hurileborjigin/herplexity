import Image from 'next/image';
import React, { useState } from 'react'
import SourceList from './SourceList';
import DisplaySummary from './DisplaySummary';

function AnswerDisplay({ chat, loadingSearch }) {

  return (
    <div>
      <div className='flex gap-2 flex-wrap mt-5'>
        <SourceList webResults={chat?.searchResult} loadingSearch={loadingSearch} />
        <DisplaySummary aiResp={chat?.aiResponse}/>
      </div>
    </div>
  )
}

export default AnswerDisplay