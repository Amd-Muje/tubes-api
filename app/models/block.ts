import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Block extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare index: number

  @column()
  declare transactionId: number

  @column()
  declare data: any

  @column()
  declare previousHash: string

  @column()
  declare hash: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}