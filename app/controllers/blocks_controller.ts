import Block from '#models/block'
import type { HttpContext } from '@adonisjs/core/http'
import Transaction from '#models/transaction'
import crypto from 'crypto'

function canonicalJSONStringify(obj: Record<string, any>): string {
  const sorted = Object.keys(obj)
    .sort()
    .reduce((acc: Record<string, any>, key) => {
      acc[key] = obj[key]
      return acc
    }, {})
  return JSON.stringify(sorted)
}

export default class BlocksController {
  public async createBlockForTransaction(transaction: Transaction) {
    const lastBlock = await Block.query().orderBy('index', 'desc').first()
    const index = lastBlock ? lastBlock.index + 1 : 1
    const previousHash = lastBlock ? lastBlock.hash : '0'
  
    const data = {
      transaction_id: transaction.id,
      amount: transaction.donation.amount,
      status: transaction.status,
      created_at: transaction.createdAt,
    }

    const blockCreatedAt = transaction.createdAt

    const dataJSON = canonicalJSONStringify(data)
  
    const stringToHash = `${index}${dataJSON}${previousHash}${blockCreatedAt}`
    const hash = crypto.createHash('sha256').update(stringToHash).digest('hex')
  
    await Block.create({
      index,
      transactionId: transaction.id,
      data,
      previousHash,
      hash,
      createdAt: blockCreatedAt,
    })
  }
  public async validateBlockchain() {
    const blocks = await Block.query().orderBy('index', 'asc')

    const validBlocks = []
    const invalidBlocks = []

    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i]

      const stringToHash = `${block.index}${canonicalJSONStringify(block.data)}${block.previousHash}${block.createdAt}`
      const recalculatedHash = crypto.createHash('sha256').update(stringToHash).digest('hex')

      const blockInfo = {
        index: block.index,
        transactionId: block.transactionId,
        data: block.data,
        previousHash: block.previousHash,
        hash: block.hash,
        createdAt: block.createdAt,
      }

      // Cek hash
      if (block.hash !== recalculatedHash) {
        invalidBlocks.push({
          ...blockInfo,
          reason: 'Invalid hash',
          recalculatedHash,
          storedHash: block.hash,
        })
        continue
      }

      // Cek previous hash
      if (i > 0 && block.previousHash !== blocks[i - 1].hash) {
        invalidBlocks.push({
          ...blockInfo,
          reason: 'Previous hash mismatch',
          recalculatedHash,
          storedHash: block.hash,
        })
        continue
      }

      validBlocks.push(blockInfo)
    }

    const isValid = invalidBlocks.length === 0

    return {
      valid: isValid,
      message: isValid ? 'Blockchain is valid' : 'Blockchain contains invalid blocks',
      valid_blocks: validBlocks,
      invalid_blocks: invalidBlocks,
    }
  }

  public async validate({response}: HttpContext){
    const result = await this.validateBlockchain()
    return response.status(200).json(result)
  }
}
