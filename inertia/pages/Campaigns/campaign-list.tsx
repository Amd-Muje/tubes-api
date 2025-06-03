'use client'

import { useState, useEffect } from 'react'
import CampaignCard, { Campaign } from './components/campaign-card'
import { router } from '@inertiajs/react'

export default function CampaignList() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  
  // Filter and sort states
  const [showFilterMenu, setShowFilterMenu] = useState(false)
  const [showSortMenu, setShowSortMenu] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('newest')

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await fetch('/campaigns')
        if (!response.ok) {
          throw new Error('Failed to fetch campaigns')
        }
        const data = await response.json()
        const campaignData = Array.isArray(data.campaigns) ? data.campaigns : []
        setCampaigns(campaignData)
        setFilteredCampaigns(campaignData)
      } catch (error: any) {
        setError(error.message)
        console.error('Error fetching campaigns:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCampaigns()
  }, [])

  // Filter and sort logic
  useEffect(() => {
    let filtered = [...campaigns]

    // Apply filters
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(campaign => campaign.category === selectedCategory)
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(campaign => campaign.status === selectedStatus)
    }

    // Apply sorting
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
        break
      case 'oldest':
        filtered.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
        break
      case 'target-high':
        filtered.sort((a, b) => b.target - a.target)
        break
      case 'target-low':
        filtered.sort((a, b) => a.target - b.target)
        break
      case 'progress':
        filtered.sort((a, b) => (b.collected / b.target) - (a.collected / a.target))
        break
      case 'alphabetical':
        filtered.sort((a, b) => a.title.localeCompare(b.title))
        break
    }

    setFilteredCampaigns(filtered)
  }, [campaigns, selectedCategory, selectedStatus, sortBy])

  // Get unique categories for filter
  const categories = [...new Set(campaigns.map(campaign => campaign.category))]
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-center">
        <h2 className="text-xl text-red-600 mb-2">Error</h2>
        <p className="text-gray-700">{error}</p>
      </div>
    )
  }
  
  if (!campaigns.length) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-center">
        <h2 className="text-xl text-gray-600 mb-2">No Campaigns Found</h2>
        <p className="text-gray-700">There are no active campaigns at the moment.</p>
      </div>
    )
  }
  
  const handleCardClick = (id: number) => {
    router.visit(`/detail/${id}`)
  }

  const resetFilters = () => {
    setSelectedCategory('all')
    setSelectedStatus('all')
    setSortBy('newest')
  }
  
  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-blue-800 relative">
          <span className="relative z-10">Discover Campaigns</span>
          <span className="absolute bottom-0 left-0 w-full h-3 bg-blue-200 opacity-40 rounded-lg z-0"></span>
        </h2>
        <div className="flex space-x-2 relative">
          {/* Filter Button */}
          <div className="relative">
            <button 
              onClick={() => {
                setShowFilterMenu(!showFilterMenu)
                setShowSortMenu(false)
              }}
              className="px-4 py-2 bg-white text-blue-600 border border-blue-200 rounded-full shadow-sm hover:shadow-md transition-all flex items-center"
            >
              <i className="ph ph-funnel text-lg mr-1"></i>
              Filter
              {(selectedCategory !== 'all' || selectedStatus !== 'all') && (
                <span className="ml-2 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </button>
            
            {/* Filter Dropdown */}
            {showFilterMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <div className="p-4">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select 
                      value={selectedCategory} 
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="all">All Categories</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select 
                      value={selectedStatus} 
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button 
                      onClick={resetFilters}
                      className="flex-1 px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200"
                    >
                      Reset
                    </button>
                    <button 
                      onClick={() => setShowFilterMenu(false)}
                      className="flex-1 px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sort Button */}
          <div className="relative">
            <button 
              onClick={() => {
                setShowSortMenu(!showSortMenu)
                setShowFilterMenu(false)
              }}
              className="px-4 py-2 bg-white text-blue-600 border border-blue-200 rounded-full shadow-sm hover:shadow-md transition-all flex items-center"
            >
              <i className="ph ph-sort-ascending text-lg mr-1"></i>
              Sort
            </button>
            
            {/* Sort Dropdown */}
            {showSortMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <div className="p-2">
                  {[
                    { value: 'newest', label: 'Newest First' },
                    { value: 'oldest', label: 'Oldest First' },
                    { value: 'target-high', label: 'Highest Target' },
                    { value: 'target-low', label: 'Lowest Target' },
                    { value: 'progress', label: 'Most Progress' },
                    { value: 'alphabetical', label: 'A-Z' }
                  ].map(option => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSortBy(option.value)
                        setShowSortMenu(false)
                      }}
                      className={`w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 ${
                        sortBy === option.value ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Results Info */}
      <div className="mb-4 text-sm text-gray-600">
        Showing {filteredCampaigns.length} of {campaigns.length} campaigns
        {(selectedCategory !== 'all' || selectedStatus !== 'all') && (
          <button 
            onClick={resetFilters}
            className="ml-2 text-blue-600 hover:underline"
          >
            Clear filters
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCampaigns.map((campaign) => (
          <div
            key={campaign.id}
            onClick={() => handleCardClick(campaign.id)}
            className="cursor-pointer"
          >
            <CampaignCard campaign={campaign} />
          </div>
        ))}
        <div className="col-span-full flex justify-center mt-8">
          <button className="bg-white text-blue-600 border border-blue-200 rounded-full px-6 py-3 shadow hover:shadow-md transition-all flex items-center font-medium">
            <i className="ph ph-plus-circle mr-2"></i>
            Load More Campaigns
          </button>
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {(showFilterMenu || showSortMenu) && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => {
            setShowFilterMenu(false)
            setShowSortMenu(false)
          }}
        />
      )}
    </>
  )
}