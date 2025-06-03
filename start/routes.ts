import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
import UsersController from '#controllers/users_controller'
import CampaignsController from '#controllers/campaigns_controller'
import DonationsController from '#controllers/donations_controller'
import TransactionsController from '#controllers/transactions_controller'
import User from '#models/user'
import PaymentController from '#controllers/payment-controller'
import BlocksController from '#controllers/blocks_controller'

router.on('/').renderInertia('home')

router.get('/google/redirect', ({ ally }) => {
  return ally.use('google').redirect()
})

router.get('/google/callback', async ({ ally, auth, inertia }) => {
  const google = ally.use('google')

  if (google.accessDenied()) {
    return 'Access was denied'
  }

  if (google.stateMisMatch()) {
    return 'Request expired. Retry again'
  }

  if (google.hasError()) {
    return google.getError()
  }

  const googleUser = await google.user()

  const user = await User.firstOrCreate(
    { email: googleUser.email },
    {
      email: googleUser.email,
      name: googleUser.name,
      avatarurl: googleUser.avatarUrl,
    }
  )
  
  const token = await auth.use('api').authenticateAsClient(user, ['*'])

  // Share auth data dengan inertia
  inertia.share({
    auth: {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        token: token
      }
    }
  })

  // Redirect ke halaman perantara
  return inertia.render('Auth/authcallback', {
    token: token.headers!.authorization
  })
})


router.get('/detail/:id', [CampaignsController, 'detail'])
router.on('/login').renderInertia('Auth/login').middleware(middleware.iner())
router.on('/register').renderInertia('Auth/register')
router.post('/users', [UsersController, 'store']).middleware(middleware.iner())
router.post('/users/login', [UsersController, 'login']).middleware(middleware.iner())
router.get('/campaigns', [CampaignsController, 'index'])
router.get('/campaign/:id', [CampaignsController, 'show'])
router.post('/api/payment/callback' , [PaymentController, 'callback'])
router.get('/campaign', [CampaignsController, 'create'])

router.group(() => {
  router.get('/donation', [DonationsController, 'donate'])
  
  
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

  router.get('/blocks/validate', [BlocksController, 'validate'])

})
.use([
    middleware.iner(),
    middleware.auth()
  ])
  .prefix('/api/')
  

