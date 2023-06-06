import { error } from '@sveltejs/kit'

export async function load(event) {

  const data = await event.parent()
  if (!data.room) throw error(404, 'Room Not Found')

  if (data.room.status === 'waiting') {
    return { room: data.room }
  }

  const question: App.Question = {
    id: 'b2d3fd78-2aea-4beb-88e0-ceb1f61eaeec',
    question: 'Dolore labore ut non id ?.',
    maker: data.player,
    choices: [
      { id: 'A', text: 'Doloribus debitis sed quis similique consequuntur numquam.', correct: false },
      { id: 'B', text: 'Et aut ut expedita error facere et eligendi corporis rerum.', correct: false },
      { id: 'C', text: 'porro nihil a.', correct: true },
      { id: 'D', text: 'Quibusdam sint reprehenderit.', correct: false },
      { id: 'E', text: 'Alias rem soluta sint vel quos.', correct: false },
    ]
  }

  return { question, room: data.room }
}