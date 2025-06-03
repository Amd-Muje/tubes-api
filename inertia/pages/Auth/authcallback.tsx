import { useEffect } from 'react'
import { usePage } from '@inertiajs/react'
import { PageProps } from '~/components/navbar'

export default function AuthCallback() {
  const { token } = usePage<PageProps>().props

  useEffect(() => {
    // Simpan token
    if (token) {
      localStorage.setItem('access_token', token)
      
      // Redirect ke home setelah token tersimpan
      window.location.href = '/'
    }
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-xl">Logging you in...</h1>
        <p>Please wait...</p>
      </div>
    </div>
  )
}