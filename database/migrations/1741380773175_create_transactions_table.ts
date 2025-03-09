import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'transactions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('donation_id').unsigned().references('id').inTable('donations').onDelete('CASCADE')
      table.string('payment_method').notNullable()
      table.string('transaction_id').nullable().unique()
      table.enum('status', ['pending', 'success', 'failed']).defaultTo('pending')
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}