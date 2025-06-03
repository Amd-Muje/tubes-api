'use client'

import { useState } from 'react'
import { Eye, EyeOff, Lock } from 'lucide-react'

const Login = () => {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'same-origin',
      })

      const data = await response.json()

      const token = data.token.headers.authorization
      const userId = data.user.id
      const userRole = data.user.role
      
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed')
      }
      console.log("ini adalah token :", token)
      console.log("in user id", userId)

      localStorage.setItem('userId', userId)
      
      // Save the token to localStorage or sessionStorage
      localStorage.setItem('access_token', token)
      localStorage.setItem('userRole', userRole)

      // Redirect to home page after successful login
      window.location.href = '/'
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-screen flex justify-center items-center p-5">
      <div className="bg-white rounded-lg shadow-md flex items-center gap-4 w-full h-full">
        <div className="w-[35%] flex flex-col p-10">
          <h1 className="text-2xl font-bold text-center mb-2 text-gray-800">Welcome Back</h1>
          <p className="text-center text-gray-600 mb-6">Please enter your credentials to log in</p>

          {error && <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4">{error}</div>}
          <a href="/google/redirect">
          <button className='border p-2 mx-auto rounded-lg flex px-6 cursor-pointer border-gray-300'>
          <i className="ph ph-google-logo text-blue-700 text-2xl"></i>
          </button>
          </a>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block mb-1 font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="name@example.com"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-24 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-blue-600 hover:text-blue-800"
                >
                  {showPassword ? (
                    <>
                      <EyeOff className="h-5 w-5 mr-1" />
                    </>
                  ) : (
                    <>
                      <Eye className="h-5 w-5 mr-1" />
                    </>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-md font-medium text-white transition-colors ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
              }`}
            >
              {loading ? 'Logging in...' : 'Log In'}
            </button>

            <div className="mt-4 text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <a href="/register" className="text-blue-600 hover:underline">
                Sign up
              </a>
            </div>
          </form>
        </div>
        <div className="bg-[url('/img/loginimg.webp')] bg-cover bg-center w-[65%] h-full rounded-lg" ></div>
      </div>
    </div>
  )
}

export default Login
