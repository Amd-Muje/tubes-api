// database/seeders/campaign_seeder.ts
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Campaign from '#models/campaign'
import User from '#models/user'
import { DateTime } from 'luxon'

export default class CampaignSeeder extends BaseSeeder {
  public async run() {
    const users = await User.all()
    if (users.length === 0) {
      console.log('No users found. Run UserSeeder first.')
      return
    }

    const adminUser = users.find(user => user.role === 'admin')
    const regularUser = users.find(user => user.email === 'user@example.com')

    if (!adminUser || !regularUser) {
      console.log('Required users not found. Make sure UserSeeder creates admin and user@example.com.')
      return
    }

    await Campaign.createMany([
      {
        userId: adminUser.id,
        title: 'Game Card For Learning',
        img_url: 'https://via.placeholder.com/600x400.png?text=Pendidikan',
        category: 'Pendidikan',
        description: 'Game card untuk membantu anak-anak belajar sambil bermain.',
        targetAmount: 50000000,
        collectedAmount: 15000000,
        status: 'approved',
        startDate: DateTime.now().minus({ days: 10 }),
        endDate: DateTime.now().plus({ days: 20 }),
      },
      {
        userId: regularUser.id,
        title: 'Modal Usaha UMKM Bangkit',
        img_url: 'https://via.placeholder.com/600x400.png?text=UMKM',
        category: 'Ekonomi',
        description: 'Mari bantu UMKM lokal untuk bangkit kembali setelah pandemi dengan memberikan modal usaha.',
        targetAmount: 25000000,
        collectedAmount: 5000000,
        status: 'pending',
        startDate: DateTime.now().minus({ days: 5 }),
        endDate: DateTime.now().plus({ days: 25 }),
      },
      {
        userId: adminUser.id,
        title: 'Moba anak bangsa',
        img_url: 'https://via.placeholder.com/600x400.png?text=Masjid',
        category: 'Infrastruktur',
        description: 'Campaign untuk Menyerukan pembuatan Moba anak bangsa',
        targetAmount: 100000000,
        collectedAmount: 75000000,
        status: 'approved',
        startDate: DateTime.now().minus({ days: 30 }),
        endDate: DateTime.now().plus({ days: 60 }),
      },
    ])
  }
}