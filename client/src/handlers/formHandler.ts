import socket from '../socket'
import server from '../helpers/serverURL'

const handler = (document: Document) => {
	const create = document.getElementById('create') as HTMLElement
	const join = document.getElementById('join') as HTMLElement
	const errorHandler = document.getElementById('modal__error') as HTMLElement
	const form = document.querySelector('.modal__form') as HTMLFormElement

	const backdrop = document.querySelector('.backdrop') as HTMLElement
	const modal = document.querySelector('.modal') as HTMLElement

	const formElements = {
		players: form.querySelector('.modal__players') as HTMLElement,
		name: form.querySelector('.modal__game') as HTMLInputElement,
		button: form.querySelector('#modal__button') as HTMLButtonElement
	}

	join.addEventListener('click', _e => {
		create.classList.remove('selected')
		join.classList.add('selected')

		errorHandler.innerHTML = ''

		formElements.players.style.display = 'none'
		formElements.name.value = ''
		formElements.button.innerHTML = 'Join'
	})

	create.addEventListener('click', _e => {
		join.classList.remove('selected')
		create.classList.add('selected')

		errorHandler.innerHTML = ''

		formElements.players.style.display = 'flex'
		formElements.name.value = ''
		formElements.button.innerHTML = 'Create'
	})

	form.addEventListener('submit', async e => {
		e.preventDefault()
		const data = new FormData(form)
		const games = await fetch(`${server}/rooms`).then(res => res.json()).then(data => data)
		const rooms = Object.keys(games)
		const isCreating = create.classList.contains('selected')

		const player = data.get('player')
		if(!player && isCreating) {
			errorHandler.innerHTML = 'Select your letter'
			return
		}

		const name = data.get('name')!.toString().trim() as string
		const roomExists = rooms.includes(name)
		if(name == '' && isCreating) {
			errorHandler.innerHTML = 'Select a Room name'
			return
		}
		if(roomExists && isCreating) {
			errorHandler.innerHTML = 'Name is already taken'
			return
		}

		if(!roomExists && !isCreating) {
			errorHandler.innerHTML = 'Invalid room name'
			return
		}
		if(!isCreating) {
			if(games[name].playerQnt == 2) {
				errorHandler.innerHTML = 'Room is already full'
				return
			}
		}

		if(isCreating) socket.emit('createRoom', [name, player])
		else socket.emit('joinRoom', name)

		modal.style.display = 'none'
		backdrop.style.display = 'none'
	})
}

export default handler
