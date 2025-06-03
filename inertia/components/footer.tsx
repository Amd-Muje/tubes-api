// import React from 'react'

export default function Footer() {
  return (
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
            <div className="flex rounded-lg bg-white">
              <input
                type="email"
                placeholder="Your email"
                className="px-4 py-2  focus:outline-none text-black w-full"
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
  )
}
