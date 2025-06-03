'use client'

import { useState, useEffect } from 'react'
import { Heart, Info, Share2, Users, Calendar } from 'lucide-react'
import { router } from '@inertiajs/react'
// import { apiService } from '~/service/utility'

interface Campaign {
  id: string
  user?: {
    name?: string
    avatar?: string
  }
  title: string
  description: string
  targetAmount: number
  collectedAmount: number
  status: string
  startDate: string
  endDate: string
  imageUrl: string
  category: string
  backers: number
}

const CampaignDetailPage = ({ id }: { id: string }) => {
  const [campaign, setCampaign] = useState<Campaign | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
      const fetchCampaigns = async () => {
        try {
          const response = await fetch(`/campaign/${id}`)
          if (!response.ok) {
            throw new Error('Failed to fetch campaigns')
          }
          const data = await response.json()
          setCampaign(data.campaign)
        } catch (error: any) {
          setError(error.message)
          console.error('Error fetching campaigns:', error)
        } finally {
          setLoading(false)
        }
      }
  
      fetchCampaigns()
    }, [id])

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

  if (!campaign) return null

  const percentFunded =
    campaign.targetAmount > 0
      ? Math.round((campaign.collectedAmount / campaign.targetAmount) * 100)
      : 0
  const hasEnded = new Date(campaign.endDate) < new Date()
  const daysLeft = !hasEnded
    ? Math.ceil(
        (new Date(campaign.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
      )
    : 0

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-blue-700 mb-6">Discover Campaigns</h1>
      <div className="max-w-3xl mx-auto bg-white rounded-xl overflow-hidden shadow-sm">
        <div className="relative h-72">
          <img
            src={campaign.imageUrl || '/placeholder.svg'}
            alt={campaign.title || 'Campaign Image'}
            className="w-full h-full object-cover"
          />

          <div className="absolute top-5 left-5 bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
            {campaign.category || 'Uncategorized'}
          </div>

          <div className="absolute bottom-5 left-5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-300 border-2 border-white overflow-hidden">
              {campaign.user?.avatar ? (
                <img
                  src={campaign.user.avatar}
                  alt={campaign.user?.name || 'User'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
                  <span className="text-lg">U</span>
                </div>
              )}
            </div>
            <span className="text-white font-semibold text-shadow">
              {campaign.user?.name || 'Anonymous User'}
            </span>
          </div>

          <div className="absolute bottom-5 right-5 bg-amber-500 text-white px-3 py-1 rounded text-sm font-semibold">
            {campaign.status || 'Unknown Status'}
          </div>
        </div>

        <div className="p-6">
          <h2 className="text-2xl font-bold text-blue-700 mb-3">
            {campaign.title || 'Untitled Campaign'}
          </h2>
          <p className="text-gray-700 mb-6">
            {campaign.description || 'No description available.'}
          </p>

          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span className="font-semibold text-lg">${campaign.collectedAmount || 0}</span>
              <span className="font-semibold text-lg">of ${campaign.targetAmount || 0}</span>
            </div>

            <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full"
                style={{ width: `${percentFunded > 100 ? 100 : percentFunded}%` }}
              ></div>
            </div>

            <div className="flex justify-between mt-2 text-sm text-gray-500">
              <span>{percentFunded}% Funded</span>
              <span>{hasEnded ? 'Campaign ended' : `${daysLeft} days left`}</span>
            </div>
          </div>

          <div className="flex items-center mb-6 text-gray-500 text-sm">
            <div className="flex items-center mr-6">
              <Users size={16} className="mr-2 text-blue-600" />
              <span>{campaign.backers || 0} backers</span>
            </div>
            <div className="flex items-center">
              <Calendar size={16} className="mr-2 text-blue-600" />
              <span>
                Started:{' '}
                {campaign.startDate ? new Date(campaign.startDate).toLocaleDateString() : 'N/A'}
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
            onClick={() => {
              const token = localStorage.getItem('access_token')
                if(!token){
                  window.location.href='/login'
                  return
                }
                router.visit(`/api/donation?campaignId=${campaign.id}`, {
                  method: 'get',
                  headers: {
                    Authorization: `${token}`,
                  },
                })
              }
            } 
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded flex items-center justify-center transition-colors">
              <Heart size={18} className="mr-2" />
              Donate
            </button>
            <button className="w-12 h-12 border border-gray-200 rounded flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors">
              <Info size={18} />
            </button>
            <button className="w-12 h-12 border border-gray-200 rounded flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors">
              <Share2 size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CampaignDetailPage
