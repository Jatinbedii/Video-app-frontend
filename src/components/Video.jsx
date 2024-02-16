import Link from 'next/link'
import React from 'react'

function Video({data}) {
  return (
    <Link href={`/video/${data._id}`}><div className='border-white bg-black w-fit text-white'>{data.title}</div></Link>
  )
}

export default Video