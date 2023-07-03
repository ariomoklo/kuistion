import { z } from 'zod'

export const zGameStatus = z.enum(['waiting', 'ready', 'in-play', 'finish'])
export const zGameVotes = z.enum(['correct', 'wrong'])

export const zQuestion = z.object({
  id: z.string().uuid(),
  maker: z.string().uuid(),
  question: z.string().min(5),
  choices: z.object({
    id: z.string().toUpperCase(),
    text: z.string().min(5),
    correct: z.boolean().optional()
  }).array()
})

export const zPlayerTurn = z.object({
  receivedPoint: z.number().default(0),
  vote: zGameVotes.nullable(),
  choices: z.string().nullable()
})

export const zGameTurn = z.object({
  player: z.string().uuid(),  // current player id that will answer the question
  question: z.string().uuid() // current question id
})

export const zRoomCreateInput = z.object({
  name: z.string().trim().min(5).transform(s => s.replaceAll(/\s/g, '-')),
  topic: z.string().min(5),
  questionPerPlayer: z.number().default(1)
})

export const zRoom = z.object({
  id: z.string(),
  host: z.string().trim().min(5).transform(s => s.replaceAll(/\s/g, '-')),
  name: z.string().trim().min(5).transform(s => s.replaceAll(/\s/g, '-')),
  topic: z.string().min(5),
  status: zGameStatus,
  questionPerPlayer: z.number(),
  currentQuestion: z.number(),
  playerReadyState: z.record(z.string(), z.boolean())
})

export const zGameInfo = z.object({
  id: z.string(),
  name: z.string().trim().min(5),
  host: z.string().trim().min(5),
  players: z.array(z.string().min(5)),
  currentTurn: z.string().uuid().nullable(),
  usedQuestions: z.array(z.string().uuid())
})
