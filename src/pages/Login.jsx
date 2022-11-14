import './login.css'
import AuthContext from '../context/Authentication'
import { useContext, useState } from 'react'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

function Login() {
  const [mode, setMode] = useState('login')
  const [error, setError] = useState('')
  const { login, signup } = useContext(AuthContext)

  async function loginUser(e) {
    e.preventDefault()
    const username = e.target['login-username'].value
    const password = e.target['login-password'].value

    if (!username || !password) {
      setError('Recuerda llenar los campos')
      return
    }
    try {
      await login({
        username,
        password
      })
    } catch (e) {
      console.log(e)
    }
  }

  async function signupUser(e) {
    e.preventDefault()

    const username = e.target['signup-username'].value
    const password = e.target['signup-password'].value

    if (!username || !password) {
      setError('Recuerda llenar los campos')
      return
    }

    try {
      await signup({
        username,
        password
      })
    } catch (error) {
      console.log(error)
      MySwal.fire({
        title: 'Ocurrio un error al generar el usuario',
        text: 'Inténtalo en otro momento',
        icon: 'error',
        showConfirmButton: false,
      })
    }
  }

  function changeMode () {
    setMode(mode === 'login' ? 'signup' : 'login')
    setError('')
  }

  return (
    <div className='login'>
      <div className='card'>
        <div className='hidden icon-container justify-center items-center w-1/2 md:flex'>
          <img src="https://www.elenas.co/co/wp-content/uploads/2022/09/elenas.png" alt="Elenas icon" />
        </div>
        {
          mode === 'login' ?
            <div className='w-full flex flex-col justify-center items-center gap-10 md:w-1/2'>
              <h1 className='title'>Inicio sesión</h1>
              <form className='w-full flex flex-col justify-center items-center gap-5 md:w-1/2' onSubmit={loginUser}>
                <input className='input-login-form username' type="text" name='login-username' placeholder='Username' />
                <input className='input-login-form password' type="password" name='login-password' placeholder='Contraseña' />
                <span className='error w-full'>{error}</span>
                <input className='input-login-form btn-primary' type="submit" value='Iniciar sesión' />
                <span className='text-primary-color cursor-pointer' onClick={changeMode}>No tengo cuenta aún</span>
              </form>
            </div> :
            <div className='w-full flex flex-col justify-center items-center gap-10 md:w-1/2'>
              <h1 className='title'>Registrate</h1>
              <form className='w-full flex flex-col justify-center items-center gap-5 md:w-1/2' onSubmit={signupUser}>
                <input className='input-login-form username' type="text" name='signup-username' placeholder='Ingresa tu username' />
                <input className='input-login-form password' type="password" name='signup-password' placeholder='Ingresa tu contraseña' />
                <span className='error'>{error}</span>
                <input className='input-login-form btn-primary' type="submit" value='Registrarme' />
                <span className='text-primary-color cursor-pointer' onClick={changeMode}>Ya tengo cuenta</span>
              </form>
            </div>
        }
      </div>
    </div>
  )
}

export default Login