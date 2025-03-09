import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
import UsersController from '#controllers/users_controller'
import DonationsController from '#controllers/donations_controller'
import TransactionsController from '#controllers/transactions_controller'

router.on('/').render('pages/home')

router.group(() => {
    router.get('/campaigns', 'CampaignsController.index')
    router.get('/campaigns/:id', 'CampaignsController.show')
    router.post('/campaigns', 'CampaignsController.store')
    router.put('/campaigns/:id', 'CampaignsController.update').middleware(middleware.adminAuth())
    router.delete('/campaigns/:id', 'CampaignsController.destroy').middleware([middleware.auth(), middleware.adminAuth()])

    router.get('/users', [UsersController, 'index'])
    router.get('/users/:id', [UsersController, 'show'])
    router.post('/users', [UsersController ,'store'])
    router.post('/users/login', [UsersController ,'login'])
    router.put('/users/:id', [UsersController, 'update']).middleware([middleware.auth(), middleware.adminAuth()])
    router.delete('/users/:id', [UsersController ,'destroy']).middleware([middleware.auth(), middleware.adminAuth()])

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
}).prefix('/api/')