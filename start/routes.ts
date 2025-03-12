import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
import UsersController from '#controllers/users_controller'
import CampaignsController from '#controllers/campaigns_controller'
import DonationsController from '#controllers/donations_controller'
import TransactionsController from '#controllers/transactions_controller'

// router.on('/').render('pages/home')

router
  .group(() => {
    router.get('/campaigns', [CampaignsController, 'index']).middleware(middleware.auth())
    router.get('/campaigns/:id', [CampaignsController, 'show']).middleware(middleware.auth())
    router.post('/campaigns', [CampaignsController, 'store']).middleware(middleware.auth())
    router
      .put('/campaigns/:id', [CampaignsController, 'updateStatus'])
      .middleware(middleware.auth())
    router.delete('/campaigns/:id', [CampaignsController, 'destroy']).middleware(middleware.auth())

    router.get('/users', [UsersController, 'index']).middleware(middleware.auth())
    router.get('/users/:id', [UsersController, 'show']).middleware(middleware.auth())
    router.post('/users', [UsersController, 'store'])
    router.post('/users/login', [UsersController, 'login'])
    router.put('/users/:id', [UsersController, 'update']).middleware(middleware.auth())
    router.delete('/users/:id', [UsersController, 'destroy']).middleware(middleware.auth())

    router.get('/donations', [DonationsController, 'index']).middleware(middleware.auth())
    router.get('/donations/:id', [DonationsController, 'show']).middleware(middleware.auth())
    router.post('/donations', [DonationsController, 'store']).middleware(middleware.auth())
    router.put('/donations/:id', [DonationsController, 'update']).middleware(middleware.auth())
    router.delete('/donations/:id', [DonationsController, 'destroy']).middleware(middleware.auth())

    router.get('/transactions', [TransactionsController, 'index']).middleware(middleware.auth())
    router.get('/transactions/:id', [TransactionsController, 'show']).middleware(middleware.auth())
    router.post('/transactions', [TransactionsController, 'store']).middleware(middleware.auth())
    router
      .put('/transactions/:id', [TransactionsController, 'update'])
      .middleware(middleware.auth())
    router
      .delete('/transactions/:id', [TransactionsController, 'destroy'])
      .middleware(middleware.auth())
  })
  .prefix('/api/')
router.on('/').renderInertia('home')
