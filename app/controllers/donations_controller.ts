import type { HttpContext } from '@adonisjs/core/http'
import Donation from '#models/donation'
import User from '#models/user'
import Campaign from '#models/campaign'
import Transaction from '#models/transaction'
import db from '@adonisjs/lucid/services/db'
import { Midtrans } from 'midtrans-client-typescript'

export default class DonationsController {
  // Get All Donations
  public async index({ response, auth }: HttpContext) {
    try {
      const user = auth.user
      const donations = await Donation.query().preload('user').preload('campaign')
      // Jika user yang get all
      if (user?.role !== 'admin') {
        return response.json({
          donations: donations.map((donation) => ({
            OwnerCampaign: donation.user.name,
            campaign: donation.campaign.title,
            amount: donation.amount,
            paymentStatus: donation.paymentStatus,
            paymentMethod: donation.paymentMethod,
          })),
        })
      }
      // Admin get All
      return response.json({
        donations: donations.map((donation) => ({
          id: donation.id,
          OwnerCampaign: donation.user?.name,
          userId: donation.userId,
          campaign: donation.campaign.title,
          amount: donation.amount,
          paymentStatus: donation.paymentStatus,
          paymentMethod: donation.paymentMethod,
          createdAt: donation.createdAt,
          updateAt: donation.updatedAt,
        })),
      })
    } catch (error) {
      console.log(error)
      return response.status(500).json({ message: 'Internal server error' })
    }
  }

  // Get Donation By Id
  public async show({ params, auth, response }: HttpContext) {
    try {
      const user = auth.user
      const donation = await Donation.query()
        .where('id', params.id)
        .preload('user')
        .preload('campaign')
        .first()
      if (!donation) {
        return response.status(404).json({ message: 'Donation not found' })
      }
      if (user?.role !== 'admin') {
        return response.json({
          donation: {
            OwnerCampaign: donation.user.name,
            campaign: donation.campaign.title,
            amount: donation.amount,
            paymentStatus: donation.paymentStatus,
            paymentMethod: donation.paymentMethod,
          },
        })
      }
      return response.json({
        donation: {
          id: donation.id,
          ownerCampaign: donation.user?.name,
          userId: donation.userId,
          campaign: donation.campaign.title,
          amount: donation.amount,
          paymentStatus: donation.paymentStatus,
          paymentMethod: donation.paymentMethod,
          createdAt: donation.createdAt,
          updateAt: donation.updatedAt,
        },
      })
    } catch (error) {
      console.log(error)
      return response.status(500).json({ message: 'Internal server error' })
    }
  }

  // Create Donation
  public async store({ request, response }: HttpContext) {
    const trx = await db.transaction()
    try {
      const data = request.only(['userId', 'campaignId', 'amount', 'paymentMethod'])

      const user = await User.find(data.userId)
      if (!user) {
        await trx.rollback()
        return response.status(404).json({ message: 'User not found' })
      }

      const campaign = await Campaign.find(data.campaignId)
      if (!campaign) {
        await trx.rollback()
        return response.status(404).json({ message: 'Campaign not found' })
      }

      const order_id = `TRX-${Date.now()}`

      const donation = await Donation.create({
        ...data,
        paymentStatus: 'pending',
      }, { client: trx })

      // campaign.collectedAmount = (campaign.collectedAmount ?? 0) + Number(data.amount)
      // await campaign.useTransaction(trx).save()

      const transaction = await Transaction.create({
        donationId: donation.id,
        paymentMethod: data.paymentMethod,
        order_id,
        status: 'pending',
      }, { client: trx })

      // Buat transaksi Midtrans setelah simpan semua data di DB, tapi sebelum commit
      const snap = new Midtrans.Snap({
        isProduction: false,
        serverKey: process.env.MIDTRANS_SERVER_KEY || '',
        clientKey: process.env.MIDTRANS_CLIENT_KEY || '',
      })

      const midtransParams = {
        transaction_details: {
          order_id,
          gross_amount: data.amount,
        },
        credit_card: {
          secure: true,
        },
        customer_details: {
          first_name: user.name,
          email: user.email,
          phone: '08123456789',
        },
      }

      const midtransResponse = await snap.createTransaction(midtransParams)

      // Commit transaksi DB setelah berhasil panggil Midtrans
      await trx.commit()

      return response.status(201).json({
        message: 'Donation Created Successfully',
        donation,
        transaction,
        snap_token: midtransResponse.token,
        redirect_url: midtransResponse.redirect_url,
      })
    } catch (error) {
      await trx.rollback()
      console.error(error)
      return response.status(500).json({ message: 'Internal server error' })
    }
  }

  // Update Donation
  public async update({ params, auth, request, response }: HttpContext) {
    try {
      const user = auth.user
      const donation = await Donation.find(params.id)
      if (!donation) {
        return response.status(404).json({ message: 'Donation not found' })
      }
      if (user?.role !== 'admin') {
        return response.status(400).json({ message: 'You not allowed to update donations' })
      }

      const { paymentStatus } = request.only(['paymentStatus'])
      if (!['pending', 'success', 'failed'].includes(paymentStatus)) {
        return response.status(400).json({ message: 'Invalid payment status' })
      }

      if (donation.paymentStatus === 'success' || donation.paymentStatus === 'failed') {
        return response.status(400).json({ message: 'Cannot update completed donations' })
      }

      donation.paymentStatus = paymentStatus
      await donation.save()

      return response.json({ message: 'Donation Updated', donation })
    } catch (error) {
      console.log(error)
      return response.status(500).json({ message: 'Internal server error' })
    }
  }

  // Delete Donation
  public async destroy({ params, auth, response }: HttpContext) {
    try {
      const user = auth.user
      const donation = await Donation.find(params.id)
      if (!donation) {
        return response.status(404).json({ message: 'Donation not found' })
      }
      if (user?.role !== 'admin') {
        return response
          .status(403)
          .json({ message: 'You are not authorized to delete this donation' })
      }
      await donation.delete()

      return response.status(202).json({ message: 'Donation Deleted' })
    } catch (error) {
      console.log(error)
      return response.status(500).json({ message: 'Internal server error' })
    }
  }

  public async donate({ request, response, auth, inertia }: HttpContext) {
    // Cek autentikasi user
    const user = auth.user
    if (!user) {
      return response.unauthorized({ message: 'Unauthorized' })
    }

    // Ambil data dari request
    const { campaignId, amount, paymentMethod } = request.only(['campaignId', 'amount', 'paymentMethod'])

    // Validasi campaign
    const campaign = await Campaign.find(campaignId)
    if (!campaign) {
      return inertia.render('errors/not_found', {
        message: 'Campaign not found'
      })
    }

    // Render halaman donasi dengan inertia
    return inertia.render('Donation/donation-form', {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      campaign: {
        id: campaign.id,
        title: campaign.title,
        description: campaign.description,
        collected_amount: campaign.collectedAmount,
        target_amount: campaign.targetAmount,
      },
      amount,
      paymentMethod,
    })
  }
  
}