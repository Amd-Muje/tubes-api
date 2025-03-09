import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import hash  from '@adonisjs/core/services/hash'

export default class UsersController {
    // Get All Users
    public async index({ auth, response }: HttpContext) {
        const user = await User.find(auth.user?.id)
        if(user?.role !== 'admin') {
            return response.status(403).json({ message: 'Only admin can access this resource' })
        }    
        const users = await User.all()
        return response.status(201).json(users)
    }

    // Get User By Id
    public async show({ params, response}: HttpContext) {
        // const user = auth.user
        // if(user?.role !== 'admin' && user?.id !== Number(params.id)) {
        //     return response.status(403).json({ message: 'You are not allowed to access this resource' })
        // }
        const userData = await User.find(params.id)
        if(!userData) {
            return response.status(404).json({ message: 'User not found' })
        }
        return response.json(userData)
    }

    // Create User
    public async store({ request, response }: HttpContext) {
        const data = request.only(['name', 'email', 'password', 'role'])
        const user = await User.create(data)

        return response.status(201).json({message: 'user registered succesfully', user})
    }

    // Login User
    public async login({ auth, request, response }: HttpContext) {
        const { email, password } = request.body()

        const user = await User.findBy('email', email)
        if(!user) {
            return response.status(404).json({ message: 'User not found' })
        }

        const passwordValid = await hash.verify(user.password, password)
        if(!passwordValid) {
            return response.status(400).json({ message: 'Invalid password' })
        }
        const token = await auth.use('api').authenticateAsClient(user, ['*'])

        return response.status(200).json({message: 'Login success', user:{
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }, token})
        }

    // Update User
    public async update({ params, request, response }: HttpContext) {
        const user = await User.find(params.id)
        if(!user) {
            return response.status(404).json({ message: 'User not found' })
        }
        const data = request.only(['name', 'email', 'password'])
        user.merge(data)
        await user.save()

        return response.json(user)
    }

    // Delete User
    public async destroy({ params, response }: HttpContext) {
        const user = await User.find(params.id)
        if(!user) {
            return response.status(404).json({ message: 'User not found' })
        }
        await user.delete()

        return response.status(204).json({'message': 'User deleted successfully'})
    }
}