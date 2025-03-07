import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'donations'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.integer('campaign_id').unsigned().references('id').inTable('campaigns').onDelete('CASCADE')
      table.decimal('amount', 15, 2).notNullable()
      table.enum('payment_status', ['pending', 'success', 'failed']).defaultTo('pending')
      table.string('payment_method').notNullable()
      table.string('transaction_id').notNullable().unique()
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}