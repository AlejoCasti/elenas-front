import React, { useState, useEffect } from 'react'
import './pagination.css'

const Pagination = ({ currentPage, totalItems, itemsPerPage, goPage }) => {
  const [pages, setPages] = useState([1])
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    if (!currentPage || !totalItems || !itemsPerPage) return

    const totalPages = Math.ceil(totalItems / itemsPerPage)
    const currentPages = []
    
    if (currentPage - 1 >= 1) currentPages.push(currentPage - 1)
    currentPages.push(currentPage)
    if (currentPage + 1 <= totalPages) currentPages.push(currentPage + 1)
    
    setTotalPages(totalPages)
    setPages(currentPages)
  }, [currentPage, totalItems])

  return (
    <div className='flex justify-center items-center gap-1'>
      { currentPage > 1 ? <div className='pagination-item' onClick={() => goPage(currentPage - 1)}> {'<'} </div> : <></> }
      {pages.map(item => {
        return (<div key={item} onClick={() => goPage(item)} className='pagination-item' style={{ backgroundColor: item === currentPage ? '#521ece' : '#ffffff', color: item === currentPage ? '#ffffff' : '#7b7a7a' }}> {item} </div>)
      })}
      { currentPage < totalPages ? <div className='pagination-item' onClick={() => goPage(currentPage + 1)}> {'>'} </div> : <></>}
    </div>
  )
}

export default Pagination