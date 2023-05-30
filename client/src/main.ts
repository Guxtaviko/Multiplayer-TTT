import './styles/style.css'
import { gameState, player, currentTurn } from './helpers/initialValues';
import formHandler from './handlers/formHandler'
import setGame from './handlers/gameHandler'

formHandler(document)
setGame({gameState, player, currentTurn})
