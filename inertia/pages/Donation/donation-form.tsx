'use client'
import type React from 'react'

import { useEffect, useState } from 'react'
import { apiService } from '~/service/utility'


type User = {
  id: number
  nama: string
  emailemail: string
}

type Campaign = {
  id: number
  title: string
  description: string
  collectedAmount: number
  targetAmount: number
}

type Props = {
  user: User
  campaign: Campaign
}

export default function donationForm({user, campaign} : Props) {
  const [amount, setAmount] = useState('')
  const [succes, setIsSuccess] = useState(false)
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)

  const presetAmounts = [25000, 50000, 100000, 250000, 500000, 1000000]

  const handlePresetClick = (value: number) => {
    setAmount(value.toString())
    setSelectedAmount(value)
  }

  const handleCustomAmount = (value: string) => {
    setAmount(value)
    setSelectedAmount(null)
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value)
  }

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const token = localStorage.getItem('access_token')
    if (!token) {
      alert('Kamu harus login terlebih dahulu')
      window.location.href = '/login'
      return
    }

    if (!user?.id || !campaign?.id || !amount) {
      alert('Data tidak lengkap. Pastikan user, campaign, dan jumlah donasi tersedia.')
      return
    }

    try {
      const result = await apiService.createDonation({
        userId: user.id,
        campaignId: campaign.id,
        amount: parseInt(amount),
        paymentMethod: 'midtrans',
      })

      if (result.snap_token) {
        // @ts-ignore
        window.snap.pay(result.snap_token, {
          onSuccess: (result: any) => {
            setIsSuccess(true)
            console.log(result)
            return Response.redirect('/')
          },
          onPending: (result: any) => {
            alert('Waiting for payment...')
            console.log(result)
          },
          onError: (error: any) => {
            alert('Payment failed')
            console.error(error)
          },
          onClose: () => {
            alert('Payment popup closed')
          },
        })
        return Response.redirect('/')
      } else {
        alert('Gagal mendapatkan Snap Token')
      }
    } catch (error) {
      console.error('Error creating donation:', error)
      alert('Terjadi kesalahan heheheh')
    }
  }

  useEffect(()=>{
    if(succes){
      window.location.href = '/'
    }
  },[succes])

  return (
    <div className="h-screen flex items-center p-4 w-screen justify-center overflow-x-hidden">
      <div className="w-1/2 max-w-md bg-white rounded-2xl shadow-lg p-8 border">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-blue-700 mb-2">Support This Project</h1>
          <p className="text-gray-600">Choose your contribution amount</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-2">
          {/* Preset Amounts */}
          <div className="space-y-3 w-full">
            <label className="block text-sm font-medium text-gray-700">Quick Select</label>
            <div className="grid grid-cols-3 gap-3 w-fit">
              {presetAmounts.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => handlePresetClick(preset)}
                  className={`p-3 rounded-lg border-2 text-sm font-medium transition-all w-full${
                    selectedAmount === preset
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  {formatCurrency(preset)}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Amount Input */}
          <div className="space-y-2">
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
              Or enter custom amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg">
                Rp
              </span>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => handleCustomAmount(e.target.value)}
                placeholder="0"
                min="1000"
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-lg text-lg font-medium focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>
            <p className="text-xs text-gray-500">Minimum donation: Rp 1.000</p>
          </div>

          {/* Amount Display */}
          {amount && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Your contribution:</span>
                <span className="text-xl font-bold text-gray-900">
                  {formatCurrency(Number.parseInt(amount) || 0)}
                </span>
              </div>
            </div>
          )}

          {/* Donate Button */}
          <button
            type="submit"
            disabled={!amount || Number.parseInt(amount) < 1000}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-lg transition-colors text-lg"
          >
            {amount && Number.parseInt(amount) >= 1000
              ? `Donate ${formatCurrency(Number.parseInt(amount))}`
              : 'Enter Amount to Continue'}
          </button>

          {/* Security Note */}
          <div className="text-center">
            <p className="text-xs text-gray-500">
              🔒 Your payment is secured with 256-bit SSL encryption
            </p>
          </div>
        </form>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-500">By continuing, you agree to our terms of service</p>
        </div>
      </div>
      <div className='w-1/2 h-full'>
        <img src="/img/payimg.webp" alt="payment" loading='lazy'className='h-full w-full'/>
      </div>
    </div>
  )
}
