import { SESSION_KEY } from "$env/static/private"
import { loggedInAction, Player } from "$lib/server/auth"
import { json, type RequestEvent } from "@sveltejs/kit"

export async function OPTIONS() {
  return new Response(undefined, {
    status: 204, headers: {
      'Allow': 'OPTIONS, GET, POST'
    }
  })
}

export async function POST(event: RequestEvent) {
  const data = await event.request.json()

  const result = await loggedInAction(data)
  if (result.status === 'error') {
    return json({
      status: result.status,
      errors: { form: result.form, name: result.name }
    }, { status: 400 })
  } else {
    event.cookies.set(SESSION_KEY, result.token, { maxAge: result.maxAge, expires: result.expires })
    return { token: result.token, refresh: result.refresh, data: result.data }
  }
}

export async function GET(event: RequestEvent) {
  const player = new Player(event.locals.user)
  return {
    ...player.session,
    data: player.value
  }
}