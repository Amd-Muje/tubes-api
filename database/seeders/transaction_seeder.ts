// database/seeders/transaction_seeder.ts
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Transaction from '#models/transaction'
import Donation from '#models/donation'
import { cuid } from '@adonisjs/core/helpers'

export default class TransactionSeeder extends BaseSeeder {
  public async run() {
    const donations = await Donation.query().where('paymentStatus', 'success')

    if (donations.length === 0) {
      console.log('No successful donations found to create transactions. Run DonationSeeder first.')
      return
    }

    const transactionsData = donations.map(donation => ({
      donationId: donation.id,
      order_id: `TRX-${cuid()}`, // Contoh order_id unik
      paymentMethod: donation.paymentMethod,
      status: 'success' as 'pending' | 'success' | 'failed' | 'canceled', // Pastikan tipe sesuai
    }))

    if (transactionsData.length > 0) {
      await Transaction.createMany(transactionsData)
    }

    // Contoh transaksi pending
    const pendingDonation = await Donation.query().where('paymentStatus', 'pending').first()
    if (pendingDonation) {
      await Transaction.create({
        donationId: pendingDonation.id,
        order_id: `TRX-${cuid()}`,
        paymentMethod: pendingDonation.paymentMethod,
        status: 'pending',
      })
    }
  }
}