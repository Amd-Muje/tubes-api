import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
import UsersController from '#controllers/users_controller'
import CampaignsController from '#controllers/campaigns_controller'
import DonationsController from '#controllers/donations_controller'
import TransactionsController from '#controllers/transactions_controller'
import PaymentController from '#controllers/payment-controller'

router.on('/').renderInertia('home')

router.get('/detail/:id', [CampaignsController, 'detail'])
router.on('/login').renderInertia('Auth/login').middleware(middleware.iner())
router.on('/register').renderInertia('Auth/register')
router.post('/users', [UsersController, 'store']).middleware(middleware.iner())
router.post('/users/login', [UsersController, 'login']).middleware(middleware.iner())
router.get('/campaigns', [CampaignsController, 'index'])
router.get('/campaign/:id', [CampaignsController, 'show'])
router.post('/api/payment/callback' , [PaymentController, 'callback'])

router.group(() => {
  router.get('/donation', [DonationsController, 'donate'])
  router.get('/campaign', [CampaignsController, 'create'])
  
  
  router.post('/campaigns', [CampaignsController, 'store'])
  router.put('/campaigns/:id', [CampaignsController, 'updateStatus'])
  
  router.delete('/campaigns/:id', [CampaignsController, 'destroy'])
  
  router.get('/users', [UsersController, 'index'])
  router.get('/me', [UsersController, 'me'])
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
.use([
    middleware.iner(),
    middleware.auth()
  ])
  .prefix('/api/')
  

