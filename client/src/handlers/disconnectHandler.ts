const handler = (document: Document) => {
	const backdrop = document.querySelector('.backdrop') as HTMLElement
	const disconnectModal = document.querySelector('.disconnect') as HTMLElement
	const disconnectMessage = document.querySelector('.disconnect__message') as HTMLElement
	const disconnectBtn = document.querySelector('.disconnect__button') as HTMLButtonElement

	disconnectBtn.addEventListener('click', () => {
		location.reload()
	})

	return (message: string) => {
		backdrop.style.display = 'block'
		disconnectModal.style.display = 'flex'
		disconnectMessage.innerHTML = message
	}
}

export default handler(document)
