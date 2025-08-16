import React from 'react'

const LetterContent = ({ content }: any) => {
    return (
        <iframe className="w-full mx-auto min-h-[75vh] overflow-x-scroll " src={content} >
        </iframe>
    )
}

export default LetterContent