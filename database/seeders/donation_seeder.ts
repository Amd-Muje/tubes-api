// database/seeders/donation_seeder.ts
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Donation from '#models/donation'
import User from '#models/user'
import Campaign from '#models/campaign'

export default class DonationSeeder extends BaseSeeder {
  public async run() {
    const users = await User.all()
    const campaigns = await Campaign.all()

    if (users.length < 2 || campaigns.length < 2) {
      console.log('Not enough users or campaigns found. Run UserSeeder and CampaignSeeder first.')
      return
    }

    const donatur1 = users.find(user => user.email === 'user@example.com')
    const donatur2 = users.find(user => user.email === 'anotheruser@example.com')
    const campaign1 = campaigns[0]
    const campaign2 = campaigns[1]

    if (!donatur1 || !donatur2 || !campaign1 || !campaign2) {
      console.log('Required users or campaigns not found for donation seeding.')
      return
    }

    await Donation.createMany([
      {
        userId: donatur1.id,
        campaignId: campaign1.id,
        amount: 50000,
        paymentStatus: 'success',
        paymentMethod: 'gopay',
      },
      {
        userId: donatur2.id,
        campaignId: campaign1.id,
        amount: 100000,
        paymentStatus: 'success',
        paymentMethod: 'bank_transfer',
      },
      {
        userId: donatur1.id,
        campaignId: campaign2.id,
        amount: 75000,
        paymentStatus: 'pending',
        paymentMethod: 'dana',
      },
    ])
  }
}