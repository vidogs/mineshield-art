import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSupabase } from '../hooks/useSupabase'

export function AuthCallbackPage() {
  const navigate = useNavigate()
  const supabase = useSupabase()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Supabase автоматически обрабатывает callback через detectSessionInUrl
        // Просто ждем завершения процесса и перенаправляем
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Error getting session:', error)
        }

        // Перенаправляем на главную страницу
        navigate('/', { replace: true })
      } catch (error) {
        console.error('Error handling auth callback:', error)
        navigate('/', { replace: true })
      }
    }

    handleAuthCallback()
  }, [navigate, supabase])

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div>Загрузка...</div>
    </div>
  )
}

