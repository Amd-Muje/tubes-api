import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Donation from './donation.js'

export default class Transaction extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare donationId: number

  @column()
  declare order_id: string

  @column()
  declare paymentMethod: string

  @column()
  declare status: 'pending' | 'success' | 'failed' | 'canceled'

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Donation)
  declare donation: BelongsTo<typeof Donation>
}
