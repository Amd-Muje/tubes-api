'use client'

import CampaignList from '../components/campaign-list'
import { Head } from '@inertiajs/react'
import Hero from '~/components/hero'
import DefaultLayout from '~/layout/default-layout'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white font-[Poppins]">
      <Head>
        <title>FundTogether | Crowdfunding Platform</title>
        <meta
          name="description"
          content="A platform for creating and supporting crowdfunding campaigns"
        />
      </Head>

      <DefaultLayout>
        <Hero />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-blue-800 relative">
              <span className="relative z-10">Discover Campaigns</span>
              <span className="absolute bottom-0 left-0 w-full h-3 bg-blue-200 opacity-40 rounded-lg z-0"></span>
            </h2>
            <div className="flex space-x-2">
              <button className="px-4 py-2 bg-white text-blue-600 border border-blue-200 rounded-full shadow-sm hover:shadow-md transition-all flex items-center">
                <i className="ph ph-funnel text-lg mr-1"></i>
                Filter
              </button>
              <button className="px-4 py-2 bg-white text-blue-600 border border-blue-200 rounded-full shadow-sm hover:shadow-md transition-all flex items-center">
                <i className="ph ph-sort-ascending text-lg mr-1"></i>
                Sort
              </button>
            </div>
          </div>

          <CampaignList />
        </div>
      </DefaultLayout>
    </main>
  )
}
