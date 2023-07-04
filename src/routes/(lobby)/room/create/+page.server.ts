import { PlayerAdmin } from "$lib/server/repositories/players.js";
import { zRoomCreateInput } from "$utils/types/room";
import { fail, redirect } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms/server";

export async function load() {
  const form = await superValidate(zRoomCreateInput)
  return { form }
}

export const actions = {
  default: async ({ request, locals }) => {

    const player = new PlayerAdmin(locals.user)

    const form = await superValidate(request, zRoomCreateInput)
    if (!form.valid) return fail(400, { form })

    const result = await player.createRoom(form.data)
    if (!result.success) {
      form.errors._errors = ['Something went wrong, please try again later!']
      return fail(400, { form })
    }

    throw redirect(303, ['', player.value.name, form.data.name].join('/'))
  }
};

