import { z } from "zod"

export const PlayerLoginInput = z.object({ 
  name: z.string().trim().min(5), 
  refresh: z.optional(z.string().uuid()).nullish()
})