import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
import UsersController from '#controllers/users_controller'
import CampaignsController from '#controllers/campaigns_controller'
import DonationsController from '#controllers/donations_controller'
import TransactionsController from '#controllers/transactions_controller'

router.post('/users', [UsersController, 'store'])
router.post('/users/login', [UsersController, 'login'])

router
  .group(() => {


    router.get('/campaigns', [CampaignsController, 'index'])
    router.post('/campaigns', [CampaignsController, 'store'])
    router.get('/campaign/:id', [CampaignsController, 'show'])
    router.put('/campaigns/:id', [CampaignsController, 'updateStatus'])

    router.delete('/campaigns/:id', [CampaignsController, 'destroy'])

    router.get('/users', [UsersController, 'index'])
    router.get('/users/:id', [UsersController, 'show'])
    router.put('/users/:id', [UsersController, 'update'])
    router.delete('/users/:id', [UsersController, 'destroy'])

    router.get('/donations', [DonationsController, 'index'])
    router.get('/donations/:id', [DonationsController, 'show'])
    router.post('/donations', [DonationsController, 'store'])
    router.put('/donations/:id', [DonationsController, 'update'])
    router.delete('/donations/:id', [DonationsController, 'destroy'])

    router.get('/transactions', [TransactionsController, 'index'])
    router.get('/transactions/:id', [TransactionsController, 'show'])
    router.post('/transactions', [TransactionsController, 'store'])
    router.put('/transactions/:id', [TransactionsController, 'update'])

    router.delete('/transactions/:id', [TransactionsController, 'destroy'])
  })
  .middleware(middleware.auth({ guards: ['api'] }))
  .prefix('/api/')

router.on('/').renderInertia('home')
// Tambahkan ini
router.get('/detail/:id', [CampaignsController, 'detail'])

router.on('/login').renderInertia('login')
router.on('/register').renderInertia('register')
