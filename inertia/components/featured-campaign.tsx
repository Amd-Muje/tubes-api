"use client"

import { formatCurrency, calculateProgress } from "../lib/utils"

export default function FeaturedCampaign() {
  const campaign = {
    id: "featured1",
    title: "Help Rebuild Green Valley Community Center",
    description:
      "After the recent natural disaster, the Green Valley Community Center needs our support to rebuild and continue serving as a vital hub for local residents, providing essential services and a gathering place for all.",
    targetAmount: 100000,
    collectedAmount: 65000,
    daysLeft: 15,
    backers: 328,
    imageUrl: "/placeholder.svg?height=400&width=800",
  }

  const progress = calculateProgress(campaign.collectedAmount, campaign.targetAmount)

  return (
    <div className="relative overflow-hidden rounded-2xl shadow-xl bg-white border border-blue-100">
      <div className="absolute top-4 left-4 z-10 bg-blue-600 text-white px-4 py-1 rounded-full font-semibold text-sm flex items-center">
        <i className="ph ph-star-fill mr-1"></i>
        Featured Campaign
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="relative h-64 lg:h-auto">
          <img
            src={campaign.imageUrl || "/placeholder.svg"}
            alt={campaign.title}
            className="object-cover brightness-90 w-full h-full"
          />
        </div>

        <div className="p-8">
          <h2 className="text-2xl font-bold text-blue-800 mb-4">{campaign.title}</h2>
          <p className="text-gray-600 mb-6">{campaign.description}</p>

          <div className="mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="font-semibold text-gray-700">Raised: {formatCurrency(campaign.collectedAmount)}</span>
              <span className="font-semibold text-gray-700">Goal: {formatCurrency(campaign.targetAmount)}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>{progress}% Complete</span>
              <span>{campaign.daysLeft} days left</span>
            </div>
          </div>

          <div className="flex items-center justify-between mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-700">{campaign.backers}</div>
              <div className="text-sm text-gray-500">Backers</div>
            </div>
            <div className="h-12 border-r border-gray-200"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-700">{campaign.daysLeft}</div>
              <div className="text-sm text-gray-500">Days Left</div>
            </div>
            <div className="h-12 border-r border-gray-200"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-700">
                ${Math.round(campaign.collectedAmount / 1000)}K
              </div>
              <div className="text-sm text-gray-500">Raised</div>
            </div>
          </div>

          <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center">
            <i className="ph ph-heart-straight text-xl mr-2"></i>
            Support This Campaign
          </button>
        </div>
      </div>
    </div>
  )
}
