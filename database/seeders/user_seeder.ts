// database/seeders/user_seeder.ts
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'

export default class UserSeeder extends BaseSeeder {
  public async run() {
    await User.createMany([
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: await hash.make('password'),
        role: 'admin',
        img_url: 'https://via.placeholder.com/150x150.png?text=Admin' // Tambahkan img_url untuk Admin
      },
      {
        name: 'Regular User',
        email: 'user@example.com',
        password: await hash.make('password'),
        role: 'user',
        img_url: 'https://via.placeholder.com/150x150.png?text=User1' // Tambahkan img_url untuk User
      },
      {
        name: 'Another User',
        email: 'anotheruser@example.com',
        password: await hash.make('password'),
        role: 'user',
        img_url: 'https://via.placeholder.com/150x150.png?text=User2' // Tambahkan img_url untuk User lainnya
      },
    ])
  }
}