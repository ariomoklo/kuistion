/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { RequestEvent } from "@sveltejs/kit";
import { getDatabase, type Reference } from "firebase-admin/database";
import { getExpiredDate, sign, verify } from "$lib/server/jwt";
import { z } from "zod";
import { v4 } from "uuid";
import { PlayerLoginInput } from "$utils/types/player";
import { zRoom, zRoomCreateInput } from "$utils/types/room";
import { useRef } from "./firebase";

const playerZod = z.object({
  id: z.string().uuid(),
  name: z.string().trim().min(5),
  point: z.number().optional().default(0),
  ready: z.boolean().optional().default(false)
})

export async function authenticate(event: RequestEvent) {
  let token = event.cookies.get('session-token')

  if (!token) token = event.request.headers.get('Authorization')?.replace('Bearer ', '')
  if (token) {

    const player = await Player.parseToken(token)
    if (!player) return { token, pname: undefined, user: undefined }

    return { token, pname: player.value.name, user: player }
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
    const check = await Player.fetch(input.data.name)

    // if player exist but doesn't have refresh token, return player exist error
    if (check) return { status: 'error', form: [], name: [`user with name ${input.data.name} already exist!`] }

    // if player not exist create the player
    const player = await Player.create(input.data.name)
    return { status: 'success', ...player.session, data: player.value, maxAge: 60 * 60 * 365, expires: getExpiredDate() }
  }

  // try refresh player token
  const player = await Player.refreshToken(input.data.refresh, input.data.name)
  if (!player) return { status: 'error', form: ['You are not authorized'], name: [] }

  return { status: 'success', ...player.session, data: player.value, maxAge: 60 * 60 * 365, expires: getExpiredDate() }
}

export function Game(owner: string, room: string) {

  const db = getDatabase()
  const ref = db.ref(useRef('users', owner, 'games', room))
  const snap = () => ref.once('value')

  async function get() {
    const s = await snap()
    if (!s.exists()) return undefined
    return zRoom.parse(s.val())
  }

  return { ref, snap, get }
}

export class Player {

  private data: App.Player
  private ref: Reference

  constructor(value: App.Player) {
    const db = getDatabase()

    this.ref = db.ref(useRef('users', value.name))
    this.data = playerZod.parse(value)
  }

  set value(value: App.Player) {
    const v = playerZod.safeParse(value)
    if (v.success) this.data = v.data
  }

  get value() {
    return this.data
  }

  get session() {
    return {
      token: sign(this.data.name),
      refresh: sign(this.data.name, this.data.name)
    }
  }

  get rooms() {
    const ref = this.ref.child(useRef('games'))
    return ref.once('value')
      .then(snap => {
        const games = snap.val()
        if (!games) return []
        return Object.entries<App.Room>(games).map(([_, room]) => room)
      })
  }

  public syncOnce() {
    return this.ref.once('value').then(snap => {
      if (!snap.exists()) {
        this.ref.set(this.data)
      } else {
        this.value = snap.val()
      }

      return this.data
    })
  }

  public async findRoom(name: string) {
    const ref = this.ref.child(useRef('games', name))
    const snap = await ref.once('value')

    console.log({ key: ref.key })

    if (snap.exists()) {
      const v = zRoom.safeParse(snap.val())
      if (v.success) return v.data
    }

    return undefined
  }

  public async joinRoom(owner: string, room: string) {
    const db = getDatabase()
    const roomRef = db.ref(useRef('users', owner, 'games', room))
    const roomSnap = await roomRef.once('value')
    if (roomSnap.exists()) {
      const playerRef = roomRef.child(useRef('playes', this.value.name))
      const playerSnap = await playerRef.once('value')
      if (!playerSnap.exists()) await playerRef.set(this.value)
      const vRoom = zRoom.safeParse(roomSnap.val())
      if (vRoom.success) return { data: vRoom.data, success: true }

      return {
        success: false,
        errors: {
          form: ['Room data validation error.'],
          name: []
        }
      }
    }

    return {
      success: false,
      errors: { form: [], name: [`Room with name ${room} doesn't exist.`] }
    }
  }

  public async createRoom(roomInput: z.infer<typeof zRoomCreateInput>): Promise<{
    status: true
    data: App.Room
  } | {
    status: false
    errors: 'RoomExist'
  }> {
    const ref = this.ref.child(useRef('games', roomInput.name))
    const snap = await ref.once('value')
    if (snap.exists()) return {
      status: false,
      errors: 'RoomExist'
    }

    const room: App.Room = {
      name: roomInput.name,
      topic: roomInput.topic,
      questionPerPlayer: roomInput.questionPerPlayer,
      status: "waiting",
      host: this.value
    }

    await ref.set(room)
    return { status: true, data: room }
  }

  public static async fetch(name: string) {
    const db = getDatabase()
    const ref = db.ref(`users/${name}`)
    const snap = await ref.once('value')
    if (!snap.exists()) return undefined

    const user = snap.val()
    return new Player(user)
  }

  public static async refreshToken(refresh: string, name: string) {
    const value = verify(refresh, name)
    if (!value) return undefined
    return await Player.fetch(name)
  }

  public static async parseToken(token: string) {
    const value = verify(token)
    const name = value?.data ?? ''
    if (name === '') return undefined

    const player = new Player({
      id: v4(), name: name,
      point: 0, ready: false
    })

    await player.syncOnce()
    return player
  }

  public static async create(name: string) {
    const trimed = name.trim()
    if (trimed.length < 5) throw new Error('Player name must have minimal 5 character with no spaces!')

    const player = new Player({
      id: v4(), name: trimed,
      point: 0, ready: false
    })

    await player.syncOnce()
    return player
  }

}