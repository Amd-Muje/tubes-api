import type { HttpContext } from '@adonisjs/core/http'
import { Midtrans } from 'midtrans-client-typescript'

export default class PaymentController {
  public async createSnapToken({ request, response }: HttpContext) {
    const { order_id, gross_amount, customer_details } = request.body()

    // Initialize Snap client
    const snap = new Midtrans.Snap({
      isProduction: false, // Ganti ke true untuk production
      serverKey: process.env.MIDTRANS_SERVER_KEY || 'null',
      clientKey: process.env.MIDTRANS_CLIENT_KEY || 'null',
    })

    // Parameter transaksi
    const parameters = {
      transaction_details: {
        order_id: order_id || 'order-id-' + new Date().getTime(),
        gross_amount: 100000000,
      },
      credit_card: {
        secure: true,
      },
      customer_details: customer_details || {
        first_name: 'Customer',
        last_name: 'Name',
        email: 'b3A9o@example.com',
        phone: '08123456789',
      },
    }

    try {
      // Generate Snap token
      const transaction = await snap.createTransaction(parameters)

      return response.json({
        snap_token: transaction.token,
        redirect_url: transaction.redirect_url,
        order_id: order_id,
        gross_amount: gross_amount,
      })
    } catch (error) {
      console.error('Midtrans Error:', error)
      return response.status(500).json({
        error: 'PAYMENT_GATEWAY_ERROR',
        message: error?.message || 'Failed to process payment',
      })
    }
  }
}
