import { get, writable } from "svelte/store";
import { getDatabase, onValue, ref, child, set } from "firebase/database";
import { zGameInfo, zPlayerTurn, zRoom } from "$utils/types/room";
import { z } from "zod";
import { v4 } from "uuid";

export const room_ = writable<App.Room>()

export function useRoomStore() {
  const { subscribe } = room_
  return { subscribe, get: () => get(room_) }
}

export function listenRoomData(room: App.Room) {
  const db = getDatabase()
  const roomRef = ref(db, ["username", room.host, "rooms", room.name].join('/'))
  onValue(roomRef, s => {
    if (!s.exists()) {
      room_.set(room)
      set(s.ref, room)
      return
    }

    const parsed = zRoom.safeParse(s.val())
    if (!parsed.success) {
      room_.set(room)
      set(s.ref, room)
    } else {
      room_.set(parsed.data)
    }
  })
}

export const gameInfo_ = writable<App.GameInfo>()
export function useGameInfo() {
  const { subscribe, update } = gameInfo_
  return {
    subscribe, get: () => get(gameInfo_),
    createTurn() {
      const data = get(gameInfo_)
      const availableQuestion = data.questions.filter(q => !data.usedQuestions.includes(q))
      if (availableQuestion.length === 0) return undefined

      const randomQuestionIndex = Math.floor(Math.random() * availableQuestion.length)
      const randomPlayerIndex = Math.floor(Math.random() * data.players.length)
      const question = availableQuestion[randomQuestionIndex]
      const player = data.players[randomPlayerIndex]
      const turn: App.GameTurn = { id: v4(), player, question }

      const db = getDatabase()
      const gameInfoRef = ref(db, ["games", data.id, "info"].join('/'))

      update(game => {
        game.currentTurn = turn.id
        game.usedQuestions.push(question)
        if (game.turns === null) {
          game.turns = { [turn.id]: turn }
        } else {
          game.turns = { ...game.turns, [turn.id]: turn }
        }

        set(gameInfoRef, game)
        return game
      })

      return turn
    }
  }
}

export const playerTurns_ = writable<App.PlayerTurn[]>([])
export function usePlayerTurn() {
  const { subscribe } = playerTurns_
  return {
    subscribe,
    addTurn(
      turn: string,
      player: string,
      vote: App.VoteEnum | null = null,
      choices: string | null = null
    ) {
      const turnData: App.PlayerTurn = {
        turn, player, choices, vote,
        receivedPoint: 0
      }

      // TODO: implement save turn
      return turn
    }
  }
}

export function listenGameInfo(room: App.Room) {
  const $room = get(room_)
  if (room.id !== $room?.id) {
    listenRoomData(room)
    room_.set(room)
  }

  const db = getDatabase()
  const gameRef = ref(db, ["games", room.id].join('/'))

  // subscribe to game info changes including game turns
  onValue(child(gameRef, "info"), s => {
    const gameInfoTemplate = {
      id: room.id,
      host: room.host,
      name: room.name,
      currentTurn: null,
      players: [room.host],
      usedQuestions: [],
      questions: [],
      turns: null,
    }

    if (!s.exists()) {
      gameInfo_.set(gameInfoTemplate)
      set(s.ref, get(gameInfo_))
      return
    }

    const parsed = zGameInfo.safeParse(s.val())
    if (!parsed.success) {
      const game = { ...s.val(), ...gameInfoTemplate }
      room_.set(game)
      set(s.ref, game)
    } else {
      gameInfo_.set(parsed.data)
    }
  })

  // subscribe to player turn changes
  onValue(child(gameRef, "playerturn"), s => {
    if (!s.exists()) {
      playerTurns_.set([])
      return
    }

    const parsed = z.array(zPlayerTurn).safeParse(s.val())
    if (!parsed.success) {
      const state = get(playerTurns_)
      if (state.length > 0) set(s.ref, state)
    } else {
      playerTurns_.set(parsed.data)
    }
  })
}