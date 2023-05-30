import socket from '../socket'
import { gamePlayer } from './gameHandler'

const handler = (document: Document) => {
	const backdrop = document.querySelector('.backdrop') as HTMLElement
	const endModal = document.querySelector('.end') as HTMLElement
	const restartBtn = document.querySelector('.end__restart') as HTMLButtonElement

	const modalElements = {
		message: endModal.querySelector('.end__message') as HTMLElement,
		votes: endModal.querySelector('.votes') as HTMLElement,
		progress: endModal.querySelector('.progress__value') as HTMLElement
	}

	restartBtn.addEventListener('click', () => {
		socket.emit('restart', gamePlayer)
	})

	const defaultBehavior = (msg: string) => {
		endModal.style.display = 'flex'
		backdrop.style.display = 'block'
		modalElements.message.innerHTML = msg
	}

	const tieMessage = () => {
		defaultBehavior('🫤 It is a tie!')
	}

	const winMessage = (player: string) => {
		const msg = player == gamePlayer ? '🥳 You won!' : '😢 You lost!'
		defaultBehavior(msg)
	}

	const updateVotes = (quantity: number) => {
		modalElements.votes.innerHTML = `${quantity}/2`
		const width = (quantity / 2) * 100

		modalElements.progress.style.width = `${width}%`
	}

	return {
		tieMessage, winMessage, updateVotes
	}
}

export default handler(document)
