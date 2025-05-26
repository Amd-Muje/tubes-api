'use client'

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-r from-blue-800 to-blue-900 text-white overflow-hidden">
      {/* Background image with overlay */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center opacity-20"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=1740&auto=format&fit=crop')",
        }}
      ></div>

      {/* Hero content */}
      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white">
            EMPOWER DREAMS.
            <br />
            FUND TOGETHER.
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-200">
            FundTogether opens the door to community-powered funding - simple, transparent, and
            accessible to everyone.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="/start-campaign"
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-full font-medium flex items-center transition-all shadow-lg hover:shadow-xl"
            >
              Start a Campaign <i className="ph ph-arrow-right ml-2"></i>
            </a>
            <a
              href="/explore"
              className="px-6 py-3 bg-transparent border-2 border-blue-300 hover:bg-blue-800 rounded-full font-medium transition-all"
            >
              Explore Projects
            </a>
          </div>
        </div>
      </div>

      {/* Stats section */}
      <div className="bg-white/10 backdrop-blur-sm py-8 relative z-10">
        <div className="mx-auto px-44">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center justify-center md:justify-start">
              <div className="bg-blue-700/50 p-3 rounded-lg mr-4">
                <i className="ph ph-chart-line-up text-3xl text-blue-200"></i>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold">250+</div>
                <div className="text-blue-200 text-sm">Successful Campaigns</div>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <div className="bg-blue-700/50 p-3 rounded-lg mr-4">
                <i className="ph ph-wallet text-3xl text-blue-200"></i>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold">$2.5M</div>
                <div className="text-blue-200 text-sm">Total Funds Raised</div>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-end">
              <div className="bg-blue-700/50 p-3 rounded-lg mr-4">
                <i className="ph ph-users text-3xl text-blue-200"></i>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold">10K+</div>
                <div className="text-blue-200 text-sm">Community Members</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
