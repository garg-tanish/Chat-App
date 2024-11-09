import React from 'react'

const Loading = () => {
  return (
    <div className='flex justify-center'>
      <div className="spinner-border text-info" role="status">
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  )
}

export default Loading
