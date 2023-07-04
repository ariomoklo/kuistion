import type { RequestEvent } from "@sveltejs/kit";
import { getExpiredDate } from "$lib/server/jwt";
import { zPlayerLoginInput } from "$utils/types/player";
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

export async function loggedInAction(name: string, refresh: string | null = null): Promise<{
  success: false,
  errors: string[]
} | {
  success: true,
  token: string
  refresh: string
  data: App.Player
  maxAge: number
  expires: Date
}> {

  // if refresh token empty, create new player only when given name is not exist
  if (refresh === null) {

    // Try registering new user with given username
    const result = await PlayerAdmin.create(name)
    if (!result.success) return { success: false, errors: result.errors._errors }

    const player = result.data
    return { success: true, ...player.session, data: player.value, maxAge: 60 * 60 * 365, expires: getExpiredDate() }

  } else {

    const result = await PlayerAdmin.recheck(refresh, name)
    if (!result.success) return { success: false, errors: result.errors._errors }

    const player = result.data
    return { success: true, ...player.session, data: player.value, maxAge: 60 * 60 * 365, expires: getExpiredDate() }

  }
}