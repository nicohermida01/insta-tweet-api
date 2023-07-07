import 'dotenv/config'
import './mongo'
import express, { Express, NextFunction, Request, Response } from 'express'
import cors from 'cors'
import { notFoundHandler } from './middlewares/notFound.middleware'
import { errorHandler } from './middlewares/handleErrors.middleware'
import { log } from './utils/log'
import tweetsRouter from './routes/tweets/tweets.routes'
import usersRouter from './routes/users/users.routes'
import loginRouter from './routes/login/login.controller'

const baseUrl = 'baseUrl'

const app: Express = express()
const port = process.env.PORT

app.use(cors()) // Necesario para que cualquier servidor pueda acceder a nuestra API
app.use(express.json()) // Necesario para acceder al body de una request

app.set(baseUrl, '/api/v1')

app.get('/', (req: Request, res: Response) => {
	res.send('Hello from InstaTweet API')
})

// TWEETS CONTROLLER
app.use(`${app.get(baseUrl)}/tweets`, tweetsRouter)

// USERS CONTROLLER
app.use(`${app.get(baseUrl)}/users`, usersRouter)

// LOGIN CONTROLLER
app.use(`${app.get(baseUrl)}/login`, loginRouter)

// 404 ROUTE HANLDER
app.use(notFoundHandler)

// ERROR MIDDLEWARE
app.use(errorHandler)

app.listen(port, () => {
	log(`Server is running at http://localhost:${port}`)
})
