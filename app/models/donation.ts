import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import User from './user.js'
import Campaign from './campaign.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Donation extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare campaignId: number

  @column()
  declare amount: number

  @column()
  declare paymentStatus: 'pending' | 'success' | 'failed'

  @column()
  declare paymentMethod: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // Relasi ke User (Donatur)
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  // Relasi ke Campaign
  @belongsTo(() => Campaign)
  declare campaign: BelongsTo<typeof Campaign>
}
