import { io } from 'socket.io-client'
import server from './helpers/serverURL'
import setGame from './handlers/gameHandler'
import endHandler from './handlers/endHandler'
import disconnection from './handlers/disconnectHandler'

type Game = {
	playerQnt: number,
	currentTurn: string,
	gameState: string[]
}

const socket = io(server, {
  transports: ['websocket']
})

socket.on('connect', () => {
	console.log(`Socket: ${socket.id} - Handshaked 🫱`)

	socket.on('initialGameState', ([game, player]: [Game, string]) => {
		const endModal = document.querySelector('.end') as HTMLElement
		const backdrop = document.querySelector('.backdrop') as HTMLElement

		endModal.style.display = 'none'
		backdrop.style.display = 'none'

		endHandler.updateVotes(0)

		setGame({...game, player})
	})

	socket.on('gameChange', ([state, turn]: [string[], string]) => {
		setGame({
			gameState: state,
			currentTurn: turn
		})
	})

	socket.on('draw', () => endHandler.tieMessage())

	socket.on('win', player => endHandler.winMessage(player))

	socket.on('votesChange', quantity => endHandler.updateVotes(quantity))

	socket.on('disconnect', () => disconnection('There was an error with our server'))

	socket.on('playerDisconnected', () => disconnection('Other player has disconnected'))
})

export default socket
