'use client'

import { formatCurrency, formatDate, daysRemaining, calculateProgress } from '../../../lib/utils'
import { useState } from 'react'

export interface Campaign {
  id: number
  owner: string  // Changed from user.name
  title: string
  description: string
  target: number // Changed from target_amount
  collected: number // Changed from collected_amount
  status: 'pending' | 'approved' | 'rejected' | 'completed'
  startDate: string
  due: string // Changed from endDate
  img_url: string
  category: string
  ownerId: number // Added to match database
}

interface CampaignCardProps {
  campaign: Campaign
}

export default function CampaignCard({ campaign }: CampaignCardProps) {
  const collectedAmount = Number(campaign.collected)
  const targetAmount = Number(campaign.target)
  const progress =  calculateProgress(collectedAmount,targetAmount)
  const days = daysRemaining(campaign.due) // Changed from endDate
  const [isHovered, setIsHovered] = useState(false)
  const isAdmin = localStorage.getItem('userRole') === 'admin'

  return (
    <div
    className="bg-white rounded-xl overflow-hidden border border-blue-100 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
    onMouseEnter={() => setIsHovered(true)}
    onMouseLeave={() => setIsHovered(false)}
  >
    <div className="relative">
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={campaign.img_url || 'https://placehold.co/600x400'}
          alt={campaign.title}
          className={`w-full h-full object-cover transition-transform duration-500 ${isHovered ? 'scale-105' : 'scale-100'}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      </div>

      <div className="absolute top-3 left-3">
        <span className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full">
          {campaign.category}
        </span>
      </div>

      <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center">
        <div className="flex items-center">
          <span className="text-white text-sm font-medium drop-shadow-md">
            {campaign.owner}
          </span>
        </div>
        {isAdmin && (
          <span
            className={`px-2 py-1 text-xs rounded-full font-medium ${
              campaign.status === 'approved'
                ? 'bg-green-500 text-white'
                : campaign.status === 'completed'
                  ? 'bg-blue-500 text-white'
                  : campaign.status === 'rejected'
                    ? 'bg-red-500 text-white'
                    : 'bg-yellow-500 text-white'
            }`}
          >
            {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
          </span>
        )}
      </div>
    </div>

    <div className="p-5">
      <h2 className="text-xl font-bold text-blue-800 line-clamp-1 mb-2 hover:text-blue-600 transition-colors">
        {campaign.title}
      </h2>

      <p className="text-gray-600 mb-4 line-clamp-2 text-sm">{campaign.description}</p>

      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1.5">
          <span className="font-medium text-gray-700">
            {formatCurrency(campaign.collected)}
          </span>
          <span className="text-gray-500">of {formatCurrency(campaign.target)}</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2.5 mb-1.5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-500 to-blue-600 h-2.5 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <span>{progress}% Funded</span>
          <span>{days > 0 ? `${days} days left` : 'Campaign ended'}</span>
        </div>
      </div>

      <div className="flex justify-between items-center text-xs text-gray-500 mb-4">
        <div className="flex items-center">
          <i className="ph ph-calendar text-blue-500 mr-1"></i>
          <span>Started: {formatDate(campaign.startDate)}</span>
        </div>
      </div>

      <div className="flex gap-2">
        <button 
          className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center"
          disabled={campaign.status !== 'approved'}
        >
          <i className="ph ph-heart-straight mr-1.5"></i>
          Donate
        </button>
        <button className="bg-blue-50 text-blue-600 border border-blue-200 px-3 py-2.5 rounded-lg hover:bg-blue-100 transition-colors">
          <i className="ph ph-info"></i>
        </button>
      </div>
    </div>
  </div>
  )
}
