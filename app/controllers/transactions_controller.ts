import type { HttpContext } from '@adonisjs/core/http'
import Transaction from '#models/transaction'
import Donation from '#models/donation'

export default class TransactionsController {
  // Get All Transactions
  public async index({ response, auth }: HttpContext) {
    try {
      const user = auth.user
      const query = Transaction.query().preload('donation', (query) =>
        query.preload('user').preload('campaign', (campaignquery) => campaignquery.preload('user'))
      )
      if (!user) {
        return response.status(404).json({ message: 'User not found' })
      }
      // user tampilkan semua riwayat transaksinya
      if (user?.role !== 'admin') {
        query.whereHas('donation', (donationQuery) => {
          donationQuery.where('user_id', user.id)
        })
      }
      const transactions = await query
      return response.json({
        transactions: transactions.map((transaction) => ({
          id: transaction.id,
          paymentMethod: transaction.paymentMethod,
          status: transaction.status,
          createdAt: transaction.createdAt,
          amount: transaction.donation.amount,
          donatur: transaction.donation?.user
            ? {
                id: transaction.donation.user.id,
                name: transaction.donation.user.name,
                email: transaction.donation.user.email,
              }
            : null,
          campaign: transaction.donation?.campaign
            ? {
                id: transaction.donation.campaign.id,
                title: transaction.donation.campaign.title,
                owner: transaction.donation.campaign.user
                  ? {
                      id: transaction.donation.campaign.user.id,
                      name: transaction.donation.campaign.user.name,
                      email: transaction.donation.campaign.user.email,
                    }
                  : null,
              }
            : null,
        })),
      })
    } catch (error) {
      return response.status(500).json({ message: 'Internal server error' })
    }
  }

  // Get Transaction By Id
  public async show({ params, auth, response }: HttpContext) {
    try {
      const user = auth.user
      const transaction = await Transaction.query()
        .where('id', params.id)
        .preload('donation', (query) =>
          query
            .preload('user')
            .preload('campaign', (campaignquery) => campaignquery.preload('user'))
        )
        .first()
      if (!transaction) {
        return response.status(404).json({ message: 'Transaction not found' })
      }
      if (user?.role !== 'admin' && user?.id !== transaction.donation.userId) {
        return response.status(403).json({ message: 'You not allowed to access this transaction' })
      }
      return response.json({
        transaction: {
          id: transaction.id,
          paymentMethod: transaction.paymentMethod,
          status: transaction.status,
          createdAt: transaction.createdAt,
          amount: transaction.donation.amount,
          donatur: transaction.donation?.user
            ? {
                id: transaction.donation.user.id,
                name: transaction.donation.user.name,
                email: transaction.donation.user.email,
              }
            : null,
          campaign: transaction.donation?.campaign
            ? {
                id: transaction.donation.campaign.id,
                title: transaction.donation.campaign.title,
                owner: transaction.donation.campaign.user
                  ? {
                      id: transaction.donation.campaign.user.id,
                      name: transaction.donation.campaign.user.name,
                      email: transaction.donation.campaign.user.email,
                    }
                  : null,
              }
            : null,
        },
      })
    } catch (error) {
      return response.status(500).json({ message: 'Internal server error' })
    }
  }

  // Create TransaKction
  public async store({ request, response }: HttpContext) {
    try {
      const { donationId, paymentMethod } = request.only(['donationId', 'paymentMethod'])
      const donation = await Donation.find(donationId)
      if (!donation) {
        return response.status(404).json({ message: 'Donation not found' })
      }

      const existingPending = await Transaction.query()
        .where('donationId', donationId)
        .where('status', 'pending')
        .first()

      if (existingPending) {
        return response.status(400).json({ message: 'There is already a pending transaction for this donation' })
      }

      const transaction = await Transaction.create({
        donationId,
        paymentMethod,
        order_id: `TRX-${Date.now()}`,
        status: 'pending',
      })
      return response.status(201).json({ message: 'Transaction created succesfully', transaction })
    } catch (error) {
      return response.status(500).json({ message: 'Internal server error' })
    }
  }

  // Update Transaction
  public async update({ auth, request, response }: HttpContext) {
    try {
      const { order_id, status } = request.only(['order_id', 'status'])
      const transaction = await Transaction.query()
        .where('order_id', order_id)
        .preload('donation')
        .first()
      const user = auth.user
      if (user && user.role !== 'admin') {
        return response
          .status(403)
          .json({ message: 'Forbidden: You are not allowed to update transactions' })
      }
      if (!transaction) {
        return response.status(404).json({ message: 'Transaction not found' })
      }

      if (!['pending', 'success', 'failed'].includes(status)) {
        return response.status(400).json({ message: 'Invalid status value' })
      }
      transaction.status = status
      await transaction.save()

      if (transaction.donation) {
        transaction.donation.paymentStatus = status
        await transaction.donation.save()
      }

      return response.json({ message: 'Transaction updated', transaction })
    } catch (error) {
      return response.status(500).json({ message: 'Internal server error' })
    }
  }

  // Delete Transaction
  public async destroy({ params, response, auth }: HttpContext) {
    try {
      const user = auth.user
      const transaction = await Transaction.query()
        .where('id', params.id)
        .preload('donation')
        .first()
      if (!transaction) {
        return response.status(404).json({ message: 'Transaction not found' })
      }

      if (user?.role === 'admin') {
        await transaction.delete()
        return response.status(200).json({ message: 'Transaction deleted successfully' })
      }

      if (transaction.donation.userId === user?.id) {
        if (transaction.status !== 'pending') {
          return response.status(403).json({ message: 'You can only cancel pending transaction' })
        }
        transaction.status = 'canceled'
        await transaction.save()
        return response.status(200).json({ message: 'Transaction canceled successfully' })
      }

      return response
        .status(403)
        .json({ message: 'You are not allowed to delete this transaction' })
    } catch (error) {
      return response.status(500).json({ message: 'Internal server error' })
    }
  }
}