import { Head } from '@inertiajs/react'
import { useForm } from '@inertiajs/react'
import { useState } from 'react'
import { EyeIcon, EyeOffIcon } from 'lucide-react'

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)

  const { data, setData, post, processing, errors } = useForm({
    email: '',
    password: '',
    remember: false as boolean,
  })
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    post('api/user/login')
  }

  return (
    <div className="flex min-h-screen">
      {/* Bagian kiri - Form Login */}
      <div className="w-1/2 flex items-center justify-center bg-white p-8">
        <div className="w-full max-w-md">
          <Head title="Login" />

          <div className="flex justify-center mb-8">
            <div className="h-12 w-12 bg-blue-500 rounded-full flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z"></path>
                <path d="M12 8v8"></path>
                <path d="M8 12h8"></path>
              </svg>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-center mb-2">Login to your account</h1>
          <p className="text-gray-500 text-center mb-8">Welcome back, please enter your details</p>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email address <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                type="email"
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
                placeholder="name@website.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.email && <div className="text-red-500 text-sm mt-1">{errors.email}</div>}
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={data.password}
                  onChange={(e) => setData('password', e.target.value)}
                  placeholder="••••••••••"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                </button>
              </div>
              {errors.password && (
                <div className="text-red-500 text-sm mt-1">{errors.password}</div>
              )}
            </div>

            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <input
                  id="remember"
                  type="checkbox"
                  checked={data.remember}
                  onChange={(e) => setData('remember', e.target.checked)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                  Keep me logged in
                </label>
              </div>
              <a href="#" className="text-sm text-blue-600 hover:underline">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={processing}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Log in
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">OR</p>
            <div className="flex justify-center space-x-4 mt-4">
              <button className="flex items-center justify-center w-12 h-12 border border-gray-300 rounded-md hover:bg-gray-50">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="#EA4335"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5.01 14.92c-1.42 1.45-3.4 2.35-5.59 2.35-4.41 0-8-3.59-8-8s3.59-8 8-8c2.29 0 4.15.97 5.5 2.53l-2.37 2.37c-.73-.73-1.97-1.59-3.13-1.59-2.68 0-4.86 2.22-4.86 4.9 0 2.68 2.18 4.9 4.86 4.9 2.12 0 3.5-1.14 3.92-2.55h-3.92v-3.09h6.59c.06.35.1.7.1 1.15 0 1.67-.44 3.37-1.6 4.03z" />
                </svg>
              </button>
              <button className="flex items-center justify-center w-12 h-12 border border-gray-300 rounded-md hover:bg-gray-50">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="#1877F2"
                >
                  <path d="M12 2.04c-5.5 0-10 4.49-10 10.02 0 5 3.66 9.15 8.44 9.9v-7H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.89 3.78-3.89 1.09 0 2.23.19 2.23.19v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33v7a10 10 0 0 0 8.44-9.9c0-5.53-4.5-10.02-10-10.02z" />
                </svg>
              </button>
              <button className="flex items-center justify-center w-12 h-12 border border-gray-300 rounded-md hover:bg-gray-50">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="#000000"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
                </svg>
              </button>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Not registered yet?{' '}
              <a href="/register" className="text-blue-600 hover:underline">
                Create an account
              </a>
            </p>
          </div>

          <div className="mt-12 text-center">
            <p className="text-xs text-gray-500">© Squareful design system All Rights Reserved.</p>
          </div>
        </div>
      </div>

      {/* Bagian kanan - Testimonial */}
      <div className="w-1/2 bg-gray-100 relative hidden md:block">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://cdn.pixabay.com/photo/2019/10/19/16/30/poverty-4561704_1280.jpg')",
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col justify-end p-12">
            <div className="mb-4 flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="#FFD700"
                  className="mr-1"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ))}
            </div>
            <h2 className="text-white text-2xl font-bold mb-4">
              FundTogether is a crowdfunding platform with a vision of creating greater positive
              change!
            </h2>
            <div className="text-white">
              <p className="font-semibold">FundBridge</p>
              <p className="text-sm">Crowdfunding Drivers</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
