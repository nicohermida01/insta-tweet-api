import { Router } from 'express'
import * as usersController from './users.controller'

const usersRouter = Router()

usersRouter.post('/', usersController.createUser)
usersRouter.get('/', usersController.getAllUsers)
usersRouter.get('/:id', usersController.getUserById)

export default usersRouter
