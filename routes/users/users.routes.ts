import { Router } from 'express'
import * as usersController from './users.controller'

const usersRouter = Router()

usersRouter.post('/', usersController.createUser)
usersRouter.get('/', usersController.getAllUsers)
usersRouter.get('/:id', usersController.getUserById)
usersRouter.get('/username/:username', usersController.getUserByUsername)

export default usersRouter
