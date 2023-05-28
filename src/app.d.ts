/// <reference types="unplugin-icons/types/svelte" />

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}

		type GameStatus = 'waiting' | 'ready' | 'in-play' | 'finish'

		interface Player {
			id: string
			name: string
			ready: boolean
			point: number
			vote?: boolean
			asker?: boolean
			host?: boolean
			winner?: boolean
		}

		interface Question {
			id: string
			maker: Player
			question: string
			choices: { 
				id: string
				text: string
				correct?: boolean 
			}[]
		}

		interface Turn {
			player: Player
			question: Question
			/** Map with key of player id and boolean vote of choice is correct */
			voters: Map<string, boolean | null> 
			choice: { 
				id: string
				text: string
			}
		}

		interface Room {
			id: string
			name: string
			topic: string
			host: Player
			status: GameStatus
			questionPerPlayer: number
			questions: Question[]
			players: Player[]
			turns: Turn[]
		}
	}
}

export {};
