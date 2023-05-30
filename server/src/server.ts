import { createServer } from 'http';
import express from 'express'
import { Server } from 'socket.io'
import { gameServer, rooms } from './game';

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer)
gameServer(io)

app.use((_req, res, next) => {
  res.setHeader('access-control-allow-origin', '*')
    .setHeader('access-control-allow-methods', '*')
    .setHeader('access-control-allow-headers', '*')
    .setHeader('access-control-max-age', 20)
  next()
})

app.get('/rooms', (_req, res) => res.send(rooms()))

httpServer.listen(3000, () => {
  console.log('Http Server Running 🚀')
})
