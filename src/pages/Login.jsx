// src/pages/Login.jsx
import { useState, useEffect } from 'react'
import { useAuth }           from '../contexts/AuthContext'
import { useNavigate }       from 'react-router-dom'
import '../styles/Login.css'

export default function Login() {
  const { user, role, login } = useAuth()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const navigate                = useNavigate()

  // Se já estiver logado, redireciona conforme a função
  useEffect(() => {
    if (user) {
      if (role === 'admin')        navigate('/admin',      { replace: true })
      else if (role === 'conferente') navigate('/conferente', { replace: true })
      else                          navigate('/order',      { replace: true })
    }
  }, [user, role, navigate])

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    if (!email || !password) {
      setError('Preencha todos os campos.')
      return
    }
    setLoading(true)
    // login() retorna { data, error } do Supabase
    const { error: loginError } = await login(email, password)
    setLoading(false)
    if (loginError) {
      setError('Falha no login: ' + loginError.message)
    }
    // se não houve erro, o useEffect acima redireciona automaticamente
  }

  return (
    <div className="login-container">
      <h1 className="login-title">Login</h1>
      {error && <div className="login-error">{error}</div>}
      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          minLength={6}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Entrando…' : 'Entrar'}
        </button>
      </form>
    </div>
  )
}
