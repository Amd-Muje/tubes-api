import type { HttpContext } from '@adonisjs/core/http'
import Transaction from '#models/transaction'

export default class TransactionsController {
    // Get All Transactions
    public async index({ response }: HttpContext) {
        const transactions = await Transaction.all()
        return response.json(transactions)
    }

    // Get Transaction By Id
    public async show({ params, response }: HttpContext) {
        const transaction = await Transaction.find(params.id)
        if(!transaction) {
            return response.status(404).json({ message: 'Transaction not found' })
        }
        return response.json(transaction)
    }

    // Create Transaction
    public async store({ request, response }: HttpContext) {
        const data = request.only(['donationId', 'paymentMethod', 'transactionId', 'status'])
        const transaction = await Transaction.create({
            ...data,
        status: 'pending'})

        return response.status(201).json({message: 'Transaction created succesfully', transaction})
    }

    // Update Transaction
    public async update({ params, request, response }: HttpContext) {
        const transaction = await Transaction.find(params.id)
        if(!transaction) {
            return response.status(404).json({ message: 'Transaction not found' })
        }

        const data = request.only(['status'])
        transaction.merge(data)
        await transaction.save()

        return response.json({message: 'Transaction updated', transaction})
    }

    // Delete Transaction
    public async destroy({ params, response }: HttpContext) {
        const transaction = await Transaction.find(params.id)
        if(!transaction) {
            return response.status(404).json({ message: 'Transaction not found' })
        }
        await transaction.delete()

        return response.status(204).json({message: 'Transaction deleted'})
    }
}