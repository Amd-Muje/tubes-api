import { HttpContext } from '@adonisjs/core/http'
import { NextFn } from '@adonisjs/core/types/http'

export default class InertiaMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    await ctx.inertia.share({
      errors: ctx.session.flashMessages.get('errors') || {},
      // Bagikan data auth dan user
      auth: {
        isAuthenticated: ctx.auth.isAuthenticated,
        user: ctx.auth.user, // User akan null jika belum login
      },
    })
    return next()
  }
}