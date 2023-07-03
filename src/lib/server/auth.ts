import type { RequestEvent } from "@sveltejs/kit";
import { getExpiredDate } from "$lib/server/jwt";
import { PlayerLoginInput } from "$utils/types/player";
import { PlayerAdmin } from "./repositories/players";

export async function authenticate(event: RequestEvent) {
  let token = event.cookies.get('session-token')
  if (!token) token = event.request.headers.get('Authorization')?.replace('Bearer ', '')

  if (token) {
    const result = await PlayerAdmin.check(token)
    if (result.success) {
      const player = result.data
      return { token, pname: player.value.name, user: player }
    }
  }

  return { token, pname: undefined, user: undefined }
}

export async function loggedInAction(data: { name: any, refresh?: any }): Promise<{
  status: 'error'
  form: string[]
  name: string[]
} | {
  status: 'success'
  token: string
  refresh: string
  data: App.Player
  maxAge: number
  expires: Date
}> {
  const input = PlayerLoginInput.safeParse(data)

  // json body error on validation
  if (!input.success) {
    const err = input.error.format()
    return {
      status: 'error',
      form: [...err._errors, ...(err.refresh?._errors ?? [])],
      name: err.name?._errors ?? ['Something went wrong, please try again later']
    }
  }

  // if refresh token empty, create new player only when given name is not exist
  if (!input.data.refresh) {
    const result = await PlayerAdmin.create(input.data.name)
    if (!result.success) return { status: 'error', form: result.errors._errors, name: [] }
    const player = result.data
    return { status: 'success', ...player.session, data: player.value, maxAge: 60 * 60 * 365, expires: getExpiredDate() }
  } else {
    const result = await PlayerAdmin.recheck(input.data.refresh, input.data.name)
    if (!result.success) return { status: 'error', form: result.errors._errors, name: [] }
    const player = result.data
    return { status: 'success', ...player.session, data: player.value, maxAge: 60 * 60 * 365, expires: getExpiredDate() }
  }
}