import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'

export default class UsersController {

  // Get All Users
  public async index({ auth, response ,inertia}: HttpContext) {
    try {
      const user = auth.user
      const users = await User.all()
      inertia.share({
        auth: {
          user: auth.user
        }
      })
      // Jika User selain role admin yang minta data user yang keluar cuma nama
      if (user?.role !== 'admin') {
        return response.json({ users: users.map((user) => ({ name: user.name })) })
      }
      return response.status(200).json(users)
    } catch (error) {
      return response.status(500).json({ message: 'Internal server error' })
    }
  }

  // Get User By Id
  public async show({ params, response, auth }: HttpContext) {
    try {
      const user = auth.user
      const userData = await User.find(params.id)
      if (!userData) {
        return response.status(404).json({ message: 'User not found' })
      }

      // Jika User selain role admin yang minta data user yang keluar cuma nama
      if (user?.role !== 'admin') {
        return response.json({
          userData: {
            name: userData.name,
          },
        })
      }
      return response.json(userData)
    } catch (error) {
      return response.status(500).json({ message: 'Internal server error' })
    }
  }

  // Create User
  public async store({ request, response }: HttpContext) {
    const data = request.only(['name', 'email', 'password'])
    const user = await User.create(data)

    return response.status(201).json({ message: 'user registered succesfully', user })
  }
// Login User
public async login({ auth, request, response, inertia }: HttpContext) {
  const { email, password } = request.only(['email', 'password'])

  try {
    const user = await User.findBy('email', email)
    if (!user) {
      return response.status(404).json({ message: 'User not found' })
    }

    const passwordValid = await hash.verify(user.password, password)
    if (!passwordValid) {
      return response.status(400).json({ message: 'Invalid password' })
    }
    
    const token = await auth.use('api').authenticateAsClient(user, ['*'])

    // Share auth data dengan inertia
    inertia.share({
      auth: {
        user: {
          id: user.id,
          name: user.name, 
          email: user.email,
          role: user.role,
          avatarUrl: user.avatarurl
        }
      }
    })

    return response.status(200).json({
      message: 'Login success',
      user: {
        id: user.id,
        name: user.name,
        email: user.email, 
        role: user.role,
        avatarUrl: user.avatarurl,
      },
      token,
    })
  } catch (error) {
    return response.status(500).json({ message: 'Internal server error' })
  }
}

  // Update User
  public async update({ params, request, response, auth }: HttpContext) {
    try {
      const user = auth.user
      const userData = await User.find(params.id)
      if (!userData) {
        return response.status(404).json({ message: 'User not found' })
      }
      if (user?.id !== userData.id) {
        return response.status(401).json({ message: 'Unauthorized' })
      }
      const data = request.only(['name', 'email', 'password'])
      userData.merge(data)
      await userData.save()

      return response.json({
        message: 'user updated succesfully',
        user: { id: userData.id, name: userData.name, email: userData.email, img_url: userData.avatarurl, },
      })
    } catch (error) {
      return response.status(500).json({ message: 'Internal server error' })
    }
  }

  // Delete User
  public async destroy({ params, response, auth }: HttpContext) {
    try {
      const user = await User.find(auth.user?.id)
      const userToDelete = await User.find(params.id)
      if (!userToDelete) {
        return response.status(404).json({ message: 'User not found' })
      }
      // User sendiri yang mau ba hapus
      if (user?.id === userToDelete.id) {
        // await auth.use('api').
        await userToDelete.delete()
        return response.status(202).json({ message: 'User self deleted successfully' })
      }
      // User lain yang mau hapus
      if (user?.role !== 'admin') {
        return response.status(401).json({ message: 'Unauthorized' })
      }
      await userToDelete.delete()
      return response.status(202).json({ message: 'User deleted successfully' })
    } catch (error) {
      return response.status(500).json({ message: 'Internal server error' })
    }
  }
  public async me({ auth, response }: HttpContext) {
    try {
      const user = auth.user
      if (!user) {
        return response.status(401).json({ message: 'Unauthorized' })
      }
  
      return response.json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatarUrl: user.avatarurl
        }
      })
    } catch (error) {
      return response.status(500).json({ message: 'Internal server error' })
    }
  }
}
