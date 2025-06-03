import type { HttpContext } from '@adonisjs/core/http'
import crypto from 'crypto'
import Block from '#models/block'

export default class BlocksController {
  public async create({ request, response }: HttpContext) {
    try {
      const transaction = request.input('transaction')

      // Ambil block terakhir
      const lastBlock = await Block.query().orderBy('index', 'desc').first()

      const index = lastBlock ? lastBlock.index + 1 : 1
      const previousHash = lastBlock ? lastBlock.hash : '0'

      // Data yang mau disimpan di block
      const data = {
        transaction_id: transaction.id,
        amount: transaction.donation?.amount ?? null,
        status: transaction.status,
        created_at: transaction.createdAt,
      }

      // Buat string untuk hashing
      const stringToHash = `${index}${JSON.stringify(data)}${previousHash}${new Date().toISOString()}`
      const hash = crypto.createHash('sha256').update(stringToHash).digest('hex')

      // Simpan block ke database
      const block = await Block.create({
        index,
        transactionId: transaction.id,
        data,
        previousHash,
        hash,
      })

      return response.created({ message: 'Block created', block })
    } catch (error) {
      return response.status(500).send({ error: error.message })
    }
  }
}
