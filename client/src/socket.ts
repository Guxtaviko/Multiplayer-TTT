import { io } from 'socket.io-client'
import server from './helpers/serverURL'
import gameHandler from './handlers/gameHandler'
import endHandler from './handlers/endHandler'
import disconnection from './handlers/disconnectHandler'

type Game = {
	playerQnt: number,
	currentTurn: string,
	gameState: string[],
	history: {
		x: number, o: number, ties: number
	}
}

const socket = io(server, {
  transports: ['websocket']
})

socket.on('connect', () => {
	// console.log(`Socket: ${socket.id} - Handshaked 🫱`)

	socket.on('initialGameState', ([game, player]: [Game, string]) => {
		const endModal = document.querySelector('.end') as HTMLElement
		const backdrop = document.querySelector('.backdrop') as HTMLElement

		endModal.style.display = 'none'
		backdrop.style.display = 'none'

		endHandler.updateVotes(0)

		gameHandler.setGame({...game, player})
	})

	socket.on('gameChange', ([state, turn]: [string[], string]) => {
		gameHandler.updateGame({
			gameState: state,
			currentTurn: turn
		})
	})

	socket.on('draw', () => endHandler.tieMessage())

	socket.on('win', player => endHandler.winMessage(player))

	socket.on('votesChange', quantity => endHandler.updateVotes(quantity))

	socket.on('disconnect', () => disconnection('There was an error with our server'))

	socket.on('playerDisconnected', () => disconnection('Other player has disconnected'))

	socket.on('failToEnterRoom', name => disconnection(`Room "${name}" was destroyed`))

	socket.on('roomIsFull', name => disconnection(`Room "${name}" is already full`))
})

export default socket
