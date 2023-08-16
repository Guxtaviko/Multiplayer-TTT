import './styles/style.css'
import { gameState, player, currentTurn, history } from './helpers/initialValues';
import formHandler from './handlers/formHandler'
import roomsHandler from './handlers/roomsHandler'
import gameHandler from './handlers/gameHandler'

formHandler(document)
roomsHandler()
gameHandler.setGame({gameState, player, currentTurn, history})
