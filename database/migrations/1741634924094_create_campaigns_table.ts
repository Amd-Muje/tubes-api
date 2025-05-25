import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'campaigns'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.string('img_url').notNullable()
      table.string('title').notNullable()
      table.string('category').notNullable()
      table.text('description').notNullable()
      table.decimal('target_amount', 15, 2).notNullable()
      table.decimal('collected_amount', 15, 2).defaultTo(0)
      table.enum('status', ['pending', 'approved', 'rejected', 'completed']).defaultTo('pending')
      table.timestamp('start_date').notNullable().defaultTo(this.now())
      table.timestamp('end_date').notNullable().nullable()
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
