import { Player } from "$lib/server/auth";
import { zRoomCreateInput } from "$utils/types/room";
import { fail, redirect } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms/server";

export async function load() {
  const form = await superValidate(zRoomCreateInput)
  return { form }
}

export const actions = {
  default: async ({ request, locals, url }) => {

    const player = new Player(locals.user)

    const form = await superValidate(request, zRoomCreateInput)
    if (!form.valid) return fail(400, { form })

    const room = await player.createRoom(form.data)
    if (room.status) {
      const target = new URL(['', player.value.name, room.data.name].join('/'), url.href)
      throw redirect(303, target.href)
    }

    return fail(400, { form })
  }
};

