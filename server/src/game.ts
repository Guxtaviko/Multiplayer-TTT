import { Server } from 'socket.io';

type player = 'x' | 'o'

const initialGameState = new Array(9).fill('')

const winConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [6, 4, 2]
]

const socketRooms: {
	[socketId: string]: string
} = {}

const games: {
	[room: string]: {
		restartVotes: string[],
		playerQnt: number,
		currentTurn: player,
		gameState: string[],
		history: {
			x: number, o: number, ties: number
		}
	}
} = {}

const rooms = () => games

const checkForEnd = ({gameState}: typeof games['']) => {
  for (let i = 0; i < winConditions.length; i++) {
    const [a, b, c] = winConditions[i];
    if (
      gameState[a] !== '' &&
      gameState[a] === gameState[b] &&
      gameState[b] === gameState[c]
    ) return gameState[a] as 'x' | 'o'; // Vitória encontrada
  }
	if(gameState.every(state => state !== '')) return 'draw'
  return false; // Nenhuma vitória encontrada
}

const joiningPlayer = (game: typeof games['']) => {
	const notPlayed = game.gameState.every(state => state == '')
	const nextPlayer = game.currentTurn == 'x' ? 'o' : 'x'

	return notPlayed ? nextPlayer : game.currentTurn
}

const gameServer = (io: Server) => {
	io.on('connection', socket => {
	// console.log(`Socket: ${socket.id} - Handshaked 🫱`)

		socket.on('createRoom', ([name, player]) => {
			socket.join(name)
			socketRooms[socket.id] = name

			games[name] = {
				restartVotes: [],
				playerQnt: 1,
				currentTurn: player,
				gameState: initialGameState,
				history: {
					x: 0, o: 0, ties: 0
				}
			}

			socket.emit('initialGameState', [games[name], player])
		})

		socket.on('joinRoom', name => {
			if(!games[name]) return socket.emit('failToEnterRoom', name)
			if(games[name].playerQnt === 2) return socket.emit('roomIsFull', name)
			socket.join(name)
			socketRooms[socket.id] = name

			const player = joiningPlayer(games[name])
			games[name].playerQnt = 2

			socket.emit('initialGameState', [games[name], player])
		})

		socket.on('stateChange', state => {
			const room = socketRooms[socket.id]
			games[room].gameState = state
			games[room].currentTurn = games[room].currentTurn == 'x' ? 'o' : 'x'

			const {gameState, currentTurn} = games[room]

			socket.to(room).emit('gameChange', [gameState, currentTurn])
			const status = checkForEnd(games[room])
			if(status) {
				if(status === 'draw') {
					io.to(room).emit('draw')
					games[room].history.ties++
				}
				else {
					io.to(room).emit('win', status)
					games[room].history[status]++
				}
			}
		})

		socket.on('restart', player => {
			const room = socketRooms[socket.id]
			if(!games[room].restartVotes.includes(player)) {
				games[room].restartVotes.push(player)
				io.to(room).emit('votesChange', games[room].restartVotes.length)
			}
			if(games[room].restartVotes.length == 2) {
				const enemy = player == 'x' ? 'o' : 'x'
				games[room].gameState = initialGameState
				games[room].restartVotes = []

				socket.emit('initialGameState', [games[room], player])
				socket.to(room).emit('initialGameState', [games[room], enemy])
			}
		})

		socket.on('disconnect', () => {
			// console.log(`Socket: ${socket.id} - Disconnected`)
			const room = socketRooms[socket.id]
			delete socketRooms[socket.id]

			io.to(room).emit('playerDisconnected')
			delete games[room]
		})
	})
}

export {gameServer, rooms}
