import { authenticate } from '$lib/server/auth';
import { setup } from '$lib/server/firebase';
import { json } from '@sveltejs/kit';

export async function handle({ event, resolve }) {

  // setup firebase admin
  await setup()


  // Authenticate User Session
  const { token, pname, user } = await authenticate(event)
  event.locals.token = token
  event.locals.pname = pname

  // only set user when found
  if (user) event.locals.user = user.value

  // passthrough login api
  if (event.url.pathname === '/api/account') {
    const response = await resolve(event)
    return response
  }

  // block access on user empty
  if (!user) {
    // check if current path is '/'
    if (event.url.pathname !== '/') {
      // return json data on api route
      if (event.url.pathname.startsWith('/api')) {
        return json({ code: 401, message: 'Player session not found!' }, { status: 401 })
      }

      // redirect on html page request
      const url = new URL('/', event.url.href)
      return Response.redirect(url.href)
    }
  } else if (event.url.pathname === '/') {

    // if user logged in but accessing root '/'
    // redirect to '/room' path

    const url = new URL('/room', event.url.href)
    return Response.redirect(url.href)
  }

  return await resolve(event)
}