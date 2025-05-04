'use client'

import { router } from '@inertiajs/react'
import { useState } from 'react'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-gradient-to-r from-blue-700 to-blue-800 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="bg-white text-blue-600 p-2 rounded-lg shadow-md mr-3">
              <i className="ph ph-hand-heart text-2xl"></i>
            </div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
              FundTogether
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <ul className="flex space-x-8">
              <li>
                <a href="#" className="hover:text-blue-200 flex items-center font-medium">
                  <i className="ph ph-house mr-1"></i>
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-200 flex items-center font-medium">
                  <i className="ph ph-compass mr-1"></i>
                  Explore
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-200 flex items-center font-medium">
                  <i className="ph ph-plus-circle mr-1"></i>
                  Create Campaign
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-200 flex items-center font-medium">
                  <i className="ph ph-user-circle mr-1"></i>
                  Profile
                </a>
              </li>
            </ul>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search campaigns..."
                className="bg-blue-600/50 text-white placeholder-blue-300 border border-blue-500 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-400 w-48 transition-all focus:w-64"
              />
              <i className="ph ph-magnifying-glass absolute left-3 top-2.5 text-blue-300"></i>
            </div>
            <a href="/login">
            <button className="bg-white text-blue-700 hover:bg-blue-50 px-4 py-2 rounded-lg font-medium transition-colors shadow-md cursor-pointer">
              Sign In
            </button>
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-white focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <i className={`ph ${isMenuOpen ? 'ph-x' : 'ph-list'} text-2xl`}></i>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-2">
            <ul className="flex flex-col space-y-3">
              <li>
                <a href="#" className="hover:text-blue-200 flex items-center font-medium py-2">
                  <i className="ph ph-house mr-2"></i>
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-200 flex items-center font-medium py-2">
                  <i className="ph ph-compass mr-2"></i>
                  Explore
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-200 flex items-center font-medium py-2">
                  <i className="ph ph-plus-circle mr-2"></i>
                  Create Campaign
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-200 flex items-center font-medium py-2">
                  <i className="ph ph-user-circle mr-2"></i>
                  Profile
                </a>
              </li>
              <li className="pt-2 border-t border-blue-600">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search campaigns..."
                    className="bg-blue-600/50 text-white placeholder-blue-300 border border-blue-500 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
                  />
                  <i className="ph ph-magnifying-glass absolute left-3 top-2.5 text-blue-300"></i>
                </div>
              </li>
              <li className="pt-2">
                <a href="/login">
                <button
                  className="bg-white text-blue-700 hover:bg-blue-50 px-4 py-2 rounded-lg font-medium transition-colors shadow-md w-full cursor-pointer"
                  >
                  Sign In
                </button>
                  </a>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </header>
  )
}
