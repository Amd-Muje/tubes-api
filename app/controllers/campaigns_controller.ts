import type { HttpContext } from '@adonisjs/core/http'
import Campaign from '#models/campaign'
import User from '#models/user'

export default class CampaignsController {
    //Get All Campaigns
    public async index({ response, auth }: HttpContext) {
        try {
            const user = auth.user
            const campaigns = await Campaign.query().preload('user')
            // Jika user yang get all
            if(user?.role !== 'admin') {
                return response.json({ campaigns: campaigns.map(campaign => ({ title: campaign.title, description: campaign.description, owner: campaign.user.name, target: campaign.targetAmount, due: campaign.endDate })) })
            }
            // Admin get All
            return response.json({campaigns: campaigns.map(campaign => ({
                id: campaign.id,
                owner: campaign.user?.name, 
                ownerId : campaign.userId,
                title: campaign.title,
                description: campaign.description,
                target: campaign.targetAmount,
                collected: campaign.collectedAmount,
                status: campaign.status,
                startDate: campaign.startDate,
                due: campaign.endDate,
                createdAt: campaign.createdAt,
                updateAt : campaign.updatedAt
            }))})
        } catch (error) {
            return response.status(500).json({ message: 'Internal server error' })
        }
    }

    // Get Campaign By Id
    public async show({ params, response, auth }: HttpContext) {
        try {
            const user = auth.user
            const campaign = await Campaign.query().where('id', params.id).preload('user').first()
            if(!campaign) {
                return response.status(404).json({ message: 'Campaign not found' })
            }
            console.log(user?.role)
            if(user?.role !== 'admin') {
                return response.json({ campaign: { title: campaign.title, description: campaign.description, owner: campaign.user.name, target: campaign.targetAmount, due: campaign.endDate } })
            }
            return response.json({campaign: {
                id: campaign.id,
                owner: campaign.user?.name, 
                ownerId : campaign.userId,
                title: campaign.title,
                description: campaign.description,
                target: campaign.targetAmount,
                collected: campaign.collectedAmount,
                status: campaign.status,
                startDate: campaign.startDate,
                due: campaign.endDate,
                createdAt: campaign.createdAt,
                updateAt : campaign.updatedAt
            }})
        } catch (error) {
            return response.status(500).json({ message: 'Internal server error' })
        }
    }

    // Create Campaign
    public async store({ request, response }: HttpContext) {
        try {
            const data = request.only(['userId', 'title', 'description', 'targetAmount', 'startDate', 'endDate'])
            const user = await User.find(data.userId)
            if(!user) {
                return response.status(404).json({ message: 'User not found' })
            }
    
            const activeCampaign = await Campaign.query()
            .where('userId', data.userId)
            .whereIn('status', ['pending', 'approved', 'rejected', 'completed'])
            .first()
            if(activeCampaign) {
                return response.status(400).json({ message: 'You already have an active campaign' })
            }
    
            const campaign = await Campaign.create({...data, status: 'pending'})
            return response.status(201).json(campaign)
        } catch (error) {
            return response.status(500).json({ message: 'Internal server error' })            
        }
    }

    // Approve or Reject Campaign by Admin
    public async updateStatus({ params, request, response, auth }: HttpContext) {     
        try {
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
            if(!['approved', 'rejected', 'completed'].includes(status)) {
                return response.status(400).json({ message: 'Invalid status' })
            }
    
            campaign.status = status
            await campaign.save()
    
            return response.json({messages: `Campaign has been ${status}`})
        } catch (error) {
            return response.status(500).json({ message: 'Internal server error' })
        }
    }

    // Delete Campaign
    public async destroy({ params, response, auth }: HttpContext) {
        try {
            const user = auth.user
    
            const campaign = await Campaign.find(params.id)
            if(!campaign) {
                return response.status(404).json({ message: 'Campaign not found' })
            }
    
            if(campaign.userId !== user?.id && user?.role !== 'admin') {
                return response.status(403).json({ message: 'You are not allowed to delete this campaign' })
            }
    
            await campaign.delete()
    
            return response.status(202).json({message: 'Campaign deleted successfully'})
        } catch (error) {
            return response.status(500).json({ message: 'Internal server error' })
        }
    }
}