import { PlayerAdmin } from '$lib/server/repositories/players';
import { redirect } from '@sveltejs/kit';

export async function load(event) {

    // get user from locals (user scanned in hook.server.ts)
    const player = new PlayerAdmin(event.locals.user)
    const prooms = await player.rooms()

    let rooms: App.Room[] = []
    if (prooms.success) rooms = prooms.data

    // get url params [username] & [roomname]
    const username = event.params.username
    const roomname = event.params.roomname

    console.log({ username, roomname })

    if (username && roomname) {
        if (player.value.name !== username) {
            const findHost = await PlayerAdmin.get(username)
            if (!findHost.success) throw redirect(303, `/${player.value.name}`)
            const host = findHost.data

            const findRoom = await host.room(roomname)
            if (!findRoom.success) throw redirect(303, `/${player.value.name}`)
            const room = findRoom.data

            return {
                rooms, room: room.value,
                player: player.value,
                session: player.session
            }
        } else {
            const findRoom = await player.room(roomname)
            if (!findRoom.success) throw redirect(303, `/${player.value.name}`);
            const room = findRoom.data

            return {
                rooms, room: room.value,
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