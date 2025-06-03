'use client'

import { Link, router, usePage } from '@inertiajs/react'
import { useEffect, useState } from 'react'
import { apiService } from '~/service/utility'

interface User {
  id: number
  name: string
  email: string
  avatarUrl?: string | null
  role: 'admin' | 'user'
}

export interface PageProps {
  auth: {
    user: User | null
  }
  [key: string]: any
}

interface Campaign {
  id: number
  title: string
  category: string
  owner: string
}

export default function Navbar() {
  const { auth = { user: null } } = usePage<PageProps>().props
  const [user, setUser] = useState<User | null>(auth?.user)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Campaign[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showSearchResults, setShowSearchResults] = useState(false)

  useEffect(() => {
    const validateUser = async () => {
      try {
        // Cek jika ada token
        const token = localStorage.getItem('access_token')
        if (!token) {
          setUser(null)
          return
        }

        // Get current user data
        const userData = await apiService.getCurrentUser()
        setUser(userData.user)
      } catch (error) {
        console.error('Error validating user:', error)
        // Clear token jika invalid
        localStorage.removeItem('access_token')
        setUser(null)
      }
    }

    validateUser()
  }, [user])

  // Search functionality
  useEffect(() => {
    const searchCampaigns = async () => {
      if (searchQuery.trim().length < 2) {
        setSearchResults([])
        setShowSearchResults(false)
        return
      }

      setIsSearching(true)
      try {
        const response = await fetch('/campaigns')
        if (response.ok) {
          const data = await response.json()
          const campaigns = data.campaigns || []
          
          // Filter campaigns based on title
          const filteredCampaigns = campaigns.filter((campaign: Campaign) =>
            campaign.title.toLowerCase().includes(searchQuery.toLowerCase())
          ).slice(0, 5) // Limit to 5 results
          
          setSearchResults(filteredCampaigns)
          setShowSearchResults(true)
        }
      } catch (error) {
        console.error('Error searching campaigns:', error)
        setSearchResults([])
      } finally {
        setIsSearching(false)
      }
    }

    const debounceTimer = setTimeout(searchCampaigns, 300)
    return () => clearTimeout(debounceTimer)
  }, [searchQuery])

  const handleLogout = async () => {
    try {
      localStorage.removeItem('access_token')
      setUser(null)
      window.location.href = '/login'
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  const getUserAvatar = (user: User) => {
    return user.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random&color=fff`
  }

  const getFirstName = (user: User) => {
    return user.name.split(' ')[0]
  }

  const handleSearchResultClick = (campaignId: number) => {
    setSearchQuery('')
    setShowSearchResults(false)
    router.visit(`/detail/${campaignId}`)
  }

  const handleSearchInputBlur = () => {
    // Delay hiding results to allow clicking on them
    setTimeout(() => setShowSearchResults(false), 200)
  }

  return (
    <header className="bg-gradient-to-r from-blue-700 to-blue-800 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="bg-white text-blue-600 p-2 rounded-lg shadow-md mr-3">
              <i className="ph ph-hand-heart text-2xl"></i>
            </div>
            <Link href="/">
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
                FundTogether
              </h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <ul className="flex space-x-8">
              {user&&(
              <li>
                <Link href="/" className="hover:text-blue-200 flex items-center font-medium">
                  <i className="ph ph-house mr-1"></i>
                  Home
                </Link>
              </li>
              )}
              {user && (
                <li>
                  <Link href="/campaign" className="hover:text-blue-200 flex items-center font-medium">
                    <i className="ph ph-plus-circle mr-1"></i>
                    Create Campaign
                  </Link>
                </li>
              )}
              {user && (
                <li>
                  <Link href={`/profile`} className="hover:text-blue-200 flex items-center font-medium">
                    <i className="ph ph-user-circle mr-1"></i>
                    Profile
                  </Link>
                </li>
              )}
            </ul>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search campaigns..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.length >= 2 && setShowSearchResults(true)}
                onBlur={handleSearchInputBlur}
                className="bg-blue-600/50 text-white placeholder-blue-300 border border-blue-500 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-400 w-48 transition-all focus:w-64"
              />
              <i className="ph ph-magnifying-glass absolute left-3 top-2.5 text-blue-300"></i>
              
              {/* Search Results Dropdown */}
              {showSearchResults && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 max-h-80 overflow-y-auto z-50">
                  {isSearching ? (
                    <div className="p-4 text-center text-gray-500">
                      <i className="ph ph-spinner animate-spin mr-2"></i>
                      Searching...
                    </div>
                  ) : searchResults.length > 0 ? (
                    <>
                      {searchResults.map((campaign) => (
                        <div
                          key={campaign.id}
                          onClick={() => handleSearchResultClick(campaign.id)}
                          className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                        >
                          <div className="text-gray-800 font-medium text-sm">
                            {campaign.title}
                          </div>
                          <div className="text-gray-500 text-xs mt-1">
                            {campaign.category} • by {campaign.owner}
                          </div>
                        </div>
                      ))}
                      <div className="p-2 text-center border-t border-gray-100">
                        <Link
                          href={`/campaigns?search=${encodeURIComponent(searchQuery)}`}
                          className="text-blue-600 text-sm hover:underline"
                          onClick={() => {
                            setSearchQuery('')
                            setShowSearchResults(false)
                          }}
                        >
                          View all results for "{searchQuery}"
                        </Link>
                      </div>
                    </>
                  ) : (
                    <div className="p-4 text-center text-gray-500 text-sm">
                      No campaigns found for "{searchQuery}"
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Conditional rendering for Login/Sign In vs Profile */}
            {!user ? (
              <Link href="/login">
                <button className="bg-white text-blue-700 hover:bg-blue-50 px-4 py-2 rounded-lg font-medium transition-colors shadow-md cursor-pointer">
                  Sign In
                </button>
              </Link>
            ) : (
              <div className="relative">
                <div
                  className="flex items-center space-x-2 cursor-pointer group"
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  onBlur={() => setTimeout(() => setIsProfileDropdownOpen(false), 100)}
                  tabIndex={0}
                >
                  <img
                    src={getUserAvatar(user)}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-md"
                  />
                  <span className="font-medium text-white group-hover:text-blue-200 transition-colors">
                    {getFirstName(user)}
                  </span>
                  <i className={`ph ph-caret-down transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180' : ''}`}></i>
                </div>

                {/* Dropdown Menu */}
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-xl py-2 z-50">
                    <Link
                      href={`/profile`}
                      className="block px-4 py-2 text-sm hover:bg-blue-50 hover:text-blue-700"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      My Profile
                    </Link>
                    <Link
                      href="/settings"
                      className="block px-4 py-2 text-sm hover:bg-blue-50 hover:text-blue-700"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      Settings
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout()
                        setIsProfileDropdownOpen(false)
                      }}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-red-50 text-red-600"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
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
                <Link href="/" className="hover:text-blue-200 flex items-center font-medium py-2">
                  <i className="ph ph-house mr-2"></i>
                  Home
                </Link>
              </li>
              <li>
                <Link href="/explore" className="hover:text-blue-200 flex items-center font-medium py-2">
                  <i className="ph ph-compass mr-2"></i>
                  Explore
                </Link>
              </li>
              {user && (
                <li>
                  <Link href="/campaign" className="hover:text-blue-200 flex items-center font-medium py-2">
                    <i className="ph ph-plus-circle mr-2"></i>
                    Create Campaign
                  </Link>
                </li>
              )}
              {user && (
                <li>
                  <Link href={`/profile/${user.id}`} className="hover:text-blue-200 flex items-center font-medium py-2">
                    <i className="ph ph-user-circle mr-2"></i>
                    Profile
                  </Link>
                </li>
              )}
              <li className="pt-2 border-t border-blue-600">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search campaigns..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => searchQuery.length >= 2 && setShowSearchResults(true)}
                    onBlur={handleSearchInputBlur}
                    className="bg-blue-600/50 text-white placeholder-blue-300 border border-blue-500 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
                  />
                  <i className="ph ph-magnifying-glass absolute left-3 top-2.5 text-blue-300"></i>
                  
                  {/* Mobile Search Results */}
                  {showSearchResults && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 max-h-60 overflow-y-auto z-50">
                      {isSearching ? (
                        <div className="p-4 text-center text-gray-500">
                          <i className="ph ph-spinner animate-spin mr-2"></i>
                          Searching...
                        </div>
                      ) : searchResults.length > 0 ? (
                        searchResults.map((campaign) => (
                          <div
                            key={campaign.id}
                            onClick={() => handleSearchResultClick(campaign.id)}
                            className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                          >
                            <div className="text-gray-800 font-medium text-sm">
                              {campaign.title}
                            </div>
                            <div className="text-gray-500 text-xs mt-1">
                              {campaign.category} • by {campaign.owner}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-center text-gray-500 text-sm">
                          No campaigns found for "{searchQuery}"
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </li>
              {!user && (
                <li className="pt-2">
                  <Link href="/login">
                    <button className="bg-white text-blue-700 hover:bg-blue-50 px-4 py-2 rounded-lg font-medium transition-colors shadow-md w-full cursor-pointer">
                      Sign In
                    </button>
                  </Link>
                </li>
              )}
            </ul>
          </nav>
        )}
      </div>
    </header>
  )
}