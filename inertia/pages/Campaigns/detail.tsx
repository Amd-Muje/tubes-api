'use client'

import { useState, useEffect } from 'react'
import { Heart, Info, Share2, Users, Calendar } from 'lucide-react'
import { router } from '@inertiajs/react'
import { calculateProgress } from '~/lib/utils'

interface Campaign {
  id: string
  owner: string
  ownerId: string
  title: string
  img_url: string
  category: string
  description: string
  target: number
  collected: number
  status: string
  startDate: string
  due: string
  createdAt: string
  updatedAt: string
}

const CampaignDetailPage = ({ id }: { id: string }) => {
  const [campaign, setCampaign] = useState<Campaign | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    const fetchCampaign = async () => {
      try {
        const response = await fetch(`/campaign/${id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch campaign')
        }
        const data = await response.json()
        setCampaign(data.campaign)
      } catch (error: any) {
        setError(error.message)
        console.error('Error fetching campaign:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCampaign()
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

  
  const collectedAmount = Number(campaign.collected)
  const targetAmount = Number(campaign.target)
  
  const percentFunded = calculateProgress(collectedAmount,targetAmount)

  const hasEnded = new Date(campaign.due) < new Date()
  const daysLeft = !hasEnded
    ? Math.ceil(
        (new Date(campaign.due).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
      )
    : 0

  return (
    <div className="container w-screen h-screen">
      <div className="w-screen h-screen bg-white overflow-x-hidden shadow-sm flex">
        <div className="relative h-screen w-1/2">
          <img
            src={campaign.img_url || '/placeholder.svg'}
            alt={campaign.title || 'Campaign Image'}
            className="w-full h-full object-cover object-center"
          />

          <div className="absolute top-5 left-5 bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
            {campaign.category || 'Uncategorized'}
          </div>

          <div className="absolute bottom-5 left-5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-300 border-2 border-white overflow-hidden flex items-center justify-center text-white font-semibold">
              {campaign.owner ? campaign.owner.charAt(0).toUpperCase() : 'U'}
            </div>
            <span className="text-white font-semibold text-shadow">
              {campaign.owner || 'Anonymous User'}
            </span>
          </div>

          <div className="absolute bottom-5 right-5 bg-amber-500 text-white px-3 py-1 rounded text-sm font-semibold">
            {campaign.status || 'Unknown Status'}
          </div>
        </div>

        <div className="p-6 px-10 w-1/2">
          <h2 className="text-2xl font-bold text-blue-700 mb-3">
            {campaign.title || 'Untitled Campaign'}
          </h2>
          <p className="text-gray-700 mb-6">
            {campaign.description || 'No description available.'}
          </p>

          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span className="font-semibold text-lg">Rp.{campaign.collected || 0}</span>
              <span className="font-semibold text-lg">of Rp.{campaign.target || 0}</span>
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
              <span>Backers info not available</span>
            </div>
            <div className="flex items-center">
              <Calendar size={16} className="mr-2 text-blue-600" />
              <span>
                Started: {campaign.startDate ? new Date(campaign.startDate).toLocaleDateString() : 'N/A'}
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => {
                const token = localStorage.getItem('access_token')
                if (!token) {
                  window.location.href = '/login'
                  return
                }
                router.visit(`/api/donation?campaignId=${campaign.id}`, {
                  method: 'get',
                  headers: {
                    Authorization: `${token}`,
                  },
                })
              }}
              className=" bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded flex items-center justify-center transition-colors"
            >
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
