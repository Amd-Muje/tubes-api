import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').unsigned()
      table.string('name').notNullable()
      table.string('email').notNullable().unique()
      table.string('password').notNullable()
      table.enum('role', ['admin', 'user']).defaultTo('user').notNullable()
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now()).notNullable()
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now()).nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
