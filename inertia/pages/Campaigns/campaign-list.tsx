'use client'

import { useState, useEffect } from 'react'
import CampaignCard from './components/campaign-card'
import { apiService } from '~/service/utility'
import { router } from '@inertiajs/react'
// import { useRouter } from 'next/router'

export default function CampaignList() {
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const data = await apiService.getCampaigns()
        setCampaigns(data.campaigns)
      } catch (error: any) {
        setError(error.message)
        console.error('Error fetching campaigns:', error)
      }
    }

    setLoading(false)
    fetchCampaigns()
  }, [])

  const handleCardClick = (id: string) => {
    router.visit(`/detail/${id}`)
  }

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

  if (!campaigns) return null

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {campaigns.map((campaign) => (
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
  )
}
