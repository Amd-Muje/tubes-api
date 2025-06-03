'use client'

import CampaignList from './Campaigns/campaign-list'
import { Head } from '@inertiajs/react'
import Hero from '~/pages/hero'
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
          <CampaignList />
        </div>
      </DefaultLayout>
    </main>
  )
}
