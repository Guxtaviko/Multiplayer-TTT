import './styles/style.css'
import { gameState, player, currentTurn } from './helpers/initialValues';
import formHandler from './handlers/formHandler'
import roomsHandler from './handlers/roomsHandler'
import setGame from './handlers/gameHandler'

formHandler(document)
roomsHandler()
setGame({gameState, player, currentTurn})
