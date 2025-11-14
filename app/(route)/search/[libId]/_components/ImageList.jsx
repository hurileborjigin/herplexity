import Image from 'next/image'
import React from 'react'

function ImageList({chat}) {
  chat.searchResult.map((item, index)=>{
    console.log(item.thumbnail)
  })
  return (
    <div className='flex gap-5 flex-wrap mt-6'>
      {chat.searchResult.map((item, index)=>(
        <div>
          
          <Image src={item?.thumbnail} alt={item.title}
          width={200}
          height={200}
          key={index}
          className='bg-accent rounded-xl'
          />
        </div>
      ))}
    </div>
  )
}

export default ImageList