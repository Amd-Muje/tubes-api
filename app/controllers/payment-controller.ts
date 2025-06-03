import Campaign from '#models/campaign'
import Donation from '#models/donation'
import Transaction from '#models/transaction'
import type { HttpContext } from '@adonisjs/core/http'
import BlocksController from './blocks_controller.js'

export default class PaymentController {
  public async callback({ request, response }: HttpContext) {
    const data = request.body()
    
    try {
      console.log('try callback hit:', data)
      const orderId = data.order_id
      const transactionStatus = data.transaction_status
      
      const transaction = await Transaction.query()
        .where('order_id', orderId)
        .preload('donation') // Tambahkan preload
        .first()
      if (!transaction) {
        console.warn('Transaction not found:', orderId)
        return response.status(404).json({ message: 'Transaction not found' })
      }
      
      if (transactionStatus === 'capture' || transactionStatus === 'settlement') {
        transaction.status = 'success'
        await transaction.save()

        const blocksController = new BlocksController()
        await blocksController.createBlockForTransaction(transaction)
        
        const donation = await Donation.find(transaction.donationId)
        if (donation) {
          donation.paymentStatus = 'success'
          await donation.save()
          
          const campaign = await Campaign.find(donation.campaignId)
          console.log('campaign data :', campaign)
          if (campaign) {
            const currentAmount = Number(campaign.collected_amount ?? 0)
            const addedAmount = Number(donation.amount ?? 0)
            campaign.collected_amount = currentAmount + addedAmount
            await campaign.save()
          } else {
            console.warn('Campaign not found:', donation.campaignId)
          }
        } else {
          console.warn('Donation not found for transaction:', transaction.donationId)
        }
      } else if (
        transactionStatus === 'cancel' ||
        transactionStatus === 'deny' ||
        transactionStatus === 'expire'
      ) {
        transaction.status = 'failed'
        await transaction.save()

        const donation = await Donation.find(transaction.donationId)
        if (donation) {
          donation.paymentStatus = 'failed'
          await donation.save()
        }
      }

      return response.status(200).json({ message: 'Callback handled' })
    } catch (error) {
      console.error('Callback error:', error)
      return response.status(500).json({ message: 'Callback error handled' })
    }
  }
}
