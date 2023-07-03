/* eslint-disable @typescript-eslint/ban-types */
import { project_id, client_email, private_key } from 'firebase-service-account-key'
import { FIREBASE_REALTIME_DBURL } from '$env/static/private'
import admin from 'firebase-admin'
import { getDatabase } from 'firebase-admin/database'

/**
 * Realtime database json tree map
 * {
 *    "users": {
 *      "<username>": {
 *        "value": <App.Player>
 *        "rooms": {
 *          "<roomname>": <App.Room>
 *        }
 *      }
 *    },
 *    "games": {
 *      "<gameid>": {
 *        "info": <App.GameInfo>
 *        "questions": {
 *          "<question-id>": <App.Question>
 *        },
 *        "gameturn": {
 *          "<turn-id>": <App.GameTurn>
 *        },
 *        "playerturn": {
 *          "<turn-id>": {
 *            "<username>": <App.PlayerTurn>
 *          }
 *        }
 *      }
 *    },
 *    "globals": {
 *      "library": {
 *        "_<username>_<roomname>": "<gameid>"
 *      }
 *      "gamescount": <number>
 *    }
 * }
 * ```
 */

const REFNAME = {
  USERS: "users",
  GAMES: "games",
  GLOBALS: "globals"
}

/**
 * Use Database hook to get reference path
 */
export function useDatabase() {
  const db = getDatabase()
  const r = (path: string) => db.ref(path)

  return {
    users(username: string) {
      const path = [REFNAME.USERS, username]
      return {
        value() {
          path.push("value")
          return r(path.join('/'))
        },
        rooms(roomname: string | undefined = undefined) {
          path.push("rooms")
          if (!roomname) return r(path.join('/'))
          path.push(roomname)
          return r(path.join('/'))
        }
      }
    },
    games(gameid: string) {
      const path = [REFNAME.GAMES, gameid]
      return {
        ref: () => r(path.join('/')),
        info() {
          path.push('info')
          return r(path.join('/'))
        },
        questions(id: string) {
          path.push('questions', id)
          return r(path.join('/'))
        },
        gameturn(turnid: string) {
          path.push('gameturn', turnid)
          return r(path.join('/'))
        },
        playerturn(turnid: string) {
          path.push('playerturn', turnid)
          return {
            ref: () => r(path.join('/')),
            user(username: string) {
              path.push(username)
              return r(path.join('/'))
            }
          }
        }
      }
    },
    globals: () => ({
      ref: () => r('globals'),
      get: (path: 'gamescount' | 'library' | string & {}) => r(`globals/${path}`),
      library(path: string) {
        return r('globals/library/' + path.replaceAll('/', '_'))
      }
    })
  }
}

export type DatabaseHookReturn = ReturnType<typeof useDatabase>

/**
 * Run Setup Firebase Admin Instance
 */
export function setup() {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: project_id,
        clientEmail: client_email,
        privateKey: private_key
      }),
      databaseURL: FIREBASE_REALTIME_DBURL
    })
  } catch (error) {
    // console.error(error)
  }
}