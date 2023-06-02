import { SESSION_KEY } from '$env/static/private'
import { loggedInAction } from '$lib/server/auth'
import { fail, type Actions, redirect } from '@sveltejs/kit'

export const actions: Actions = {
  default: async ({ request, cookies }) => {

    const form = await request.formData()
    const data = { name: form.get('name'), refresh: form.get('refresh') }
    const result = await loggedInAction(data)

    if (result.status === 'error') return fail(400, { errors: result, name: data.name, refresh: data.refresh })

    cookies.set(SESSION_KEY, result.token, { maxAge: result.maxAge, expires: result.expires })
    throw redirect(300, '/room');

  }
}