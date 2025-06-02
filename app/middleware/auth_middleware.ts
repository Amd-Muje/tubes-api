import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import type { Authenticators } from '@adonisjs/auth/types'

/**
 * Auth middleware is used authenticate HTTP requests and deny
 * access to unauthenticated users.
 */
export default class AuthMiddleware {
  /**
   * The URL to redirect to, when authentication fails
   */
  redirectTo = '/login'

  async handle(
    ctx: HttpContext,
    next: NextFn,
    options: {
      guards?: (keyof Authenticators)[]
    } = {}
  ) {
    try {
      // `authenticateUsing` akan mencoba guard yang diberikan.
      // Jika tidak ada guard spesifik di options, ia akan mencoba default guard dari config/auth.ts
      // Untuk rute API, kita akan secara eksplisit memberikan options.guards = ['api']
      // Untuk rute Inertia yang tidak mengirim token di header, ia akan gagal jika default guardnya adalah 'api'
      // atau jika default guardnya 'web' tapi tidak ada sesi.
      await ctx.auth.authenticateUsing(options.guards, { loginRoute: this.redirectTo })
      return next()
    } catch (error) {
      // Jika request mengharapkan JSON (misalnya dari API call di frontend), kirim response 401 JSON
      if (ctx.request.accepts(['html', 'json']) === 'json') {
        return ctx.response.status(401).json({ message: 'Unauthorized access' })
      }
      // Jika tidak (misalnya request browser biasa ke halaman yang diproteksi sesi), redirect ke login
      return ctx.response.redirect(this.redirectTo)
    }
  }
}
