import { Player } from '$lib/server/auth.js';
import { redirect } from '@sveltejs/kit';

export async function load(event) {

    // get user from locals (user scanned in hook.server.ts)
    const player = new Player(event.locals.user)
    const rooms = await player.rooms

    // get url params [username] & [roomname]
    const username = event.params.username
    const roomname = event.params.roomname

    console.log({ username, roomname })

    if (username && roomname) {
        if (player.value.name !== username) {
            const host = await Player.fetch(username)
            if (!host) throw redirect(303, `/${player.value.name}`)

            const game = await host.findRoom(roomname)
            if (!game) throw redirect(303, `/${player.value.name}`)

            return {
                rooms, room: game,
                player: player.value,
                session: player.session
            }
        } else {
            const game = await player.findRoom(roomname)
            if (!game) throw redirect(303, `/${player.value.name}`);

            return {
                rooms, room: game,
                player: player.value,
                session: player.session
            }
        }
    }

    return {
        rooms,
        player: player.value,
        session: player.session
    }
}