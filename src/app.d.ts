/// <reference types="unplugin-icons/types/svelte" />

import type { z } from "zod"
import { zGameStatus, zQuestion, zRoom, zGameInfo, zGameTurn, zPlayerTurn } from "$utils/types/room"
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

		type GameStatus = z.infer<typeof zGameStatus>

		type Question = z.infer<typeof zQuestion>
		type Player = z.infer<typeof zPlayer>
		type Room = z.infer<typeof zRoom>
		type GameInfo = z.infer<typeof zGameInfo>
		type GameTurn = z.infer<typeof zGameTurn>
		type PlayerTurn = z.infer<typeof zPlayerTurn>
	}
}

export { };
