import Donation from '#models/donation'
import Transaction from '#models/transaction'
import type { HttpContext } from '@adonisjs/core/http'

export default class PaymentController {
  public async callback({ request, response }: HttpContext) {
    const payload = request.body()
    const orderId = payload.order_id
    const transactionStatus = payload.transaction_status

    const transaction = await Transaction.findBy('order_id', orderId)

    if (!transaction) {
      return response.status(404).json({ message: 'Transaction not found' })
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
}
