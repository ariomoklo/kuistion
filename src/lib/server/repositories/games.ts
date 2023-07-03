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
    const path = `${host}_${name}`
    const ref = Repo.getdb().globals().ref()
    ref.transaction(globals => {
      if (!globals.library) {
        globals.gamescount = 1
        globals.library = {
          [path]: id
        }
      } else if (!globals.library[`${host}_${name}`]) {
        globals.gamescount = (globals.gamescount ?? 0) + 1
        globals.library = {
          [path]: id
        }
      }

      return globals
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

    // reserve games count as id
    const id = GameAdmin.createGameID(host.value.name, input.name)
    await Repo.getdb().globals().get('gamescount').set(id)

    const game = new GameAdmin({
      id, name: input.name, host: host.value.name,
      currentTurn: null, usedQuestions: [], players: [host.value.name]
    })

    game.save()
    return Repo.success(game)
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