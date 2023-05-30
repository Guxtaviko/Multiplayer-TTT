import socket from '../socket';

type setGameProps = {
	gameState: string[],
	player?: string,
	currentTurn: string
}

let gamePlayer: string
let gameTurn: string

const handler = (document: Document) => {
	const cells = document.querySelectorAll('.cell')
	const turn = document.getElementById('turn') as HTMLElement

	const clickHandler = (e: Event) => {
		const cell = e.target as Element
		if(gamePlayer != gameTurn || cell.innerHTML != '') return

		gameTurn = gamePlayer == 'x' ? 'o' : 'x'
		turn.className = 'enemy'
		turn.innerHTML = `(${gameTurn.toUpperCase()}) Enemy's`
		cell.innerHTML = gamePlayer
		cell.classList.add('player')

		socket.emit('stateChange', getCurrentState())
	}

	const setCell = (cell: Element, state: string) => {
		cell.innerHTML = state
		if(state == '') return cell.className = 'cell'

		const playerOrEnemy = state == gamePlayer ? 'player' : 'enemy'
		cell.className = `cell ${playerOrEnemy}`
	}

	const getCurrentState = () => {
		const stateBuffer: string[] = []
		cells.forEach(cell => stateBuffer.push(cell.innerHTML))
		return stateBuffer
	}

	return ({gameState, player, currentTurn}: setGameProps) => {

		if(player) gamePlayer = player
		gameTurn = currentTurn
		const playerOrEnemy = currentTurn == gamePlayer ? 'player' : 'enemy'
		turn.innerHTML = `(${currentTurn.toUpperCase()})`
		turn.innerHTML += currentTurn == gamePlayer ? ` Your` : ` Enemy's`
		turn.className = playerOrEnemy

		cells.forEach((cell, i) => {
			setCell(cell, gameState[i])

			cell.removeEventListener('click', clickHandler)
			cell.addEventListener('click', clickHandler)
		})
	}
}

export default handler(document)
export { gamePlayer }
