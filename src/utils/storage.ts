import { browser } from "$app/environment";
import { z } from "zod";

export function useLocalSession() {
  const SESSIONKEY = 'session'
  const v = z.object({
    name: z.string().min(5),
    token: z.string().nonempty()
  })

  return {

    save(session: {
      name: string
      token: string
    }) {
      if (browser) {
        localStorage.setItem(SESSIONKEY, JSON.stringify(session))
      }
    },

    load() {
      if (browser) {
        const raw = localStorage.getItem(SESSIONKEY)
        if (raw) {
          const valid = v.safeParse(JSON.parse(raw))
          if (valid.success) return valid.data
        }
      }

      return { name: undefined, token: undefined }
    }

  }
}