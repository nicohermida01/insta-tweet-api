import { NextFunction, Request, Response, Router } from 'express'
import bcrypt from 'bcrypt'
import { UserModel } from '../../models/user.model'
import { ILoginDTO } from './dtos/login.dto'
import jwt from 'jsonwebtoken'

const loginRouter = Router()

export const JWT_SECRET = process.env.JWT_SECRET || ''

loginRouter.post(
	'/',
	async (req: Request, res: Response, next: NextFunction) => {
		const dto: ILoginDTO = req.body
		if (!dto || !dto.username || !dto.username) {
			return res.status(400).end()
		}

		try {
			const user = await UserModel.findOne({ username: dto.username })

			const passwordCorrect =
				user === null
					? false
					: await bcrypt.compare(dto.password, user.passwordHash)

			if (!(user && passwordCorrect)) {
				return res.status(401).send({
					// 401 === No Authorized
					error: 'invalid username or password',
				})
			}

			const userForToken = {
				id: user._id,
				username: user.username,
			}

			const token = jwt.sign(userForToken, JWT_SECRET, {
				expiresIn: 60 * 60 * 24 * 7, // 7 dias (60sec * 60min * 24hs * 7dias) === 7dias en sec
			})

			res.send({
				userId: user._id,
				username: user?.username,
				token,
			})
		} catch (error) {
			next(error)
		}
	}
)

export default loginRouter
