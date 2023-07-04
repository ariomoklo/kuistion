import { PlayerAdmin } from '$lib/server/repositories/players';
import { devlog } from '$lib/tools/devtools';
import { redirect } from '@sveltejs/kit';

export async function load(event) {

    // get user from locals (user scanned in hook.server.ts)
    // then transform user value as PlayerAdmin Object
    const player = new PlayerAdmin(event.locals.user)
    const prooms = await player.rooms()

    let rooms: App.Room[] = []
    if (prooms.success) rooms = prooms.data

    // get url params [username] & [roomname]
    // {baseurl}/<username>/<roomname>
    const username = event.params.username
    const roomname = event.params.roomname

    // console log only on dev
    devlog({ username, roomname })

    // check for username and roomname params
    // if not exist return only player data for user roomlist page
    if (username && roomname) {

        // check if targeter username is actualy current logged user
        if (player.value.name !== username) {

            // check if given username exist in firebase
            const findHost = await PlayerAdmin.get(username)
            if (!findHost.success) throw redirect(303, `/${player.value.name}`)
            const host = findHost.data

            // check if given roomname exist on the found user host
            const findRoom = await host.room(roomname)
            if (!findRoom.success) throw redirect(303, `/${player.value.name}`)
            const room = findRoom.data

            return {
                rooms, room: room.value,
                player: player.value,
                session: player.session,
                seo: {
                    title: `${username} - ${roomname}`,
                    desc: `Game of '${room.value.topic}' Question!.`
                }
            }
        } else {

            // check if given roomname exist in current player room list
            const findRoom = await player.room(roomname)
            if (!findRoom.success) throw redirect(303, `/${player.value.name}`);
            const room = findRoom.data

            return {
                rooms, room: room.value,
                player: player.value,
                session: player.session,
                seo: {
                    title: `${player.value.name} - ${room.value.name}`,
                    desc: `Game of '${room.value.topic}' Question!.`
                }
            }
        }
    }

    return {
        rooms,
        player: player.value,
        session: player.session,
        seo: {
            title: `${player.value.name} | Room List`,
            desc: 'Waiting room to create and join game of kuistion.'
        }
    }
}