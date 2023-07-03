/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { getDatabase } from "firebase-admin/database";
import { useDatabase, type DatabaseHookReturn } from "./firebase";
import { sign, verify as verifyToken } from "./jwt";
import { zPlayer } from "$utils/types/player";
import { zInGame, zRoom, zRoomCreateInput } from "$utils/types/room";
import { z, type ZodFormattedError } from "zod";

type ReturnFormat<T extends Record<string, any>, TErr = any> = TErr extends any ?
  { success: true, data: T } | { success: false, errors: ZodFormattedError<T> } :
  { success: true, data: T } | { success: false, errors: ZodFormattedError<TErr> }

type PromiseReturnFormat<T extends Record<string, any>, TErr = any> = Promise<ReturnFormat<T, TErr>>

type CreateRoomInput = z.infer<typeof zRoomCreateInput>
type CreateRoomOutput = Promise<ReturnFormat<App.Room, CreateRoomInput>>

class Player {

  private data: App.Player
  private db: DatabaseHookReturn

  private getRoomList() {
    return this.db.users(this.value.name).rooms().once('value')
      .then(snap => {
        const games = snap.val()
        if (!games) return []
        return Object.entries<App.Room>(games).map(([_, room]) => room)
      })
  }

  private async setGameData(room: App.Room, ingame: App.InGame): Promise<ReturnFormat<{ room: App.Room, ingame: App.InGame }>> {
    const v = z.object({ room: zRoom, ingame: zInGame }).safeParse({ room, ingame })
    if (!v.success) return { success: false, errors: v.error.format() }

    const hostRoomRef = this.db.users(room.host.name).rooms(room.name)
    const gameRef = this.db.games(room.id + '').ref()

    try {
      await Promise.all([
        hostRoomRef.set(v.data.room),
        gameRef.set(v.data) // { room, ingame }
      ])

      return { success: true, data: v.data }
    } catch (error) {
      return { success: false, errors: { _errors: ['Error on saving data to database service. Please try again later.'] } }
    }
  }

  private async createRoom(createRoomInput: CreateRoomInput): CreateRoomOutput {

    const valid = zRoomCreateInput.safeParse(createRoomInput)
    if (!valid.success) return { success: false, errors: valid.error.format() }

    const userRoomRef = this.db.users(this.value.name).rooms(createRoomInput.name)
    const userRoomSnap = await userRoomRef.once('value')
    if (userRoomSnap.exists()) return {
      success: false,
      errors: { _errors: [], name: { _errors: ["Room name already exist, please use another!"] } }
    }

    const countRef = this.db.globals().get("gamescount")
    const countSnap = await countRef.once('value')
    const count = countSnap.val() ?? 10000
    const currentCount = count + 1
    countRef.set(currentCount)

    const room: App.Room = {
      id: currentCount,
      name: createRoomInput.name,
      topic: createRoomInput.topic,
      questionPerPlayer: createRoomInput.questionPerPlayer,
      currentQuestion: 0,
      currentReadyPlayer: new Set(),
      host: this.value,
      status: "waiting"
    }

    const ingame: App.InGame = {
      currentTurn: null,
      questions: {},
      turns: new Set(),
      players: {
        [this.value.name]: {
          ...this.value,
          gamedata: {
            asker: false,
            host: false,
            point: 0,
            ready: false,
            vote: false,
            winner: false
          }
        }
      }
    }

    const gameRef = this.db.games(room.id + '').ref()
    const gameSnap = await gameRef.once('value')
    if (gameSnap.exists()) return {
      success: false,
      errors: { _errors: [], name: { _errors: ['Room name already exist, please use another!'] } }
    }

    const result = await this.setGameData(room, ingame)
    if (!result.success) return {
      success: false, errors: {
        _errors: result.errors._errors
      }
    }

    return { success: true, data: room }
  }

  constructor(value: App.Player) {
    this.data = zPlayer.parse(value)
    this.db = useDatabase()
  }

  set value(value: App.Player) {
    this.data = zPlayer.parse(value)
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

  get room() {
    return this.db.ref(useRef("users", this.value.name, "games")).once('value')
      .then(snap => {
        const games = snap.val()
        if (!games) return []
        return Object.entries<App.Room>(games).map(([_, room]) => room)
      })
  }

  save() {
    const ref = this.db.ref(useRef("users", this.value.name, "value"))
    ref.once('value').then(snap => {
      if (!snap.exists()) {
        ref.set(this.data)
      } else {
        this.value = snap.val()
      }

      return this.data
    })
  }

}

export default function useRepositories() {

  // get firebase admin realtime db
  const db = getDatabase()

  async function verify(token: string) {
    const value = verifyToken(token)
    const name = value?.data ?? ''
    if (name === '') return undefined

    const ref = db.ref(useRef("users", name, "value"))
    const snap = await ref.once('value')
    if (snap.exists()) return new Player(snap.val())
    return undefined
  }

  return {
    verify
  }
}