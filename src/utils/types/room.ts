import { z } from 'zod'
import { zPlayer } from './player'

export const zGameStatus = z.enum(['waiting', 'ready', 'in-play', 'finish'])

export const zQuestion = z.object({
  id: z.string().uuid(),
  maker: zPlayer,
  question: z.string().min(5),
  choices: z.object({
    id: z.string().toUpperCase(),
    text: z.string().min(5),
    correct: z.boolean().optional()
  }).array()
})

export const zTurn = z.object({
  player: zPlayer,
  question: zQuestion,

  /** Map with key of player id and boolean vote of choice is correct */
  voters: z.map(z.string(), z.boolean().nullable()),

  choice: z.object({
    id: z.string().toUpperCase(),
    text: z.string().min(5)
  })
})

export const zRoomCreateInput = z.object({
  name: z.string().trim().min(5).transform(s => s.replaceAll(/\s/g, '-')),
  topic: z.string().min(5),
  questionPerPlayer: z.number().default(1)
})

export const zRoom = z.object({
  name: z.string().trim().min(5).transform(s => s.replaceAll(/\s/g, '-')),
  topic: z.string().min(5),
  host: zPlayer,
  status: zGameStatus,
  questionPerPlayer: z.number(),
  questions: z.array(zQuestion).nullish(),
  players: z.record(zPlayer).nullish(),
  turns: z.array(zTurn).nullish()
})