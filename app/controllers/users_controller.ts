import { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'

export default class UsersController {
  public async store({ request, response }: HttpContext) {
    const { name, email, password } = request.only(['name', 'email', 'password'])

    const existingUser = await User.findBy('email', email)
    if (existingUser) {
      return response.status(400).json({ message: 'Email already registered' })
    }

    const user = await User.create({
      name,
      email,
      password: await hash.make(password),
      role: 'user',
    })

    return response.status(201).json({
      message: 'User created successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  }

  public async login({ auth, request, response }: HttpContext) {
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

    const tokenObject = await auth.use('api').authenticateAsClient(user)

    console.log('--- Mulai Debugging Token Object ---')
    console.log('Objek Token Mentah (Raw):', tokenObject)
    if (tokenObject && typeof tokenObject === 'object' && tokenObject.constructor) {
      console.log('Konstruktor Objek Token:', tokenObject.constructor.name)
    }
    console.log(
      'Apakah tokenObject memiliki method .release()? ->',
      typeof (tokenObject as any)?.release
    )
    console.log('Struktur Objek Token (JSON.stringify):', JSON.stringify(tokenObject, null, 2))
    console.log('--- Selesai Debugging Token Object ---')

    let actualTokenString: string | undefined

    // ini bagian untuk mengekstrak token
    if (typeof tokenObject === 'object' && tokenObject !== null) {
      // 1. Coba .release() jika ada (ini yang seharusnya bekerja dengan config standar)
      if (typeof (tokenObject as any).release === 'function') {
        try {
          actualTokenString = (tokenObject as any).release()
          console.log('Token didapatkan dari .release()')
        } catch (e) {
          console.error('Gagal memanggil .release() pada tokenObject:', e)
        }
      }

      if (
        !actualTokenString &&
        typeof (tokenObject as any).headers === 'object' &&
        (tokenObject as any).headers !== null
      ) {
        const authHeader: string = (tokenObject as any).headers.authorization
        if (typeof authHeader === 'string' && authHeader.toLowerCase().startsWith('bearer ')) {
          actualTokenString = authHeader.substring(7)
          console.log('Token didapatkan dari .headers.authorization')
        }
      }

      // ini sebenarnya macam fallback lain aja kalau diperlukan (misalnya .token atau .value)
      if (!actualTokenString && typeof (tokenObject as any).token === 'string') {
        actualTokenString = (tokenObject as any).token
        console.log('Token didapatkan dari .token')
      }
      if (!actualTokenString && typeof (tokenObject as any).value === 'string') {
        actualTokenString = (tokenObject as any).value
        console.log('Token didapatkan dari .value')
      }
    }

    if (!actualTokenString) {
      console.error(
        'Tidak dapat menemukan string token dari objek (setelah semua percobaan):',
        tokenObject
      )
      return response.status(500).json({ message: 'Gagal memproses token login.' })
    }

    return response.status(200).json({
      message: 'Login success',
      user: {
        id: user.id,
        name: user.name,
        email: user.email, 
        role: user.role,
        avatarUrl: user.avatarurl,
      },
      token: actualTokenString,
    })
  }

  public async profile({ auth, response }: HttpContext) {
    try {
      const user = auth.use('api').user!
      return response.status(200).json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        img_url: user.img_url || null,
        created_at: user.createdAt?.toISO(),
      })
    } catch (error) {
      console.error('Profile error:', error)
      return response.status(500).json({ message: 'Internal server error' })
    }
  }

  public async update({ auth, request, response }: HttpContext) {
    try {
      const user = auth.use('api').user!
      const { name, email } = request.only(['name', 'email'])
      const payload: { name?: string; email?: string } = {}

      if (name) payload.name = name
      if (email && email !== user.email) {
        const existingUser = await User.findBy('email', email)
        if (existingUser && existingUser.id !== user.id) {
          return response.status(400).json({ message: 'Email already taken' })
        }
        payload.email = email
      }

      if (Object.keys(payload).length === 0) {
        return response.status(400).json({ message: 'No data provided for update' })
      }

      user.merge(payload)
      await user.save()

      return response.status(200).json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        img_url: user.img_url || null,
      })
    } catch (error) {
      console.error('Update profile error:', error)
      return response.status(500).json({ message: 'Internal server error' })
    }
  }

  public async index({ auth, response }: HttpContext) {
    try {
      const currentUser = auth.use('api').user!
      if (currentUser.role !== 'admin') {
        return response.status(403).json({ message: 'Forbidden: Admin access required' })
      }
      const users = await User.query().select([
        'id',
        'name',
        'email',
        'role',
        'img_url',
        'created_at',
        'updated_at',
      ])
      return response.json(users)
    } catch (error) {
      console.error('Error fetching users:', error)
      return response.status(500).json({ message: 'Internal server error' })
    }
  }

  public async show({ params, response, auth }: HttpContext) {
    try {
      const currentUser = auth.use('api').user!
      if (currentUser.role !== 'admin' && currentUser.id !== Number(params.id)) {
        return response.status(403).json({ message: 'Forbidden: Insufficient permissions' })
      }
      const user = await User.find(params.id)
      if (!user) {
        return response.status(404).json({ message: 'User not found' })
      }
      return response.json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        img_url: user.img_url || null,
        created_at: user.createdAt?.toISO(),
        updated_at: user.updatedAt?.toISO(),
      })
    } catch (error) {
      console.error(`Error fetching user ${params.id}:`, error)
      return response.status(500).json({ message: 'Internal server error' })
    }
  }

  public async destroy({ params, response, auth }: HttpContext) {
    try {
      const currentUser = auth.use('api').user!
      if (currentUser.role !== 'admin') {
        return response.status(403).json({ message: 'Forbidden: Admin access required' })
      }
      const user = await User.find(params.id)
      if (!user) {
        return response.status(404).json({ message: 'User not found' })
      }
      if (user.id === currentUser.id) {
        return response
          .status(400)
          .json({ message: 'Admin cannot delete their own account through this endpoint' })
      }
      await user.delete()
      return response.status(200).json({ message: 'User deleted successfully' })
    } catch (error) {
      console.error(`Error deleting user ${params.id}:`, error)
      return response.status(500).json({ message: 'Internal server error' })
    }
  }
}
