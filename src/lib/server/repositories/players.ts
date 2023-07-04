import { zPlayer } from "$utils/types/player";
import { ZodError, z } from "zod";
import { sign, verify } from "../jwt";
import { Repo } from "./utility";
import { zRoom, zRoomCreateInput } from "$utils/types/room";
import { RoomAdmin } from "./rooms";
import { GameAdmin } from "./games";

type CreateRoomInput = z.infer<typeof zRoomCreateInput>

export class PlayerAdmin extends Repo {

  private _data: App.Player

  static serializer = {
    from: zPlayer.extend({
      createdAt: z.string().datetime().transform(d => new Date(d)),
      lastLoggedIn: z.string().datetime().transform(d => new Date(d))
    }),
    to: zPlayer.transform(p => ({
      name: p.name,
      createdAt: p.createdAt.toISOString(),
      lastLoggedIn: p.lastLoggedIn.toISOString()
    }))
  }

  private get ref() {
    return this.db.users(this._data.name)
  }

  static async get(name: string) {
    const ref = Repo.getdb().users(name).value()
    const snap = await ref.once('value')
    if (!snap.exists()) return Repo.fail<App.Player>({ _errors: ['Player with given name is not exist!'] })
    const player = PlayerAdmin.serializer.from.parse(snap.val())

    try {
      return Repo.success(new PlayerAdmin(player))
    } catch (error) {
      return Repo.catchFail<App.Player>(error)
    }
  }

  static async create(name: string) {
    const trimed = name.trim()
    if (trimed.length < 5) return Repo.fail<string>({ _errors: ['min 5 character length with no spaces'] })

    const ref = Repo.getdb().users(trimed).value()
    const snap = await ref.once('value')
    if (snap.exists()) return Repo.fail<string>({ _errors: ['Player with given name already exist!'] })

    const player = new PlayerAdmin({
      name: trimed,
      createdAt: new Date(),
      lastLoggedIn: new Date()
    })

    await player.save()
    return Repo.success(player)
  }

  static async check(token: string) {
    const value = verify(token)
    const name = value?.data ?? ''
    if (name === '') return Repo.fail<App.Player>({ _errors: ['You are unauthorized!'] })
    const result = await PlayerAdmin.get(name)
    if (!result.success) return result

    await result.data.update({ lastLoggedIn: new Date() })
    return result
  }

  static async recheck(refresh: string, name: string) {
    const value = verify(refresh, name)
    if (!value) return Repo.fail<App.Player>({ _errors: ['You are unauthorized!'] })
    const result = await PlayerAdmin.get(name)
    if (!result.success) return result

    await result.data.update({ lastLoggedIn: new Date() })
    return result
  }

  constructor(value: App.Player) {
    super()
    this._data = zPlayer.parse(value)
  }

  get value(): App.Player {
    return this._data
  }

  get serialized() {
    return PlayerAdmin.serializer.to.parse(this._data)
  }

  get session() {
    return {
      token: sign(this._data.name),
      refresh: sign(this._data.name, this._data.name)
    }
  }

  async update(value: Partial<App.Player>) {
    try {
      this._data = zPlayer.parse({ ...this._data, ...value })
      await this.ref.value().set(this.serialized)
      return Repo.success<App.Player>(this._data)
    } catch (error) {
      if (error instanceof ZodError) {
        return Repo.fail<App.Player>(error.format())
      }
      return Repo.fail<App.Player>({ _errors: ['Something is wrong, please try again later.'] })
    }
  }

  async save() {
    try {
      await this.ref.value().set(this.serialized)
      return Repo.success<App.Player>(this._data)
    } catch (error) {
      return Repo.fail<App.Player>({ _errors: ['Something is wrong, please try again later.'] })
    }
  }

  async room(roomname: string) {
    return RoomAdmin.getByName(this._data.name, roomname)
  }

  async rooms() {
    const snap = await this.ref.rooms().once('value')
    const rooms = snap.val()
    if (!rooms?.length) return Repo.success<App.Room[]>([])
    const v = zRoom.array().safeParse(snap.val())
    if (!v.success) return Repo.fail(v.error.format())
    else return Repo.success(v.data)
  }

  async createRoom(input: CreateRoomInput) {
    return await GameAdmin.createGame(input, this)
  }

  async joinRoom(host: string, name: string) {
    const find = await RoomAdmin.getByName(host, name)
    if (!find.success) return find
    const room = find.data
    const game = await room.getGame()
    const isInGame = game.hasPlayer(this._data.name)
    if (isInGame) return game

    game.addPlayer(this.value)
    return game
  }
}