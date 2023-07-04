import { zRoom } from "$utils/types/room";
import { GameAdmin } from "./games";
import { Repo } from "./utility";

export class RoomAdmin extends Repo {

  private _data: App.Room

  private get ref() {
    return this.db.users(this._data.host).rooms(this._data.name)
  }

  static async getByName(host: string, name: string) {
    const ref = Repo.getdb().users(host).rooms(name)
    const snap = await ref.once('value')
    if (!snap.exists()) return Repo.fail({ _errors: ['Room does not exist!'] })
    const room = snap.val()

    try {
      return Repo.success(new RoomAdmin(room))
    } catch (error) {
      return Repo.catchFail(error)
    }
  }

  constructor(value: App.Room) {
    super()
    this._data = zRoom.parse(value)
  }

  get value() {
    return this._data
  }

  async save() {
    await this.ref.set(this._data)
  }

  async getGame() {
    const ref = this.db.games(this._data.id).ref()
    const snap = await ref.once('value')
    if (snap.exists()) {
      try {
        return new GameAdmin(snap.val())
      } catch (error) {
        console.log(error)
      }
    }

    const game = new GameAdmin({
      id: this._data.id,
      name: this._data.name,
      host: this._data.host,
      players: [this._data.host],
      currentTurn: null,
      usedQuestions: [],
      questions: [],
      turns: null,
    })

    game.save()
    return game
  }
}