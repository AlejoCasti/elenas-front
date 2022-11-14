import React, { useState, useEffect } from 'react'
import Modal from 'react-modal';
import { getAuthContext } from '../context/Authentication'
import apiService from '../services/api'
import Header from '../components/Header'
import TaskForm from '../components/TaskForm'
import Pagination from '../components/Pagination'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import './home.css'

const MySwal = withReactContent(Swal)
Modal.setAppElement('#root');
const ITEMS_PER_PAGE = 7

function Home() {
  const [tasks, setTasks] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false)
  const [showEditTaskModal, setShowEditTaskModal] = useState(false)
  const [taskToEdit, setTaskToEdit] = useState(false)
  const [deleteMode, setDeleteMode] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [currentSearch, setCurrentSearch] = useState('')

  const { userData } = getAuthContext()
  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
  };

  function getIcon(task) {
    const icons = [
      'description',
      'folder_open',
      'palette',
      'brush',
      'sports_soccer',
      'restaurant',
      'calculate'
    ]

    const title = task.title.toLowerCase()
    const ascii = title[0].charCodeAt(0) - 97
    const index = ascii % 7
    if (index < 0) return icons[3]
    return icons[index]
  }

  async function getTasks({ page = currentPage } = {}) {
    try {
      setLoading(true)
      const { data } = await apiService.getTasks({ page, offset: ITEMS_PER_PAGE * currentPage - ITEMS_PER_PAGE, search: currentSearch })
      setTasks({
        ...data,
        results: data.results.map(task => {
          return { ...task, icon: getIcon(task) }
        })
      })
    } catch (e) {
      console.log(e)
    } finally {
      setLoading(false)
    }
  }

  async function createTask({ title, description, status }) {
    try {
      await apiService.createTask({ title, description, status })
      setShowCreateTaskModal(false)
      await getTasks()
    } catch (e) {
      console.log(e)
    }
  }

  async function updateTask({ id, title, description, status }) {
    try {
      await apiService.updateTask({
        id: id || taskToEdit.id,
        title,
        description,
        status
      })
      setShowEditTaskModal(false)
      await getTasks()
    } catch (e) {
      MySwal.fire({
        title: 'Ocurrio un error al intentar editar',
        text: e.message,
        icon: 'error'
      })
    }
  }

  async function changeStatus(e, task) {
    e.stopPropagation()
    setTaskToEdit(task)
    await updateTask({
      ...task,
      status: task.status === 'completed' ? 'pending' : 'completed'
    })
  }

  async function deleteTask(task) {
    const result = await MySwal.fire({
      title: '¿Deseas eliminar la tarea?',
      text: 'Se eliminara tu tarea permanentemente',
      icon: 'warning',
      showConfirmButton: true,
      showDenyButton: true,
      confirmButtonText: 'Eliminar',
      denyButtonText: 'Cancelar',
      confirmButtonColor: '#521ece',
      denyButtonColor: '#cccccc',
    })

    if (!result.value) return

    // delete tarea
    await apiService.deleteTask({ id: task.id })
    await getTasks()
  }

  function editTask(task) {
    setTaskToEdit(task)
    setShowEditTaskModal(true)
  }

  async function goPage (page) {
    setCurrentPage(page)
  }

  async function searchTask(e) {
    setCurrentSearch(e.target.value)
    await getTasks()
  }

  useEffect(() => {
    getTasks()
  }, [currentSearch, currentPage])



  return (
    <div className=''>
      <Header />
      <div className='home'>
        <div className='flex justify-center'>
          <div className='home-card'>
            <div className='flex justify-between mb-2'>
              <h1 className='home-title'>Hola {userData.username}</h1>
              {
                deleteMode ?
                  <i className='material-icons text-red-500' onClick={() => setDeleteMode(!deleteMode)}> cancel </i> :
                  <i className='material-icons text-red-500' onClick={() => setDeleteMode(!deleteMode)}> delete </i>
              }
            </div>
            <div className="relative w-full mb-3">
              <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                <i className='material-icons search-icon'>search</i>
              </div>
              <input type="text" className="search-bar text-sm rounded-lg w-full pl-10 p-2.5" placeholder="Busca por descripción" onChange={searchTask}/>
            </div>
            <div className='tasks'>
              {tasks ? tasks.results.map(task => {
                return (
                  <div className='flex items-center mb-3' key={task.id}>
                    <div className='task-item grow-[1]' onClick={() => editTask(task)} style={{ opacity: task.status === 'completed' ? 0.4 : 1 }}>
                      <div className='flex items-center'>
                        <i className='task-icon material-icons mr-2'>{task.icon}</i>
                        <div>
                          <div className='task-title'>{task.title}</div>
                          <span className='task-description'>{task.description}</span>
                        </div>
                      </div>
                      {
                        task.status === 'completed' ?
                          <i className='material-icons text-primary-color float-right' onClick={(e) => { changeStatus(e, task) }}>radio_button_checked</i> :
                          <i className='material-icons text-primary-color float-right' onClick={(e) => { changeStatus(e, task) }}>radio_button_unchecked</i>
                      }
                    </div>
                    {deleteMode ? <i className='material-icons text-red-500 ml-3' onClick={() => { deleteTask(task) }}>delete</i> : <></>}
                  </div>
                )
              }) : <></>}
            </div>
            <div className='button-auto'>
              <Pagination currentPage={currentPage} totalItems={tasks ? tasks.count : 1} itemsPerPage={ITEMS_PER_PAGE} goPage={goPage}/>
            </div>
          </div>
        </div>
        <div href="#" className="float-button" onClick={() => setShowCreateTaskModal(true)}>
          <i className="float-icon material-icons">description</i>
        </div>
      </div>
      <Modal
        isOpen={showCreateTaskModal}
        onRequestClose={() => setShowCreateTaskModal(false)}
        style={customStyles}
      >
        <TaskForm onSubmit={createTask} />
      </Modal>

      <Modal
        isOpen={showEditTaskModal}
        onRequestClose={() => setShowEditTaskModal(false)}
        style={customStyles}
      >
        <TaskForm onSubmit={updateTask} title={taskToEdit.title} description={taskToEdit.description} status={taskToEdit.status} />
      </Modal>
    </div>
  )
}

export default Home