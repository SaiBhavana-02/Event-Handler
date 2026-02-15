import { useState, useContext } from 'react'
import axios from 'axios'
import { AuthContext } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import './Login.css'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const { data } = await axios.post(
        'http://localhost:5000/api/auth/login',
        { email, password }
      )

      login(data)
      navigate('/')
    } catch (error) {
      alert(error.response?.data?.message || 'Login failed')
    }
  }

  return (
    <div  className="login-page">
        <form className="login-form" onSubmit={handleSubmit}>
      <input className="login-input" type="email" placeholder='Enter Email' onChange={(e) => setEmail(e.target.value)} />
      <input className="login-input" type="password" placeholder='Enter password' onChange={(e) => setPassword(e.target.value)} />
      <button className="login-button" type="submit">Login</button>
    </form>
    </div>
    
  )
}

export default Login