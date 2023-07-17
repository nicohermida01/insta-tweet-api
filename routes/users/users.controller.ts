import bcrypt from 'bcrypt'
import { NextFunction, Request, RequestHandler, Response } from 'express'
import { UserModel } from '../../models/user.model'
import { ICreateUserDTO } from './dtos/create-user.dto'

export const createUser: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const dto: ICreateUserDTO = req.body
	if (!dto || !dto.username || !dto.password) {
		return res.status(400).end()
	}

	try {
		const passwordHash = await bcrypt.hash(dto.password, 10)

		const newUser = new UserModel({
			username: dto.username,
			name: dto.name,
			passwordHash: passwordHash,
		})

		const savedUser = await newUser.save()

		res.status(201).json(savedUser)
	} catch (error) {
		next(error)
	}
}

export const getAllUsers: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const users = await UserModel.find({}).populate('tweets', {
			content: 1,
			createdAt: 1,
		})

		res.json(users)
	} catch (error) {
		next(error)
	}
}

export const getUserById: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { id } = req.params

	try {
		const user = await UserModel.findById(id).populate('tweets', {
			content: 1,
			createdAt: 1,
		})

		if (!user) {
			return res.status(404).send({ error: 'user not found' })
		}

		res.json(user)
	} catch (error) {
		next(error)
	}
}

export const getUserByUsername: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (!req.params.username) {
		return res.status(400).send({ error: 'username param is missing' })
	}

	const username = req.params.username

	try {
		const user = await UserModel.findOne({ username: username }).populate(
			'tweets',
			{
				content: 1,
				createdAt: 1,
			}
		)

		if (!user) {
			return res.status(404).send({ error: 'user not found' })
		}

		res.json(user)
	} catch (error) {
		next(error)
	}
}
