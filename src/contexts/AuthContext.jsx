import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import Spinner from "../components/Spinner";

const AuthContext = createContext()
export function useAuth() { return useContext(AuthContext) }

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null)
  const [role,    setRole]    = useState(null)
  const [loading, setLoading] = useState(true)

  // inicialização + listener original (mantém sessão ao recarregar)
  useEffect(() => {
    async function init() {
      const { data: { session }} = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      if (session?.user) {
        const { data: profile } = await supabase
          .from('users').select('role').eq('id', session.user.id).single()
        setRole(profile?.role ?? null)
      }
      setLoading(false)
    }
    init()
    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        supabase
          .from('users').select('role').eq('id', session.user.id).single()
          .then(({ data: profile }) => setRole(profile?.role ?? null))
      } else {
        setRole(null)
      }
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  // NOVA VERSÃO do login
  const login = async (email, password) => {
    setLoading(true)
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (data.session) {
      setUser(data.session.user)
      // já busca role imediatamente:
      const { data: profile } = await supabase
        .from('users').select('role').eq('id', data.session.user.id).single()
      setRole(profile?.role ?? null)
    }
    setLoading(false)
    return { data, error }
  }

  const logout = async () => {
    setLoading(true)
    await supabase.auth.signOut()
    setUser(null)
    setRole(null)
    setLoading(false)
  }

  const register = async (name, email, password, newRole='atendente') => {
    setLoading(true)
    const { data, error } = await supabase.auth.signUp({
      email, password,
      options: { data: { name }}
    })
    if (!error) {
      await supabase.from('users').insert({
        id: data.user.id, name, email, role:newRole, created_at: new Date().toISOString()
      })
    }
    setLoading(false)
    if (error) throw error
  }

if (loading) return <Spinner />;

  return (
    <AuthContext.Provider value={{ user, role, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  )
}
