import React, { useState, useEffect } from 'react'
import './taskform.css'

const TaskForm = ({ onSubmit, title, description, status }) => {
  const [currentStatus, setStatus] = useState('pending')
  const [error, setError] = useState('')

  useEffect(() => {
    if (status) setStatus(status)
  }, [])

  async function executeOnSubmit(e) {
    e.preventDefault()
    const title = e.target['title'].value
    const description =e.target['description'].value
    if (!title || !description) {
      setError('Es necesario que tenga título y descripción')
      return
    }

    await onSubmit({
      title,
      description,
      status: currentStatus
    })
  }

  return (
    <form onSubmit={executeOnSubmit}>
      <label htmlFor='title' className='task-form-label'>Título</label>
      <input type='text' name='title' placeholder='Título' defaultValue={title} className='task-form-title'/>
      <label htmlFor='description' className='task-form-label'>Descripción</label>
      <textarea name='description' placeholder='Descripción' defaultValue={description} className='task-form-description'/>
      <div className='flex items-center prevent-select' onClick={() => setStatus(currentStatus === 'completed' ? 'pending' : 'completed')}>
        {currentStatus === 'completed' ? 
        <i className='material-icons text-primary-color cursor-pointer mr-3'>radio_button_checked</i> :
        <i className='material-icons text-primary-color cursor-pointer mr-3'>radio_button_unchecked</i>}
        <label className='cursor-pointer'> Completado </label>
      </div>
      <span className='error'>{error}</span>
      <input type='submit' value='Guardar' className='btn-primary float-right w-1/4' />
    </form>
  )
}

export default TaskForm