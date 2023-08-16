import server from '../helpers/serverURL'
import socket from '../socket'

interface Games {
	[name: string]: {
		playerQnt: number
	}
}

let gamesList: Games = {}

const handler = () => {
	const rooms = document.querySelector('.rooms') as HTMLElement
	const roomsBtn = document.getElementById('roomsBtn') as HTMLButtonElement
	const goBackBtn = document.getElementById('goBackBtn') as HTMLButtonElement
	const refreshBtn = document.getElementById('refreshBtn') as HTMLElement
	const searchRoom = document.getElementById('searchRoom') as HTMLInputElement
	const joinBtn = document.getElementById('joinBtn') as HTMLButtonElement
	const errorContainer = document.getElementById('rooms__error') as HTMLElement
	const roomsContainer = rooms.querySelector('tbody') as HTMLElement

	const mainModal = document.querySelector('.modal') as HTMLElement

	const renderRooms = (rooms: Games) => {
		roomsContainer.innerHTML = ''
		for (const name in rooms) {
			if (Object.prototype.hasOwnProperty.call(rooms, name)) {
				const { playerQnt } = rooms[name]
				roomsContainer.innerHTML += `
				<tr>
					<td>${name}</td>
					<td ${playerQnt >= 2 ? `class="full"` : '' }>${playerQnt}</td>
				</tr>
				`
			}
		}

		roomsContainer.querySelectorAll('tr').forEach(row => {
			row.addEventListener('click', e => {
				const selectedRow = roomsContainer.querySelector('tr.active')
				if(selectedRow) selectedRow.classList.remove('active')
				const target = e.target as Element
				if(selectedRow !== target.parentNode) row.classList.add('active')
			})
		})
	}

	roomsBtn.addEventListener('click', async () => {
		mainModal.style.display = 'none'
		rooms.style.display = 'block'

		const games = await fetch(`${server}/rooms`).then(res => res.json()) as Games
		renderRooms(games)
		gamesList = games
	})

	goBackBtn.addEventListener('click', async () => {
		mainModal.style.display = 'block'
		rooms.style.display = 'none'
	})

	refreshBtn.addEventListener('click',async () => {
		const games = await fetch(`${server}/rooms`).then(res => res.json()) as Games
		renderRooms(games)
		gamesList = games
	})

	searchRoom.addEventListener('input', function() {
		const search = this.value
		const filteredRooms: Games = {}
		Object.keys(gamesList).filter(key => key.includes(search)).forEach(key => {
			filteredRooms[key] = gamesList[key]
		})
		renderRooms(filteredRooms)
	})

	joinBtn.addEventListener('click', () => {
		const selectedRow = roomsContainer.querySelector('tr.active')
		if(!selectedRow) return errorContainer.innerHTML = 'Select a Room'

		const [nameCell, playersCell] = selectedRow.querySelectorAll('td')
		if(playersCell.classList.contains('full')) return errorContainer.innerHTML = 'Room is full'

		socket.emit('joinRoom', nameCell.innerHTML)
		rooms.style.display = 'none'
	})
}
export default handler
