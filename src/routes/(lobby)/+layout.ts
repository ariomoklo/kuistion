export function load(ctx) {
    const player: App.Player = {
        id: 'ad6f39b3-26c6-451e-9736-3f8f1e0a4f30',
        name: 'ariomoklo',
        point: 0,
        host: true,
        ready: true,
        asker: true
    }

    const rooms: App.Room[] = [
        { id: '1fd905ea-1688-48b0-b84e-e5390be220de', questionPerPlayer: 2, questions: [], turns: [], players: [], status: 'waiting', topic: 'Cumque ex occaecati eum cum dolor incidunt.', host: player, name: 'Reynolds-Inc' },
        { id: '6d1f94a8-0532-46c5-a615-d60851e893dc', questionPerPlayer: 2, questions: [], turns: [], players: [], status: 'ready', topic: 'Deserunt labore nostrum expedita.', host: player, name: 'Littel-Stroman' },
        { id: '0e1c32ee-df5e-45f2-8745-5734095aff2a', questionPerPlayer: 2, questions: [], turns: [], players: [], status: 'in-play', topic: 'Et recusandae.', host: player, name: 'Gorczany-Muller' },
        { id: '1e061461-386d-4a92-96b8-6967e52843cd', questionPerPlayer: 2, questions: [], turns: [], players: [], status: 'finish', topic: 'Maxime quam velit qui id quia eos architecto.', host: player, name: 'McClure-Leuschke-Kohler' },
        { id: '87ef484c-4727-49c0-b174-db5455e2c4ea', questionPerPlayer: 2, questions: [], turns: [], players: [], status: 'finish', topic: 'Ab assumenda modi consequatur dolor alias sit accusantium.', host: player, name: 'Hegmann-Kassulke' },
        { id: 'c08c7422-7b91-45c7-8329-ae7ab598549f', questionPerPlayer: 2, questions: [], turns: [], players: [], status: 'finish', topic: 'Ipsa hic quis beatae incidunt.', host: player, name: 'Sporer-Huel-Dickens' },
    ];

    const people: App.Player[] = [
        player,
		{ id: 'e83320f0-34b1-4fb9-b961-df467a11a100', name: 'Michael', point: 0, ready: true, vote: true },
		{ id: '405981ff-eb32-443e-b37b-b7c4a3141724', name: 'Janet', point: 0, ready: false, vote: false },
		{ id: 'cfc978ad-0058-4b47-bf8c-f30e9c8179b5', name: 'Susan', point: 0, ready: true },
		{ id: '13c2125a-38f1-48eb-abb2-e6d2cc2dfa0e', name: 'Joey', point: 0, ready: true },
		{ id: '8acf1afd-51b2-4f6e-8ada-67ba6d37ae06', name: 'Lara', point: 0, ready: true },
		{ id: '38f857ba-2311-4e12-a98f-8f18df1b8592', name: 'Melissa', point: 0, ready: false },
		{ id: 'cfc978ad-0058-4b47-bf8c-f30e9c8179b5', name: 'Wenty', point: 0, ready: true, winner: true },
	];

    const roomID = ctx.params.roomid
    const foundRoom = rooms.find(r => r.name === roomID)
    if (!roomID || !foundRoom) {
        // roomID undefined, return only room list
        return { rooms, player }
    }

    return { 
        rooms, 
        player,
        room: {
            ...foundRoom,
            players: people
        }
    }
}