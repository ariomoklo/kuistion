/// <reference types="unplugin-icons/types/svelte" />

import type { z } from "zod"
import { zGameStatus, zQuestion, zRoom, zTurn } from "$utils/types/room"
import type { zPlayer } from "$utils/types/player"

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface PageData {}
		// interface Platform {}
		interface Locals {
			user: Player
			pname: string | undefined
			token: string | undefined
		}

		/** 
		 * firebase realtime db path 
		 * 
		 * users path: 'users/<username>'
		 * games path: 'users/<username>/games/<roomname>'
		 * gamesplayer path: 'users/<username>/games/<roomname>/players/<username>'
		 * */
		type DBPath = 'users' | 'games' | 'playes'

		type GameStatus = z.infer<typeof zGameStatus>
		type Player = z.infer<typeof zPlayer>
		type Question = z.infer<typeof zQuestion>
		type Turn = z.infer<typeof zTurn>
		type Room = z.infer<typeof zRoom>
	}
}

export { };
