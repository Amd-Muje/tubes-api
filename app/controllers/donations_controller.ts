import type { HttpContext } from '@adonisjs/core/http'
import Donation from '#models/donation'

export default class DonationsController {
    // Get All Donations
    public async index({ response }: HttpContext) {
        const donations = await Donation.all()
        return response.json(donations)
    }

    // Get Donation By Id
    public async show({ params, response }: HttpContext) {
        const donation = await Donation.find(params.id)
        if(!donation) {
            return response.status(404).json({ message: 'Donation not found' })
        }
        return response.json(donation)
    }

    // Create Donation
    public async store({ request, response }: HttpContext) {
        const data = request.only(['userId', 'campaignId', 'amount', 'paymentMethod'])
        const donation = await Donation.create({
            ...data,
            paymentStatus: 'pending',
            transactionId: null,
        })

        return response.status(201).json({message : "Donation Created Succesfully", donation})
    }

    // Update Donation
    public async update({ params, request, response }: HttpContext) {     
        const donation = await Donation.find(params.id)
        if(!donation) {
            return response.status(404).json({ message: 'Donation not found' })
        }

        const data = request.only(['amount', 'paymentStatus', 'paymentMethod', 'transactionId'])
        donation.merge(data)
        await donation.save()

        return response.json({message : "Donation Updated",donation})
    }

    // Delete Donation
    public async destroy({ params, response }: HttpContext) {
        const donation = await Donation.find(params.id)
        if(!donation) {
            return response.status(404).json({ message: 'Donation not found' })
        }
        await donation.delete()

        return response.status(204).json({message : "Donation Deleted"})
    }
}