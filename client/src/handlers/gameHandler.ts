import socket from '../socket';

type setGameProps = {
	gameState: string[],
	player?: string,
	currentTurn: string,
	history: {
		x: number, o: number, ties: number
	}
}

type updateGameProps = {
	gameState: string[],
	player?: string,
	currentTurn: string,
}

let gamePlayer: string
let gameTurn: string

const handler = (document: Document) => {
	const cells = document.querySelectorAll('.cell')
	const turn = document.getElementById('turn') as HTMLElement
	const historyElements = document.querySelectorAll('.history')

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

	const updateTurn = (currentTurn: string, player?: string) => {
		if(player) gamePlayer = player
		gameTurn = currentTurn
		const playerOrEnemy = currentTurn == gamePlayer ? 'player' : 'enemy'
		turn.innerHTML = `(${currentTurn.toUpperCase()})`
		turn.innerHTML += currentTurn == gamePlayer ? ` Your` : ` Enemy's`
		turn.className = playerOrEnemy
	}

	const setGame = ({gameState, player, currentTurn, history}: setGameProps) => {
		updateTurn(currentTurn, player)

		cells.forEach((cell, i) => {
			setCell(cell, gameState[i])

			cell.removeEventListener('click', clickHandler)
			cell.addEventListener('click', clickHandler)
		})

		const [xWins, ties, oWins] = historyElements

		if(gamePlayer == 'x') {
			xWins.className = 'history player'
			oWins.className = 'history enemy'
		} else {
			xWins.className = 'history enemy'
			oWins.className = 'history player'
		}

		xWins.innerHTML = `X Wins: ${history.x}`
		ties.innerHTML = `Ties: ${history.ties}`
		oWins.innerHTML = `O Wins: ${history.o}`
	}

	const updateGame = ({gameState, player, currentTurn}: updateGameProps) => {
		updateTurn(currentTurn, player)
		cells.forEach((cell, i) => setCell(cell, gameState[i]))
	}

	return { setGame, updateGame }
}

export default handler(document)
export { gamePlayer }
