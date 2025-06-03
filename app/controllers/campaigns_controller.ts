import type { HttpContext } from '@adonisjs/core/http'
import Campaign from '#models/campaign'
import User from '#models/user'

export default class CampaignsController {
  public async index({ response, auth }: HttpContext) {
    try {
      const user = auth.user
      const campaigns = await Campaign.query().preload('user')
      // Jika user yang get all
      if (user?.role !== 'admin') {
        return response.json({
          campaigns: campaigns.map((campaign) => ({
            id: campaign.id,
            owner: campaign.user?.name,
            ownerId: campaign.userId,
            title: campaign.title,
            img_url: campaign.img_url,
            category: campaign.category,
            description: campaign.description,
            target: campaign.target_amount,
            collected: campaign.collected_amount,
            status: campaign.status,
            startDate: campaign.startDate,
            due: campaign.endDate,
          })),
        })
      }
      // Admin get All
      return response.json({
        campaigns: campaigns.map((campaign) => ({
          id: campaign.id,
          owner: campaign.user?.name,
          ownerId: campaign.userId,
          title: campaign.title,
          img_url: campaign.img_url,
          category: campaign.category,
          description: campaign.description,
          target: campaign.target_amount,
          collected: campaign.collected_amount,
          status: campaign.status,
          startDate: campaign.startDate,
          due: campaign.endDate,
          createdAt: campaign.createdAt,
          updateAt: campaign.updatedAt,
        })),
      })
    } catch (error) {
      console.log(error)
      return response.status(500).json({ message: 'Internal server error' })
    }
  }

  // Get Campaign By Id
  public async show({ params, response, auth }: HttpContext) {
    try {
      const user = auth.user
      const campaign = await Campaign.query().where('id', params.id).preload('user').first()
      
      if (!campaign) {
        return response.status(404).json({ message: 'Campaign not found' })
      }

      if (user?.role !== 'admin') {
        return response.json({
          campaign: {
            id: campaign.id,
            owner: campaign.user?.name,
            title: campaign.title,
            img_url: campaign.img_url,
            category: campaign.category,
            description: campaign.description,
            target: campaign.target_amount,
            collected: campaign.collected_amount,
            status: campaign.status,
            startDate: campaign.startDate,
            due: campaign.endDate,
          },
        })
      }

      return response.json({
        campaign: {
          id: campaign.id,
          owner: campaign.user?.name,
          ownerId: campaign.userId,
          title: campaign.title,
          img_url: campaign.img_url,
          category: campaign.category,
          description: campaign.description,
          target: campaign.target_amount,
          collected: campaign.collected_amount,
          status: campaign.status,
          startDate: campaign.startDate,
          due: campaign.endDate,
          createdAt: campaign.createdAt,
          updatedAt: campaign.updatedAt,
        },
      })
    } catch (error) {
      console.log(error)
      return response.status(500).json({ message: 'Internal server error' })
    }
  }

  // Create Campaign
  public async store({ request, response }: HttpContext) {
    try {
      const data = request.only([
        'user_id', // Changed from userId
        'title',
        'img_url',
        'category',
        'description',
        'target_amount',
        'startDate',
        'endDate',
      ])

      const user = await User.find(data.user_id)
      if (!user) {
        return response.status(404).json({ message: 'User not found' })
      }

      const activeCampaign = await Campaign.query()
        .where('user_id', data.user_id)
        .whereIn('status', ['pending', 'approved', 'rejected', 'completed'])
        .first()

      if (activeCampaign) {
        return response.status(400).json({ message: 'You already have an active campaign' })
      }

      const campaign = await Campaign.create({
        ...data,
        status: 'pending',
        collectedAmount: 0, // Set default collected amount
      })

      return response.status(201).json(campaign)
    } catch (error) {
      console.log(error)
      return response.status(500).json({ message: 'Internal server error' })
    }
  }

  // Approve or Reject Campaign by Admin
  public async updateStatus({ params, request, response, auth }: HttpContext) {
    try {
      // Verif role admin
      const admin = auth.user
      if (!admin || admin.role !== 'admin') {
        return response.status(403).json({ message: 'Only admin can approve or reject campaigns' })
      }

      // verif campaign
      const campaign = await Campaign.find(params.id)
      if (!campaign) {
        return response.status(404).json({ message: 'Campaign not found' })
      }

      // Verif status
      const { status } = request.only(['status'])
      if (!['approved', 'rejected', 'completed'].includes(status)) {
        return response.status(400).json({ message: 'Invalid status' })
      }

      campaign.status = status
      await campaign.save()

      return response.json({ messages: `Campaign has been ${status}` })
    } catch (error) {
      console.log(error)
      return response.status(500).json({ message: 'Internal server error' })
    }
  }

  // Delete Campaign
  public async destroy({ params, response, auth }: HttpContext) {
    try {
      const user = auth.user

      const campaign = await Campaign.find(params.id)
      if (!campaign) {
        return response.status(404).json({ message: 'Campaign not found' })
      }

      if (campaign.userId !== user?.id && user?.role !== 'admin') {
        return response.status(403).json({ message: 'You are not allowed to delete this campaign' })
      }

      await campaign.delete()

      return response.status(202).json({ message: 'Campaign deleted successfully' })
    } catch (error) {
      console.log(error)
      return response.status(500).json({ message: 'Internal server error' })
    }
  }
  public async detail({ inertia, params }: HttpContext) {
    return inertia.render('Campaigns/detail', { id: params.id })
  }

  public async create({ inertia }: HttpContext) {
    return inertia.render('Campaigns/makecampaign')
  }
}
