import Donation from '#models/donation'
import Transaction from '#models/transaction'
import type { HttpContext } from '@adonisjs/core/http'

export default class PaymentController {
  public async callback({ request, response }: HttpContext) {
    const data = request.body()
    console.log('✅ Callback hit:', data)
    response.status(200).json({ message: 'Callback received' })
    try{
      const orderId = data.order_id
      const transactionStatus = data.transaction_status
      
      const transaction = await Transaction.findBy('order_id', orderId)
      
      if (!transaction) {
        console.warn('Transaction not found:', orderId)
        console.log('Transaction status:', transactionStatus)
        return response.status(200).json({ message: 'Transaction not found' })
      }
      
      // Update status transaksi dan donasi berdasarkan status dari Midtrans
      if (transactionStatus === 'capture' || transactionStatus === 'settlement') {
        transaction.status = 'success'
        await transaction.save()
        
        const donation = await Donation.find(transaction.donationId)
        if (donation) {
          donation.paymentStatus = 'success'
          await donation.save()
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
    }
    catch(error){
      console.error('allback error:', error)
      return response.status(200).json({ message: 'Callback error handled' }) 
    }
  }
}
