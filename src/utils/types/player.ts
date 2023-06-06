import { z } from "zod"

export const PlayerLoginInput = z.object({
  name: z.string().trim().min(5).transform(s => s.replaceAll(/\s/g, '-')),
  refresh: z.optional(z.string().nonempty()).nullish()
})

export const zPlayer = z.object({
  id: z.string().uuid(),
  name: z.string().min(5).transform(s => s.replaceAll(/\s/g, '-')),
  ready: z.boolean().optional().default(true),
  point: z.number().optional().default(0),
  vote: z.boolean().optional(),
  asker: z.boolean().optional(),
  host: z.boolean().optional(),
  winner: z.boolean().optional(),
})