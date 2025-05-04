'use client'

import { useState, useEffect } from 'react'
import CampaignCard from './campaign-card'
// import { useRouter } from 'next/router'

export default function CampaignList() {
  const [campaigns, setCampaigns] = useState<any[]>([])
  // const router = useRouter()

  useEffect(() => {
    const fetchCampaigns = async () => {
      const token = localStorage.getItem('authToken')
      if (!token) {
        console.error('Auth token is missing')
        return
      }

      try {
        const res = await fetch('http://localhost:3333/api/campaigns', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `${token}`,
          },
        })
        console.log(token)

        if (!res.ok) {
          console.error('Failed to fetch campaigns:', res.statusText)
          return
        }

        const data = await res.json()
        setCampaigns(data.campaigns)
      } catch (error) {
        console.error('Error fetching campaigns:', error)
      }
    }

    fetchCampaigns()
  }, [])


  const handleCardClick = (id: string) => {
          window.location.href =`api/campaigns/${id}`

  }
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
