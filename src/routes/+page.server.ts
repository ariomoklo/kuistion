import { SESSION_KEY } from '$env/static/private'
import { loggedInAction } from '$lib/server/auth'
import { zPlayerLoginInput } from '$utils/types/player'
import { fail, type Actions, redirect } from '@sveltejs/kit'
import { superValidate } from 'sveltekit-superforms/server'

export async function load() {
  const form = await superValidate(zPlayerLoginInput)
  return { form }
}

export const actions: Actions = {
  default: async ({ request, cookies, url }) => {

    const form = await superValidate(request, zPlayerLoginInput)

    if (!form.valid) {
      return fail(400, { form })
    }

    const username = url.searchParams.get('username')
    const roomname = url.searchParams.get('roomname')

    const result = await loggedInAction(form.data.name, form.data.refresh)
    if (result.success) {
      cookies.set(SESSION_KEY, result.token, { maxAge: result.maxAge, expires: result.expires })

      const name = result.data.name
      let target = '/' + name
      if (username && roomname) {
        target = ['', username, roomname].join('/')
      }

      throw redirect(303, target);
    }

    form.errors._errors = [...(form.errors._errors ?? []), ...result.errors]
    return { form }
  }
}