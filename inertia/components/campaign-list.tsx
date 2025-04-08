'use client'

import { useState, useEffect } from 'react'
import CampaignCard from './campaign-card'

// Mock data for campaigns
const mockCampaigns = [
  {
    id: '1',
    userId: 'user1',
    user: {
      name: 'John Doe',
      avatar: '/placeholder.svg?height=100&width=100',
    },
    title: 'Help Build a Community Center',
    description:
      'We are raising funds to build a new community center that will serve as a hub for local activities, education, and support services.',
    targetAmount: 50000,
    collectedAmount: 25000,
    status: 'active',
    startDate: '2023-01-01',
    endDate: '2023-12-31',
    imageUrl: '/placeholder.svg?height=200&width=400',
    category: 'Community',
    backers: 125,
  },
  {
    id: '2',
    userId: 'user2',
    user: {
      name: 'Jane Smith',
      avatar: '/placeholder.svg?height=100&width=100',
    },
    title: 'Clean Water Initiative',
    description:
      'Help us provide clean drinking water to communities in need. Your contribution will help install water purification systems.',
    targetAmount: 30000,
    collectedAmount: 27000,
    status: 'active',
    startDate: '2023-02-15',
    endDate: '2023-08-15',
    imageUrl: '/placeholder.svg?height=200&width=400',
    category: 'Environment',
    backers: 210,
  },
  {
    id: '3',
    userId: 'user3',
    user: {
      name: 'Robert Johnson',
      avatar: '/placeholder.svg?height=100&width=100',
    },
    title: 'Educational Scholarships',
    description:
      'We aim to provide scholarships to underprivileged students who show academic promise but lack financial resources.',
    targetAmount: 25000,
    collectedAmount: 5000,
    status: 'active',
    startDate: '2023-03-10',
    endDate: '2023-09-10',
    imageUrl: '/placeholder.svg?height=200&width=400',
    category: 'Education',
    backers: 45,
  },
  {
    id: '4',
    userId: 'user4',
    user: {
      name: 'Maria Garcia',
      avatar: '/placeholder.svg?height=100&width=100',
    },
    title: 'Animal Shelter Renovation',
    description:
      'Our local animal shelter needs urgent renovations to provide better care for abandoned pets and increase adoption rates.',
    targetAmount: 15000,
    collectedAmount: 12000,
    status: 'active',
    startDate: '2023-04-05',
    endDate: '2023-07-05',
    imageUrl: '/placeholder.svg?height=200&width=400',
    category: 'Animals',
    backers: 180,
  },
  {
    id: '5',
    userId: 'user5',
    user: {
      name: 'David Wilson',
      avatar: '/placeholder.svg?height=100&width=100',
    },
    title: 'Renewable Energy for Schools',
    description:
      'Help us install solar panels in rural schools to provide sustainable energy and reduce operational costs.',
    targetAmount: 40000,
    collectedAmount: 8000,
    status: 'active',
    startDate: '2023-05-20',
    endDate: '2023-11-20',
    imageUrl: '/placeholder.svg?height=200&width=400',
    category: 'Environment',
    backers: 62,
  },
  {
    id: '6',
    userId: 'user6',
    user: {
      name: 'Sarah Brown',
      avatar: '/placeholder.svg?height=100&width=100',
    },
    title: 'Community Garden Project',
    description:
      "We're transforming an abandoned lot into a thriving community garden that will provide fresh produce and educational opportunities.",
    targetAmount: 10000,
    collectedAmount: 7500,
    status: 'active',
    startDate: '2023-06-01',
    endDate: '2023-09-01',
    imageUrl: '/placeholder.svg?height=200&width=400',
    category: 'Community',
    backers: 95,
  },
]

export default function CampaignList() {
  const [campaigns, setCampaigns] = useState<typeof mockCampaigns>([])

  useEffect(() => {
    // In a real application, you would fetch data from an API
    // For now, we'll use the mock data
    setCampaigns(mockCampaigns)
  }, [])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {campaigns.map((campaign) => (
        <CampaignCard key={campaign.id} campaign={campaign} />
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
