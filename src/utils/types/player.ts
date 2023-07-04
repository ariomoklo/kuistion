import { z } from "zod"

export const zPlayerLoginInput = z.object({
  name: z.string().trim().min(5).transform(s => s.replaceAll(/\s/g, '-')),
  refresh: z.optional(z.string().nonempty()).nullish()
})

export const zPlayer = z.object({
  name: z.string().min(5).transform(s => s.replaceAll(/\s/g, '-')),
  createdAt: z.date().default(new Date()),
  lastLoggedIn: z.date().default(new Date())
})