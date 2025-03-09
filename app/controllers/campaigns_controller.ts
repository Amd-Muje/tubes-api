import type { HttpContext } from '@adonisjs/core/http'
import Campaign from '#models/campaign'
import User from '#models/user'

export default class CampaignsController {
    //Get All Campaigns
    public async index({ response }: HttpContext) {
        const campaigns = await Campaign.all()
        return response.json(campaigns)
    }

    // Get Campaign By Id
    public async show({ params, response }: HttpContext) {
        const campaign = await Campaign.find(params.id)
        if(!campaign) {
            return response.status(404).json({ message: 'Campaign not found' })
        }
        return response.json(campaign)
    }

    // Create Campaign
    public async store({ request, response }: HttpContext) {
        const data = request.only(['userId', 'title', 'description', 'targetAmount', 'startDate', 'endDate'])
        const user = await User.find(data.userId)
        if(!user) {
            return response.status(404).json({ message: 'User not found' })
        }

        const activeCampaign = await Campaign.query()
        .where('userId', data.userId)
        .where('status', ['pending', 'active'])
        .first()
        if(activeCampaign) {
            return response.status(400).json({ message: 'You already have an active campaign' })
        }

        const campaign = await Campaign.create({...data, status: 'pending'})
        return response.status(201).json(campaign)
    }

    // Approve or Reject Campaign by Admin
    public async updateStatus({ params, request, response, auth }: HttpContext) {     
        // Verif role admin
        const admin = auth.user
        if(!admin || admin.role !== 'admin') { 
            return response.status(403).json({ message: 'Only admin can approve or reject campaigns' })
        }

        // verif campaign
        const campaign = await Campaign.find(params.id)
        if(!campaign) {
            return response.status(404).json({ message: 'Campaign not found' })
        }

        // Verif status
        const {status} = request.only(['status'])
        if(!['approved', 'rejected'].includes(status)) {
            return response.status(400).json({ message: 'Invalid status' })
        }

        campaign.status = status
        await campaign.save()

        return response.json({messages: `Campaign has been ${status}`})
    }

    // Delete Campaign
    public async destroy({ params, response, auth }: HttpContext) {
        const user = auth.user

        const campaign = await Campaign.find(params.id)
        if(!campaign) {
            return response.status(404).json({ message: 'Campaign not found' })
        }

        if(campaign.userId !== user?.id && user?.role !== 'admin') {
            return response.status(403).json({ message: 'You are not allowed to delete this campaign' })
        }

        await campaign.delete()

        return response.status(204).json({'message': 'Campaign deleted successfully'})
    }
}