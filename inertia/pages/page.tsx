'use client'

import { useEffect } from 'react'
import CampaignList from '../components/campaign-list'
import Header from '../components/header'
import FeaturedCampaign from '../components/featured-campaign'
import { Head } from '@inertiajs/react'

export default function Home() {
  // Add Phosphor Icons and Google Fonts dynamically
  useEffect(() => {
    // Add Phosphor Icons
    const phosphorLink = document.createElement('link')
    phosphorLink.rel = 'stylesheet'
    phosphorLink.href = 'https://unpkg.com/@phosphor-icons/web@2.0.3/src/regular/style.css'
    document.head.appendChild(phosphorLink)

    // Add Google Fonts
    const fontLink = document.createElement('link')
    fontLink.rel = 'stylesheet'
    fontLink.href =
      'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap'
    document.head.appendChild(fontLink)

    // Clean up
    return () => {
      document.head.removeChild(phosphorLink)
      document.head.removeChild(fontLink)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white font-[Poppins]">
      <Head>
        <title>FundTogether | Crowdfunding Platform</title>
        <meta
          name="description"
          content="A platform for creating and supporting crowdfunding campaigns"
        />
      </Head>

      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-12">
          <FeaturedCampaign />
        </div>
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
      <footer className="bg-blue-900 text-white py-12 mt-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <i className="ph ph-hand-heart text-2xl mr-2"></i>
                FundRaiser
              </h3>
              <p className="text-blue-200 mb-4">
                Empowering communities through collective funding and support.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-white hover:text-blue-200 transition-colors">
                  <i className="ph ph-facebook-logo text-xl"></i>
                </a>
                <a href="#" className="text-white hover:text-blue-200 transition-colors">
                  <i className="ph ph-twitter-logo text-xl"></i>
                </a>
                <a href="#" className="text-white hover:text-blue-200 transition-colors">
                  <i className="ph ph-instagram-logo text-xl"></i>
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-blue-200 hover:text-white transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-blue-200 hover:text-white transition-colors">
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#" className="text-blue-200 hover:text-white transition-colors">
                    Success Stories
                  </a>
                </li>
                <li>
                  <a href="#" className="text-blue-200 hover:text-white transition-colors">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Newsletter</h4>
              <p className="text-blue-200 mb-4">
                Stay updated with our latest campaigns and success stories.
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="px-4 py-2 rounded-l-lg focus:outline-none text-gray-800 w-full"
                />
                <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-r-lg transition-colors">
                  <i className="ph ph-paper-plane-right"></i>
                </button>
              </div>
            </div>
          </div>
          <div className="border-t border-blue-800 mt-8 pt-8 text-center text-blue-300">
            <p>&copy; 2023 FundRaiser. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
