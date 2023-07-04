import { zGameInfo, zRoomCreateInput } from "$utils/types/room";
import type { z } from "zod";
import { Repo } from "./utility";
import type { PlayerAdmin } from "./players";
import { RoomAdmin } from "./rooms";
import { v4 } from "uuid";

const DEFAULTCOUNT = 10000

type CreateGameInput = z.infer<typeof zRoomCreateInput>

function createFreshPlayerGameData() {
  return {
    asker: false,
    host: false,
    point: 0,
    ready: false,
    vote: false,
    winner: false
  }
}

export class GameAdmin extends Repo {

  private _data: App.GameInfo
  private get ref() {
    return this.db.games(this._data.id)
  }

  protected static createGameID(host: string, name: string) {
    const id = v4()
    const path = `${host}|${name}`
    const ref = Repo.getdb().library()
    ref.transaction(library => {
      if (!library) {
        return {
          [path]: id
        }
      } else if (typeof library === 'object') {
        const exist = library[path]
        if (!exist) {
          library[path] = id
          return library
        }
      }

      return library
    })

    return id
  }

  static async get(id: string) {
    const ref = Repo.getdb().games(id).info()
    const snap = await ref.once('value')
    if (!snap.exists()) return Repo.fail<App.GameInfo>({ _errors: ['Game with given id is not exist!'] })
    const game = snap.val()

    try {
      return Repo.success(new GameAdmin(game))
    } catch (error) {
      return Repo.catchFail<App.GameInfo>(error)
    }
  }

  static async createGame(input: CreateGameInput, host: PlayerAdmin) {
    const v = zRoomCreateInput.safeParse(input)
    if (!v.success) return Repo.fail(v.error.format())

    // reserve id in games library
    const id = GameAdmin.createGameID(host.value.name, input.name)

    const game = new GameAdmin({
      id, name: input.name, host: host.value.name, turns: null, questions: [],
      currentTurn: null, usedQuestions: [], players: [host.value.name]
    })

    const room = new RoomAdmin({
      id, name: input.name, host: host.value.name,
      status: "waiting", topic: input.topic, questionPerPlayer: input.questionPerPlayer,
      currentQuestion: 0, playerReadyState: {
        [host.value.name]: false
      }
    })

    game.save()
    room.save()
    return Repo.success(room)
  }

  constructor(value: App.GameInfo) {
    super()
    this._data = zGameInfo.parse(value)
  }

  async save() {
    this.ref.info().set(this._data)
  }

  hasPlayer(name: string) {
    const player = this._data.players.find(n => name === n)
    return player !== undefined
  }

  addPlayer(player: App.Player) {
    this._data.players.push(player.name)
    this.save()
  }
}